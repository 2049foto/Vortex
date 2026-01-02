/**
 * Vortex ERC-4337 Batch Swap Engine
 * Gasless batch swaps using Account Abstraction + Pimlico
 */

import {
  createPublicClient,
  http,
  type Address,
  type Chain,
  parseAbi,
  encodeFunctionData,
  type Hash,
} from 'viem';
import { base } from 'viem/chains';
import {
  createSmartAccountClient,
  ENTRYPOINT_ADDRESS_V06,
  type SmartAccountClient,
} from 'permissionless';
import { privateKeyToAccount } from 'viem/accounts';
import { pimlicoBundlerActions, pimlicoPaymasterActions } from 'permissionless/actions/pimlico';
import type { ScannedToken, BatchActionResult } from '../scanner/types';
import { TARGET_CHAIN } from '../chains/config';

// ERC-20 ABI for approvals and transfers
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
]);

// Swap router ABI (generic - would use actual aggregator ABI in production)
const SWAP_ROUTER_ABI = parseAbi([
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) returns (uint256[] memory amounts)',
  'function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] calldata path, address to, uint256 deadline) returns (uint256[] memory amounts)',
]);

// Pimlico configuration
const PIMLICO_API_KEY = import.meta.env.VITE_PIMLICO_API_KEY || '';
const PIMLICO_BASE_URL = `https://api.pimlico.io/v2/${TARGET_CHAIN?.id || 8453}`;

// Default target token (USDC on Base)
const DEFAULT_TARGET_TOKEN: Address = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

// Dead address for burning
const DEAD_ADDRESS: Address = '0x000000000000000000000000000000000000dead';

interface SwapRoute {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  amountOutMin: bigint;
  path: Address[];
}

interface UserOperationCall {
  target: Address;
  data: `0x${string}`;
  value: bigint;
}

/**
 * ERC-4337 Batch Swap Engine
 */
class SwapEngine {
  private smartAccountClient: SmartAccountClient | null = null;
  private publicClient: ReturnType<typeof createPublicClient> | null = null;

  /**
   * Initialize smart account client
   */
  async initialize(ownerPrivateKey: `0x${string}`): Promise<void> {
    if (!TARGET_CHAIN) {
      throw new Error('Target chain not configured');
    }

    // Create public client for target chain
    this.publicClient = createPublicClient({
      chain: {
        ...base,
        rpcUrls: {
          default: {
            http: [TARGET_CHAIN.rpc],
          },
        },
      },
      transport: http(TARGET_CHAIN.rpc),
    });

    // Create account from private key
    const account = privateKeyToAccount(ownerPrivateKey);

    // Create smart account client with Pimlico
    this.smartAccountClient = createSmartAccountClient({
      account,
      chain: {
        ...base,
        rpcUrls: {
          default: {
            http: [TARGET_CHAIN.rpc],
          },
        },
      },
      transport: http(TARGET_CHAIN.rpc),
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    })
      .extend(
        pimlicoBundlerActions(`${PIMLICO_BASE_URL}/rpc?apikey=${PIMLICO_API_KEY}`)
      )
      .extend(
        pimlicoPaymasterActions(`${PIMLICO_BASE_URL}/rpc?apikey=${PIMLICO_API_KEY}`)
      );
  }

  /**
   * Build swap route for a token
   */
  async buildSwapRoute(
    token: ScannedToken,
    targetToken: Address = DEFAULT_TARGET_TOKEN,
    slippage: number = 0.5
  ): Promise<SwapRoute | null> {
    if (!this.publicClient) {
      throw new Error('Swap engine not initialized');
    }

    try {
      const tokenAddress = token.address as Address;
      const amountIn = BigInt(token.balance);

      // Calculate minimum output with slippage
      const priceRatio = token.priceUSD > 0 ? targetToken === DEFAULT_TARGET_TOKEN ? 1 / token.priceUSD : 1 : 0;
      const expectedOut = amountIn * BigInt(Math.floor(priceRatio * (100 - slippage) * 100)) / BigInt(10000);
      const amountOutMin = expectedOut;

      // Build swap path (direct or via WETH)
      const path: Address[] = [];
      if (tokenAddress.toLowerCase() !== targetToken.toLowerCase()) {
        path.push(tokenAddress);
        // Add WETH as intermediate if needed
        if (token.chain === 'BASE' || token.chain === 'ETHEREUM') {
          const WETH = '0x4200000000000000000000000000000000000006' as Address;
          if (tokenAddress.toLowerCase() !== WETH.toLowerCase() && targetToken.toLowerCase() !== WETH.toLowerCase()) {
            path.push(WETH);
          }
        }
        path.push(targetToken);
      } else {
        // Same token, no swap needed
        return null;
      }

      return {
        tokenIn: tokenAddress,
        tokenOut: targetToken,
        amountIn,
        amountOutMin,
        path,
      };
    } catch (error) {
      console.error('Error building swap route:', error);
      return null;
    }
  }

  /**
   * Build UserOperation calls for batch swap
   */
  async buildBatchSwapCalls(
    tokens: ScannedToken[],
    targetToken: Address = DEFAULT_TARGET_TOKEN,
    slippage: number = 0.5
  ): Promise<UserOperationCall[]> {
    if (!this.publicClient || !this.smartAccountClient) {
      throw new Error('Swap engine not initialized');
    }

    const calls: UserOperationCall[] = [];
    const smartAccountAddress = await this.smartAccountClient.account.address;

    for (const token of tokens) {
      const route = await this.buildSwapRoute(token, targetToken, slippage);
      if (!route) continue;

      const tokenAddress = route.tokenIn;

      // Step 1: Approve swap router (if needed)
      const currentAllowance = await this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [smartAccountAddress, route.tokenOut], // Would use actual router address
      });

      if (currentAllowance < route.amountIn) {
        const approveData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [route.tokenOut, route.amountIn], // Would use actual router address
        });

        calls.push({
          target: tokenAddress,
          data: approveData,
          value: 0n,
        });
      }

      // Step 2: Execute swap
      const swapData = encodeFunctionData({
        abi: SWAP_ROUTER_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [
          route.amountIn,
          route.amountOutMin,
          route.path,
          smartAccountAddress,
          BigInt(Math.floor(Date.now() / 1000) + 300), // 5 min deadline
        ],
      });

      // Would use actual router address here
      calls.push({
        target: route.tokenOut, // Placeholder - would be router address
        data: swapData,
        value: 0n,
      });
    }

    return calls;
  }

  /**
   * Execute batch swap via ERC-4337
   */
  async executeBatchSwap(
    tokens: ScannedToken[],
    ownerPrivateKey: `0x${string}`,
    targetToken: Address = DEFAULT_TARGET_TOKEN,
    slippage: number = 0.5
  ): Promise<BatchActionResult> {
    try {
      // Initialize if needed
      if (!this.smartAccountClient) {
        await this.initialize(ownerPrivateKey);
      }

      if (!this.smartAccountClient) {
        throw new Error('Failed to initialize smart account client');
      }

      // Filter eligible tokens
      const eligibleTokens = tokens.filter(
        (t) => t.allowedActions.includes('SWAP') && t.valueUSD > 0.01 && t.chain === TARGET_CHAIN?.name
      );

      if (eligibleTokens.length === 0) {
        return {
          success: false,
          tokensProcessed: 0,
          totalValueSaved: 0,
          gasUsed: 0,
          error: 'No eligible tokens to swap',
        };
      }

      // Build batch swap calls
      const calls = await this.buildBatchSwapCalls(eligibleTokens, targetToken, slippage);

      if (calls.length === 0) {
        return {
          success: false,
          tokensProcessed: 0,
          totalValueSaved: 0,
          gasUsed: 0,
          error: 'No valid swap routes found',
        };
      }

      // Encode batch call
      const callData = await this.smartAccountClient.account.encodeCallData(calls);

      // Prepare UserOperation
      const userOperation = await this.smartAccountClient.prepareUserOperation({
        userOperation: {
          callData,
        },
      });

      // Sign UserOperation
      const signature = await this.smartAccountClient.account.signUserOperation(userOperation);

      // Send UserOperation to bundler
      const userOperationHash = await this.smartAccountClient.sendUserOperation({
        userOperation: {
          ...userOperation,
          signature,
        },
      });

      // Wait for transaction receipt
      const receipt = await this.smartAccountClient.waitForUserOperationReceipt({
        hash: userOperationHash,
      });

      const totalValue = eligibleTokens.reduce((sum, t) => sum + t.valueUSD, 0);

      return {
        success: true,
        txHash: receipt.receipt.transactionHash,
        tokensProcessed: eligibleTokens.length,
        totalValueSaved: totalValue,
        gasUsed: Number(receipt.receipt.gasUsed || 0n),
      };
    } catch (error) {
      console.error('Batch swap error:', error);
      return {
        success: false,
        tokensProcessed: 0,
        totalValueSaved: 0,
        gasUsed: 0,
        error: error instanceof Error ? error.message : 'Batch swap failed',
      };
    }
  }

  /**
   * Execute batch burn (send to dead address)
   */
  async executeBatchBurn(
    tokens: ScannedToken[],
    ownerPrivateKey: `0x${string}`
  ): Promise<BatchActionResult> {
    try {
      if (!this.smartAccountClient) {
        await this.initialize(ownerPrivateKey);
      }

      if (!this.smartAccountClient) {
        throw new Error('Failed to initialize smart account client');
      }

      const eligibleTokens = tokens.filter(
        (t) => t.allowedActions.includes('BURN') && t.valueUSD < 0.1 && t.chain === TARGET_CHAIN?.name
      );

      if (eligibleTokens.length === 0) {
        return {
          success: false,
          tokensProcessed: 0,
          totalValueSaved: 0,
          gasUsed: 0,
          error: 'No eligible tokens to burn',
        };
      }

      const calls: UserOperationCall[] = [];

      for (const token of eligibleTokens) {
        const transferData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [DEAD_ADDRESS, BigInt(token.balance)],
        });

        calls.push({
          target: token.address as Address,
          data: transferData,
          value: 0n,
        });
      }

      const callData = await this.smartAccountClient.account.encodeCallData(calls);

      const userOperation = await this.smartAccountClient.prepareUserOperation({
        userOperation: {
          callData,
        },
      });

      const signature = await this.smartAccountClient.account.signUserOperation(userOperation);

      const userOperationHash = await this.smartAccountClient.sendUserOperation({
        userOperation: {
          ...userOperation,
          signature,
        },
      });

      const receipt = await this.smartAccountClient.waitForUserOperationReceipt({
        hash: userOperationHash,
      });

      return {
        success: true,
        txHash: receipt.receipt.transactionHash,
        tokensProcessed: eligibleTokens.length,
        totalValueSaved: 0,
        gasUsed: Number(receipt.receipt.gasUsed || 0n),
      };
    } catch (error) {
      console.error('Batch burn error:', error);
      return {
        success: false,
        tokensProcessed: 0,
        totalValueSaved: 0,
        gasUsed: 0,
        error: error instanceof Error ? error.message : 'Batch burn failed',
      };
    }
  }

  /**
   * Estimate gas for batch swap
   */
  async estimateGas(
    tokens: ScannedToken[],
    targetToken: Address = DEFAULT_TARGET_TOKEN
  ): Promise<{
    estimatedGas: number;
    estimatedCost: number;
    gasPerToken: number;
  }> {
    const eligibleTokens = tokens.filter(
      (t) => t.allowedActions.includes('SWAP') && t.valueUSD > 0.01
    );

    // Rough estimate: 100k gas per swap + 50k overhead
    const gasPerSwap = 100000;
    const batchOverhead = 50000;
    const estimatedGas = batchOverhead + eligibleTokens.length * gasPerSwap;

    // Estimate cost (would use actual gas price)
    const gasPrice = 0.000000001; // 1 gwei in ETH
    const estimatedCost = estimatedGas * gasPrice;

    return {
      estimatedGas,
      estimatedCost,
      gasPerToken: gasPerSwap,
    };
  }
}

// Export singleton
export const swapEngine = new SwapEngine();


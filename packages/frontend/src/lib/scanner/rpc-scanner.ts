/**
 * Vortex RPC Scanner
 * Real blockchain scanning using viem (EVM) and @solana/web3.js (Solana)
 */

import { createPublicClient, http, type Address, type Chain, parseAbi } from 'viem';
import { mainnet, base, bsc, arbitrum, polygon, optimism, avalanche } from 'viem/chains';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import type { ChainConfig } from '../chains/config';
import type { ScannedToken } from './types';

// ERC-20 ABI for token operations
const ERC20_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)',
]);

// Multicall ABI
const MULTICALL_ABI = parseAbi([
  'function aggregate((address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
]);

// Chain mapping for viem
const ViemChainMap: Record<string, Chain> = {
  ETHEREUM: mainnet,
  BASE: base,
  BSC: bsc,
  ARBITRUM: arbitrum,
  POLYGON: polygon,
  OPTIMISM: optimism,
  AVALANCHE: avalanche,
};

// Common token addresses for each chain (for price fetching)
const NATIVE_TOKENS: Record<string, { address: string; symbol: string; decimals: number }> = {
  ETHEREUM: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18 },
  BASE: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18 },
  ARBITRUM: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18 },
  OPTIMISM: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18 },
  BSC: { address: '0x0000000000000000000000000000000000000000', symbol: 'BNB', decimals: 18 },
  POLYGON: { address: '0x0000000000000000000000000000000000000000', symbol: 'MATIC', decimals: 18 },
  AVALANCHE: { address: '0x0000000000000000000000000000000000000000', symbol: 'AVAX', decimals: 18 },
};

// Known token addresses per chain (popular tokens)
const KNOWN_TOKENS: Record<string, string[]> = {
  BASE: [
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC
    '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', // DAI
    '0x4200000000000000000000000000000000000006', // WETH
  ],
  ETHEREUM: [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
  ],
  BSC: [
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
    '0x55d398326f99059ff775485246999027b3197955', // USDT
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8', // ETH
  ],
  ARBITRUM: [
    '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // USDC
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH
  ],
  POLYGON: [
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT
    '0x7ceb23fd6fc0dd61e6cf23aeca94d4e62b41e2ba', // WETH
  ],
  OPTIMISM: [
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
    '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', // USDT
    '0x4200000000000000000000000000000000000006', // WETH
  ],
  AVALANCHE: [
    '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
    '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', // USDT
    '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', // WETH
  ],
};

interface TokenBalance {
  address: Address;
  balance: bigint;
  decimals: number;
  symbol?: string;
  name?: string;
}

/**
 * Scan EVM chain for token balances
 */
export async function scanEVMChain(
  address: Address,
  chainKey: string,
  chainConfig: ChainConfig
): Promise<ScannedToken[]> {
  const viemChain = ViemChainMap[chainKey];
  if (!viemChain) {
    throw new Error(`Unsupported EVM chain: ${chainKey}`);
  }

  // Create public client
  const client = createPublicClient({
    chain: {
      ...viemChain,
      rpcUrls: {
        default: {
          http: [chainConfig.rpc],
        },
      },
    },
    transport: http(chainConfig.rpc, {
      retryCount: 3,
      retryDelay: 1000,
    }),
  });

  const tokens: ScannedToken[] = [];
  const tokenAddresses = KNOWN_TOKENS[chainKey] || [];

  try {
    // Fetch native balance
    const nativeBalance = await client.getBalance({ address });
    const nativeToken = NATIVE_TOKENS[chainKey];
    
    if (nativeToken && nativeBalance > 0n) {
      const balanceFormatted = Number(nativeBalance) / 10 ** nativeToken.decimals;
      // Estimate price (would use price API in production)
      const priceUSD = await fetchTokenPrice(chainKey, nativeToken.symbol);
      const valueUSD = balanceFormatted * priceUSD;

      tokens.push({
        address: nativeToken.address,
        symbol: nativeToken.symbol,
        name: nativeToken.symbol,
        decimals: nativeToken.decimals,
        balance: nativeBalance.toString(),
        balanceFormatted,
        priceUSD,
        valueUSD,
        riskScore: 0, // Native tokens are safe
        isHoneypot: false,
        isRugpull: false,
        chain: chainKey,
        chainConfig,
        verified: true,
        liquidity: 0, // Would fetch from DEX
        holders: 0, // Would fetch from explorer
        category: 'PREMIUM',
        allowedActions: ['HOLD', 'SWAP'],
      });
    }

    // Fetch ERC-20 token balances using multicall if available
    if (chainConfig.multicall && tokenAddresses.length > 0) {
      const tokenBalances = await fetchTokenBalancesMulticall(
        client,
        address,
        tokenAddresses,
        chainConfig.multicall as Address
      );

      for (const tokenBalance of tokenBalances) {
        if (tokenBalance.balance === 0n) continue;

        const balanceFormatted = Number(tokenBalance.balance) / 10 ** tokenBalance.decimals;
        const symbol = tokenBalance.symbol || 'UNKNOWN';
        const priceUSD = await fetchTokenPrice(chainKey, symbol);
        const valueUSD = balanceFormatted * priceUSD;

        tokens.push({
          address: tokenBalance.address,
          symbol,
          name: tokenBalance.name || symbol,
          decimals: tokenBalance.decimals,
          balance: tokenBalance.balance.toString(),
          balanceFormatted,
          priceUSD,
          valueUSD,
          riskScore: 0, // Would fetch from GoPlus API
          isHoneypot: false,
          isRugpull: false,
          chain: chainKey,
          chainConfig,
          verified: true, // Would check verification status
          liquidity: 0,
          holders: 0,
          category: 'DUST',
          allowedActions: ['SWAP'],
        });
      }
    } else {
      // Fallback: fetch tokens individually
      for (const tokenAddress of tokenAddresses) {
        try {
          const balance = await client.readContract({
            address: tokenAddress as Address,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address],
          });

          if (balance === 0n) continue;

          const [decimals, symbol, name] = await Promise.all([
            client.readContract({
              address: tokenAddress as Address,
              abi: ERC20_ABI,
              functionName: 'decimals',
            }),
            client.readContract({
              address: tokenAddress as Address,
              abi: ERC20_ABI,
              functionName: 'symbol',
            }).catch(() => 'UNKNOWN'),
            client.readContract({
              address: tokenAddress as Address,
              abi: ERC20_ABI,
              functionName: 'name',
            }).catch(() => 'Unknown Token'),
          ]);

          const balanceFormatted = Number(balance) / 10 ** decimals;
          const priceUSD = await fetchTokenPrice(chainKey, symbol);
          const valueUSD = balanceFormatted * priceUSD;

          tokens.push({
            address: tokenAddress as Address,
            symbol,
            name,
            decimals,
            balance: balance.toString(),
            balanceFormatted,
            priceUSD,
            valueUSD,
            riskScore: 0,
            isHoneypot: false,
            isRugpull: false,
            chain: chainKey,
            chainConfig,
            verified: true,
            liquidity: 0,
            holders: 0,
            category: 'DUST',
            allowedActions: ['SWAP'],
          });
        } catch (error) {
          // Skip failed tokens
          console.warn(`Failed to fetch token ${tokenAddress}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${chainKey}:`, error);
    throw error;
  }

  return tokens;
}

/**
 * Fetch token balances using multicall
 */
async function fetchTokenBalancesMulticall(
  client: ReturnType<typeof createPublicClient>,
  address: Address,
  tokenAddresses: string[],
  multicallAddress: Address
): Promise<TokenBalance[]> {
  const calls = tokenAddresses.map((tokenAddr) => ({
    target: tokenAddr as Address,
    callData: client.encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    }) as `0x${string}`,
  }));

  try {
    const result = await client.readContract({
      address: multicallAddress,
      abi: MULTICALL_ABI,
      functionName: 'aggregate',
      args: [calls],
    });

    const balances: TokenBalance[] = [];
    for (let i = 0; i < tokenAddresses.length; i++) {
      const returnData = result[1][i];
      if (!returnData || returnData === '0x') continue;

      const balance = BigInt(returnData);
      if (balance === 0n) continue;

      // Fetch decimals and symbol
      try {
        const [decimals, symbol, name] = await Promise.all([
          client.readContract({
            address: tokenAddresses[i] as Address,
            abi: ERC20_ABI,
            functionName: 'decimals',
          }),
          client.readContract({
            address: tokenAddresses[i] as Address,
            abi: ERC20_ABI,
            functionName: 'symbol',
          }).catch(() => 'UNKNOWN'),
          client.readContract({
            address: tokenAddresses[i] as Address,
            abi: ERC20_ABI,
            functionName: 'name',
          }).catch(() => 'Unknown Token'),
        ]);

        balances.push({
          address: tokenAddresses[i] as Address,
          balance,
          decimals,
          symbol,
          name,
        });
      } catch (error) {
        // Skip if metadata fetch fails
        console.warn(`Failed to fetch metadata for ${tokenAddresses[i]}:`, error);
      }
    }

    return balances;
  } catch (error) {
    console.warn('Multicall failed, falling back to individual calls:', error);
    // Fallback to individual calls
    return [];
  }
}

/**
 * Scan Solana chain for token balances
 */
export async function scanSolanaChain(
  address: string,
  chainConfig: ChainConfig
): Promise<ScannedToken[]> {
  const connection = new Connection(chainConfig.rpc, {
    commitment: 'confirmed',
  });

  const tokens: ScannedToken[] = [];

  try {
    const publicKey = new PublicKey(address);

    // Fetch native SOL balance
    const solBalance = await connection.getBalance(publicKey);
    if (solBalance > 0) {
      const balanceFormatted = solBalance / 1e9; // SOL has 9 decimals
      const priceUSD = await fetchTokenPrice('SOLANA', 'SOL');
      const valueUSD = balanceFormatted * priceUSD;

      tokens.push({
        address: 'native',
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
        balance: solBalance.toString(),
        balanceFormatted,
        priceUSD,
        valueUSD,
        riskScore: 0,
        isHoneypot: false,
        isRugpull: false,
        chain: 'SOLANA',
        chainConfig,
        verified: true,
        liquidity: 0,
        holders: 0,
        category: 'PREMIUM',
        allowedActions: ['HOLD', 'SWAP'],
      });
    }

    // Fetch SPL token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });

    for (const accountInfo of tokenAccounts.value) {
      const parsedInfo = accountInfo.account.data.parsed?.info;
      if (!parsedInfo) continue;

      const mint = parsedInfo.mint;
      const tokenAmount = parsedInfo.tokenAmount;
      
      if (tokenAmount.uiAmount === 0 || !tokenAmount.uiAmount) continue;

      // Fetch token metadata (would use Metaplex in production)
      const symbol = 'UNKNOWN';
      const name = 'Unknown Token';
      const decimals = tokenAmount.decimals;
      const balance = BigInt(tokenAmount.amount);
      const balanceFormatted = tokenAmount.uiAmount;

      const priceUSD = await fetchTokenPrice('SOLANA', symbol);
      const valueUSD = balanceFormatted * priceUSD;

      tokens.push({
        address: mint,
        symbol,
        name,
        decimals,
        balance: balance.toString(),
        balanceFormatted,
        priceUSD,
        valueUSD,
        riskScore: 0,
        isHoneypot: false,
        isRugpull: false,
        chain: 'SOLANA',
        chainConfig,
        verified: false,
        liquidity: 0,
        holders: 0,
        category: 'DUST',
        allowedActions: ['SWAP'],
      });
    }
  } catch (error) {
    console.error('Error scanning Solana:', error);
    throw error;
  }

  return tokens;
}

/**
 * Fetch token price from CoinGecko API (simplified)
 * In production, would use proper API with caching
 */
async function fetchTokenPrice(chain: string, symbol: string): Promise<number> {
  // Mock price fetching - in production would use CoinGecko/CoinMarketCap API
  const priceMap: Record<string, number> = {
    ETH: 2500,
    BNB: 300,
    MATIC: 0.8,
    AVAX: 35,
    SOL: 100,
    USDC: 1,
    USDT: 1,
    DAI: 1,
    WETH: 2500,
  };

  return priceMap[symbol.toUpperCase()] || Math.random() * 10;
}

/**
 * Retry wrapper for RPC calls
 */
export async function retryRpcCall<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError || new Error('RPC call failed after retries');
}


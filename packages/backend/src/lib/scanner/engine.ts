/**
 * Multi-Chain Scanner Engine
 * Scans EVM chains (viem) + Solana (@solana/web3.js)
 * Uses RPC endpoints from environment configuration
 */

import { createPublicClient, http, type Address } from 'viem';
import { Connection, PublicKey, getTokenAccountsByOwner, TOKEN_PROGRAM_ID } from '@solana/web3.js';
import { config } from '../config';
import type { ScannedToken, ScanResult } from './types';

export class MultiChainScanner {
  /**
   * Get RPC URL for chain (with fallback priority)
   */
  private getRPCUrl(chainId: number, chainName: string): string {
    // Base chain - priority: QuickNode > Alchemy > Infura > fallback
    if (chainId === 8453) {
      return (
        config.rpc.base ||
        config.rpc.alchemy.base ||
        config.rpc.infura.base ||
        'https://base.drpc.org'
      );
    }

    // Ethereum - priority: Alchemy > Infura > fallback
    if (chainId === 1) {
      return (
        config.rpc.alchemy.base?.replace('base-mainnet', 'eth-mainnet') ||
        config.rpc.infura.base?.replace('base-mainnet', 'mainnet') ||
        'https://eth.llamarpc.com'
      );
    }

    // Other chains - use fallback RPCs
    const fallbackRPCs: Record<number, string> = {
      56: 'https://bsc.drpc.org', // BSC
      42161: 'https://arb1.arbitrum.io/rpc', // Arbitrum
      137: 'https://polygon.drpc.org', // Polygon
      838592: 'https://monad.drpc.org', // Monad
      43114: 'https://avalanche.drpc.org', // Avalanche
      10: 'https://optimism.drpc.org', // Optimism
    };

    return fallbackRPCs[chainId] || `https://${chainName.toLowerCase()}.drpc.org`;
  }

  /**
   * Scan wallet address across all supported chains
   */
  async scan(address: string): Promise<ScanResult> {
    const chains = [
      { id: 56, name: 'BSC', rpc: this.getRPCUrl(56, 'BSC') },
      { id: 42161, name: 'Arbitrum', rpc: this.getRPCUrl(42161, 'Arbitrum') },
      { id: 8453, name: 'Base', rpc: this.getRPCUrl(8453, 'Base') },
      { id: 137, name: 'Polygon', rpc: this.getRPCUrl(137, 'Polygon') },
      { id: 838592, name: 'Monad', rpc: this.getRPCUrl(838592, 'Monad') },
      { id: 43114, name: 'Avalanche', rpc: this.getRPCUrl(43114, 'Avalanche') },
      { id: 10, name: 'Optimism', rpc: this.getRPCUrl(10, 'Optimism') },
      { id: 1, name: 'Ethereum', rpc: this.getRPCUrl(1, 'Ethereum') },
    ];

    const allTokens: ScannedToken[] = [];

    // Scan EVM chains in parallel
    const evmResults = await Promise.allSettled(
      chains.map((chain) => this.scanEVMChain(address as Address, chain))
    );

    for (const result of evmResults) {
      if (result.status === 'fulfilled') {
        allTokens.push(...result.value);
      }
    }

    // Scan Solana
    try {
      const solanaTokens = await this.scanSolanaChain(address);
      allTokens.push(...solanaTokens);
    } catch (error) {
      console.error('Solana scan error:', error);
    }

    return {
      address,
      timestamp: Date.now(),
      chains: chains.map((c) => c.name),
      tokens: allTokens,
      summary: {
        totalValue: allTokens.reduce((sum, t) => sum + (t.valueUSD || 0), 0),
        totalTokens: allTokens.length,
        premium: {
          count: allTokens.filter((t) => t.category === 'PREMIUM').length,
          value: allTokens
            .filter((t) => t.category === 'PREMIUM')
            .reduce((sum, t) => sum + (t.valueUSD || 0), 0),
          tokens: allTokens.filter((t) => t.category === 'PREMIUM'),
        },
        dust: {
          count: allTokens.filter((t) => t.category === 'DUST').length,
          value: allTokens
            .filter((t) => t.category === 'DUST')
            .reduce((sum, t) => sum + (t.valueUSD || 0), 0),
          tokens: allTokens.filter((t) => t.category === 'DUST'),
        },
        micro: {
          count: allTokens.filter((t) => t.category === 'MICRO').length,
          value: allTokens
            .filter((t) => t.category === 'MICRO')
            .reduce((sum, t) => sum + (t.valueUSD || 0), 0),
          tokens: allTokens.filter((t) => t.category === 'MICRO'),
        },
        risk: {
          count: allTokens.filter((t) => t.category === 'RISK').length,
          value: allTokens
            .filter((t) => t.category === 'RISK')
            .reduce((sum, t) => sum + (t.valueUSD || 0), 0),
          tokens: allTokens.filter((t) => t.category === 'RISK'),
        },
      },
      fromCache: false,
    };
  }

  /**
   * Scan EVM chain
   */
  private async scanEVMChain(
    address: Address,
    chain: { id: number; name: string; rpc: string }
  ): Promise<ScannedToken[]> {
    const publicClient = createPublicClient({
      chain: {
        id: chain.id,
        name: chain.name,
        rpcUrls: { default: { http: [chain.rpc] } },
      },
      transport: http(chain.rpc),
    });

    const tokens: ScannedToken[] = [];

    try {
      // Get native balance
      const balance = await publicClient.getBalance({ address });
      tokens.push({
        address: '0x0',
        symbol: chain.name === 'Base' ? 'ETH' : chain.name,
        name: `${chain.name} Native`,
        decimals: 18,
        balance: balance.toString(),
        balanceFormatted: Number(balance) / 10 ** 18,
        priceUSD: 0, // Would fetch from price API
        valueUSD: 0,
        riskScore: 0,
        isHoneypot: false,
        isRugpull: false,
        chain: chain.name,
        verified: true,
        liquidity: 0,
        holders: 0,
        category: 'PREMIUM',
        allowedActions: ['HOLD', 'SWAP'],
      });

      // TODO: Fetch ERC-20 tokens (would use indexer or multicall)
    } catch (error) {
      console.error(`Error scanning ${chain.name}:`, error);
    }

    return tokens;
  }

  /**
   * Scan Solana chain
   */
  private async scanSolanaChain(address: string): Promise<ScannedToken[]> {
    // Priority: Helius > QuickNode > Alchemy > fallback
    const solanaRPC =
      config.rpc.helius.rpc ||
      config.rpc.helius.mainnet ||
      config.rpc.solana ||
      config.rpc.alchemy.solana ||
      'https://solana.drpc.org';
    
    const connection = new Connection(solanaRPC, 'confirmed');
    const ownerPublicKey = new PublicKey(address);
    const tokens: ScannedToken[] = [];

    try {
      // Get SOL balance
      const solBalance = await connection.getBalance(ownerPublicKey);
      tokens.push({
        address: 'SOL',
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
        balance: solBalance.toString(),
        balanceFormatted: solBalance / 10 ** 9,
        priceUSD: 0,
        valueUSD: 0,
        riskScore: 0,
        isHoneypot: false,
        isRugpull: false,
        chain: 'Solana',
        verified: true,
        liquidity: 0,
        holders: 0,
        category: 'PREMIUM',
        allowedActions: ['HOLD', 'SWAP'],
      });

      // Get SPL tokens
      const tokenAccounts = await getTokenAccountsByOwner(connection, ownerPublicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      // TODO: Fetch token metadata for each SPL token
    } catch (error) {
      console.error('Solana scan error:', error);
    }

    return tokens;
  }
}


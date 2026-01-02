/**
 * Multi-Chain Scanner Engine
 * Scans EVM chains (viem) + Solana (@solana/web3.js)
 */

import { createPublicClient, http, type Address } from 'viem';
import { Connection, PublicKey, getTokenAccountsByOwner, TOKEN_PROGRAM_ID } from '@solana/web3.js';
import type { ScannedToken, ScanResult } from './types';

export class MultiChainScanner {
  /**
   * Scan wallet address across all supported chains
   */
  async scan(address: string): Promise<ScanResult> {
    const chains = [
      { id: 56, name: 'BSC', rpc: 'https://bsc.drpc.org' },
      { id: 42161, name: 'Arbitrum', rpc: 'https://arb1.arbitrum.io/rpc' },
      { id: 8453, name: 'Base', rpc: 'https://base.drpc.org' },
      { id: 137, name: 'Polygon', rpc: 'https://polygon.drpc.org' },
      { id: 838592, name: 'Monad', rpc: 'https://monad.drpc.org' },
      { id: 43114, name: 'Avalanche', rpc: 'https://avalanche.drpc.org' },
      { id: 10, name: 'Optimism', rpc: 'https://optimism.drpc.org' },
      { id: 1, name: 'Ethereum', rpc: 'https://eth.llamarpc.com' },
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
    const connection = new Connection('https://solana.drpc.org', 'confirmed');
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


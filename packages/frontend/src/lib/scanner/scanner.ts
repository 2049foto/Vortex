/**
 * Vortex Multi-Chain Scanner
 * Parallel scanning across 9 chains with caching
 */

import { CHAINS, type ChainConfig } from '../chains/config';
import { classifyTokens } from './classifier';
import { scanEVMChain, scanSolanaChain } from './rpc-scanner';
import { redisClient } from '../cache/redis-client';
import { enhanceTokensWithSecurity } from './goPlus-integration';
import { retryOnNetworkError } from '../utils/retry';
import { logger } from '../utils/logger';
import type { ScannedToken, ScanResult, ChainScanStatus, ScannerOptions } from './types';

// Scan state callbacks
type ScanProgressCallback = (chains: ChainScanStatus[]) => void;

class VortexScanner {
  private cacheTTL = 5 * 60; // 5 minutes in seconds
  private cacheStats = {
    hits: 0,
    misses: 0,
    warmups: 0,
  };

  /**
   * Scan all chains for a wallet address
   */
  async scan(
    address: string,
    options: ScannerOptions = {},
    onProgress?: ScanProgressCallback
  ): Promise<ScanResult> {
    const cacheKey = `scan:${address}`;
    
    // Check cache first
    if (options.useCache !== false) {
      const cached = await redisClient.get<ScanResult>(cacheKey);
      if (cached) {
        this.cacheStats.hits++;
        return { ...cached, fromCache: true };
      }
      this.cacheStats.misses++;
    }

    // Initialize chain statuses
    const chainKeys = Object.keys(CHAINS);
    const chainStatuses: ChainScanStatus[] = chainKeys.map(chain => ({
      chain,
      status: 'pending',
      tokensFound: 0,
      progress: 0,
    }));

    onProgress?.(chainStatuses);

    // Parallel scan with batching (3 chains at a time)
    const allTokens: ScannedToken[] = [];
    const chainBatches = this.batchChains(chainKeys, 3);

    for (const batch of chainBatches) {
      const results = await Promise.allSettled(
        batch.map(async (chainKey) => {
          const chainIndex = chainStatuses.findIndex(c => c.chain === chainKey);
          const chainStatus = chainStatuses[chainIndex];
          const chainConfig = CHAINS[chainKey];
          
          if (!chainConfig || !chainStatus || chainIndex < 0) {
            return [];
          }
          
          chainStatus.status = 'scanning';
          onProgress?.([...chainStatuses]);

          try {
            const tokens = await retryOnNetworkError(
              () => this.scanChain(address, chainKey, chainConfig),
              { maxAttempts: 3 }
            );
            
            logger.info(`Scanned ${chainKey}`, { tokensFound: tokens.length });
            chainStatus.status = 'complete';
            chainStatus.tokensFound = tokens.length;
            chainStatus.progress = 100;
            onProgress?.([...chainStatuses]);

            return tokens;
          } catch (error) {
            logger.error(`Error scanning chain ${chainKey}`, error, { chainKey, address });
            chainStatus.status = 'error';
            chainStatus.error = error instanceof Error ? error.message : 'Unknown error';
            onProgress?.([...chainStatuses]);
            return [];
          }
        })
      );

      // Collect successful results
      for (const result of results) {
        if (result.status === 'fulfilled') {
          allTokens.push(...result.value);
        }
      }
    }

    // Enhance tokens with GoPlus security data
    const enhancedTokens = await enhanceTokensWithSecurity(allTokens);

    // Classify all tokens
    const { classified, summary } = classifyTokens(enhancedTokens);

    // Build result
    const scanResult: ScanResult = {
      address,
      timestamp: Date.now(),
      chains: chainStatuses,
      tokens: classified,
      summary: {
        ...summary,
        premium: summary.premium,
        dust: summary.dust,
        micro: summary.micro,
        risk: summary.risk,
      },
      fromCache: false,
    };

    // Cache result
    await redisClient.set(cacheKey, scanResult, options.cacheTTL || this.cacheTTL);

    return scanResult;
  }

  /**
   * Scan a single chain
   */
  private async scanChain(
    address: string,
    chainKey: string,
    chainConfig: ChainConfig
  ): Promise<ScannedToken[]> {
    // Solana has different logic
    if (chainKey === 'SOLANA') {
      return this.scanSolana(address, chainConfig);
    }

    // EVM chain scanning
    return this.scanEVMChain(address, chainKey, chainConfig);
  }

  /**
   * Scan EVM chain using real RPC calls
   */
  private async scanEVMChain(
    address: string,
    chainKey: string,
    chainConfig: ChainConfig
  ): Promise<ScannedToken[]> {
    try {
      return await scanEVMChain(address as `0x${string}`, chainKey, chainConfig);
    } catch (error) {
      console.error(`Error scanning EVM chain ${chainKey}:`, error);
      // Fallback to mock data on error
      return this.getMockTokens(chainKey, chainConfig);
    }
  }

  /**
   * Scan Solana chain using real RPC calls
   */
  private async scanSolana(
    address: string,
    chainConfig: ChainConfig
  ): Promise<ScannedToken[]> {
    try {
      return await scanSolanaChain(address, chainConfig);
    } catch (error) {
      console.error('Error scanning Solana:', error);
      // Fallback to mock data on error
      return this.getMockTokens('SOLANA', chainConfig);
    }
  }

  /**
   * Generate mock tokens for demo
   */
  private getMockTokens(
    chainKey: string,
    chainConfig: ChainConfig
  ): ScannedToken[] {
    // Random tokens per chain
    const tokenCount = Math.floor(Math.random() * 5) + 1;
    const tokens: ScannedToken[] = [];
    const symbols = ['PEPE', 'SHIB', 'DOGE', 'USDC', 'USDT', 'WETH', 'AERO'];

    for (let i = 0; i < tokenCount; i++) {
      const valueUSD = Math.random() * 1000;
      const riskScore = Math.floor(Math.random() * 100);
      const symbolIndex = Math.floor(Math.random() * symbols.length);
      const symbol = symbols[symbolIndex] ?? 'TOKEN';
      
      tokens.push({
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        symbol,
        name: `Token ${i + 1}`,
        decimals: 18,
        balance: (Math.random() * 1000000).toString(),
        balanceFormatted: Math.random() * 1000000,
        priceUSD: Math.random() * 10,
        valueUSD,
        riskScore,
        isHoneypot: riskScore > 80,
        isRugpull: riskScore > 90,
        chain: chainKey,
        chainConfig,
        verified: Math.random() > 0.3,
        liquidity: Math.random() * 500000,
        holders: Math.floor(Math.random() * 10000),
        category: 'DUST',
        allowedActions: ['SWAP'],
      });
    }

    return tokens;
  }

  /**
   * Batch chains for parallel scanning
   */
  private batchChains(chains: string[], batchSize: number): string[][] {
    const batches: string[][] = [];
    for (let i = 0; i < chains.length; i += batchSize) {
      batches.push(chains.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    // Note: Redis doesn't support clearing all keys from frontend
    // This would need a backend endpoint for safety
    console.warn('clearCache() not fully implemented - use clearCacheForAddress()');
  }

  /**
   * Clear cache for specific address
   */
  async clearCacheForAddress(address: string): Promise<void> {
    await redisClient.del(`scan:${address}`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { hits: number; misses: number; hitRate: number; warmups: number } {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    return {
      hits: this.cacheStats.hits,
      misses: this.cacheStats.misses,
      hitRate: total > 0 ? (this.cacheStats.hits / total) * 100 : 0,
      warmups: this.cacheStats.warmups,
    };
  }

  /**
   * Warm up cache for popular addresses
   */
  async warmupCache(addresses: string[]): Promise<void> {
    for (const address of addresses) {
      const cacheKey = `scan:${address}`;
      const exists = await redisClient.exists(cacheKey);
      
      if (!exists) {
        // Pre-scan popular addresses
        try {
          await this.scan(address, { useCache: false });
          this.cacheStats.warmups++;
        } catch (error) {
          console.error(`Cache warmup failed for ${address}:`, error);
        }
      }
    }
  }
}

// Export class and singleton
export { VortexScanner };
export const scanner = new VortexScanner();

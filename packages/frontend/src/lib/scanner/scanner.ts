/**
 * Vortex Multi-Chain Scanner
 * Parallel scanning across 9 chains with caching
 */

import { CHAINS, type ChainConfig } from '../chains/config';
import { classifyTokens } from './classifier';
import type { ScannedToken, ScanResult, ChainScanStatus, ScannerOptions } from './types';

// Scan state callbacks
type ScanProgressCallback = (chains: ChainScanStatus[]) => void;

class VortexScanner {
  private cache = new Map<string, { data: ScanResult; expiry: number }>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

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
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return { ...cached.data, fromCache: true };
      }
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
            const tokens = await this.scanChain(address, chainKey, chainConfig);
            
            chainStatus.status = 'complete';
            chainStatus.tokensFound = tokens.length;
            chainStatus.progress = 100;
            onProgress?.([...chainStatuses]);

            return tokens;
          } catch (error) {
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

    // Classify all tokens
    const { classified, summary } = classifyTokens(allTokens);

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
    this.cache.set(cacheKey, {
      data: scanResult,
      expiry: Date.now() + (options.cacheTTL || this.cacheTTL),
    });

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
   * Scan EVM chain using public APIs
   */
  private async scanEVMChain(
    _address: string,
    chainKey: string,
    chainConfig: ChainConfig
  ): Promise<ScannedToken[]> {
    const tokens: ScannedToken[] = [];

    try {
      // Use Covalent/Zerion/DeBank API in production
      // For now, return mock data for demo
      const mockTokens = this.getMockTokens(chainKey, chainConfig);
      tokens.push(...mockTokens);
    } catch (error) {
      // Error handled by caller
    }

    return tokens;
  }

  /**
   * Scan Solana chain
   */
  private async scanSolana(
    _address: string,
    chainConfig: ChainConfig
  ): Promise<ScannedToken[]> {
    const tokens: ScannedToken[] = [];

    try {
      // Use Helius/Solscan API in production
      // Mock data for demo
      const mockTokens = this.getMockTokens('SOLANA', chainConfig);
      tokens.push(...mockTokens);
    } catch (error) {
      // Error handled by caller
    }

    return tokens;
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
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for specific address
   */
  clearCacheForAddress(address: string): void {
    this.cache.delete(`scan:${address}`);
  }
}

// Export singleton
export const scanner = new VortexScanner();

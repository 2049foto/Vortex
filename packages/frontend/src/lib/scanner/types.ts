/**
 * Vortex Scanner - Type Definitions
 */

import type { ChainConfig } from '../chains/config';

// Token classification categories
export type TokenCategory = 'PREMIUM' | 'DUST' | 'MICRO' | 'RISK';

// Allowed actions per category
export type TokenAction = 'SWAP' | 'HIDE' | 'BURN' | 'HOLD';

// Token data from scanner
export interface ScannedToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  
  // Balance
  balance: string;
  balanceFormatted: number;
  
  // Value
  priceUSD: number;
  valueUSD: number;
  
  // Risk analysis
  riskScore: number;
  isHoneypot: boolean;
  isRugpull: boolean;
  
  // Metadata
  chain: string;
  chainConfig: ChainConfig;
  verified: boolean;
  liquidity: number;
  holders: number;
  
  // Classification
  category: TokenCategory;
  allowedActions: TokenAction[];
  
  // Selection state (UI)
  selected?: boolean;
}

// Chain scan status
export interface ChainScanStatus {
  chain: string;
  status: 'pending' | 'scanning' | 'complete' | 'error';
  tokensFound: number;
  error?: string;
  progress: number;
}

// Full scan result
export interface ScanResult {
  address: string;
  timestamp: number;
  chains: ChainScanStatus[];
  tokens: ScannedToken[];
  
  // Summary stats
  summary: {
    totalValue: number;
    totalTokens: number;
    
    premium: {
      count: number;
      value: number;
      tokens: ScannedToken[];
    };
    
    dust: {
      count: number;
      value: number;
      tokens: ScannedToken[];
    };
    
    micro: {
      count: number;
      value: number;
      tokens: ScannedToken[];
    };
    
    risk: {
      count: number;
      value: number;
      tokens: ScannedToken[];
    };
  };
  
  // Cached?
  fromCache: boolean;
  cacheExpiry?: number;
}

// Batch action request
export interface BatchActionRequest {
  action: 'SWAP' | 'HIDE' | 'BURN';
  tokens: ScannedToken[];
  targetChain: string;
  slippage?: number;
}

// Batch action result
export interface BatchActionResult {
  success: boolean;
  txHash?: string;
  tokensProcessed: number;
  totalValueSaved: number;
  gasUsed: number;
  error?: string;
}

// Scanner options
export interface ScannerOptions {
  chains?: string[];
  includeNFTs?: boolean;
  minValue?: number;
  useCache?: boolean;
  cacheTTL?: number;
}


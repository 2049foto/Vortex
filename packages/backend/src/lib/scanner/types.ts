/**
 * Scanner Types
 */

export type TokenCategory = 'PREMIUM' | 'DUST' | 'MICRO' | 'RISK';
export type TokenAction = 'HOLD' | 'SWAP' | 'HIDE' | 'BURN';

export interface ScannedToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: number;
  priceUSD: number;
  valueUSD: number;
  riskScore: number;
  isHoneypot: boolean;
  isRugpull: boolean;
  chain: string;
  verified: boolean;
  liquidity: number;
  holders: number;
  category: TokenCategory;
  allowedActions: TokenAction[];
}

export interface ScanResult {
  address: string;
  timestamp: number;
  chains: string[];
  tokens: ScannedToken[];
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
  scanDuration?: number;
  fromCache: boolean;
}


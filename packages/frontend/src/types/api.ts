/**
 * API-specific type definitions
 */

import type { Chain } from './index';

// ============================================
// Request Types
// ============================================

export interface AuthMessageRequest {
  address: string;
}

export interface AuthLoginRequest {
  address: string;
  signature: string;
  message: string;
}

export interface AuthVerifyRequest {
  token: string;
}

export interface ScanTokenRequest {
  tokenAddress: string;
  chain: Chain;
}

export interface PortfolioRequest {
  address: string;
  chain?: Chain;
}

export interface WatchlistCreateRequest {
  tokenAddress: string;
  chain: string;
  symbol?: string;
  name?: string;
}

export interface AlertCreateRequest {
  type: 'price' | 'risk' | 'volume';
  token: string;
  condition: 'above' | 'below' | 'equals';
  value: number;
}

export interface AlertUpdateRequest {
  enabled?: boolean;
  value?: number;
  condition?: 'above' | 'below' | 'equals';
}

// ============================================
// Response Types
// ============================================

export interface AuthMessageResponse {
  message: string;
  nonce: string;
  timestamp: number;
}

export interface AuthLoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    walletAddress: string;
    email?: string;
    name?: string;
    createdAt: string;
    updatedAt: string;
  };
  expiresAt: string;
}

export interface AuthVerifyResponse {
  valid: boolean;
  user?: {
    id: string;
    walletAddress: string;
  };
  expiresAt?: string;
}

export interface ScanTokenResponse {
  success: boolean;
  data: {
    token: {
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      chain: string;
    };
    risk: {
      riskScore: number;
      riskLevel: 'SAFE' | 'WARNING' | 'DANGER';
      safe: boolean;
      honeypot: boolean;
      rugpull: boolean;
      transferability: boolean;
      risks: Array<{
        name: string;
        description: string;
        result: boolean;
        severity: 'low' | 'medium' | 'high' | 'critical';
      }>;
    };
    cachedAt: string;
    expiresAt: string;
  };
}

export interface PortfolioResponse {
  success: boolean;
  data: {
    address: string;
    totalValueUSD: number;
    change24hUSD: number;
    change24hPercent: number;
    tokens: Array<{
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      balance: string;
      balanceFormatted: number;
      priceUSD: number;
      valueUSD: number;
      change24h: number;
      change24hPercent: number;
    }>;
    lastUpdated: string;
  };
}

export interface WatchlistResponse {
  success: boolean;
  data: Array<{
    id: string;
    userId: string;
    tokenAddress: string;
    chain: string;
    symbol: string;
    name: string;
    createdAt: string;
  }>;
}

export interface AlertsResponse {
  success: boolean;
  data: Array<{
    id: string;
    userId: string;
    type: 'price' | 'risk' | 'volume';
    token: string;
    condition: 'above' | 'below' | 'equals';
    value: number;
    enabled: boolean;
    createdAt: string;
  }>;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    cache: 'connected' | 'disconnected';
  };
}

// ============================================
// Error Types
// ============================================

export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  status: number;
  timestamp: string;
  details?: Record<string, unknown>;
}

// Error codes
export const API_ERROR_CODES = {
  // Authentication
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Validation
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_CHAIN: 'INVALID_CHAIN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  
  // External APIs
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  GOPLUS_ERROR: 'GOPLUS_ERROR',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];


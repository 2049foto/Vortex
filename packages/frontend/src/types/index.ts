/**
 * Core type definitions for Vortex Protocol
 */

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  darkMode: boolean;
  notifications: boolean;
  language: string;
  theme: string;
}

// ============================================
// Authentication Types
// ============================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  address: string;
  signature: string;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface AuthMessage {
  message: string;
  nonce: string;
  timestamp: number;
}

// ============================================
// Token Types
// ============================================

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  chain: Chain;
}

export interface TokenBalance extends Token {
  balance: string;
  balanceFormatted: number;
  priceUSD: number;
  valueUSD: number;
  change24h: number;
  change24hPercent: number;
}

export interface TokenRisk {
  riskScore: number;
  riskLevel: RiskLevel;
  safe: boolean;
  honeypot: boolean;
  rugpull: boolean;
  transferability: boolean;
  risks: RiskCheck[];
}

export interface RiskCheck {
  name: string;
  description: string;
  result: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export type RiskLevel = 'SAFE' | 'WARNING' | 'DANGER';

// ============================================
// Portfolio Types
// ============================================

export interface Portfolio {
  address: string;
  totalValueUSD: number;
  change24hUSD: number;
  change24hPercent: number;
  tokens: TokenBalance[];
  lastUpdated: string;
}

export interface PortfolioStats {
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  tokenCount: number;
  topGainer?: TokenBalance;
  topLoser?: TokenBalance;
}

// ============================================
// Watchlist Types
// ============================================

export interface WatchlistItem {
  id: string;
  userId: string;
  tokenAddress: string;
  chain: string;
  symbol: string;
  name: string;
  createdAt: string;
}

export interface AddToWatchlistRequest {
  tokenAddress: string;
  chain: string;
  symbol?: string;
  name?: string;
}

// ============================================
// Alert Types
// ============================================

export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  token: string;
  condition: AlertCondition;
  value: number;
  enabled: boolean;
  createdAt: string;
}

export type AlertType = 'price' | 'risk' | 'volume';
export type AlertCondition = 'above' | 'below' | 'equals';

export interface CreateAlertRequest {
  type: AlertType;
  token: string;
  condition: AlertCondition;
  value: number;
}

export interface UpdateAlertRequest {
  enabled?: boolean;
  value?: number;
  condition?: AlertCondition;
}

// ============================================
// Transaction Types
// ============================================

export interface Transaction {
  id: string;
  txHash: string;
  from: string;
  to: string;
  value: string;
  chainId: number;
  blockNumber: number;
  createdAt: string;
  tokens: TransactionToken[];
}

export interface TransactionToken {
  id: string;
  tokenAddress: string;
  symbol: string;
  name: string;
  amount: string;
}

// ============================================
// Chain Types
// ============================================

export type Chain = 
  | 'ethereum'
  | 'base'
  | 'arbitrum'
  | 'optimism'
  | 'polygon'
  | 'bsc'
  | 'avalanche'
  | 'solana';

export interface ChainInfo {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  logoUrl?: string;
}

export const SUPPORTED_CHAINS: Record<Chain, ChainInfo> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  base: {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Chain',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  },
  avalanche: {
    id: 'avalanche',
    name: 'Avalanche',
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    chainId: 0,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
  },
};

// ============================================
// API Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  status?: number;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  status: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Scanner Types
// ============================================

export interface ScanRequest {
  tokenAddress: string;
  chain: Chain;
}

export interface ScanResponse {
  token: Token;
  risk: TokenRisk;
  cachedAt?: string;
  expiresAt?: string;
}

// ============================================
// UI Types
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}


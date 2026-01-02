/**
 * Vortex Protocol - 9-Chain Configuration
 * High-performance RPCs for multi-chain scanning
 */

export interface ChainConfig {
  id: number | string;
  name: string;
  symbol: string;
  rpc: string;
  explorer: string;
  explorerApi?: string;
  isTarget?: boolean;
  color: string;
  icon: string;
  multicall?: string;
}

export const CHAINS: Record<string, ChainConfig> = {
  // Target Chain
  BASE: {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    explorerApi: 'https://api.basescan.org/api',
    isTarget: true,
    color: '#0052FF',
    icon: '🔵',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  
  // EVM Chains
  ETHEREUM: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    explorerApi: 'https://api.etherscan.io/api',
    color: '#627EEA',
    icon: '⟠',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  
  BSC: {
    id: 56,
    name: 'BNB Chain',
    symbol: 'BNB',
    rpc: 'https://bsc-dataseed1.binance.org',
    explorer: 'https://bscscan.com',
    explorerApi: 'https://api.bscscan.com/api',
    color: '#F0B90B',
    icon: '🟡',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  
  ARBITRUM: {
    id: 42161,
    name: 'Arbitrum One',
    symbol: 'ETH',
    rpc: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    explorerApi: 'https://api.arbiscan.io/api',
    color: '#28A0F0',
    icon: '🔷',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  
  POLYGON: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    explorerApi: 'https://api.polygonscan.com/api',
    color: '#8247E5',
    icon: '🟣',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  
  OPTIMISM: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpc: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    explorerApi: 'https://api-optimistic.etherscan.io/api',
    color: '#FF0420',
    icon: '🔴',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  
  AVALANCHE: {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    explorerApi: 'https://api.snowtrace.io/api',
    color: '#E84142',
    icon: '🔺',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  
  // Future Chain
  MONAD: {
    id: 838592,
    name: 'Monad',
    symbol: 'MON',
    rpc: 'https://testnet.monad.xyz',
    explorer: 'https://explorer.monad.xyz',
    color: '#6366F1',
    icon: '🟪',
  },
  
  // Non-EVM
  SOLANA: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    rpc: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
    color: '#14F195',
    icon: '◎',
  },
};

// EVM chains for batch scanning
export const EVM_CHAINS = Object.entries(CHAINS)
  .filter(([_, config]) => typeof config.id === 'number' && config.id !== 838592)
  .map(([key, config]) => ({ key, ...config }));

// Get chain by ID
export function getChainById(id: number | string): ChainConfig | undefined {
  return Object.values(CHAINS).find(c => c.id === id);
}

// Get chain key by ID
export function getChainKey(id: number | string): string | undefined {
  const entry = Object.entries(CHAINS).find(([_, c]) => c.id === id);
  return entry?.[0];
}

// Chain IDs array
export const CHAIN_IDS = Object.values(CHAINS).map(c => c.id);

// Target chain
export const TARGET_CHAIN = CHAINS.BASE;


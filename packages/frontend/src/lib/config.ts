/**
 * Frontend configuration for Vortex Protocol
 * Maps environment variables (supports both VITE_* and NEXT_PUBLIC_*)
 */

/**
 * Helper to get env var (supports both VITE_* and NEXT_PUBLIC_*)
 */
function getEnv(key: string, defaultValue: string = ''): string {
  // Try VITE_ prefix first (Vite standard)
  const viteKey = `VITE_${key}`;
  if (import.meta.env[viteKey]) {
    return import.meta.env[viteKey];
  }
  
  // Fallback to NEXT_PUBLIC_ prefix (for compatibility)
  const nextKey = `NEXT_PUBLIC_${key}`;
  if (import.meta.env[nextKey]) {
    return import.meta.env[nextKey];
  }
  
  // Try direct access
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  return defaultValue;
}

/**
 * Helper to get boolean env var
 */
function getBoolEnv(key: string, defaultValue: boolean = false): boolean {
  const value = getEnv(key);
  return value === 'true' || value === '1' || defaultValue;
}

/**
 * Helper to get number env var
 */
function getNumberEnv(key: string, defaultValue: number = 0): number {
  const value = getEnv(key);
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Frontend configuration
 */
export const config = {
  // App Identity
  app: {
    name: getEnv('APP_NAME', 'Vortex Protocol'),
    url: getEnv('APP_URL', 'https://vortex-protocol.vercel.app'),
  },

  // API
  api: {
    url: getEnv('API_URL', 'http://localhost:3001/api'),
  },

  // Wallet Connection
  wallet: {
    walletConnectProjectId: getEnv('WALLET_CONNECT_PROJECT_ID', ''),
    privyAppId: getEnv('PRIVY_APP_ID', ''),
  },

  // RPC Providers
  rpc: {
    // QuickNode
    quicknodeBase: getEnv('QUICKNODE_BASE_HTTPS', ''),
    quicknodeBaseWss: getEnv('QUICKNODE_BASE_WSS', ''),
    quicknodeSolana: getEnv('QUICKNODE_SOLANA_HTTPS', ''),
    quicknodeSolanaWss: getEnv('QUICKNODE_SOLANA_WSS', ''),
    // Alchemy
    alchemyApiKey: getEnv('ALCHEMY_API_KEY', ''),
    alchemyBase: getEnv('ALCHEMY_BASE_RPC', ''),
    alchemySolana: getEnv('ALCHEMY_SOLANA_RPC', ''),
    // Infura
    infuraProjectId: getEnv('INFURA_PROJECT_ID', ''),
    infuraBase: getEnv('INFURA_BASE_HTTPS', ''),
    // Helius (Solana)
    heliusApiKey: getEnv('HELIUS_API_KEY', ''),
    heliusRpc: getEnv('HELIUS_RPC', ''),
    heliusMainnet: getEnv('HELIUS_MAINNET', ''),
  },

  // Token Security APIs
  security: {
    goplus: {
      apiUrl: getEnv('GOPLUS_API_URL', 'https://api.gopluslabs.io/api/v1'),
    },
    rugcheck: {
      apiUrl: getEnv('RUGCHECK_API_URL', 'https://api.rugcheck.xyz/v1'),
    },
    blockaid: {
      apiKey: getEnv('BLOCKAID_API_KEY', ''),
    },
  },

  // Swap Aggregators
  swaps: {
    oneinch: {
      apiUrl: getEnv('ONEINCH_API_URL', 'https://api.1inch.dev'),
    },
    zerox: {
      apiUrl: getEnv('ZEROX_API_URL', 'https://api.0x.org'),
    },
    openocean: {
      apiUrl: getEnv('OPENOCEAN_API_URL', 'https://open-api.openocean.finance/v4'),
    },
    rango: {
      apiKey: getEnv('RANGO_API_KEY', ''),
      apiUrl: getEnv('RANGO_API_URL', 'https://api.rango.exchange'),
    },
    lifi: {
      apiUrl: getEnv('LIFI_API_URL', 'https://li.quest/v1'),
    },
    cow: {
      apiUrl: getEnv('COW_API_URL', 'https://api.cow.fi'),
    },
    jupiter: {
      apiUrl: getEnv('JUPITER_API_URL', 'https://quote-api.jup.ag/v6'),
    },
  },

  // Gas Sponsorship / Account Abstraction
  gasless: {
    pimlico: {
      baseUrl: getEnv('PIMLICO_BASE_URL', ''),
      polygonUrl: getEnv('PIMLICO_POLYGON_URL', ''),
    },
    coinbase: {
      onchainKitKey: getEnv('ONCHAINKIT_API_KEY', ''),
      paymasterUrl: getEnv('CDP_PAYMASTER_URL', ''),
    },
    zerodev: {
      projectId: getEnv('ZERODEV_PROJECT_ID', ''),
    },
  },

  // Data Indexing
  indexing: {
    moralis: {
      apiUrl: getEnv('MORALIS_API_URL', 'https://deep-index.moralis.io/api/v2.2'),
    },
  },

  // Market Data
  marketData: {
    coingecko: {
      apiUrl: getEnv('COINGECKO_API_URL', 'https://api.coingecko.com/api/v3'),
    },
    dexscreener: {
      apiUrl: getEnv('DEXSCREENER_API_URL', 'https://api.dexscreener.com/token-profiles/latest/v1'),
    },
  },

  // Analytics
  analytics: {
    posthog: {
      key: getEnv('POSTHOG_KEY', ''),
      host: getEnv('POSTHOG_HOST', 'https://us.i.posthog.com'),
    },
    sentry: {
      dsn: getEnv('SENTRY_DSN', ''),
    },
  },

  // Feature Flags
  features: {
    analytics: getBoolEnv('ENABLE_ANALYTICS', true),
    gasless: getBoolEnv('ENABLE_GASLESS', false),
    sessionKeys: getBoolEnv('ENABLE_SESSION_KEYS', false),
    aiClassification: getBoolEnv('ENABLE_AI_CLASSIFICATION', false),
    volatilityDetector: getBoolEnv('ENABLE_VOLATILITY_DETECTOR', false),
    greenOffset: getBoolEnv('ENABLE_GREEN_OFFSET', false),
    tokenizedReceipts: getBoolEnv('ENABLE_TOKENIZED_RECEIPTS', false),
  },

  // Fee Configuration
  fees: {
    protocolPercent: getNumberEnv('PROTOCOL_FEE_PERCENT', 0.8),
    minPercent: getNumberEnv('MIN_FEE_PERCENT', 0.2),
    maxPercent: getNumberEnv('MAX_FEE_PERCENT', 0.6),
  },

  // Chains
  chains: {
    supported: (getEnv('SUPPORTED_CHAINS', 'base,arbitrum,optimism,polygon,ethereum,bsc,avalanche,solana')).split(','),
    primary: getEnv('PRIMARY_CHAIN', 'base'),
    chainId: getNumberEnv('CHAIN_ID', 8453),
  },

  // AI & Advanced Features
  ai: {
    baseKit: {
      apiUrl: getEnv('BASE_AI_KIT_URL', 'https://basekit.ai/api/v1'),
    },
    toucan: {
      apiUrl: getEnv('TOUCAN_API_URL', 'https://api.toucan.earth/carbon'),
    },
  },

  // Farcaster
  farcaster: {
    hubUrl: getEnv('FARCASTER_HUB_URL', 'https://hub.farcaster.cast'),
    framesEnabled: getBoolEnv('FARCASTER_FRAMES_ENABLED', true),
  },

  // Admin
  admin: {
    wallet: getEnv('ADMIN_WALLET', ''),
  },
} as const;

export type Config = typeof config;

export default config;


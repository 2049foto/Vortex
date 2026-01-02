/**
 * Application configuration for Vortex Protocol
 * Loads and validates environment variables
 */

import { z } from 'zod';

/**
 * Environment schema validation
 */
const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NEON_API_URL: z.string().optional(),

  // Redis
  UPSTASH_REDIS_REST_URL: z.string().min(1, 'UPSTASH_REDIS_REST_URL is required'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'UPSTASH_REDIS_REST_TOKEN is required'),

  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),

  // GoPlus
  GOPLUS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GOPLUS_API_URL: z.string().default('https://api.gopluslabs.io/api/v1'),

  // RPC - QuickNode
  NEXT_PUBLIC_QUICKNODE_BASE_HTTPS: z.string().optional(),
  NEXT_PUBLIC_QUICKNODE_BASE_WSS: z.string().optional(),
  NEXT_PUBLIC_QUICKNODE_SOLANA_HTTPS: z.string().optional(),
  NEXT_PUBLIC_QUICKNODE_SOLANA_WSS: z.string().optional(),

  // RPC - Alchemy
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
  ALCHEMY_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ALCHEMY_BASE_RPC: z.string().optional(),
  NEXT_PUBLIC_ALCHEMY_SOLANA_RPC: z.string().optional(),

  // RPC - Infura
  NEXT_PUBLIC_INFURA_PROJECT_ID: z.string().optional(),
  INFURA_API_KEY: z.string().optional(),
  INFURA_API_KEY_SECRET: z.string().optional(),
  NEXT_PUBLIC_INFURA_BASE_HTTPS: z.string().optional(),

  // Solana - Helius
  NEXT_PUBLIC_HELIUS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_HELIUS_RPC: z.string().optional(),
  NEXT_PUBLIC_HELIUS_MAINNET: z.string().optional(),

  // Jupiter
  JUPITER_API_KEY: z.string().optional(),
  NEXT_PUBLIC_JUPITER_API_URL: z.string().optional(),

  // Security APIs
  NEXT_PUBLIC_RUGCHECK_API_URL: z.string().optional(),
  NEXT_PUBLIC_BLOCKAID_API_KEY: z.string().optional(),

  // Swap Aggregators
  ONEINCH_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ONEINCH_API_URL: z.string().optional(),
  ZEROX_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ZEROX_API_URL: z.string().optional(),
  NEXT_PUBLIC_OPENOCEAN_API_URL: z.string().optional(),
  NEXT_PUBLIC_RANGO_API_KEY: z.string().optional(),
  NEXT_PUBLIC_RANGO_API_URL: z.string().optional(),
  NEXT_PUBLIC_LIFI_API_URL: z.string().optional(),
  COW_APP_DATA: z.string().optional(),
  NEXT_PUBLIC_COW_API_URL: z.string().optional(),

  // Gas Sponsorship / Account Abstraction
  PIMLICO_API_KEY: z.string().optional(),
  NEXT_PUBLIC_PIMLICO_BASE_URL: z.string().optional(),
  NEXT_PUBLIC_PIMLICO_POLYGON_URL: z.string().optional(),
  BICONOMY_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ONCHAINKIT_API_KEY: z.string().optional(),
  NEXT_PUBLIC_CDP_PAYMASTER_URL: z.string().optional(),
  CDP_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_ZERODEV_PROJECT_ID: z.string().optional(),
  ZERODEV_PERSONAL_API_KEY: z.string().optional(),
  ZERODEV_TEAM_API_KEY: z.string().optional(),

  // Wallet Connection
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().optional(),

  // Data Indexing
  MORALIS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_MORALIS_API_URL: z.string().optional(),
  THEGRAPH_API_KEY: z.string().optional(),
  COVALENT_API_KEY: z.string().optional(),

  // Market Data
  COINGECKO_API_URL: z.string().optional(),
  NEXT_PUBLIC_DEXSCREENER_API_URL: z.string().optional(),

  // Security & Simulation
  TENDERLY_API_KEY: z.string().optional(),
  TENDERLY_USERNAME: z.string().optional(),
  TENDERLY_PROJECT: z.string().optional(),
  TENDERLY_API_URL: z.string().optional(),
  GITCOIN_PASSPORT_API_KEY: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  DUNE_API_KEY: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform((v) => v === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_GASLESS: z.string().transform((v) => v === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_SESSION_KEYS: z.string().transform((v) => v === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_AI_CLASSIFICATION: z.string().transform((v) => v === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_VOLATILITY_DETECTOR: z.string().transform((v) => v === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_GREEN_OFFSET: z.string().transform((v) => v === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_TOKENIZED_RECEIPTS: z.string().transform((v) => v === 'true').default('false'),

  // Fee Configuration
  NEXT_PUBLIC_PROTOCOL_FEE_PERCENT: z.string().transform(Number).optional(),
  NEXT_PUBLIC_MIN_FEE_PERCENT: z.string().transform(Number).optional(),
  NEXT_PUBLIC_MAX_FEE_PERCENT: z.string().transform(Number).optional(),

  // Chains
  NEXT_PUBLIC_SUPPORTED_CHAINS: z.string().optional(),
  NEXT_PUBLIC_PRIMARY_CHAIN: z.string().optional(),
  NEXT_PUBLIC_CHAIN_ID: z.string().transform(Number).optional(),

  // AI & Advanced Features
  BASE_AI_KIT_API_KEY: z.string().optional(),
  NEXT_PUBLIC_BASE_AI_KIT_URL: z.string().optional(),
  QUANTUM_RESIST_ENABLED: z.string().transform((v) => v === 'true').default('false'),
  TOUCAN_API_KEY: z.string().optional(),
  NEXT_PUBLIC_TOUCAN_API_URL: z.string().optional(),

  // Farcaster
  NEXT_PUBLIC_FARCASTER_HUB_URL: z.string().optional(),
  FARCASTER_FRAMES_ENABLED: z.string().transform((v) => v === 'true').default('false'),

  // Deployment
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),

  // CORS
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

/**
 * Parse and validate environment in development
 */
function validateEnv() {
  if (process.env.NODE_ENV === 'production') return;
  
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
  }
}

// Run validation in development
validateEnv();

/**
 * Application configuration
 */
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',

  // Database
  database: {
    url: process.env.DATABASE_URL || '',
  },

  // Redis
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },

  // Auth
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'development_secret_change_in_production_32chars',
    jwtExpiresIn: '7d',
    messagePrefix: 'Sign this message to authenticate with Vortex Protocol:\n\n',
  },

  // External APIs
  goplus: {
    apiKey: process.env.GOPLUS_API_KEY || '',
    baseUrl: process.env.NEXT_PUBLIC_GOPLUS_API_URL || 'https://api.gopluslabs.io/api/v1',
  },

  // RPC Providers
  rpc: {
    // QuickNode (Primary)
    base: process.env.NEXT_PUBLIC_QUICKNODE_BASE_HTTPS || process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC || process.env.NEXT_PUBLIC_INFURA_BASE_HTTPS || '',
    baseWss: process.env.NEXT_PUBLIC_QUICKNODE_BASE_WSS || '',
    solana: process.env.NEXT_PUBLIC_QUICKNODE_SOLANA_HTTPS || process.env.NEXT_PUBLIC_ALCHEMY_SOLANA_RPC || '',
    solanaWss: process.env.NEXT_PUBLIC_QUICKNODE_SOLANA_WSS || '',
    // Alchemy (Backup)
    alchemy: {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY || '',
      base: process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC || '',
      solana: process.env.NEXT_PUBLIC_ALCHEMY_SOLANA_RPC || '',
    },
    // Infura (Fallback)
    infura: {
      projectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || process.env.INFURA_API_KEY || '',
      apiKey: process.env.INFURA_API_KEY || '',
      apiKeySecret: process.env.INFURA_API_KEY_SECRET || '',
      base: process.env.NEXT_PUBLIC_INFURA_BASE_HTTPS || '',
    },
    // Helius (Solana Primary)
    helius: {
      apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY || '',
      rpc: process.env.NEXT_PUBLIC_HELIUS_RPC || '',
      mainnet: process.env.NEXT_PUBLIC_HELIUS_MAINNET || '',
    },
  },

  // Swap Aggregators
  swaps: {
    oneinch: {
      apiKey: process.env.ONEINCH_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_ONEINCH_API_URL || '',
    },
    zerox: {
      apiKey: process.env.ZEROX_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_ZEROX_API_URL || '',
    },
    openocean: {
      baseUrl: process.env.NEXT_PUBLIC_OPENOCEAN_API_URL || '',
    },
    rango: {
      apiKey: process.env.NEXT_PUBLIC_RANGO_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_RANGO_API_URL || '',
    },
    lifi: {
      baseUrl: process.env.NEXT_PUBLIC_LIFI_API_URL || '',
    },
    cow: {
      appData: process.env.COW_APP_DATA || 'vortex-protocol-v1',
      baseUrl: process.env.NEXT_PUBLIC_COW_API_URL || '',
    },
    jupiter: {
      apiKey: process.env.JUPITER_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_JUPITER_API_URL || '',
    },
  },

  // Gas Sponsorship / Account Abstraction
  gasless: {
    pimlico: {
      apiKey: process.env.PIMLICO_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_PIMLICO_BASE_URL || '',
      polygonUrl: process.env.NEXT_PUBLIC_PIMLICO_POLYGON_URL || '',
    },
    biconomy: {
      apiKey: process.env.BICONOMY_API_KEY || '',
    },
    coinbase: {
      onchainKitKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '',
      paymasterUrl: process.env.NEXT_PUBLIC_CDP_PAYMASTER_URL || '',
      keyId: process.env.CDP_KEY_ID || '',
    },
    zerodev: {
      projectId: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || '',
      personalApiKey: process.env.ZERODEV_PERSONAL_API_KEY || '',
      teamApiKey: process.env.ZERODEV_TEAM_API_KEY || '',
    },
  },

  // Data Indexing
  indexing: {
    moralis: {
      apiKey: process.env.MORALIS_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_MORALIS_API_URL || '',
    },
    thegraph: {
      apiKey: process.env.THEGRAPH_API_KEY || '',
    },
    covalent: {
      apiKey: process.env.COVALENT_API_KEY || '',
    },
  },

  // Market Data
  marketData: {
    coingecko: {
      baseUrl: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
    },
    dexscreener: {
      baseUrl: process.env.NEXT_PUBLIC_DEXSCREENER_API_URL || '',
    },
  },

  // Security & Simulation
  security: {
    rugcheck: {
      baseUrl: process.env.NEXT_PUBLIC_RUGCHECK_API_URL || '',
    },
    blockaid: {
      apiKey: process.env.NEXT_PUBLIC_BLOCKAID_API_KEY || '',
    },
    tenderly: {
      apiKey: process.env.TENDERLY_API_KEY || '',
      username: process.env.TENDERLY_USERNAME || '',
      project: process.env.TENDERLY_PROJECT || '',
      baseUrl: process.env.TENDERLY_API_URL || '',
    },
    gitcoin: {
      passportApiKey: process.env.GITCOIN_PASSPORT_API_KEY || '',
    },
  },

  // Analytics
  analytics: {
    posthog: {
      key: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '',
    },
    sentry: {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    },
    dune: {
      apiKey: process.env.DUNE_API_KEY || '',
    },
  },

  // Feature Flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    gasless: process.env.NEXT_PUBLIC_ENABLE_GASLESS === 'true',
    sessionKeys: process.env.NEXT_PUBLIC_ENABLE_SESSION_KEYS === 'true',
    aiClassification: process.env.NEXT_PUBLIC_ENABLE_AI_CLASSIFICATION === 'true',
    volatilityDetector: process.env.NEXT_PUBLIC_ENABLE_VOLATILITY_DETECTOR === 'true',
    greenOffset: process.env.NEXT_PUBLIC_ENABLE_GREEN_OFFSET === 'true',
    tokenizedReceipts: process.env.NEXT_PUBLIC_ENABLE_TOKENIZED_RECEIPTS === 'true',
  },

  // Fee Configuration
  fees: {
    protocolPercent: parseFloat(process.env.NEXT_PUBLIC_PROTOCOL_FEE_PERCENT || '0.8'),
    minPercent: parseFloat(process.env.NEXT_PUBLIC_MIN_FEE_PERCENT || '0.2'),
    maxPercent: parseFloat(process.env.NEXT_PUBLIC_MAX_FEE_PERCENT || '0.6'),
  },

  // Chains
  chains: {
    supported: (process.env.NEXT_PUBLIC_SUPPORTED_CHAINS || 'base,arbitrum,optimism,polygon,ethereum,bsc,avalanche,solana').split(','),
    primary: process.env.NEXT_PUBLIC_PRIMARY_CHAIN || 'base',
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453', 10),
  },

  // AI & Advanced Features
  ai: {
    baseKit: {
      apiKey: process.env.BASE_AI_KIT_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_BASE_AI_KIT_URL || '',
    },
    quantumResist: process.env.QUANTUM_RESIST_ENABLED === 'true',
    toucan: {
      apiKey: process.env.TOUCAN_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_TOUCAN_API_URL || '',
    },
  },

  // Farcaster
  farcaster: {
    hubUrl: process.env.NEXT_PUBLIC_FARCASTER_HUB_URL || '',
    framesEnabled: process.env.FARCASTER_FRAMES_ENABLED === 'true',
  },

  // Admin
  admin: {
    wallet: process.env.NEXT_PUBLIC_ADMIN_WALLET || process.env.X402_WALLET_ADDRESS || '',
  },

  // CORS
  cors: {
    origins: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL || '',
      'https://vortex-protocol.vercel.app',
    ].filter(Boolean),
  },

  // Cache TTLs (in seconds)
  cache: {
    tokenScan: 3600, // 1 hour
    portfolio: 300, // 5 minutes
    prices: 60, // 1 minute
  },
} as const;

export type Config = typeof config;

export default config;


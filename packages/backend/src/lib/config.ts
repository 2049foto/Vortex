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

  // Redis
  UPSTASH_REDIS_REST_URL: z.string().min(1, 'UPSTASH_REDIS_REST_URL is required'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'UPSTASH_REDIS_REST_TOKEN is required'),

  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

  // GoPlus
  GOPLUS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GOPLUS_API_URL: z.string().default('https://api.gopluslabs.io/api/v1'),

  // RPC
  NEXT_PUBLIC_QUICKNODE_BASE_HTTPS: z.string().optional(),
  NEXT_PUBLIC_ALCHEMY_BASE_RPC: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform((v) => v === 'true').default('false'),

  // CORS
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

/**
 * Parse and validate environment
 */
function loadConfig() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration');
  }

  return parsed.data;
}

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

  // RPC
  rpc: {
    base: process.env.NEXT_PUBLIC_QUICKNODE_BASE_HTTPS || process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC || '',
    ethereum: process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC || '',
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


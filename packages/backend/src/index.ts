/**
 * Vortex Protocol Backend - Hono 4.11 API Server
 * Bun 1.3.4 + Hono 4.11 + Prisma 6.19 + Neon PostgreSQL
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
// JWT will be implemented manually since hono/jwt might not be available
import { PrismaClient } from '@prisma/client';
import { MultiChainScanner } from './lib/scanner/engine';
import { cache } from './lib/cache';
import { config } from './lib/config';

const app = new Hono();
const prisma = new PrismaClient();
const scanner = new MultiChainScanner();

// CORS for frontend
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow requests from configured origins
      const allowedOrigins = config.cors.origins;
      if (!origin || allowedOrigins.includes(origin)) {
        return true;
      }
      // Default to first allowed origin
      return allowedOrigins[0] || 'http://localhost:5173';
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Supported chains (using config for RPC URLs)
const SUPPORTED_CHAINS = [
  { id: 56, name: 'BSC', symbol: 'BNB', rpc: config.rpc.base || 'https://bsc.drpc.org' },
  { id: 42161, name: 'Arbitrum', symbol: 'ETH', rpc: config.rpc.base || 'https://arb1.arbitrum.io/rpc' },
  { id: 8453, name: 'Base', symbol: 'ETH', rpc: config.rpc.base || 'https://base.drpc.org', isTarget: true },
  { id: 137, name: 'Polygon', symbol: 'MATIC', rpc: config.rpc.base || 'https://polygon.drpc.org' },
  { id: 838592, name: 'Monad', symbol: 'MONAD', rpc: config.rpc.base || 'https://monad.drpc.org' },
  { id: 43114, name: 'Avalanche', symbol: 'AVAX', rpc: config.rpc.base || 'https://avalanche.drpc.org' },
  { id: 10, name: 'Optimism', symbol: 'ETH', rpc: config.rpc.base || 'https://optimism.drpc.org' },
  { id: 1, name: 'Ethereum', symbol: 'ETH', rpc: config.rpc.alchemy.base || config.rpc.infura.base || 'https://eth.llamarpc.com' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', rpc: config.rpc.helius.rpc || config.rpc.solana || 'https://solana.drpc.org' },
];

// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * POST /api/scan
 * Scan wallet across all supported chains
 */
app.post('/api/scan', async (c) => {
  try {
    const { address } = await c.req.json();

    if (!address || typeof address !== 'string') {
      return c.json({ error: 'Invalid address' }, 400);
    }

    // Check cache first
    const cacheKey = `scan:${address}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return c.json({ ...cached, fromCache: true });
    }

    // Scan all chains
    const result = await scanner.scan(address);

    // Cache result (5 minutes)
    await cache.set(cacheKey, result, 300);

    return c.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    return c.json(
      { error: error instanceof Error ? error.message : 'Scan failed' },
      500
    );
  }
});

/**
 * GET /api/chains
 * Get supported chains
 */
app.get('/api/chains', (c) => {
  return c.json(SUPPORTED_CHAINS);
});

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', async (c) => {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis
    await cache.get('health:check');

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'connected',
        cache: 'connected',
      },
    });
  } catch (error) {
    return c.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      503
    );
  }
});

// ============================================
// AUTHENTICATED ENDPOINTS (JWT)
// ============================================

// JWT middleware for protected routes
app.use('/api/user/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const token = authHeader.substring(7);
    // TODO: Implement JWT verification with jose library
    // For now, extract userId from token payload
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

/**
 * GET /api/user/portfolio/:address
 * Get user portfolio
 */
app.get('/api/user/portfolio/:address', async (c) => {
  try {
    const { address } = c.req.param();
    const user = c.get('user') as { userId?: string };

    if (user.userId !== address) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: address },
      include: {
        tokens: true,
      },
    });

    if (!portfolio) {
      return c.json({ error: 'Portfolio not found' }, 404);
    }

    return c.json(portfolio);
  } catch (error) {
    console.error('Portfolio error:', error);
    return c.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch portfolio' },
      500
    );
  }
});

/**
 * POST /api/user/actions
 * Execute batch actions (swap/hide/burn)
 */
app.post('/api/user/actions', async (c) => {
  try {
    const actions = await c.req.json();
    const user = c.get('user') as { userId?: string };

    // Execute batch swap via Pimlico ERC-4337
    const txHash = await executeBatchSwap(actions, user.userId || '');

    // Calculate XP earned
    const xpEarned = calculateXPEarned(actions);

    // Update user XP
    if (user.userId) {
      await updateUserXP(user.userId, xpEarned);
    }

    return c.json({ txHash, xpEarned });
  } catch (error) {
    console.error('Actions error:', error);
    return c.json(
      { error: error instanceof Error ? error.message : 'Failed to execute actions' },
      500
    );
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function executeBatchSwap(
  actions: Array<{ type: string; token: string; amount: string }>,
  userId: string
): Promise<string> {
  // TODO: Implement Pimlico ERC-4337 batch swap
  // This would use viem + permissionless + Pimlico paymaster
  return `0x${Math.random().toString(16).slice(2, 66)}`;
}

function calculateXPEarned(actions: Array<{ type: string }>): number {
  const xpMap: Record<string, number> = {
    swap: 10,
    hide: 5,
    burn: 3,
  };

  return actions.reduce((total, action) => {
    return total + (xpMap[action.type] || 0);
  }, 0);
}

async function updateUserXP(userId: string, xp: number): Promise<void> {
  // TODO: Update user XP in database
  await prisma.user.update({
    where: { id: userId },
    data: {
      // Add XP field to User model
    },
  });
}

// ============================================
// EXPORT FOR BUN
// ============================================

export default {
  port: process.env.PORT || 8787,
  fetch: app.fetch,
};

// For Vercel Edge
export const config = {
  runtime: 'edge',
};


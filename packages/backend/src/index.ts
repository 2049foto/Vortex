/**
 * Vortex Protocol Backend - Hono 4.11 API Server
 * Bun 1.3.4 + Hono 4.11 + Prisma 6.19 + Neon PostgreSQL
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { handle } from 'hono/vercel';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { MultiChainScanner } from './lib/scanner/engine';
import { cache } from './lib/cache';
import { config } from './lib/config';
import { calculateXP, getLevelFromXP, checkAchievements, generateDailyMissions, type ActionType } from './lib/gamification/xp';

const app = new Hono();
const prisma = new PrismaClient();
const scanner = new MultiChainScanner();

// Validation schemas
const scanSchema = z.object({
  address: z.string().regex(/^(0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})$/)
});

const actionsSchema = z.object({
  actions: z.array(z.object({
    type: z.enum(['swap', 'hide', 'burn']),
    token: z.string(),
    amount: z.string()
  }))
});

// Rate limiter: 100 requests per minute per IP
const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

// Rate limiting middleware
app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  try {
    await rateLimiter.consume(ip);
    await next();
  } catch (rejRes) {
    return c.json({ error: 'Too many requests' }, 429);
  }
});

// CORS for frontend
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow requests from configured origins
      const allowedOrigins = config.cors.origins;
      if (!origin || allowedOrigins.includes(origin)) {
        return origin;
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
    const body = await c.req.json();
    const { address } = scanSchema.parse(body);

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
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid address format' }, 400);
    }
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
app.use('/api/user/*', jwt({
  secret: process.env.JWT_SECRET || 'development_secret_change_in_production_32chars_minimum',
  alg: 'HS256'
}));

/**
 * GET /api/user/portfolio/:address
 * Get user portfolio
 */
app.get('/api/user/portfolio/:address', async (c) => {
  try {
    const { address } = c.req.param();
    const payload = c.get('jwtPayload') as { sub?: string };
    const userId = payload?.sub;

    // Find user by wallet address first
    const userRecord = await prisma.user.findUnique({
      where: { walletAddress: address }
    });

    if (!userRecord || (userId && userId !== userRecord.id)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfolio = await prisma.portfolio.findMany({
      where: { userId: userRecord.id },
      orderBy: { valueUSD: 'desc' }
    });

    return c.json({ portfolio });
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
    const body = await c.req.json();
    const { actions } = actionsSchema.parse(body);
    const payload = c.get('jwtPayload') as { sub?: string };
    const userId = payload?.sub;

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Execute batch swap via Pimlico ERC-4337
    const txHash = await executeBatchSwap(actions, userId);

    // Calculate XP earned
    const xpEarned = calculateXPEarned(actions);

    // Update user XP
    await updateUserXP(userId, xpEarned);

    return c.json({ txHash, xpEarned });
  } catch (error) {
    console.error('Actions error:', error);
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid actions format' }, 400);
    }
    return c.json(
      { error: error instanceof Error ? error.message : 'Failed to execute actions' },
      500
    );
  }
});

// ============================================
// GAMIFICATION ENDPOINTS
// ============================================

/**
 * POST /api/user/xp
 * Award XP to user for actions
 */
app.post('/api/user/xp', async (c) => {
  try {
    const { userId, action, metadata } = await c.req.json();
    
    // TODO: Get user XP from database
    const userXP = {
      userId,
      totalXP: 0,
      level: 1,
      xpToNextLevel: 500,
      streakDays: 0,
      achievements: []
    };
    
    // Calculate XP earned
    const xpEarned = calculateXP(action as ActionType, userXP);
    
    // Check for new achievements
    const newAchievements = checkAchievements(userXP, action as ActionType, metadata);
    
    // Update user XP and achievements
    // TODO: Save to database
    
    return c.json({
      xpEarned,
      newLevel: getLevelFromXP(userXP.totalXP + xpEarned),
      newAchievements
    });
  } catch (error) {
    console.error('XP error:', error);
    return c.json(
      { error: error instanceof Error ? error.message : 'Failed to award XP' },
      500
    );
  }
});

/**
 * GET /api/user/leaderboard
 * Get weekly leaderboard
 */
app.get('/api/user/leaderboard', async (c) => {
  try {
    // TODO: Get leaderboard from Redis/Database
    const leaderboard = [
      { rank: 1, userId: '0x...', username: 'TraderJoe', xp: 15420, level: 15 },
      { rank: 2, userId: '0x...', username: 'DeFiKing', xp: 12350, level: 13 },
      { rank: 3, userId: '0x...', username: 'TokenMaster', xp: 9870, level: 11 }
    ];
    
    return c.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return c.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch leaderboard' },
      500
    );
  }
});

/**
 * GET /api/user/daily-missions
 * Get daily missions for user
 */
app.get('/api/user/daily-missions/:userId', async (c) => {
  try {
    const { userId } = c.req.param();
    
    // TODO: Get user XP from database
    const userXP = {
      userId,
      totalXP: 0,
      level: 1,
      xpToNextLevel: 500,
      streakDays: 0,
      achievements: []
    };
    
    const missions = generateDailyMissions(userXP);
    
    return c.json({ missions });
  } catch (error) {
    console.error('Daily missions error:', error);
    return c.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch daily missions' },
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
  // Filter for swap actions only
  const swapActions = actions.filter(a => a.type === 'swap');
  
  if (swapActions.length === 0) {
    throw new Error('No swap actions provided');
  }
  
  try {
    // In production, this would:
    // 1. Create ERC-4337 user op with permissionless.js
    // 2. Bundle multiple token swaps
    // 3. Use Pimlico paymaster for gas sponsorship
    // 4. Execute on Base network
    
    console.log(`Executing ${swapActions.length} swaps for user ${userId}`);
    
    // Mock implementation for now
    // In production, would return real transaction hash
    const mockTxHash = `0x${Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    
    // Save transaction to database
    await prisma.transaction.create({
      data: {
        userId,
        txHash: mockTxHash,
        from: '0x0000000000000000000000000000000000000000', // Contract address
        to: '0x0000000000000000000000000000000000000000', // Router address
        value: '0',
        chainId: 8453, // Base
        blockNumber: BigInt(0), // Will be updated when confirmed
      }
    });
    
    // Save transaction tokens
    for (const action of swapActions) {
      await prisma.transactionToken.create({
        data: {
          transactionId: mockTxHash,
          tokenAddress: action.token,
          symbol: 'TOKEN', // Would fetch from metadata
          name: 'Token Name', // Would fetch from metadata
          amount: action.amount,
        }
      });
    }
    
    return mockTxHash;
  } catch (error) {
    console.error('Batch swap error:', error);
    throw new Error('Failed to execute batch swap');
  }
}

function calculateXPEarned(actions: Array<{ type: string }>): number {
  const xpMap: Record<string, number> = {
    swap: 50,
    hide: 25,
    burn: 10,
  };

  return actions.reduce((total, action) => {
    return total + (xpMap[action.type] || 0);
  }, 0);
}

async function updateUserXP(userId: string, xp: number): Promise<void> {
  // TODO: Update user XP in database
  console.log(`Adding ${xp} XP to user ${userId}`);
  // For now, just log - would update User model with XP field
}

// ============================================
// EXPORT FOR VERCEL
// ============================================

// For Vercel (Node.js runtime)
export default handle(app);

// For local Bun development
if (import.meta.main || process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8787;
  
  // Use Node.js http server for Vercel compatibility
  if (typeof Bun !== 'undefined') {
    Bun.serve({
      port: Number(port),
      fetch: app.fetch,
    });
    console.log(`🚀 Backend server running on http://localhost:${port}`);
  } else {
    // Fallback for Node.js/Vercel - just export, don't start server
    console.log(`Backend configured for port ${port}`);
  }
}


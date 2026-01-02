/**
 * Watchlist API routes for Vortex Protocol
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../../lib/db';
import { ValidationError, NotFoundError, AlreadyExistsError } from '../../lib/errors';
import { authMiddleware } from '../../middleware/auth';
import { isAddress } from 'viem';
import type { Watchlist } from '@prisma/client';

const watchlist = new Hono();

// Apply auth middleware to all routes
watchlist.use('*', authMiddleware());

/**
 * Request schemas
 */
const addSchema = z.object({
  tokenAddress: z.string().min(1, 'Token address is required'),
  chain: z.string().min(1, 'Chain is required'),
  symbol: z.string().optional(),
  name: z.string().optional(),
});

/**
 * GET /api/watchlist
 * Get all watchlist items for the authenticated user
 */
watchlist.get('/', async (c) => {
  const user = c.get('user');

  const items = await prisma.watchlist.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return c.json({
    success: true,
    data: items.map((item: Watchlist) => ({
      id: item.id,
      userId: item.userId,
      tokenAddress: item.tokenAddress,
      chain: item.chain,
      symbol: item.symbol,
      name: item.name,
      createdAt: item.createdAt.toISOString(),
    })),
  });
});

/**
 * POST /api/watchlist
 * Add a token to the watchlist
 */
watchlist.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const parsed = addSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Invalid request body', parsed.error.flatten().fieldErrors);
  }

  const { tokenAddress, chain, symbol, name } = parsed.data;

  // Validate address format (for EVM chains)
  if (chain !== 'solana' && !isAddress(tokenAddress)) {
    throw new ValidationError('Invalid token address format');
  }

  const normalizedAddress = tokenAddress.toLowerCase();

  // Check if already in watchlist
  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_tokenAddress_chain: {
        userId: user.id,
        tokenAddress: normalizedAddress,
        chain,
      },
    },
  });

  if (existing) {
    throw new AlreadyExistsError('Token is already in your watchlist');
  }

  // Create watchlist item
  const item = await prisma.watchlist.create({
    data: {
      userId: user.id,
      tokenAddress: normalizedAddress,
      chain,
      symbol: symbol || 'UNKNOWN',
      name: name || 'Unknown Token',
    },
  });

  return c.json(
    {
      success: true,
      data: {
        id: item.id,
        userId: item.userId,
        tokenAddress: item.tokenAddress,
        chain: item.chain,
        symbol: item.symbol,
        name: item.name,
        createdAt: item.createdAt.toISOString(),
      },
    },
    201
  );
});

/**
 * DELETE /api/watchlist/:id
 * Remove a token from the watchlist
 */
watchlist.delete('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');

  if (!id) {
    throw new ValidationError('Watchlist item ID is required');
  }

  // Find the item
  const item = await prisma.watchlist.findUnique({
    where: { id },
  });

  if (!item) {
    throw new NotFoundError('Watchlist item not found');
  }

  // Verify ownership
  if (item.userId !== user.id) {
    throw new NotFoundError('Watchlist item not found');
  }

  // Delete the item
  await prisma.watchlist.delete({
    where: { id },
  });

  return c.json({
    success: true,
    message: 'Token removed from watchlist',
  });
});

export default watchlist;


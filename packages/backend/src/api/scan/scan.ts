/**
 * Token scanning API routes for Vortex Protocol
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { scanToken, getCachedScan } from '../../lib/scanner/tokenScanner';
import { ValidationError } from '../../lib/errors';
import { scanRateLimit } from '../../middleware/rateLimit';

const scan = new Hono();

// Apply rate limiting to scan endpoints
scan.use('*', scanRateLimit);

/**
 * Request schemas
 */
const scanSchema = z.object({
  tokenAddress: z.string().min(1, 'Token address is required'),
  chain: z.string().min(1, 'Chain is required').default('base'),
});

/**
 * POST /api/scan
 * Scan a token for security risks
 */
scan.post('/', async (c) => {
  const body = await c.req.json();
  const parsed = scanSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Invalid request body', parsed.error.flatten().fieldErrors);
  }

  const { tokenAddress, chain } = parsed.data;

  // Perform scan
  const result = await scanToken(tokenAddress, chain.toLowerCase());

  return c.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/scan/:chain/:address
 * Get cached scan result (no API call if not cached)
 */
scan.get('/:chain/:address', async (c) => {
  const chain = c.req.param('chain');
  const address = c.req.param('address');

  if (!chain || !address) {
    throw new ValidationError('Chain and address are required');
  }

  // Try to get cached result
  const cached = await getCachedScan(address, chain.toLowerCase());

  if (cached) {
    return c.json({
      success: true,
      data: cached,
      cached: true,
    });
  }

  // No cache, perform fresh scan
  const result = await scanToken(address, chain.toLowerCase());

  return c.json({
    success: true,
    data: result,
    cached: false,
  });
});

export default scan;


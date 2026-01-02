/**
 * Cache API routes for Vortex Protocol
 * Exposes Redis cache operations to frontend
 */

import { Hono } from 'hono';
import { cache } from '../../lib/cache';
import { ValidationError } from '../../lib/errors';
import { defaultRateLimit } from '../../middleware/rateLimit';

const cacheApi = new Hono();

// Apply rate limiting
cacheApi.use('*', defaultRateLimit);

/**
 * GET /api/cache/:key
 * Get cached value
 */
cacheApi.get('/:key', async (c) => {
  const key = c.req.param('key');

  if (!key) {
    throw new ValidationError('Cache key is required');
  }

  // Decode key from URL
  const decodedKey = decodeURIComponent(key);
  const value = await cache.get(decodedKey);

  if (value === null) {
    return c.json({
      success: false,
      cached: false,
      data: null,
    }, 404);
  }

  return c.json({
    success: true,
    cached: true,
    data: value,
  });
});

/**
 * POST /api/cache
 * Set cached value
 * Body: { key: string, value: any, ttl?: number }
 */
cacheApi.post('/', async (c) => {
  const body = await c.req.json() as {
    key: string;
    value: unknown;
    ttl?: number;
  };

  if (!body.key || body.value === undefined) {
    throw new ValidationError('Key and value are required');
  }

  const ttl = body.ttl || 300; // Default 5 minutes
  const success = await cache.set(body.key, body.value, ttl);

  return c.json({
    success,
    cached: success,
  });
});

/**
 * DELETE /api/cache/:key
 * Delete cached value
 */
cacheApi.delete('/:key', async (c) => {
  const key = c.req.param('key');

  if (!key) {
    throw new ValidationError('Cache key is required');
  }

  const decodedKey = decodeURIComponent(key);
  const success = await cache.del(decodedKey);

  return c.json({
    success,
    deleted: success,
  });
});

/**
 * GET /api/cache/exists/:key
 * Check if key exists
 */
cacheApi.get('/exists/:key', async (c) => {
  const key = c.req.param('key');

  if (!key) {
    throw new ValidationError('Cache key is required');
  }

  const decodedKey = decodeURIComponent(key);
  const exists = await cache.exists(decodedKey);

  return c.json({
    success: true,
    exists,
  });
});

export default cacheApi;


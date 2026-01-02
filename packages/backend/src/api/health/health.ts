/**
 * Health check API for Vortex Protocol
 */

import { Hono } from 'hono';
import { prisma } from '../../lib/db';
import { redis } from '../../lib/cache';
import { config } from '../../lib/config';

const health = new Hono();

// Track server start time for uptime
const startTime = Date.now();

/**
 * GET /api/health
 * Basic health check
 */
health.get('/', async (c) => {
  const uptime = Date.now() - startTime;

  // Check database connection
  let dbStatus: 'connected' | 'disconnected' = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  // Check Redis connection
  let cacheStatus: 'connected' | 'disconnected' = 'disconnected';
  try {
    if (redis) {
      await redis.ping();
      cacheStatus = 'connected';
    }
  } catch {
    cacheStatus = 'disconnected';
  }

  const status = dbStatus === 'connected' && cacheStatus === 'connected' 
    ? 'ok' 
    : dbStatus === 'connected' 
      ? 'degraded' 
      : 'error';

  return c.json({
    status,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: Math.floor(uptime / 1000), // seconds
    services: {
      database: dbStatus,
      cache: cacheStatus,
    },
    environment: config.env,
  });
});

/**
 * GET /api/health/ready
 * Readiness check (all services must be ready)
 */
health.get('/ready', async (c) => {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis if configured
    if (redis) {
      await redis.ping();
    }

    return c.json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json(
      {
        ready: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      503
    );
  }
});

/**
 * GET /api/health/live
 * Liveness check (server is running)
 */
health.get('/live', (c) => {
  return c.json({
    alive: true,
    timestamp: new Date().toISOString(),
  });
});

export default health;


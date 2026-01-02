/**
 * Request logging middleware for Vortex Protocol
 * Uses structured logger for production
 */

import { type Context, type Next } from 'hono';
import { logger } from '../lib/logger';

/**
 * Request logging middleware
 * Logs method, path, status, and response time
 */
export function loggerMiddleware() {
  return async (c: Context, next: Next) => {
    const start = performance.now();
    const method = c.req.method;
    const path = c.req.path;
    const requestId = crypto.randomUUID().slice(0, 8);

    // Attach request ID to context for tracing
    c.set('requestId', requestId);

    try {
      await next();
    } finally {
      const duration = performance.now() - start;
      const status = c.res.status;

      logger.request(method, path, status, duration, { requestId });
    }
  };
}

export default loggerMiddleware;


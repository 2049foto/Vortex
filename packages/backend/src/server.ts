/**
 * Vortex Protocol Backend Server
 * Bun + Hono API Server
 */

import { Hono } from 'hono';
import { config } from './lib/config';
import { corsMiddleware } from './middleware/cors';
import { loggerMiddleware } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './lib/logger';

// API Routes
import health from './api/health/health';
import auth from './api/auth/auth';
import scan from './api/scan/scan';
import portfolio from './api/portfolio/portfolio';
import watchlist from './api/watchlist/watchlist';
import alerts from './api/alerts/alerts';

/**
 * Create and configure Hono app
 */
const app = new Hono();

// Global middleware
app.use('*', loggerMiddleware());
app.use('*', corsMiddleware());

// Error handling
app.onError(errorHandler);
app.notFound(notFoundHandler);

// Mount API routes
app.route('/api/health', health);
app.route('/api/auth', auth);
app.route('/api/scan', scan);
app.route('/api/portfolio', portfolio);
app.route('/api/watchlist', watchlist);
app.route('/api/alerts', alerts);

// Root route
app.get('/', (c) => {
  return c.json({
    name: 'Vortex Protocol API',
    version: '1.0.0',
    status: 'running',
    docs: '/api/health',
  });
});

/**
 * Start server with Bun.serve
 */
const port = config.port;

// Use structured logger for server startup
logger.info('Vortex Protocol API Server starting', {
  environment: config.env,
  port,
  url: `http://localhost:${port}`,
});

// Export for Bun
export default {
  port,
  fetch: app.fetch,
};

// Also export for testing
export { app };


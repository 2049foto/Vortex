/**
 * CORS middleware for Vortex Protocol
 * Production-safe CORS configuration with whitelist
 */

import { type Context, type Next } from 'hono';
import { config } from '../lib/config';

type CorsMiddleware = (c: Context, next: Next) => Promise<void | Response>;

/**
 * Allowed origins whitelist
 * NEVER use '*' in production
 */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://vortex-protocol.vercel.app',
  'https://www.vortex-protocol.vercel.app',
];

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  
  // In development, also allow from config
  const origins = config.isDev 
    ? [...ALLOWED_ORIGINS, ...config.cors.origins]
    : ALLOWED_ORIGINS;
  
  return origins.some((allowed) => {
    // Exact match only, no wildcards
    return allowed === origin;
  });
}

/**
 * CORS middleware configuration
 * Uses strict whitelist, no wildcards
 */
export const corsMiddleware: CorsMiddleware = async (c: Context, next: Next) => {
    const origin = c.req.header('Origin');
    
    // Only set CORS headers if origin is in whitelist
    if (origin && isOriginAllowed(origin)) {
      c.header('Access-Control-Allow-Origin', origin);
      c.header('Access-Control-Allow-Credentials', 'true');
    }

    // Always set these headers for allowed methods
    c.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    c.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept'
    );
    c.header('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests
    if (c.req.method === 'OPTIONS') {
      if (origin && isOriginAllowed(origin)) {
        return new Response(null, { status: 204 });
      }
      return c.text('Forbidden', 403);
    }

    await next();
};


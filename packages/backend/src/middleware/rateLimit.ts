/**
 * Rate limiting middleware for Vortex Protocol
 * Uses Redis for distributed rate limiting
 */

import { type Context, type Next } from 'hono';
import { redis } from '../lib/cache';
import { RateLimitError } from '../lib/errors';
import { config } from '../lib/config';

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  /** Maximum requests allowed */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Key prefix for Redis */
  keyPrefix: string;
}

/**
 * Default rate limits by endpoint type
 */
const RATE_LIMITS = {
  auth: { limit: 5, windowSeconds: 60, keyPrefix: 'rl:auth' },
  scan: { limit: 10, windowSeconds: 60, keyPrefix: 'rl:scan' },
  portfolio: { limit: 30, windowSeconds: 60, keyPrefix: 'rl:portfolio' },
  default: { limit: 100, windowSeconds: 60, keyPrefix: 'rl:default' },
} as const;

/**
 * Get client identifier (IP or user ID)
 */
function getClientId(c: Context): string {
  // Try to get user ID from context (if authenticated)
  const user = c.get('user');
  if (user?.id) {
    return `user:${user.id}`;
  }

  // Fall back to IP address
  const forwarded = c.req.header('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || c.req.header('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

/**
 * Check rate limit using Redis sliding window
 */
async function checkRateLimit(
  clientId: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  if (!redis) {
    // If Redis unavailable, allow request but log warning
    return { allowed: true, remaining: config.limit, resetAt: new Date() };
  }

  const key = `${config.keyPrefix}:${clientId}`;
  const now = Date.now();
  const windowStart = now - config.windowSeconds * 1000;

  try {
    // Use Redis pipeline for atomic operations
    const pipe = redis.pipeline();
    
    // Remove old entries
    pipe.zremrangebyscore(key, 0, windowStart);
    
    // Count current entries
    pipe.zcard(key);
    
    // Add current request
    pipe.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    
    // Set expiry
    pipe.expire(key, config.windowSeconds);
    
    const results = await pipe.exec();
    const currentCount = (results[1] as number) || 0;

    const allowed = currentCount < config.limit;
    const remaining = Math.max(0, config.limit - currentCount - 1);
    const resetAt = new Date(now + config.windowSeconds * 1000);

    return { allowed, remaining, resetAt };
  } catch (error) {
    // On Redis error, allow request
    return { allowed: true, remaining: config.limit, resetAt: new Date() };
  }
}

/**
 * Rate limiting middleware factory
 */
export function rateLimitMiddleware(type: keyof typeof RATE_LIMITS = 'default') {
  const limitConfig = RATE_LIMITS[type];

  return async (c: Context, next: Next) => {
    // Skip rate limiting in development if desired
    if (config.isDev && process.env.SKIP_RATE_LIMIT === 'true') {
      await next();
      return;
    }

    const clientId = getClientId(c);
    const { allowed, remaining, resetAt } = await checkRateLimit(clientId, limitConfig);

    // Set rate limit headers
    c.header('X-RateLimit-Limit', limitConfig.limit.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());
    c.header('X-RateLimit-Reset', Math.floor(resetAt.getTime() / 1000).toString());

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
      c.header('Retry-After', retryAfter.toString());
      throw new RateLimitError(`Rate limit exceeded. Retry after ${retryAfter} seconds`, retryAfter);
    }

    await next();
  };
}

/**
 * Specific rate limiters for different endpoints
 */
export const authRateLimit = rateLimitMiddleware('auth');
export const scanRateLimit = rateLimitMiddleware('scan');
export const portfolioRateLimit = rateLimitMiddleware('portfolio');
export const defaultRateLimit = rateLimitMiddleware('default');

export default rateLimitMiddleware;


/**
 * Redis cache client for Vortex Protocol
 * Uses Upstash Redis for serverless caching
 */

import { Redis } from '@upstash/redis';
import { config } from './config';

/**
 * Create Redis client
 */
function createRedisClient(): Redis | null {
  if (!config.redis.url || !config.redis.token) {
    console.warn('⚠️ Redis not configured, caching disabled');
    return null;
  }

  try {
    return new Redis({
      url: config.redis.url,
      token: config.redis.token,
    });
  } catch (error) {
    console.error('❌ Failed to create Redis client:', error);
    return null;
  }
}

export const redis = createRedisClient();

/**
 * Cache utility functions
 */
export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;

    try {
      const value = await redis.get<T>(key);
      return value;
    } catch (error) {
      console.error(`Cache get error for ${key}:`, error);
      return null;
    }
  },

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<boolean> {
    if (!redis) return false;

    try {
      await redis.set(key, value, { ex: ttlSeconds });
      return true;
    } catch (error) {
      console.error(`Cache set error for ${key}:`, error);
      return false;
    }
  },

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<boolean> {
    if (!redis) return false;

    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error(`Cache delete error for ${key}:`, error);
      return false;
    }
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!redis) return false;

    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for ${key}:`, error);
      return false;
    }
  },

  /**
   * Get or set value with factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number = 3600
  ): Promise<T> {
    // Try to get from cache
    const cached = await cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Generate value and cache it
    const value = await factory();
    await cache.set(key, value, ttlSeconds);
    return value;
  },

  /**
   * Generate cache key for token scan
   */
  tokenScanKey(chain: string, address: string): string {
    return `scan:${chain}:${address.toLowerCase()}`;
  },

  /**
   * Generate cache key for portfolio
   */
  portfolioKey(address: string, chain?: string): string {
    return chain
      ? `portfolio:${address.toLowerCase()}:${chain}`
      : `portfolio:${address.toLowerCase()}`;
  },

  /**
   * Generate cache key for prices
   */
  priceKey(chain: string, address: string): string {
    return `price:${chain}:${address.toLowerCase()}`;
  },
};

export default cache;


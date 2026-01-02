/**
 * Frontend Redis Client
 * Communicates with backend Redis cache via API
 */

import { config } from '../config';

const API_BASE_URL = config.api.url || 'http://localhost:3001';

interface CacheResponse<T> {
  success: boolean;
  cached?: boolean;
  data?: T;
  exists?: boolean;
  deleted?: boolean;
}

/**
 * Frontend Redis cache client
 */
class RedisClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const encodedKey = encodeURIComponent(key);
      const response = await fetch(`${this.baseUrl}/api/cache/${encodedKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Cache get failed: ${response.statusText}`);
      }

      const result = (await response.json()) as CacheResponse<T>;
      
      if (result.success && result.data !== undefined) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cache`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          ttl: ttlSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cache set failed: ${response.statusText}`);
      }

      const result = (await response.json()) as CacheResponse<T>;
      return result.success === true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      const encodedKey = encodeURIComponent(key);
      const response = await fetch(`${this.baseUrl}/api/cache/${encodedKey}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Cache delete failed: ${response.statusText}`);
      }

      const result = (await response.json()) as CacheResponse<unknown>;
      return result.deleted === true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const encodedKey = encodeURIComponent(key);
      const response = await fetch(`${this.baseUrl}/api/cache/exists/${encodedKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const result = (await response.json()) as CacheResponse<unknown>;
      return result.exists === true;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  /**
   * Get or set value with factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Generate value and cache it
    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  /**
   * Generate cache key for token scan
   */
  tokenScanKey(chain: string, address: string): string {
    return `scan:${chain}:${address.toLowerCase()}`;
  }

  /**
   * Generate cache key for portfolio
   */
  portfolioKey(address: string, chain?: string): string {
    return chain
      ? `portfolio:${address.toLowerCase()}:${chain}`
      : `portfolio:${address.toLowerCase()}`;
  }

  /**
   * Generate cache key for prices
   */
  priceKey(chain: string, address: string): string {
    return `price:${chain}:${address.toLowerCase()}`;
  }
}

// Export singleton instance
export const redisClient = new RedisClient();

// Export class for testing
export { RedisClient };


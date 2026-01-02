/**
 * Redis Cache Module (Upstash)
 */

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get<T>(key);
      return value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      await redis.setex(key, ttlSeconds, value);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache del error:', error);
      return false;
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },
};


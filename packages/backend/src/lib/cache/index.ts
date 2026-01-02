/**
 * Redis Cache Module (Upstash)
 */

import { Redis } from '@upstash/redis';
import { config } from '../config';

const redis = new Redis({
  url: config.redis.url,
  token: config.redis.token,
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


/**
 * Redis Client Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redisClient } from '../redis-client';

// Mock fetch
global.fetch = vi.fn();

describe('Redis Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('should get value from cache', async () => {
      const mockResponse = {
        success: true,
        cached: true,
        data: { test: 'value' },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await redisClient.get('test-key');
      expect(result).toEqual({ test: 'value' });
    });

    it('should return null on 404', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await redisClient.get('test-key');
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await redisClient.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value in cache', async () => {
      const mockResponse = {
        success: true,
        cached: true,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await redisClient.set('test-key', { test: 'value' }, 300);
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await redisClient.set('test-key', { test: 'value' }, 300);
      expect(result).toBe(false);
    });
  });

  describe('del', () => {
    it('should delete value from cache', async () => {
      const mockResponse = {
        success: true,
        deleted: true,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await redisClient.del('test-key');
      expect(result).toBe(true);
    });
  });

  describe('exists', () => {
    it('should check if key exists', async () => {
      const mockResponse = {
        success: true,
        exists: true,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await redisClient.exists('test-key');
      expect(result).toBe(true);
    });
  });

  describe('getOrSet', () => {
    it('should get from cache if exists', async () => {
      const mockResponse = {
        success: true,
        cached: true,
        data: { cached: 'value' },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const factory = vi.fn().mockResolvedValue({ new: 'value' });
      const result = await redisClient.getOrSet('test-key', factory, 300);

      expect(result).toEqual({ cached: 'value' });
      expect(factory).not.toHaveBeenCalled();
    });

    it('should call factory if not cached', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, cached: true }),
        });

      const factory = vi.fn().mockResolvedValue({ new: 'value' });
      const result = await redisClient.getOrSet('test-key', factory, 300);

      expect(result).toEqual({ new: 'value' });
      expect(factory).toHaveBeenCalled();
    });
  });

  describe('cache key generation', () => {
    it('should generate token scan key', () => {
      const key = redisClient.tokenScanKey('base', '0x123');
      expect(key).toBe('scan:base:0x123');
    });

    it('should generate portfolio key', () => {
      const key = redisClient.portfolioKey('0x123', 'base');
      expect(key).toBe('portfolio:0x123:base');
    });

    it('should generate price key', () => {
      const key = redisClient.priceKey('base', '0x123');
      expect(key).toBe('price:base:0x123');
    });
  });
});


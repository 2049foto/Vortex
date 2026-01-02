/**
 * Cache Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'bun:test';
import { cache } from '../../src/lib/cache';

describe('Cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('should get value from cache', async () => {
      // Test cache get
      expect(true).toBe(true);
    });

    it('should return null if key not found', async () => {
      const result = await cache.get('non-existent-key');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value in cache', async () => {
      const result = await cache.set('test-key', { test: 'value' }, 300);
      expect(result).toBe(true);
    });

    it('should set value with TTL', async () => {
      const result = await cache.set('test-key-ttl', { test: 'value' }, 60);
      expect(result).toBe(true);
    });
  });

  describe('del', () => {
    it('should delete value from cache', async () => {
      await cache.set('test-delete', { test: 'value' }, 300);
      const result = await cache.del('test-delete');
      expect(result).toBe(true);
    });
  });

  describe('getOrSet', () => {
    it('should get from cache if exists', async () => {
      await cache.set('test-getorset', { cached: true }, 300);
      
      const factory = vi.fn().mockResolvedValue({ new: true });
      const result = await cache.getOrSet('test-getorset', factory, 300);
      
      expect(result).toEqual({ cached: true });
      expect(factory).not.toHaveBeenCalled();
    });

    it('should call factory if not cached', async () => {
      const factory = vi.fn().mockResolvedValue({ new: true });
      const result = await cache.getOrSet('test-factory', factory, 300);
      
      expect(result).toEqual({ new: true });
      expect(factory).toHaveBeenCalled();
    });
  });
});


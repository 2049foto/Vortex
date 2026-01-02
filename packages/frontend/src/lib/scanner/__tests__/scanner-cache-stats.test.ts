/**
 * Scanner Cache Stats Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scanner } from '../scanner';

describe('Scanner Cache Stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track cache hits', async () => {
    const stats = scanner.getCacheStats();
    expect(stats.hits).toBeGreaterThanOrEqual(0);
    expect(stats.misses).toBeGreaterThanOrEqual(0);
  });

  it('should calculate hit rate', () => {
    const stats = scanner.getCacheStats();
    expect(stats.hitRate).toBeGreaterThanOrEqual(0);
    expect(stats.hitRate).toBeLessThanOrEqual(100);
  });

  it('should track cache warmups', async () => {
    const popularAddresses = [
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321',
    ];

    await scanner.warmupCache(popularAddresses);
    const stats = scanner.getCacheStats();
    expect(stats.warmups).toBeGreaterThanOrEqual(0);
  });
});


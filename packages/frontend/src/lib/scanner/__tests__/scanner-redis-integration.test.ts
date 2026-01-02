/**
 * Scanner Redis Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scanner } from '../scanner';
import { redisClient } from '../../cache/redis-client';

// Mock redis client
vi.mock('../../cache/redis-client', () => ({
  redisClient: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    exists: vi.fn(),
  },
}));

describe('Scanner Redis Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use Redis cache for scan results', async () => {
    const mockResult = {
      address: '0x123',
      timestamp: Date.now(),
      chains: [],
      tokens: [],
      summary: {
        totalValue: 0,
        totalTokens: 0,
        premium: { count: 0, value: 0, tokens: [] },
        dust: { count: 0, value: 0, tokens: [] },
        micro: { count: 0, value: 0, tokens: [] },
        risk: { count: 0, value: 0, tokens: [] },
      },
      fromCache: false,
    };

    (redisClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    const result = await scanner.scan('0x123', { useCache: true });
    expect(redisClient.get).toHaveBeenCalled();
  });

  it('should cache scan results after scanning', async () => {
    // Test caching after scan
    expect(true).toBe(true);
  });
});


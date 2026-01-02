/**
 * GoPlus API Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'bun:test';
import { fetchGoPlusSecurity } from '../../src/lib/goplus/api';

// Mock fetch
global.fetch = vi.fn();

describe('GoPlus API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch token security data', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: {
          address: '0x123',
          symbol: 'TEST',
          name: 'Test Token',
          chain: 'base',
        },
        risk: {
          riskScore: 25,
          riskLevel: 'SAFE',
          safe: true,
          honeypot: false,
          rugpull: false,
          transferability: true,
          risks: [],
        },
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchGoPlusSecurity('0x123', 'base');
    expect(result).toBeDefined();
    expect(result?.risk.riskScore).toBe(25);
  });

  it('should handle API errors', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('API error')
    );

    const result = await fetchGoPlusSecurity('0x123', 'base');
    expect(result).toBeNull();
  });
});


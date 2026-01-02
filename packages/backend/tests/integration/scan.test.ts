/**
 * Scan endpoint integration tests
 */

import { describe, test, expect } from 'bun:test';
import { app } from '../../src/server';

describe('Scan API', () => {
  describe('POST /api/scan', () => {
    test('should reject invalid address', async () => {
      const res = await app.request('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAddress: 'invalid',
          chain: 'base',
        }),
      });

      expect(res.status).toBe(400);
    });

    test('should reject unsupported chain', async () => {
      const res = await app.request('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
          chain: 'unsupported-chain',
        }),
      });

      expect(res.status).toBe(400);
    });

    test('should reject empty request body', async () => {
      const res = await app.request('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
    });
  });
});


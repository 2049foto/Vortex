/**
 * Watchlist endpoint integration tests
 */

import { describe, test, expect } from 'bun:test';
import { app } from '../../src/server';

describe('Watchlist API', () => {
  describe('GET /api/watchlist', () => {
    test('should reject unauthenticated requests', async () => {
      const res = await app.request('/api/watchlist');

      expect(res.status).toBe(401);
    });

    test('should reject invalid token', async () => {
      const res = await app.request('/api/watchlist', {
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/watchlist', () => {
    test('should reject unauthenticated requests', async () => {
      const res = await app.request('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
          chain: 'base',
        }),
      });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/watchlist/:id', () => {
    test('should reject unauthenticated requests', async () => {
      const res = await app.request('/api/watchlist/test-id', {
        method: 'DELETE',
      });

      expect(res.status).toBe(401);
    });
  });
});


/**
 * Alerts endpoint integration tests
 */

import { describe, test, expect } from 'bun:test';
import { app } from '../../src/server';

describe('Alerts API', () => {
  describe('GET /api/alerts', () => {
    test('should reject unauthenticated requests', async () => {
      const res = await app.request('/api/alerts');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/alerts', () => {
    test('should reject unauthenticated requests', async () => {
      const res = await app.request('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'price',
          token: '0x1234567890abcdef1234567890abcdef12345678',
          condition: 'above',
          value: 100,
        }),
      });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/alerts/:id', () => {
    test('should reject unauthenticated requests', async () => {
      const res = await app.request('/api/alerts/test-id', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: false }),
      });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/alerts/:id', () => {
    test('should reject unauthenticated requests', async () => {
      const res = await app.request('/api/alerts/test-id', {
        method: 'DELETE',
      });

      expect(res.status).toBe(401);
    });
  });
});


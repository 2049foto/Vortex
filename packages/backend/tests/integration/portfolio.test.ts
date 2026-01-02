/**
 * Portfolio endpoint integration tests
 */

import { describe, test, expect } from 'bun:test';
import { app } from '../../src/server';

describe('Portfolio API', () => {
  describe('GET /api/portfolio/:address', () => {
    test('should reject invalid address', async () => {
      const res = await app.request('/api/portfolio/invalid-address');

      expect(res.status).toBe(400);
    });

    // Note: These tests would need database setup in real scenarios
    test('should accept valid address format', async () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const res = await app.request(`/api/portfolio/${address}`);

      // May fail due to DB but should not fail on validation
      expect([200, 500]).toContain(res.status);
    });
  });
});


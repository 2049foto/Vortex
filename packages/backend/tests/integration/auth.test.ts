/**
 * Auth endpoint integration tests
 */

import { describe, test, expect, beforeAll } from 'bun:test';
import { app } from '../../src/server';

// Set environment variables for testing
beforeAll(() => {
  process.env.JWT_SECRET = 'test_secret_key_at_least_32_characters_long';
});

describe('Auth API', () => {
  describe('POST /api/auth/message', () => {
    test('should return message for valid address', async () => {
      const res = await app.request('/api/auth/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: '0x1234567890abcdef1234567890abcdef12345678',
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.message).toBeDefined();
      expect(data.data.nonce).toBeDefined();
      expect(data.data.timestamp).toBeDefined();
    });

    test('should reject empty address', async () => {
      const res = await app.request('/api/auth/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: '' }),
      });

      expect(res.status).toBe(400);
    });

    test('should reject invalid address format', async () => {
      const res = await app.request('/api/auth/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: 'not-an-address' }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/verify', () => {
    test('should reject missing token', async () => {
      const res = await app.request('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(401);
    });

    test('should reject invalid token', async () => {
      const res = await app.request('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-token',
        },
      });

      const data = await res.json();
      expect(data.valid).toBe(false);
    });
  });
});


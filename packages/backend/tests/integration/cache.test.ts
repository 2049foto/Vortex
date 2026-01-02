/**
 * Cache API Integration Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { app } from '../../src/server';

describe('Cache API', () => {
  beforeAll(() => {
    // Setup
  });

  afterAll(() => {
    // Cleanup
  });

  describe('GET /api/cache/:key', () => {
    it('should get cached value', async () => {
      // First set a value
      const setRes = await app.request('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'test-key',
          value: { test: 'value' },
          ttl: 300,
        }),
      });

      expect(setRes.status).toBe(200);

      // Then get it
      const getRes = await app.request('/api/cache/test-key');
      expect(getRes.status).toBe(200);

      const data = await getRes.json();
      expect(data.success).toBe(true);
      expect(data.data).toEqual({ test: 'value' });
    });

    it('should return 404 for non-existent key', async () => {
      const res = await app.request('/api/cache/non-existent-key');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/cache', () => {
    it('should set cached value', async () => {
      const res = await app.request('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'test-set',
          value: { data: 'test' },
          ttl: 300,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it('should require key and value', async () => {
      const res = await app.request('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/cache/:key', () => {
    it('should delete cached value', async () => {
      // First set a value
      await app.request('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'test-delete',
          value: { test: 'value' },
          ttl: 300,
        }),
      });

      // Then delete it
      const res = await app.request('/api/cache/test-delete', {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe('GET /api/cache/exists/:key', () => {
    it('should check if key exists', async () => {
      // Set a value first
      await app.request('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'test-exists',
          value: { test: 'value' },
          ttl: 300,
        }),
      });

      const res = await app.request('/api/cache/exists/test-exists');
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.exists).toBe(true);
    });
  });
});


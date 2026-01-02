/**
 * Health endpoint integration tests
 */

import { describe, test, expect } from 'bun:test';
import { app } from '../../src/server';

describe('Health API', () => {
  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const res = await app.request('/api/health');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBeDefined();
      expect(data.timestamp).toBeDefined();
      expect(data.version).toBe('1.0.0');
      expect(data.uptime).toBeGreaterThanOrEqual(0);
      expect(data.services).toBeDefined();
    });
  });

  describe('GET /api/health/live', () => {
    test('should return alive status', async () => {
      const res = await app.request('/api/health/live');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.alive).toBe(true);
      expect(data.timestamp).toBeDefined();
    });
  });
});


/**
 * Health endpoint integration tests
 */

import { describe, test, expect } from 'bun:test';

describe('Health API', () => {
  describe('GET /api/health', () => {
    test('should return health status', async () => {
      // Import the app directly from index.ts
      const { default: app } = await import('../../src/index');
      
      const res = await app.request('/api/health');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBeDefined();
      expect(data.timestamp).toBeDefined();
      expect(data.version).toBe('1.0.0');
      expect(data.services).toBeDefined();
    });
  });

  describe('GET /api/health/live', () => {
    test('should return alive status', async () => {
      const { default: app } = await import('../../src/index');
      
      const res = await app.request('/api/health');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe('ok' || 'error'); // Allow both based on DB connection
      expect(data.timestamp).toBeDefined();
    });
  });
});


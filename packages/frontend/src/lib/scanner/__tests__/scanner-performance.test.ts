/**
 * Scanner Performance Tests
 * Test scanner performance with large datasets
 */

import { describe, it, expect } from 'vitest';
import { VortexScanner } from '../scanner';

describe('Scanner Performance', () => {
  let scanner: VortexScanner;

  beforeEach(() => {
    scanner = new VortexScanner();
  });

  it('should complete scan in <20 seconds', async () => {
    const startTime = Date.now();
    
    await scanner.scan('0x1234567890123456789012345678901234567890', { useCache: false });
    
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(20000); // 20 seconds
  }, 30000);

  it('should handle cache efficiently', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    
    // First scan
    const start1 = Date.now();
    await scanner.scan(address);
    const duration1 = Date.now() - start1;
    
    // Cached scan should be much faster
    const start2 = Date.now();
    await scanner.scan(address);
    const duration2 = Date.now() - start2;
    
    expect(duration2).toBeLessThan(duration1);
    expect(duration2).toBeLessThan(100); // Cache should be <100ms
  });

  it('should track performance statistics', async () => {
    await scanner.scan('0x1234567890123456789012345678901234567890', { useCache: false });
    
    const stats = scanner.getStats();
    
    expect(stats.totalScans).toBe(1);
    expect(stats.averageScanTime).toBeGreaterThan(0);
    expect(stats.lastScanTime).toBeGreaterThan(0);
  });
});


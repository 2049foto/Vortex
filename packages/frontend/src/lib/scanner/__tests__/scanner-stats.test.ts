/**
 * Scanner Statistics Tests
 */

import { describe, it, expect } from 'vitest';
import { VortexScanner } from '../scanner';

describe('Scanner Statistics', () => {
  let scanner: VortexScanner;

  beforeEach(() => {
    scanner = new VortexScanner();
  });

  it('should track total scans', async () => {
    await scanner.scan('0x1234', { useCache: false });
    
    const stats = scanner.getStats();
    expect(stats.totalScans).toBe(1);
  });

  it('should track tokens scanned', async () => {
    await scanner.scan('0x1234', { useCache: false });
    
    const stats = scanner.getStats();
    expect(stats.tokensScanned).toBeGreaterThan(0);
  });
});


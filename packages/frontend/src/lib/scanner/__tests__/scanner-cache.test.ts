/**
 * Scanner Cache Tests
 */

import { describe, it, expect } from 'vitest';
import { VortexScanner } from '../scanner';

describe('Scanner Cache', () => {
  let scanner: VortexScanner;

  beforeEach(() => {
    scanner = new VortexScanner();
    scanner.clearCache();
  });

  it('should cache scan results', async () => {
    const address = '0x1234';
    
    await scanner.scan(address);
    expect(scanner.getCacheSize()).toBe(1);
  });

  it('should clear cache', () => {
    scanner.clearCache();
    expect(scanner.getCacheSize()).toBe(0);
  });

  it('should track cache hit rate', async () => {
    const address = '0x1234';
    
    await scanner.scan(address);
    await scanner.scan(address);
    
    const hitRate = scanner.getCacheHitRate();
    expect(hitRate).toBeGreaterThan(0);
  });
});


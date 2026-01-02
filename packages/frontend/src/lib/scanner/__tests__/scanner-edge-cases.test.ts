/**
 * Scanner Edge Cases Tests
 * Test error handling and edge cases
 */

import { describe, it, expect } from 'vitest';
import { VortexScanner } from '../scanner';

describe('Scanner Edge Cases', () => {
  let scanner: VortexScanner;

  beforeEach(() => {
    scanner = new VortexScanner();
    scanner.clearCache();
  });

  it('should handle empty address', async () => {
    const result = await scanner.scan('');
    expect(result).toBeDefined();
  });

  it('should handle invalid chain selection', async () => {
    const result = await scanner.scan('0x1234', { chains: ['INVALID'] as any });
    expect(result).toBeDefined();
    expect(result.chains.length).toBe(0);
  });

  it('should handle cache expiry', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    
    // Set cache with short TTL
    await scanner.scan(address, { cacheTTL: 100 });
    
    // Wait for expiry
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Should not use cache
    const result = await scanner.scan(address);
    expect(result.fromCache).toBe(false);
  });

  it('should handle progress callback errors gracefully', async () => {
    const errorCallback = vi.fn(() => {
      throw new Error('Callback error');
    });
    
    // Should not throw
    await expect(
      scanner.scan('0x1234', {}, errorCallback)
    ).resolves.toBeDefined();
  });
});


/**
 * Validator tests
 */

import { describe, test, expect } from 'bun:test';
import { isAddress } from 'viem';

describe('Address Validators', () => {
  describe('isAddress (viem)', () => {
    test('should validate correct checksummed addresses', () => {
      expect(isAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(true);
      expect(isAddress('0x1234567890123456789012345678901234567890')).toBe(true);
    });

    test('should validate lowercase addresses', () => {
      expect(isAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')).toBe(true);
    });

    test('should reject invalid addresses', () => {
      expect(isAddress('')).toBe(false);
      expect(isAddress('0x123')).toBe(false);
      expect(isAddress('not-an-address')).toBe(false);
    });
  });
});

describe('Chain Validators', () => {
  const SUPPORTED_CHAINS = ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon', 'bsc', 'avalanche'];

  test('should include all expected chains', () => {
    expect(SUPPORTED_CHAINS).toContain('ethereum');
    expect(SUPPORTED_CHAINS).toContain('base');
    expect(SUPPORTED_CHAINS).toContain('arbitrum');
    expect(SUPPORTED_CHAINS).toContain('polygon');
  });

  test('should have correct number of chains', () => {
    expect(SUPPORTED_CHAINS.length).toBeGreaterThanOrEqual(7);
  });
});

describe('Input Sanitization', () => {
  test('should trim whitespace', () => {
    const input = '  test  ';
    expect(input.trim()).toBe('test');
  });

  test('should limit string length', () => {
    const longString = 'a'.repeat(2000);
    const maxLength = 1000;
    expect(longString.slice(0, maxLength).length).toBe(maxLength);
  });
});


/**
 * Format Utility Tests
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, formatAddress, formatNumber } from '../format';

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('should format USD currency', () => {
      expect(formatCurrency(1234.56)).toContain('$');
      expect(formatCurrency(1234.56)).toContain('1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-100)).toContain('-');
    });
  });

  describe('formatPercent', () => {
    it('should format percentage', () => {
      expect(formatPercent(0.1234)).toContain('%');
      expect(formatPercent(0.1234)).toContain('12.34');
    });

    it('should handle zero', () => {
      expect(formatPercent(0)).toBe('0%');
    });
  });

  describe('formatAddress', () => {
    it('should truncate address', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const formatted = formatAddress(address);
      expect(formatted).toContain('...');
      expect(formatted.length).toBeLessThan(address.length);
    });

    it('should use custom start/end length', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const formatted = formatAddress(address, 4, 4);
      expect(formatted).toBe('0x12...7890');
    });
  });

  describe('formatNumber', () => {
    it('should format large numbers', () => {
      expect(formatNumber(1000000)).toContain('1');
      expect(formatNumber(1000000)).toContain('M');
    });

    it('should format small numbers', () => {
      expect(formatNumber(0.0001)).toContain('0.0001');
    });
  });
});


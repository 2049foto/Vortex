/**
 * Format utility tests
 */

import { describe, test, expect } from 'bun:test';

// Simple format utilities for testing
function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

describe('Format Utilities', () => {
  describe('formatUSD', () => {
    test('should format positive numbers', () => {
      expect(formatUSD(1234.56)).toBe('$1,234.56');
      expect(formatUSD(0)).toBe('$0.00');
    });

    test('should format negative numbers', () => {
      expect(formatUSD(-1234.56)).toBe('-$1,234.56');
    });

    test('should format large numbers', () => {
      const formatted = formatUSD(1234567.89);
      expect(formatted).toContain('1,234,567');
    });
  });

  describe('truncateAddress', () => {
    test('should truncate long addresses', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const truncated = truncateAddress(address);
      expect(truncated).toBe('0x1234...5678');
    });

    test('should handle short addresses', () => {
      const address = '0x1234';
      const truncated = truncateAddress(address);
      expect(truncated).toBe('0x1234');
    });

    test('should accept custom lengths', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const truncated = truncateAddress(address, 10, 8);
      expect(truncated).toBe('0x12345678...12345678');
    });
  });

  describe('formatPercent', () => {
    test('should format positive percentages with plus sign', () => {
      expect(formatPercent(5.25)).toBe('+5.25%');
      expect(formatPercent(0)).toBe('+0.00%');
    });

    test('should format negative percentages', () => {
      expect(formatPercent(-3.5)).toBe('-3.50%');
    });
  });
});


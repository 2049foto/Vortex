/**
 * Validators Tests
 */

import { describe, test, expect } from 'vitest';
import {
  isValidEvmAddress,
  isValidSolanaAddress,
  isValidChain,
  isValidEmail,
  isValidUrl,
  sanitizeString,
} from '../validators';

describe('Address Validators', () => {
  describe('isValidEvmAddress', () => {
    test('validates correct EVM addresses', () => {
      expect(isValidEvmAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true);
      expect(isValidEvmAddress('0xABCDEF1234567890abcdef1234567890abcdef12')).toBe(true);
    });

    test('rejects invalid EVM addresses', () => {
      expect(isValidEvmAddress('')).toBe(false);
      expect(isValidEvmAddress('invalid')).toBe(false);
      expect(isValidEvmAddress('0x123')).toBe(false);
      expect(isValidEvmAddress('1234567890abcdef1234567890abcdef12345678')).toBe(false);
    });

    test('rejects null and undefined', () => {
      expect(isValidEvmAddress(null as unknown as string)).toBe(false);
      expect(isValidEvmAddress(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isValidSolanaAddress', () => {
    test('validates correct Solana addresses', () => {
      expect(isValidSolanaAddress('11111111111111111111111111111111')).toBe(true);
      expect(isValidSolanaAddress('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')).toBe(true);
    });

    test('rejects invalid Solana addresses', () => {
      expect(isValidSolanaAddress('')).toBe(false);
      expect(isValidSolanaAddress('invalid')).toBe(false);
      expect(isValidSolanaAddress('0x1234')).toBe(false);
    });
  });
});

describe('Chain Validators', () => {
  describe('isValidChain', () => {
    test('validates supported chains', () => {
      expect(isValidChain('ethereum')).toBe(true);
      expect(isValidChain('base')).toBe(true);
      expect(isValidChain('arbitrum')).toBe(true);
      expect(isValidChain('polygon')).toBe(true);
      expect(isValidChain('solana')).toBe(true);
    });

    test('rejects unsupported chains', () => {
      expect(isValidChain('invalid')).toBe(false);
      expect(isValidChain('')).toBe(false);
      expect(isValidChain('bitcoin')).toBe(false);
    });
  });
});

describe('Email Validators', () => {
  describe('isValidEmail', () => {
    test('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('rejects invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail('no@domain')).toBe(false);
    });
  });
});

describe('URL Validators', () => {
  describe('isValidUrl', () => {
    test('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://api.example.com/v1/users')).toBe(true);
    });

    test('rejects invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('invalid')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });
  });
});

describe('String Sanitization', () => {
  describe('sanitizeString', () => {
    test('trims whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    test('limits string length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeString(longString).length).toBe(1000);
    });

    test('handles custom max length', () => {
      const longString = 'a'.repeat(100);
      expect(sanitizeString(longString, 50).length).toBe(50);
    });

    test('returns empty string for invalid input', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString(null as unknown as string)).toBe('');
      expect(sanitizeString(undefined as unknown as string)).toBe('');
    });
  });
});


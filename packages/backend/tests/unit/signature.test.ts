/**
 * Signature verification tests
 */

import { describe, test, expect } from 'bun:test';
import {
  generateSignMessage,
  isValidEVMAddress,
  normalizeAddress,
  isValidTimestamp,
} from '../../src/lib/auth/signature';

describe('Signature Utilities', () => {
  describe('generateSignMessage', () => {
    test('should generate a message with address', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const { message, nonce, timestamp } = generateSignMessage(address);
      
      expect(message).toContain(address);
      expect(message).toContain('Sign this message');
      expect(nonce).toBeDefined();
      expect(nonce.length).toBe(32);
      expect(timestamp).toBeLessThanOrEqual(Date.now());
    });

    test('should generate unique nonces', () => {
      const { nonce: nonce1 } = generateSignMessage('0x123');
      const { nonce: nonce2 } = generateSignMessage('0x123');
      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('isValidEVMAddress', () => {
    test('should validate correct EVM addresses', () => {
      expect(isValidEVMAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true);
      expect(isValidEVMAddress('0xabcdef1234567890abcdef1234567890abcdef12')).toBe(true);
    });

    test('should reject invalid addresses', () => {
      expect(isValidEVMAddress('')).toBe(false);
      expect(isValidEVMAddress('0x123')).toBe(false);
      expect(isValidEVMAddress('not-an-address')).toBe(false);
      expect(isValidEVMAddress('1234567890abcdef1234567890abcdef12345678')).toBe(false);
    });
  });

  describe('normalizeAddress', () => {
    test('should lowercase addresses', () => {
      const address = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12';
      const normalized = normalizeAddress(address);
      expect(normalized).toBe(address.toLowerCase());
    });
  });

  describe('isValidTimestamp', () => {
    test('should accept recent timestamps', () => {
      const now = Date.now();
      expect(isValidTimestamp(now)).toBe(true);
      expect(isValidTimestamp(now - 60000)).toBe(true); // 1 minute ago
    });

    test('should reject old timestamps', () => {
      const oldTimestamp = Date.now() - 10 * 60 * 1000; // 10 minutes ago
      expect(isValidTimestamp(oldTimestamp)).toBe(false);
    });

    test('should reject future timestamps', () => {
      const futureTimestamp = Date.now() + 60000;
      expect(isValidTimestamp(futureTimestamp)).toBe(false);
    });
  });
});


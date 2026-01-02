/**
 * JWT utility tests
 */

import { describe, test, expect, beforeAll } from 'bun:test';
import { generateJWT, verifyJWT, extractToken, getTokenExpiration } from '../../src/lib/auth/jwt';

// Set environment variables for testing
beforeAll(() => {
  process.env.JWT_SECRET = 'test_secret_key_at_least_32_characters_long';
});

describe('JWT Utilities', () => {
  describe('generateJWT', () => {
    test('should generate a valid JWT token', async () => {
      const token = await generateJWT('user123', '0x1234567890abcdef1234567890abcdef12345678');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should generate different tokens for different users', async () => {
      const token1 = await generateJWT('user1', '0xaddress1');
      const token2 = await generateJWT('user2', '0xaddress2');
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyJWT', () => {
    test('should verify a valid token', async () => {
      const userId = 'testuser123';
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      
      const token = await generateJWT(userId, walletAddress);
      const payload = await verifyJWT(token);
      
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(userId);
      expect(payload?.walletAddress).toBe(walletAddress.toLowerCase());
    });

    test('should return null for invalid token', async () => {
      const payload = await verifyJWT('invalid.token.here');
      expect(payload).toBeNull();
    });

    test('should return null for empty token', async () => {
      const payload = await verifyJWT('');
      expect(payload).toBeNull();
    });
  });

  describe('extractToken', () => {
    test('should extract token from Bearer header', () => {
      const token = extractToken('Bearer mytoken123');
      expect(token).toBe('mytoken123');
    });

    test('should return null for missing header', () => {
      const token = extractToken(undefined);
      expect(token).toBeNull();
    });

    test('should return null for invalid format', () => {
      const token = extractToken('Basic mytoken');
      expect(token).toBeNull();
    });

    test('should return null for Bearer without token', () => {
      const token = extractToken('Bearer');
      expect(token).toBeNull();
    });
  });

  describe('getTokenExpiration', () => {
    test('should return a future date', () => {
      const expiration = getTokenExpiration();
      expect(expiration.getTime()).toBeGreaterThan(Date.now());
    });
  });
});


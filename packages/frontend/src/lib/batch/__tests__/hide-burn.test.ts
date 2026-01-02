/**
 * Hide/Burn Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isActionAllowed,
  validateBatchAction,
  canHide,
  canBurn,
  canSwap,
  getAllowedActions,
} from '../hide-burn';
import type { ScannedToken } from '../../scanner/types';
import { CHAINS } from '../../chains/config';

describe('Hide/Burn Logic', () => {
  const mockToken: ScannedToken = {
    address: '0x123',
    symbol: 'TEST',
    name: 'Test Token',
    decimals: 18,
    balance: '1000000000000000000',
    balanceFormatted: 1,
    priceUSD: 1,
    valueUSD: 1,
    riskScore: 50,
    isHoneypot: false,
    isRugpull: false,
    chain: 'BASE',
    chainConfig: CHAINS.BASE,
    verified: true,
    liquidity: 100000,
    holders: 1000,
    category: 'DUST',
    allowedActions: ['SWAP', 'HIDE'],
  };

  describe('isActionAllowed', () => {
    it('should allow SWAP for DUST tokens', () => {
      expect(isActionAllowed('DUST', 'SWAP')).toBe(true);
    });

    it('should allow HIDE for DUST tokens', () => {
      expect(isActionAllowed('DUST', 'HIDE')).toBe(true);
    });

    it('should not allow BURN for DUST tokens', () => {
      expect(isActionAllowed('DUST', 'BURN')).toBe(false);
    });

    it('should only allow HIDE for RISK tokens', () => {
      expect(isActionAllowed('RISK', 'HIDE')).toBe(true);
      expect(isActionAllowed('RISK', 'SWAP')).toBe(false);
      expect(isActionAllowed('RISK', 'BURN')).toBe(false);
    });

    it('should allow HOLD and SWAP for PREMIUM tokens', () => {
      expect(isActionAllowed('PREMIUM', 'HOLD')).toBe(true);
      expect(isActionAllowed('PREMIUM', 'SWAP')).toBe(true);
      expect(isActionAllowed('PREMIUM', 'HIDE')).toBe(false);
    });

    it('should allow HIDE and BURN for MICRO tokens', () => {
      expect(isActionAllowed('MICRO', 'HIDE')).toBe(true);
      expect(isActionAllowed('MICRO', 'BURN')).toBe(true);
      expect(isActionAllowed('MICRO', 'SWAP')).toBe(false);
    });
  });

  describe('validateBatchAction', () => {
    it('should validate eligible tokens for SWAP', () => {
      const tokens: ScannedToken[] = [
        { ...mockToken, category: 'DUST', valueUSD: 5 },
        { ...mockToken, category: 'DUST', valueUSD: 0.005 },
      ];

      const result = validateBatchAction(tokens, 'SWAP');
      expect(result.eligibleTokens.length).toBe(1);
      expect(result.invalidTokens.length).toBe(1);
    });

    it('should validate eligible tokens for HIDE', () => {
      const tokens: ScannedToken[] = [
        { ...mockToken, category: 'RISK' },
        { ...mockToken, category: 'PREMIUM' },
      ];

      const result = validateBatchAction(tokens, 'HIDE');
      expect(result.eligibleTokens.length).toBe(1);
      expect(result.invalidTokens.length).toBe(1);
    });

    it('should validate eligible tokens for BURN', () => {
      const tokens: ScannedToken[] = [
        { ...mockToken, category: 'MICRO', valueUSD: 0.05 },
        { ...mockToken, category: 'MICRO', valueUSD: 0.5 },
      ];

      const result = validateBatchAction(tokens, 'BURN');
      expect(result.eligibleTokens.length).toBe(1);
      expect(result.invalidTokens.length).toBe(1);
    });
  });

  describe('canHide', () => {
    it('should return true for tokens that can be hidden', () => {
      expect(canHide({ ...mockToken, category: 'DUST' })).toBe(true);
      expect(canHide({ ...mockToken, category: 'RISK' })).toBe(true);
      expect(canHide({ ...mockToken, category: 'MICRO' })).toBe(true);
    });

    it('should return false for PREMIUM tokens', () => {
      expect(canHide({ ...mockToken, category: 'PREMIUM' })).toBe(false);
    });
  });

  describe('canBurn', () => {
    it('should return true for MICRO tokens with low value', () => {
      expect(canBurn({ ...mockToken, category: 'MICRO', valueUSD: 0.05 })).toBe(true);
    });

    it('should return false for tokens with high value', () => {
      expect(canBurn({ ...mockToken, category: 'MICRO', valueUSD: 0.5 })).toBe(false);
    });
  });

  describe('canSwap', () => {
    it('should return true for tokens with sufficient value', () => {
      expect(canSwap({ ...mockToken, category: 'DUST', valueUSD: 5 })).toBe(true);
    });

    it('should return false for tokens with low value', () => {
      expect(canSwap({ ...mockToken, category: 'DUST', valueUSD: 0.005 })).toBe(false);
    });
  });

  describe('getAllowedActions', () => {
    it('should return correct actions for each category', () => {
      expect(getAllowedActions({ ...mockToken, category: 'PREMIUM' })).toEqual(['HOLD', 'SWAP']);
      expect(getAllowedActions({ ...mockToken, category: 'DUST' })).toEqual(['SWAP', 'HIDE']);
      expect(getAllowedActions({ ...mockToken, category: 'MICRO' })).toEqual(['HIDE', 'BURN']);
      expect(getAllowedActions({ ...mockToken, category: 'RISK' })).toEqual(['HIDE']);
    });
  });
});


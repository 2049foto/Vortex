/**
 * Batch Engine Edge Cases Tests
 */

import { describe, it, expect } from 'vitest';
import { BatchActionEngine } from '../engine';
import type { ScannedToken } from '../../scanner/types';
import { CHAINS } from '../../chains/config';

const createMockToken = (overrides: Partial<ScannedToken> = {}): ScannedToken => ({
  address: '0x1234',
  symbol: 'TEST',
  name: 'Test',
  decimals: 18,
  balance: '1000',
  balanceFormatted: 1,
  priceUSD: 1,
  valueUSD: 1,
  riskScore: 30,
  isHoneypot: false,
  isRugpull: false,
  chain: 'BASE',
  chainConfig: CHAINS.BASE,
  verified: true,
  liquidity: 100000,
  holders: 500,
  category: 'DUST',
  allowedActions: ['SWAP'],
  ...overrides,
});

describe('Batch Engine Edge Cases', () => {
  let engine: BatchActionEngine;

  beforeEach(() => {
    engine = new BatchActionEngine();
    engine.unhideAll();
  });

  it('should handle empty token array', async () => {
    const result = await engine.batchSwap([]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('No eligible tokens');
  });

  it('should handle tokens with no allowed actions', async () => {
    const tokens = [createMockToken({ allowedActions: [] })];
    const result = await engine.batchSwap(tokens);
    expect(result.success).toBe(false);
  });

  it('should handle very large token arrays', async () => {
    const tokens = Array.from({ length: 1000 }, () => createMockToken());
    const result = await engine.batchSwap(tokens);
    expect(result).toBeDefined();
  });
});


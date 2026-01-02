/**
 * Batch Engine Hidden Tokens Tests
 */

import { describe, it, expect } from 'vitest';
import { BatchActionEngine } from '../engine';
import type { ScannedToken } from '../../scanner/types';
import { CHAINS } from '../../chains/config';

const createMockToken = (): ScannedToken => ({
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
  allowedActions: ['HIDE'],
});

describe('Hidden Tokens Management', () => {
  let engine: BatchActionEngine;

  beforeEach(() => {
    engine = new BatchActionEngine();
    engine.unhideAll();
  });

  it('should hide tokens', async () => {
    const tokens = [createMockToken()];
    await engine.batchHide(tokens);
    
    expect(engine.isHidden('BASE', '0x1234')).toBe(true);
  });

  it('should unhide tokens', async () => {
    const tokens = [createMockToken()];
    await engine.batchHide(tokens);
    
    engine.unhide('BASE', '0x1234');
    expect(engine.isHidden('BASE', '0x1234')).toBe(false);
  });
});


/**
 * Batch Engine Transaction History Tests
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
  valueUSD: 5,
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
});

describe('Transaction History', () => {
  let engine: BatchActionEngine;

  beforeEach(() => {
    engine = new BatchActionEngine();
    engine.clearTransactionHistory();
  });

  it('should track transaction history', async () => {
    const tokens = [createMockToken()];
    await engine.batchSwap(tokens);
    
    const history = engine.getTransactionHistory();
    expect(history.length).toBeGreaterThan(0);
  });

  it('should clear transaction history', () => {
    engine.clearTransactionHistory();
    expect(engine.getTransactionHistory().length).toBe(0);
  });
});


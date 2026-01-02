/**
 * Batch Engine Gas Estimation Tests
 * Test gas savings calculations
 */

import { describe, it, expect } from 'vitest';
import { batchEngine } from '../engine';
import type { ScannedToken } from '../../scanner/types';
import { CHAINS } from '../../chains/config';

const createMockToken = (overrides: Partial<ScannedToken> = {}): ScannedToken => ({
  address: '0x1234567890123456789012345678901234567890',
  symbol: 'TEST',
  name: 'Test Token',
  decimals: 18,
  balance: '1000000000000000000',
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

describe('Batch Engine Gas Estimation', () => {
  it('should calculate gas savings for batch operations', () => {
    const savings = batchEngine.estimateGasSavings(10);
    
    expect(savings.individualGas).toBeGreaterThan(savings.batchGas);
    expect(savings.savings).toBeGreaterThan(0);
    expect(savings.savingsPercent).toBeGreaterThan(0);
    expect(savings.savingsUSD).toBeGreaterThan(0);
  });

  it('should show higher savings for more tokens', () => {
    const savings5 = batchEngine.estimateGasSavings(5);
    const savings20 = batchEngine.estimateGasSavings(20);
    
    expect(savings20.savings).toBeGreaterThan(savings5.savings);
    expect(savings20.savingsUSD).toBeGreaterThan(savings5.savingsUSD);
  });

  it('should estimate swap value correctly', () => {
    const tokens = [
      createMockToken({ valueUSD: 100 }),
      createMockToken({ valueUSD: 50 }),
      createMockToken({ valueUSD: 25 }),
    ];
    
    const estimate = batchEngine.estimateSwapValue(tokens, 0.5);
    
    expect(estimate.totalValue).toBe(175);
    expect(estimate.afterSlippage).toBeLessThan(estimate.totalValue);
    expect(estimate.fees).toBeGreaterThan(0);
    expect(estimate.netValue).toBeLessThan(estimate.afterSlippage);
  });

  it('should account for slippage in value estimation', () => {
    const tokens = [createMockToken({ valueUSD: 100 })];
    
    const estimate1 = batchEngine.estimateSwapValue(tokens, 0.5);
    const estimate2 = batchEngine.estimateSwapValue(tokens, 1.0);
    
    expect(estimate2.afterSlippage).toBeLessThan(estimate1.afterSlippage);
  });
});


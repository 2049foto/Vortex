/**
 * Batch Validation Tests
 */

import { describe, it, expect } from 'vitest';
import { validateBatchAction } from '../hide-burn';
import type { ScannedToken } from '../../scanner/types';
import { CHAINS } from '../../chains/config';

describe('Batch Validation', () => {
  const createMockToken = (overrides: Partial<ScannedToken>): ScannedToken => ({
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
    ...overrides,
  });

  it('should validate mixed token categories', () => {
    const tokens: ScannedToken[] = [
      createMockToken({ category: 'PREMIUM', valueUSD: 100 }),
      createMockToken({ category: 'DUST', valueUSD: 5 }),
      createMockToken({ category: 'RISK', riskScore: 80 }),
    ];

    const result = validateBatchAction(tokens, 'SWAP');
    expect(result.eligibleTokens.length).toBe(1);
    expect(result.invalidTokens.length).toBe(2);
  });

  it('should validate all tokens are eligible', () => {
    const tokens: ScannedToken[] = [
      createMockToken({ category: 'DUST', valueUSD: 5 }),
      createMockToken({ category: 'DUST', valueUSD: 3 }),
    ];

    const result = validateBatchAction(tokens, 'SWAP');
    expect(result.valid).toBe(true);
    expect(result.eligibleTokens.length).toBe(2);
  });
});


/**
 * Batch Engine Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { batchEngine } from '../engine';
import type { ScannedToken } from '../../scanner/types';
import { CHAINS } from '../../chains/config';

// Mock swap engine
vi.mock('../swap-engine', () => ({
  swapEngine: {
    initialize: vi.fn(),
    executeBatchSwap: vi.fn(),
  },
}));

// Mock hide/burn engine
vi.mock('../hide-burn', () => ({
  hideBurnEngine: {
    batchHide: vi.fn(),
    batchBurn: vi.fn(),
  },
}));

describe('Batch Engine Integration', () => {
  const mockTokens: ScannedToken[] = [
    {
      address: '0x123',
      symbol: 'DUST1',
      name: 'Dust Token 1',
      decimals: 18,
      balance: '1000000000000000000',
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
      holders: 1000,
      category: 'DUST',
      allowedActions: ['SWAP', 'HIDE'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute batch swap', async () => {
    const result = await batchEngine.executeBatchSwap(mockTokens);
    expect(result).toBeDefined();
  });

  it('should execute batch hide', async () => {
    const result = await batchEngine.executeBatchHide(mockTokens);
    expect(result).toBeDefined();
  });

  it('should execute batch burn', async () => {
    const result = await batchEngine.executeBatchBurn(mockTokens);
    expect(result).toBeDefined();
  });
});


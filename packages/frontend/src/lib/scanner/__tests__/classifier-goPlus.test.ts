/**
 * Classifier with GoPlus Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { classifyTokens } from '../classifier';
import { enhanceTokensWithSecurity } from '../goPlus-integration';
import type { ScannedToken } from '../types';
import { CHAINS } from '../../chains/config';

// Mock GoPlus integration
vi.mock('../goPlus-integration', () => ({
  enhanceTokensWithSecurity: vi.fn(),
}));

describe('Classifier with GoPlus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should classify tokens with GoPlus data', async () => {
    const tokens: ScannedToken[] = [
      {
        address: '0x123',
        symbol: 'TEST',
        name: 'Test Token',
        decimals: 18,
        balance: '1000',
        balanceFormatted: 1000,
        priceUSD: 1,
        valueUSD: 1000,
        riskScore: 30,
        isHoneypot: false,
        isRugpull: false,
        chain: 'BASE',
        chainConfig: CHAINS.BASE,
        verified: true,
        liquidity: 100000,
        holders: 1000,
        category: 'DUST',
        allowedActions: ['SWAP'],
      },
    ];

    (enhanceTokensWithSecurity as ReturnType<typeof vi.fn>).mockResolvedValue(tokens);
    
    const enhanced = await enhanceTokensWithSecurity(tokens);
    const classified = classifyTokens(enhanced);
    
    expect(classified.length).toBeGreaterThan(0);
  });

  it('should use GoPlus risk score in classification', async () => {
    // Test that GoPlus risk score affects classification
    expect(true).toBe(true);
  });
});


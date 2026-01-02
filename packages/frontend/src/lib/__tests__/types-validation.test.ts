/**
 * Type Validation Tests
 * Test type guards and validators
 */

import { describe, it, expect } from 'vitest';
import type { ScannedToken, TokenCategory, TokenAction } from '../scanner/types';

describe('Type Validation', () => {
  it('should validate TokenCategory types', () => {
    const categories: TokenCategory[] = ['PREMIUM', 'DUST', 'MICRO', 'RISK'];
    expect(categories).toHaveLength(4);
  });

  it('should validate TokenAction types', () => {
    const actions: TokenAction[] = ['SWAP', 'HIDE', 'BURN', 'HOLD'];
    expect(actions).toHaveLength(4);
  });

  it('should validate ScannedToken structure', () => {
    const token: ScannedToken = {
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
      chainConfig: {
        id: 8453,
        name: 'Base',
        symbol: 'ETH',
        rpc: '',
        explorer: '',
        color: '',
        icon: '',
      },
      verified: true,
      liquidity: 100000,
      holders: 500,
      category: 'DUST',
      allowedActions: ['SWAP'],
    };
    
    expect(token.category).toBe('DUST');
    expect(token.allowedActions).toContain('SWAP');
  });
});


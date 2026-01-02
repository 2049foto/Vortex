/**
 * Scanner Types Tests
 * Test suite for type definitions and validators
 */

import { describe, it, expect } from 'vitest';
import type { ScannedToken, TokenCategory, TokenAction, ScanResult } from '../types';

describe('TokenCategory', () => {
  it('should have valid categories', () => {
    const categories: TokenCategory[] = ['PREMIUM', 'DUST', 'MICRO', 'RISK'];
    
    expect(categories).toHaveLength(4);
    expect(categories).toContain('PREMIUM');
    expect(categories).toContain('DUST');
    expect(categories).toContain('MICRO');
    expect(categories).toContain('RISK');
  });
});

describe('TokenAction', () => {
  it('should have valid actions', () => {
    const actions: TokenAction[] = ['SWAP', 'HIDE', 'BURN', 'HOLD'];
    
    expect(actions).toHaveLength(4);
    expect(actions).toContain('SWAP');
    expect(actions).toContain('HIDE');
    expect(actions).toContain('BURN');
    expect(actions).toContain('HOLD');
  });
});

describe('ScannedToken', () => {
  it('should have required fields', () => {
    const token: ScannedToken = {
      address: '0x1234',
      symbol: 'TEST',
      name: 'Test Token',
      decimals: 18,
      balance: '1000',
      balanceFormatted: 1000,
      priceUSD: 1,
      valueUSD: 100,
      riskScore: 30,
      isHoneypot: false,
      isRugpull: false,
      chain: 'BASE',
      chainConfig: {
        id: 8453,
        name: 'Base',
        symbol: 'ETH',
        rpc: 'https://mainnet.base.org',
        explorer: 'https://basescan.org',
        color: '#0052FF',
        icon: '🔵',
      },
      verified: true,
      liquidity: 100000,
      holders: 500,
      category: 'DUST',
      allowedActions: ['SWAP'],
    };
    
    expect(token.address).toBeDefined();
    expect(token.symbol).toBeDefined();
    expect(token.category).toBeDefined();
    expect(token.allowedActions).toBeDefined();
  });
});

describe('ScanResult', () => {
  it('should have required fields', () => {
    const result: ScanResult = {
      address: '0x1234',
      timestamp: Date.now(),
      chains: [],
      tokens: [],
      summary: {
        totalValue: 0,
        totalTokens: 0,
        premium: { count: 0, value: 0, tokens: [] },
        dust: { count: 0, value: 0, tokens: [] },
        micro: { count: 0, value: 0, tokens: [] },
        risk: { count: 0, value: 0, tokens: [] },
      },
      fromCache: false,
    };
    
    expect(result.address).toBeDefined();
    expect(result.timestamp).toBeDefined();
    expect(result.summary).toBeDefined();
  });
});


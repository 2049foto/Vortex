/**
 * Chain Config Tests
 */

import { describe, it, expect } from 'vitest';
import { CHAINS, EVM_CHAINS, getChainById, getChainKey, TARGET_CHAIN } from '../config';

describe('Chain Config', () => {
  it('should have all 9 chains configured', () => {
    const chainKeys = Object.keys(CHAINS);
    expect(chainKeys.length).toBe(9);
    expect(chainKeys).toContain('BASE');
    expect(chainKeys).toContain('ETHEREUM');
    expect(chainKeys).toContain('BSC');
    expect(chainKeys).toContain('ARBITRUM');
    expect(chainKeys).toContain('POLYGON');
    expect(chainKeys).toContain('OPTIMISM');
    expect(chainKeys).toContain('AVALANCHE');
    expect(chainKeys).toContain('MONAD');
    expect(chainKeys).toContain('SOLANA');
  });

  it('should have target chain configured', () => {
    expect(TARGET_CHAIN).toBeDefined();
    expect(TARGET_CHAIN.isTarget).toBe(true);
  });

  it('should get chain by ID', () => {
    const chain = getChainById(8453);
    expect(chain).toBeDefined();
    expect(chain?.name).toBe('Base');
  });

  it('should get chain key by ID', () => {
    const key = getChainKey(8453);
    expect(key).toBe('BASE');
  });

  it('should filter EVM chains', () => {
    expect(EVM_CHAINS.length).toBeGreaterThan(0);
    expect(EVM_CHAINS.every(c => typeof c.id === 'number')).toBe(true);
  });
});


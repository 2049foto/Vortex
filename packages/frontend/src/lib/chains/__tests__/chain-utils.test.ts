/**
 * Chain Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { CHAINS, getChainById, getChainKey } from '../config';

describe('Chain Utilities', () => {
  it('should get chain by ID', () => {
    const chain = getChainById(8453);
    expect(chain?.name).toBe('Base');
  });

  it('should get chain key by ID', () => {
    expect(getChainKey(8453)).toBe('BASE');
  });

  it('should handle invalid chain IDs', () => {
    expect(getChainById(99999)).toBeUndefined();
    expect(getChainKey(99999)).toBeUndefined();
  });
});


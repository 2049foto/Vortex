/**
 * Gamification Statistics Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GamificationEngine } from '../engine';

describe('Gamification Statistics', () => {
  let engine: GamificationEngine;
  const testAddress = '0x1234';

  beforeEach(() => {
    engine = new GamificationEngine();
    localStorage.clear();
  });

  it('should track scan statistics', () => {
    engine.awardXP(testAddress, 'SCAN');
    const user = engine.getUser(testAddress);
    
    expect(user.stats.scans).toBe(1);
  });

  it('should track swap statistics', () => {
    engine.awardXP(testAddress, 'SWAP_DUST');
    const user = engine.getUser(testAddress);
    
    expect(user.stats.swaps).toBe(1);
  });
});


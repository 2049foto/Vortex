/**
 * XP Award Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { gamification } from '../engine';

describe('XP Award', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  it('should award XP for scan', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const result = gamification.awardXP(address, 'SCAN');
    
    expect(result.xpAwarded).toBeGreaterThan(0);
    expect(result.newXp).toBeGreaterThan(0);
  });

  it('should award XP for swap', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const result = gamification.awardXP(address, 'SWAP_DUST');
    
    expect(result.xpAwarded).toBeGreaterThan(0);
  });

  it('should level up when XP threshold reached', () => {
    const address = '0x1234567890123456789012345678901234567890';
    
    // Award enough XP to level up
    for (let i = 0; i < 10; i++) {
      gamification.awardXP(address, 'SCAN', 100);
    }
    
    const user = gamification.getUser(address);
    expect(user.level).toBeGreaterThan(1);
  });
});


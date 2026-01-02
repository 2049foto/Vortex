/**
 * Leaderboard Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { gamification } from '../engine';

describe('Leaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should update leaderboard on XP award', () => {
    const address1 = '0x1111111111111111111111111111111111111111';
    const address2 = '0x2222222222222222222222222222222222222222';
    
    gamification.awardXP(address1, 'SCAN', 100);
    gamification.awardXP(address2, 'SCAN', 50);
    
    const leaderboard = gamification.getLeaderboard(10);
    expect(leaderboard.length).toBeGreaterThan(0);
  });

  it('should return top N users', () => {
    // Create multiple users with different XP
    for (let i = 0; i < 10; i++) {
      const address = `0x${i.toString(16).padStart(40, '0')}`;
      gamification.awardXP(address, 'SCAN', i * 10);
    }
    
    const top5 = gamification.getLeaderboard(5);
    expect(top5.length).toBeLessThanOrEqual(5);
  });

  it('should sort by XP descending', () => {
    const address1 = '0x1111111111111111111111111111111111111111';
    const address2 = '0x2222222222222222222222222222222222222222';
    
    gamification.awardXP(address1, 'SCAN', 50);
    gamification.awardXP(address2, 'SCAN', 100);
    
    const leaderboard = gamification.getLeaderboard(10);
    expect(leaderboard[0].xp).toBeGreaterThanOrEqual(leaderboard[1].xp);
  });
});


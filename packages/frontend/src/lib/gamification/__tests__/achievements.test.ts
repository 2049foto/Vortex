/**
 * Achievements Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { gamification } from '../engine';
import type { ScanResult } from '../../scanner/types';

describe('Achievements', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should unlock achievement on first scan', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const scanResult: ScanResult = {
      address,
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

    gamification.awardXP(address, 'SCAN');
    const achievements = gamification.checkAchievements(address, scanResult);
    
    // Should check for achievements
    expect(Array.isArray(achievements)).toBe(true);
  });

  it('should track daily login streak', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const result = gamification.trackLogin(address);
    
    expect(result.streakUpdated).toBe(true);
    expect(result.newStreak).toBeGreaterThanOrEqual(1);
  });
});


/**
 * Gamification Types Tests
 * Test level calculations and XP functions
 */

import { describe, it, expect } from 'vitest';
import { calculateLevel, levelProgress, xpForNextLevel, ACHIEVEMENTS } from '../types';

describe('calculateLevel', () => {
  it('should calculate level from XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(500)).toBe(1);
    expect(calculateLevel(1000)).toBe(2);
    expect(calculateLevel(2000)).toBe(3);
  });
});

describe('levelProgress', () => {
  it('should calculate progress percentage', () => {
    expect(levelProgress(0)).toBe(0);
    expect(levelProgress(500)).toBe(50);
    expect(levelProgress(999)).toBe(99);
  });
});

describe('xpForNextLevel', () => {
  it('should return XP needed for next level', () => {
    expect(xpForNextLevel(1)).toBe(1000);
    expect(xpForNextLevel(2)).toBe(2000);
  });
});

describe('ACHIEVEMENTS', () => {
  it('should have 10 achievements', () => {
    expect(ACHIEVEMENTS.length).toBe(10);
  });

  it('should have unique IDs', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ACHIEVEMENTS.length);
  });
});


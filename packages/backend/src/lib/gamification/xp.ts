/**
 * Gamification XP System
 * Calculates XP, levels, achievements for Vortex Protocol
 */

import { z } from 'zod';

// XP action types
export const ActionType = z.enum([
  'first_scan',
  'daily_scan', 
  'swap_dust',
  'hide_risk',
  'burn_micro',
  'clean_portfolio',
  'referral',
  'daily_mission',
  'achievement_unlock'
]);

export type ActionType = z.infer<typeof ActionType>;

// XP values for different actions
export const XP_VALUES: Record<ActionType, number> = {
  first_scan: 100,
  daily_scan: 25,
  swap_dust: 50,
  hide_risk: 75,
  burn_micro: 25,
  clean_portfolio: 200,
  referral: 250,
  daily_mission: 50,
  achievement_unlock: 100
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, xpToNext: 500 },
  { level: 2, xp: 500, xpToNext: 500 },
  { level: 3, xp: 1000, xpToNext: 500 },
  { level: 4, xp: 1500, xpToNext: 500 },
  { level: 5, xp: 2000, xpToNext: 1000 },
  { level: 6, xp: 2500, xpToNext: 1000 },
  { level: 7, xp: 3500, xpToNext: 1000 },
  { level: 8, xp: 4500, xpToNext: 1000 },
  { level: 9, xp: 5500, xpToNext: 1000 },
  { level: 10, xp: 6500, xpToNext: 1000 },
  { level: 11, xp: 7500, xpToNext: 2000 },
  { level: 12, xp: 9500, xpToNext: 2000 },
  { level: 13, xp: 11500, xpToNext: 2000 },
  { level: 14, xp: 13500, xpToNext: 2000 },
  { level: 15, xp: 15500, xpToNext: 2000 },
  { level: 16, xp: 17500, xpToNext: 2000 },
  { level: 17, xp: 19500, xpToNext: 2000 },
  { level: 18, xp: 21500, xpToNext: 2000 },
  { level: 19, xp: 23500, xpToNext: 2000 },
  { level: 20, xp: 25500, xpToNext: 2500 },
];

// Achievement definitions
export const ACHIEVEMENTS = [
  {
    id: 'first_scan',
    name: 'First Scanner',
    description: 'Complete your first portfolio scan',
    xpReward: 50,
    type: 'common' as const,
    icon: '🔍'
  },
  {
    id: 'dust_buster',
    name: 'Dust Buster',
    description: 'Swap 10+ dust tokens',
    xpReward: 500,
    type: 'rare' as const,
    icon: '🧹'
  },
  {
    id: 'risk_terminator',
    name: 'Risk Terminator',
    description: 'Hide 50+ risk tokens',
    xpReward: 1000,
    type: 'epic' as const,
    icon: '🛡️'
  },
  {
    id: 'premium_collector',
    name: 'Premium Collector',
    description: 'Hold 5+ premium assets',
    xpReward: 5000,
    type: 'legendary' as const,
    icon: '💎'
  },
  {
    id: 'grand_master',
    name: 'Grand Master Cleaner',
    description: 'Reach level 100',
    xpReward: 10000,
    type: 'mythic' as const,
    icon: '👑'
  }
];

export interface UserXP {
  userId: string;
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  streakDays: number;
  lastScanDate?: Date;
  achievements: string[];
}

export interface XPAction {
  userId: string;
  type: ActionType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Calculate XP with multipliers
 */
export function calculateXP(action: ActionType, userXP: UserXP): number {
  const baseXP = XP_VALUES[action];
  
  // Streak multiplier: +10% per day (max 100%)
  const streakMultiplier = 1 + Math.min(userXP.streakDays * 0.1, 1);
  
  // Level multiplier: +5% per level above 10 (max 50%)
  const levelMultiplier = 1 + Math.max(0, (userXP.level - 10) * 0.05);
  
  const totalXP = Math.floor(baseXP * streakMultiplier * levelMultiplier);
  
  return totalXP;
}

/**
 * Get user level from total XP
 */
export function getLevelFromXP(totalXP: number): { level: number; xpToNext: number } {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = LEVEL_THRESHOLDS[i];
    if (threshold && totalXP >= threshold.xp) {
      return {
        level: threshold.level,
        xpToNext: threshold.xpToNext
      };
    }
  }
  
  return { level: 1, xpToNext: 500 };
}

/**
 * Check and unlock achievements
 */
export function checkAchievements(
  userXP: UserXP,
  action: ActionType,
  metadata?: Record<string, any>
): string[] {
  const newAchievements: string[] = [];
  
  // First scan achievement
  if (action === 'first_scan' && !userXP.achievements.includes('first_scan')) {
    newAchievements.push('first_scan');
  }
  
  // Dust buster achievement
  if (action === 'swap_dust' && metadata?.dustSwapped && metadata.dustSwapped >= 10 && !userXP.achievements.includes('dust_buster')) {
    newAchievements.push('dust_buster');
  }
  
  // Risk terminator achievement
  if (action === 'hide_risk' && metadata?.riskHidden && metadata.riskHidden >= 50 && !userXP.achievements.includes('risk_terminator')) {
    newAchievements.push('risk_terminator');
  }
  
  // Premium collector achievement
  if (action === 'daily_scan' && metadata?.premiumCount && metadata.premiumCount >= 5 && !userXP.achievements.includes('premium_collector')) {
    newAchievements.push('premium_collector');
  }
  
  // Grand master achievement
  if (userXP.level >= 100 && !userXP.achievements.includes('grand_master')) {
    newAchievements.push('grand_master');
  }
  
  return newAchievements;
}

/**
 * Generate daily missions
 */
export function generateDailyMissions(_userXP: UserXP) {
  const missions = [
    {
      id: 'daily_scan',
      title: 'Daily Portfolio Scan',
      description: 'Scan your portfolio today',
      xpReward: 25,
      completed: false,
      type: 'scan' as const
    },
    {
      id: 'swap_one',
      title: 'Swap One Token',
      description: 'Swap at least one dust token',
      xpReward: 50,
      completed: false,
      type: 'swap' as const
    },
    {
      id: 'hide_three',
      title: 'Hide Risky Tokens',
      description: 'Hide 3 or more risk tokens',
      xpReward: 75,
      completed: false,
      type: 'hide' as const
    }
  ];
  
  return missions;
}

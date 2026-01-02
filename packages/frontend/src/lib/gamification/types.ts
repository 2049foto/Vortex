/**
 * Vortex Gamification - Type Definitions
 * 73% retention boost system
 */

// XP actions
export type XPAction = 
  | 'SCAN'
  | 'SWAP_DUST'
  | 'HIDE_RISK'
  | 'BURN_MICRO'
  | 'DAILY_LOGIN'
  | 'REFER_FRIEND'
  | 'SHARE_PORTFOLIO'
  | 'ACHIEVEMENT';

// XP amounts per action
export const XP_AMOUNTS: Record<XPAction, number> = {
  SCAN: 25,
  SWAP_DUST: 50,
  HIDE_RISK: 75,
  BURN_MICRO: 30,
  DAILY_LOGIN: 10,
  REFER_FRIEND: 200,
  SHARE_PORTFOLIO: 100,
  ACHIEVEMENT: 0, // Varies per achievement
};

// Achievement types
export type AchievementId =
  | 'FIRST_SCAN'
  | 'DUST_DESTROYER'
  | 'RISK_TERMINATOR'
  | 'PORTFOLIO_MASTER'
  | 'CHAIN_CONQUEROR'
  | 'PREMIUM_COLLECTOR'
  | 'CLEAN_PORTFOLIO'
  | 'BURN_LEGEND'
  | 'SWAP_KING'
  | 'STREAK_MASTER';

// Achievement definition
export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  xp: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: AchievementCondition;
  unlockedAt?: number;
}

export interface AchievementCondition {
  type: 'scans' | 'swaps' | 'hides' | 'burns' | 'streak' | 'premium' | 'chains' | 'clean';
  threshold: number;
}

// All achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_SCAN',
    name: 'First Scanner',
    description: 'Scan your portfolio for the first time',
    icon: '🔍',
    xp: 50,
    rarity: 'common',
    condition: { type: 'scans', threshold: 1 },
  },
  {
    id: 'DUST_DESTROYER',
    name: 'Dust Destroyer',
    description: 'Swap 10 dust tokens',
    icon: '💨',
    xp: 200,
    rarity: 'rare',
    condition: { type: 'swaps', threshold: 10 },
  },
  {
    id: 'RISK_TERMINATOR',
    name: 'Risk Terminator',
    description: 'Hide 50 risk tokens',
    icon: '🛡️',
    xp: 500,
    rarity: 'epic',
    condition: { type: 'hides', threshold: 50 },
  },
  {
    id: 'PORTFOLIO_MASTER',
    name: 'Portfolio Master',
    description: 'Achieve 100% clean portfolio',
    icon: '🏆',
    xp: 1000,
    rarity: 'legendary',
    condition: { type: 'clean', threshold: 100 },
  },
  {
    id: 'CHAIN_CONQUEROR',
    name: 'Chain Conqueror',
    description: 'Scan tokens on all 9 chains',
    icon: '⛓️',
    xp: 500,
    rarity: 'epic',
    condition: { type: 'chains', threshold: 9 },
  },
  {
    id: 'PREMIUM_COLLECTOR',
    name: 'Premium Collector',
    description: 'Own 5+ premium assets',
    icon: '💎',
    xp: 300,
    rarity: 'rare',
    condition: { type: 'premium', threshold: 5 },
  },
  {
    id: 'CLEAN_PORTFOLIO',
    name: 'Clean Portfolio',
    description: 'Zero risk tokens in portfolio',
    icon: '✨',
    xp: 200,
    rarity: 'rare',
    condition: { type: 'clean', threshold: 0 },
  },
  {
    id: 'BURN_LEGEND',
    name: 'Burn Legend',
    description: 'Burn 100 micro tokens',
    icon: '🔥',
    xp: 500,
    rarity: 'epic',
    condition: { type: 'burns', threshold: 100 },
  },
  {
    id: 'SWAP_KING',
    name: 'Swap King',
    description: 'Swap 50 dust tokens',
    icon: '👑',
    xp: 750,
    rarity: 'epic',
    condition: { type: 'swaps', threshold: 50 },
  },
  {
    id: 'STREAK_MASTER',
    name: 'Streak Master',
    description: 'Login for 30 consecutive days',
    icon: '🔥',
    xp: 1000,
    rarity: 'legendary',
    condition: { type: 'streak', threshold: 30 },
  },
];

// Daily mission
export interface DailyMission {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  type: XPAction;
  target: number;
  progress: number;
  completed: boolean;
  expiresAt: number;
}

// User gamification state
export interface UserGamification {
  address: string;
  xp: number;
  totalXp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  
  // Stats
  stats: {
    scans: number;
    swaps: number;
    hides: number;
    burns: number;
    chainsScanned: string[];
    premiumCount: number;
    cleanScore: number;
  };
  
  // Achievements
  achievements: {
    id: AchievementId;
    unlockedAt: number;
  }[];
  
  // Daily missions
  dailyMissions: DailyMission[];
  
  // Referrals
  referrals: string[];
  referredBy?: string;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  address: string;
  xp: number;
  level: number;
  streak: number;
  achievements: number;
}

// Level calculation
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

// XP for next level
export function xpForNextLevel(level: number): number {
  return level * 1000;
}

// Progress to next level (0-100)
export function levelProgress(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const currentLevelXp = (currentLevel - 1) * 1000;
  const nextLevelXp = currentLevel * 1000;
  return Math.floor(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100);
}


/**
 * Vortex Gamification Engine
 * XP, Achievements, Missions, Leaderboard
 */

import {
  type XPAction,
  type UserGamification,
  type DailyMission,
  type Achievement,
  ACHIEVEMENTS,
  XP_AMOUNTS,
  calculateLevel,
} from './types';
import type { ScanResult } from '../scanner/types';

// Storage keys
const STORAGE_KEY = 'vortex_gamification';
const LEADERBOARD_KEY = 'vortex_leaderboard';

class GamificationEngine {
  /**
   * Get or create user gamification state
   */
  getUser(address: string): UserGamification {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}:${address}`);
      if (stored) {
        return JSON.parse(stored) as UserGamification;
      }
    } catch {
      // Invalid JSON, create new user
    }
    
    return this.createUser(address);
  }

  /**
   * Create new user
   */
  private createUser(address: string): UserGamification {
    const user: UserGamification = {
      address,
      xp: 0,
      totalXp: 0,
      level: 1,
      streak: 0,
      lastLoginDate: '',
      stats: {
        scans: 0,
        swaps: 0,
        hides: 0,
        burns: 0,
        chainsScanned: [],
        premiumCount: 0,
        cleanScore: 0,
      },
      achievements: [],
      dailyMissions: this.generateDailyMissions(),
      referrals: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    this.saveUser(user);
    return user;
  }

  /**
   * Save user state
   */
  private saveUser(user: UserGamification): void {
    user.updatedAt = Date.now();
    localStorage.setItem(`${STORAGE_KEY}:${user.address}`, JSON.stringify(user));
  }

  /**
   * Award XP for an action
   */
  awardXP(address: string, action: XPAction, customAmount?: number): {
    xpAwarded: number;
    newLevel: boolean;
    newXp: number;
    level: number;
  } {
    const user = this.getUser(address);
    const xpAmount = customAmount ?? XP_AMOUNTS[action];
    
    const oldLevel = user.level;
    user.xp += xpAmount;
    user.totalXp += xpAmount;
    user.level = calculateLevel(user.xp);
    
    // Update stats
    switch (action) {
      case 'SCAN':
        user.stats.scans++;
        break;
      case 'SWAP_DUST':
        user.stats.swaps++;
        break;
      case 'HIDE_RISK':
        user.stats.hides++;
        break;
      case 'BURN_MICRO':
        user.stats.burns++;
        break;
    }
    
    // Update daily mission progress
    this.updateMissionProgress(user, action);
    
    this.saveUser(user);
    
    return {
      xpAwarded: xpAmount,
      newLevel: user.level > oldLevel,
      newXp: user.xp,
      level: user.level,
    };
  }

  /**
   * Check and award achievements based on scan result
   */
  checkAchievements(address: string, scanResult: ScanResult): Achievement[] {
    const user = this.getUser(address);
    const newAchievements: Achievement[] = [];
    
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (user.achievements.some(a => a.id === achievement.id)) {
        continue;
      }
      
      let unlocked = false;
      
      switch (achievement.condition.type) {
        case 'scans':
          unlocked = user.stats.scans >= achievement.condition.threshold;
          break;
        case 'swaps':
          unlocked = user.stats.swaps >= achievement.condition.threshold;
          break;
        case 'hides':
          unlocked = user.stats.hides >= achievement.condition.threshold;
          break;
        case 'burns':
          unlocked = user.stats.burns >= achievement.condition.threshold;
          break;
        case 'streak':
          unlocked = user.streak >= achievement.condition.threshold;
          break;
        case 'premium':
          unlocked = scanResult.summary.premium.count >= achievement.condition.threshold;
          break;
        case 'chains':
          unlocked = user.stats.chainsScanned.length >= achievement.condition.threshold;
          break;
        case 'clean':
          if (achievement.id === 'CLEAN_PORTFOLIO') {
            unlocked = scanResult.summary.risk.count === 0;
          } else {
            const cleanScore = scanResult.summary.totalTokens > 0
              ? 100 - (scanResult.summary.risk.count / scanResult.summary.totalTokens) * 100
              : 100;
            unlocked = cleanScore >= achievement.condition.threshold;
          }
          break;
      }
      
      if (unlocked) {
        user.achievements.push({
          id: achievement.id,
          unlockedAt: Date.now(),
        });
        user.xp += achievement.xp;
        user.totalXp += achievement.xp;
        user.level = calculateLevel(user.xp);
        newAchievements.push(achievement);
      }
    }
    
    if (newAchievements.length > 0) {
      this.saveUser(user);
    }
    
    return newAchievements;
  }

  /**
   * Track daily login and streak
   */
  trackLogin(address: string): { streakUpdated: boolean; newStreak: number } {
    const user = this.getUser(address);
    const todayParts = new Date().toISOString().split('T');
    const today = todayParts[0] ?? '';
    
    if (user.lastLoginDate === today) {
      return { streakUpdated: false, newStreak: user.streak };
    }
    
    const yesterdayParts = new Date(Date.now() - 86400000).toISOString().split('T');
    const yesterday = yesterdayParts[0] ?? '';
    
    if (user.lastLoginDate === yesterday) {
      user.streak++;
    } else {
      user.streak = 1;
    }
    
    user.lastLoginDate = today;
    
    // Award daily login XP
    this.awardXP(address, 'DAILY_LOGIN');
    
    this.saveUser(user);
    
    return { streakUpdated: true, newStreak: user.streak };
  }

  /**
   * Generate daily missions
   */
  private generateDailyMissions(): DailyMission[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return [
      {
        id: 'daily_scan',
        name: 'Daily Scan',
        description: 'Scan your portfolio',
        icon: '🔍',
        xp: 25,
        type: 'SCAN',
        target: 1,
        progress: 0,
        completed: false,
        expiresAt: tomorrow.getTime(),
      },
      {
        id: 'daily_swap',
        name: 'Dust Cleaner',
        description: 'Swap 1 dust token',
        icon: '🔄',
        xp: 50,
        type: 'SWAP_DUST',
        target: 1,
        progress: 0,
        completed: false,
        expiresAt: tomorrow.getTime(),
      },
      {
        id: 'daily_hide',
        name: 'Risk Hunter',
        description: 'Hide 3 risk tokens',
        icon: '👁️',
        xp: 75,
        type: 'HIDE_RISK',
        target: 3,
        progress: 0,
        completed: false,
        expiresAt: tomorrow.getTime(),
      },
    ];
  }

  /**
   * Update mission progress
   */
  private updateMissionProgress(user: UserGamification, action: XPAction): void {
    const now = Date.now();
    const firstMission = user.dailyMissions[0];
    
    // Reset expired missions
    if (user.dailyMissions.length === 0 || !firstMission || firstMission.expiresAt < now) {
      user.dailyMissions = this.generateDailyMissions();
    }
    
    // Update progress
    for (const mission of user.dailyMissions) {
      if (mission.type === action && !mission.completed) {
        mission.progress++;
        if (mission.progress >= mission.target) {
          mission.completed = true;
          // Bonus XP for completing mission already awarded via action
        }
      }
    }
  }

  /**
   * Get user's unlocked achievements
   */
  getUnlockedAchievements(address: string): Achievement[] {
    const user = this.getUser(address);
    return ACHIEVEMENTS.filter(a => 
      user.achievements.some(ua => ua.id === a.id)
    ).map(a => ({
      ...a,
      unlockedAt: user.achievements.find(ua => ua.id === a.id)?.unlockedAt,
    }));
  }

  /**
   * Get locked achievements
   */
  getLockedAchievements(address: string): Achievement[] {
    const user = this.getUser(address);
    return ACHIEVEMENTS.filter(a => 
      !user.achievements.some(ua => ua.id === a.id)
    );
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(): { address: string; xp: number; level: number }[] {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
        return JSON.parse(stored) as { address: string; xp: number; level: number }[];
      }
    } catch {
      // Invalid JSON
    }
    return [];
  }

  /**
   * Update leaderboard with user
   */
  updateLeaderboard(address: string): void {
    const user = this.getUser(address);
    const leaderboard = this.getLeaderboard();
    
    const existingIndex = leaderboard.findIndex(e => e.address === address);
    if (existingIndex >= 0) {
      const existing = leaderboard[existingIndex];
      if (existing) {
        existing.xp = user.totalXp;
        existing.level = user.level;
      }
    } else {
      leaderboard.push({ address, xp: user.totalXp, level: user.level });
    }
    
    // Sort by XP descending
    leaderboard.sort((a, b) => b.xp - a.xp);
    
    // Keep top 100
    const top100 = leaderboard.slice(0, 100);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top100));
  }
}

// Export singleton
export const gamification = new GamificationEngine();

/**
 * Gamification Bar Component
 * XP progress, level, streak display
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge, Progress, Tooltip } from '@/components/ui';
import { calculateLevel, levelProgress, xpForNextLevel } from '@/lib/gamification/types';

interface GamificationBarProps {
  xp: number;
  level: number;
  streak: number;
  className?: string;
}

export function GamificationBar({ xp, level, streak, className }: GamificationBarProps) {
  const progress = levelProgress(xp);
  const nextLevelXp = xpForNextLevel(level);
  const currentLevelXp = (level - 1) * 1000;
  const xpInLevel = xp - currentLevelXp;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Level Badge */}
      <Tooltip content={`Level ${level} • ${xpInLevel}/${nextLevelXp - currentLevelXp} XP`}>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl text-white">
          <span className="text-lg font-bold">⭐</span>
          <div className="flex flex-col">
            <span className="text-xs opacity-80">Level</span>
            <span className="text-lg font-bold -mt-1">{level}</span>
          </div>
        </div>
      </Tooltip>

      {/* XP Progress */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-neutral-600 font-medium">XP Progress</span>
          <span className="text-neutral-900 font-bold">{xp.toLocaleString()} XP</span>
        </div>
        <Progress
          value={progress}
          variant="gradient"
          size="sm"
          animated
        />
        <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
          <span>Level {level}</span>
          <span>Level {level + 1}</span>
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <Tooltip content={`${streak} day login streak!`}>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-amber-700">{streak}</span>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

// Compact version for mobile
export function GamificationBarCompact({ xp, level, streak }: GamificationBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="primary" size="md">
        ⭐ Lv.{level}
      </Badge>
      <Badge variant="default" size="md">
        {xp.toLocaleString()} XP
      </Badge>
      {streak > 0 && (
        <Badge variant="warning" size="md">
          🔥 {streak}
        </Badge>
      )}
    </div>
  );
}


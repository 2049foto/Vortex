/**
 * XP Bar Component
 * Shows user XP, level, and progress
 */

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { Trophy, Zap } from 'lucide-react';

interface XPBarProps {
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak?: number;
}

export function XPBar({ xp, level, xpToNextLevel, streak }: XPBarProps) {
  const progress = (xp % 100) / xpToNextLevel;
  const currentLevelXP = xp % 100;

  return (
    <Card padding="sm" className="mb-4">
      <div className="flex items-center gap-4">
        {/* Level Badge */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {level}
          </div>
          <div>
            <p className="text-xs text-neutral-500">Level</p>
            <p className="text-sm font-semibold text-neutral-900">Level {level}</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-600">XP Progress</span>
            <span className="text-xs font-medium text-neutral-700">
              {currentLevelXP} / {xpToNextLevel} XP
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Total XP */}
        <div className="text-right">
          <p className="text-xs text-neutral-500">Total XP</p>
          <p className="text-sm font-bold text-neutral-900 flex items-center gap-1">
            <Zap size={14} className="text-yellow-500" />
            {xp.toLocaleString()}
          </p>
        </div>

        {/* Streak */}
        {streak && streak > 0 && (
          <Tooltip content={`${streak} day streak`}>
            <Badge variant="warning" size="sm" className="flex items-center gap-1">
              🔥 {streak}
            </Badge>
          </Tooltip>
        )}
      </div>
    </Card>
  );
}


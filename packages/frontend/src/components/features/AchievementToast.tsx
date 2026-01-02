/**
 * Achievement Toast Component
 * Shows achievement unlock with confetti
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, X } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const rarityColors = {
  common: 'bg-neutral-100 text-neutral-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-yellow-100 text-yellow-700',
};

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <Card padding="md" className="relative overflow-hidden">
          {/* Confetti effect background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
            <div className="absolute top-0 left-3/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
          </div>

          <div className="relative flex items-start gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
              {achievement.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="font-semibold text-neutral-900">{achievement.name}</p>
                  <p className="text-sm text-neutral-600">{achievement.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-neutral-600 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="success"
                  size="sm"
                  className={rarityColors[achievement.rarity]}
                >
                  +{achievement.xpReward} XP
                </Badge>
                <Badge variant="info" size="sm">
                  <Trophy size={12} className="mr-1" />
                  {achievement.rarity}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

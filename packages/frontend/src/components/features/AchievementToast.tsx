/**
 * Achievement Toast Component
 * Celebratory achievement notifications
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/lib/gamification/types';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // Play sound effect
      try {
        const audio = new Audio('/sounds/achievement.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}

      // Auto close after 5s
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const rarityColors = {
    common: 'from-neutral-400 to-neutral-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-amber-600',
  };

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      )}
    >
      <div className={cn(
        'flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl',
        'bg-gradient-to-r',
        rarityColors[achievement.rarity]
      )}>
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#9370DB'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="relative z-10 text-5xl animate-bounce">
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <p className="text-sm font-medium text-white/80 uppercase tracking-wider">
            Achievement Unlocked!
          </p>
          <p className="text-xl font-bold text-white">
            {achievement.name}
          </p>
          <p className="text-sm text-white/80">
            +{achievement.xp} XP • {achievement.rarity.toUpperCase()}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="relative z-10 p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Add confetti keyframes to globals.css:
// @keyframes confetti {
//   0% { transform: translateY(0) rotate(0deg); opacity: 1; }
//   100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
// }
// .animate-confetti { animation: confetti 3s ease-out forwards; }


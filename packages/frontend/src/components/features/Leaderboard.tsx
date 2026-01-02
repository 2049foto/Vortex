/**
 * Leaderboard Component
 * Top users by XP (Redis sorted set)
 */

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  address: string;
  xp: number;
  level: number;
  streak?: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserAddress?: string;
}

export function Leaderboard({ entries, currentUserAddress }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={20} />;
    if (rank === 2) return <Medal className="text-gray-400" size={20} />;
    if (rank === 3) return <Award className="text-orange-500" size={20} />;
    return null;
  };

  return (
    <Card padding="lg">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Leaderboard</h2>
      <div className="space-y-2">
        {entries.map((entry) => {
          const isCurrentUser = entry.address === currentUserAddress;
          return (
            <div
              key={entry.address}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                isCurrentUser ? 'bg-blue-50 border-2 border-blue-500' : 'bg-neutral-50 hover:bg-neutral-100'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank) || (
                  <span className="text-sm font-bold text-neutral-500">#{entry.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <Avatar address={entry.address} size="md" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 truncate">
                  {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="info" size="sm">
                    Level {entry.level}
                  </Badge>
                  {entry.streak && entry.streak > 0 && (
                    <Badge variant="warning" size="sm">
                      🔥 {entry.streak}
                    </Badge>
                  )}
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="text-sm font-bold text-neutral-900">
                  {entry.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}


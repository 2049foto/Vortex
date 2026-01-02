/**
 * Daily Missions Component
 * Dynamic quests for users
 */

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Circle } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
}

interface DailyMissionsProps {
  missions: Mission[];
  onClaim?: (missionId: string) => void;
}

export function DailyMissions({ missions, onClaim }: DailyMissionsProps) {
  return (
    <Card padding="lg">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Daily Missions</h2>
      <div className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`p-4 rounded-lg border ${
              mission.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="mt-1">
                {mission.completed ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : (
                  <Circle className="text-neutral-400" size={20} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-neutral-900">{mission.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{mission.description}</p>
                  </div>
                  <Badge variant="success" size="sm">
                    +{mission.xpReward} XP
                  </Badge>
                </div>

                {/* Progress */}
                {!mission.completed && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                      <span>Progress</span>
                      <span>
                        {mission.progress} / {mission.target}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${Math.min((mission.progress / mission.target) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Claim Button */}
                {mission.completed && onClaim && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onClaim(mission.id)}
                    className="mt-3"
                  >
                    Claim Reward
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}


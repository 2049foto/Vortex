/**
 * Summary Cards Component
 * Portfolio overview with category breakdowns
 */

import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { Card, Badge, Button } from '@/components/ui';
import type { ScanResult } from '@/lib/scanner/types';

interface SummaryCardsProps {
  data: ScanResult | null;
  onQuickAction?: (action: 'swap-dust' | 'hide-risk' | 'burn-micro') => void;
  className?: string;
}

export function SummaryCards({ data, onQuickAction, className }: SummaryCardsProps) {
  if (!data) {
    return (
      <div className={cn('grid sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
        {[1, 2, 3, 4].map(i => (
          <Card key={i} padding="md" className="animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-20 mb-2" />
            <div className="h-8 bg-neutral-200 rounded w-32 mb-4" />
            <div className="h-3 bg-neutral-200 rounded w-24" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Portfolio',
      value: data.summary.totalValue,
      count: data.summary.totalTokens,
      icon: '💰',
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50',
    },
    {
      label: 'Premium Assets',
      value: data.summary.premium.value,
      count: data.summary.premium.count,
      icon: '💎',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      badge: 'HOLD',
    },
    {
      label: 'Dust Tokens',
      value: data.summary.dust.value,
      count: data.summary.dust.count,
      icon: '🌾',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      action: 'swap-dust' as const,
      actionLabel: 'Swap All',
    },
    {
      label: 'Risk Tokens',
      value: data.summary.risk.value,
      count: data.summary.risk.count,
      icon: '⚠️',
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      action: 'hide-risk' as const,
      actionLabel: 'Hide All',
    },
  ];

  return (
    <div className={cn('grid sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {cards.map((card, i) => (
        <Card
          key={i}
          variant="elevated"
          padding="md"
          className={cn('relative overflow-hidden', card.count > 0 && 'hover:shadow-lg transition-shadow')}
        >
          {/* Background Gradient */}
          <div className={cn('absolute inset-0 opacity-5', `bg-gradient-to-br ${card.color}`)} />

          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl', card.bgColor)}>
                {card.icon}
              </div>
              {card.badge && (
                <Badge variant="success" size="sm">{card.badge}</Badge>
              )}
              {card.count > 0 && card.action && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onQuickAction?.(card.action!)}
                >
                  {card.actionLabel}
                </Button>
              )}
            </div>

            {/* Value */}
            <p className="text-2xl font-bold text-neutral-900 mb-1">
              {formatCurrency(card.value)}
            </p>

            {/* Label & Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="text-sm font-medium text-neutral-700">
                {card.count} {card.count === 1 ? 'token' : 'tokens'}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Compact summary for mobile
export function SummaryCompact({ data }: { data: ScanResult | null }) {
  if (!data) return null;

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      <Badge variant="primary" size="md">
        💰 {formatCurrency(data.summary.totalValue)}
      </Badge>
      <Badge variant="success" size="md">
        💎 {data.summary.premium.count}
      </Badge>
      <Badge variant="warning" size="md">
        🌾 {data.summary.dust.count}
      </Badge>
      <Badge variant="danger" size="md">
        ⚠️ {data.summary.risk.count}
      </Badge>
    </div>
  );
}


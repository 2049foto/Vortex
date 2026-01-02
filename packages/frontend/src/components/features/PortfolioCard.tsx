/**
 * Portfolio Card component for Vortex Protocol
 */

import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Wallet, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonPortfolioHeader } from '@/components/ui/Skeleton';
import { formatUSD, formatPercent, getPriceChangeColor, getPriceChangeBg } from '@/lib/format';
import { usePortfolio } from '@/hooks/usePortfolio';

/**
 * Portfolio Card component showing total value and change
 */
export function PortfolioCard(): React.ReactElement {
  const { stats, isLoading, refresh, error } = usePortfolio();

  if (isLoading) {
    return <SkeletonPortfolioHeader />;
  }

  if (error) {
    return (
      <Card variant="default" padding="lg">
        <div className="text-center py-8">
          <p className="text-text-secondary mb-4">Failed to load portfolio</p>
          <Button onClick={refresh} variant="secondary" size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  const isPositive = stats.change24h >= 0;

  return (
    <Card variant="gradient" padding="lg" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Portfolio Value */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Wallet className="w-5 h-5 text-primary-400" />
            </div>
            <span className="text-sm font-medium text-text-secondary">Total Balance</span>
          </div>
          
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-text-primary">
              {formatUSD(stats.totalValue)}
            </span>
            <div
              className={clsx(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium',
                getPriceChangeBg(stats.change24h),
                getPriceChangeColor(stats.change24h)
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{formatPercent(stats.change24hPercent)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
            <span>
              24h Change:{' '}
              <span className={getPriceChangeColor(stats.change24h)}>
                {isPositive ? '+' : ''}{formatUSD(stats.change24h)}
              </span>
            </span>
            <span>•</span>
            <span>{stats.tokenCount} tokens</span>
          </div>
        </div>

        {/* Right: Actions & Quick Stats */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Top Gainer */}
          {stats.topGainer && (
            <div className="p-3 bg-background-elevated rounded-xl min-w-[140px]">
              <span className="text-xs text-text-muted block mb-1">Top Gainer</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-success-light/20 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-success-light" />
                </div>
                <div>
                  <span className="text-sm font-medium text-text-primary block">
                    {stats.topGainer.symbol}
                  </span>
                  <span className="text-xs text-success-light">
                    {formatPercent(stats.topGainer.change24hPercent)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Top Loser */}
          {stats.topLoser && stats.topLoser.change24hPercent < 0 && (
            <div className="p-3 bg-background-elevated rounded-xl min-w-[140px]">
              <span className="text-xs text-text-muted block mb-1">Top Loser</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-danger-light/20 flex items-center justify-center">
                  <TrendingDown className="w-3 h-3 text-danger-light" />
                </div>
                <div>
                  <span className="text-sm font-medium text-text-primary block">
                    {stats.topLoser.symbol}
                  </span>
                  <span className="text-xs text-danger-light">
                    {formatPercent(stats.topLoser.change24hPercent)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            onClick={refresh}
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="self-start"
          >
            Refresh
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Mini portfolio card for compact displays
 */
export function PortfolioCardMini(): React.ReactElement {
  const { stats, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="p-4 bg-background-card rounded-xl border border-border animate-pulse">
        <div className="h-4 bg-background-elevated rounded w-20 mb-2" />
        <div className="h-6 bg-background-elevated rounded w-32" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-background-card rounded-xl border border-border">
      <span className="text-xs text-text-muted block mb-1">Portfolio Value</span>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-text-primary">
          {formatUSD(stats.totalValue)}
        </span>
        <span
          className={clsx(
            'text-xs font-medium',
            getPriceChangeColor(stats.change24h)
          )}
        >
          {formatPercent(stats.change24hPercent)}
        </span>
      </div>
    </div>
  );
}

export default PortfolioCard;


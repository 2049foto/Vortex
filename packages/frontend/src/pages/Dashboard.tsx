/**
 * Dashboard page for Vortex Protocol
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { ArrowRight, TrendingUp, Shield, Bell } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TokenScanner } from '@/components/features/TokenScanner';
import { PortfolioCard } from '@/components/features/PortfolioCard';
import { HoldingsTable } from '@/components/features/HoldingsTable';
import { useAuthStore } from '@/stores/auth';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatUSD } from '@/lib/format';

/**
 * Quick stat card component
 */
interface QuickStatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  href?: string;
}

function QuickStat({ label, value, icon, trend, href }: QuickStatProps): React.ReactElement {
  const content = (
    <Card
      variant="default"
      padding="md"
      hoverable={!!href}
      clickable={!!href}
      className="h-full"
    >
      <div className="flex items-start justify-between">
        <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className={clsx(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trend >= 0
                ? 'bg-success-light/10 text-success-light'
                : 'bg-danger-light/10 text-danger-light'
            )}
          >
            {trend >= 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary mt-1">{label}</p>
      </div>
    </Card>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}

/**
 * Dashboard page component
 */
export default function Dashboard(): React.ReactElement {
  const { isAuthenticated, user } = useAuthStore();
  const { stats } = usePortfolio();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            {isAuthenticated
              ? `Welcome back! Here's your portfolio overview.`
              : 'Connect your wallet to see your portfolio.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/watchlist">
            <Button variant="secondary" size="sm">
              View Watchlist
            </Button>
          </Link>
          <Link to="/portfolio">
            <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Full Portfolio
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          label="Portfolio Value"
          value={formatUSD(stats.totalValue)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={stats.change24hPercent}
          href="/portfolio"
        />
        <QuickStat
          label="Tokens Held"
          value={stats.tokenCount}
          icon={<TrendingUp className="w-5 h-5" />}
          href="/portfolio"
        />
        <QuickStat
          label="Tokens Scanned"
          value="12"
          icon={<Shield className="w-5 h-5" />}
        />
        <QuickStat
          label="Active Alerts"
          value="3"
          icon={<Bell className="w-5 h-5" />}
          href="/alerts"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Scanner */}
        <div className="lg:col-span-1">
          <TokenScanner />
        </div>

        {/* Portfolio Summary */}
        <div className="lg:col-span-1 space-y-6">
          <PortfolioCard />

          {/* Recent Activity */}
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Recent Scans
              </h3>
              <Link
                to="/history"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { symbol: 'PEPE', status: 'safe', time: '2m ago' },
                { symbol: 'DOGE', status: 'safe', time: '15m ago' },
                { symbol: 'SHIB', status: 'warning', time: '1h ago' },
              ].map((scan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background-elevated rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                      {scan.symbol.slice(0, 2)}
                    </div>
                    <span className="font-medium text-text-primary">
                      {scan.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={clsx(
                        'text-xs px-2 py-0.5 rounded-full',
                        scan.status === 'safe'
                          ? 'bg-success-light/10 text-success-light'
                          : 'bg-warning-light/10 text-warning-light'
                      )}
                    >
                      {scan.status}
                    </span>
                    <span className="text-xs text-text-muted">{scan.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Holdings Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Your Holdings</h2>
          <Link to="/portfolio">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        </div>
        <HoldingsTable />
      </div>
    </div>
  );
}


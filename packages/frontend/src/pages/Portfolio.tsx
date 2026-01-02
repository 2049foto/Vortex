/**
 * Portfolio page for Vortex Protocol
 */

import React from 'react';
import { clsx } from 'clsx';
import { RefreshCw, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ChainSelect } from '@/components/ui/Select';
import { PortfolioCard } from '@/components/features/PortfolioCard';
import { HoldingsTable } from '@/components/features/HoldingsTable';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuthStore } from '@/stores/auth';
import type { Chain } from '@/types';

/**
 * Portfolio page component
 */
export default function Portfolio(): React.ReactElement {
  const { isAuthenticated } = useAuthStore();
  const {
    portfolio,
    isLoading,
    error,
    selectedChain,
    setChainFilter,
    refresh,
  } = usePortfolio();

  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChainFilter(e.target.value as Chain | 'all');
  };

  const handleExport = () => {
    if (!portfolio) return;

    const data = {
      address: portfolio.address,
      totalValueUSD: portfolio.totalValueUSD,
      tokens: portfolio.tokens,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${portfolio.address.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
          <Filter className="w-8 h-8 text-primary-400" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-text-secondary max-w-md mb-6">
          Connect your wallet to view your portfolio holdings across all supported
          chains.
        </p>
        <Button>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Portfolio</h1>
          <p className="text-sm text-text-secondary mt-1">
            Track your holdings and performance across all chains.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ChainSelect
            value={selectedChain}
            onChange={handleChainChange}
            includeAll
            size="sm"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={refresh}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!portfolio}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Card */}
      <PortfolioCard />

      {/* Holdings Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Holdings</h2>
          <span className="text-sm text-text-secondary">
            {portfolio?.tokens.length || 0} tokens
          </span>
        </div>
        <HoldingsTable />
      </div>

      {/* Performance Chart Placeholder */}
      <div className="p-6 bg-background-card rounded-2xl border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Performance (Coming Soon)
        </h3>
        <div className="h-64 flex items-center justify-center bg-background-elevated rounded-xl">
          <p className="text-text-muted">
            Portfolio performance chart will be available in the next update.
          </p>
        </div>
      </div>
    </div>
  );
}


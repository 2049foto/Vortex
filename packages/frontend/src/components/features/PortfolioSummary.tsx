/**
 * Portfolio Summary Component
 */

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import type { Portfolio } from '@/types';

interface PortfolioSummaryProps {
  data: Portfolio | null;
  loading: boolean;
}

export function PortfolioSummary({ data, loading }: PortfolioSummaryProps) {
  if (loading) {
    return (
      <Card padding="lg">
        <Skeleton height="1.5rem" className="mb-4" />
        <Skeleton height="2rem" className="mb-2" />
        <Skeleton height="1rem" width="60%" />
      </Card>
    );
  }
  
  if (!data) {
    return (
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Portfolio
        </h3>
        <p className="text-neutral-600">Connect wallet to view portfolio</p>
      </Card>
    );
  }
  
  const isPositive = data.change24hPercent >= 0;
  
  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Portfolio
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-neutral-600 mb-1">Total Value</p>
          <p className="text-3xl font-bold text-neutral-900">
            ${data.totalValueUSD.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isPositive ? 'success' : 'danger'}>
            {isPositive ? '+' : ''}
            {data.change24hPercent.toFixed(2)}%
          </Badge>
          <span className="text-sm text-neutral-600">
            {isPositive ? '+' : ''}${Math.abs(data.change24hUSD).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} (24h)
          </span>
        </div>
        
        <div className="pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 mb-2">Holdings</p>
          <p className="text-xl font-semibold text-neutral-900">
            {data.tokens?.length || 0} tokens
          </p>
        </div>
      </div>
    </Card>
  );
}


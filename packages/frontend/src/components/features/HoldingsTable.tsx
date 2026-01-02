/**
 * Holdings Table component for Vortex Protocol
 */

import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { formatUSD, formatTokenBalance, formatPercent, getPriceChangeColor, truncateAddress } from '@/lib/format';
import { usePortfolio } from '@/hooks/usePortfolio';
import type { TokenBalance } from '@/types';

type SortField = 'symbol' | 'balance' | 'value' | 'change';
type SortDirection = 'asc' | 'desc';

/**
 * Holdings Table component
 */
export function HoldingsTable(): React.ReactElement {
  const { portfolio, isLoading, error } = usePortfolio();
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedTokens = useMemo(() => {
    if (!portfolio?.tokens) return [];

    return [...portfolio.tokens].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'balance':
          comparison = a.balanceFormatted - b.balanceFormatted;
          break;
        case 'value':
          comparison = a.valueUSD - b.valueUSD;
          break;
        case 'change':
          comparison = a.change24hPercent - b.change24hPercent;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [portfolio?.tokens, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (isLoading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  if (error) {
    return (
      <Card padding="lg">
        <div className="text-center py-8">
          <p className="text-text-secondary">Failed to load holdings</p>
        </div>
      </Card>
    );
  }

  if (!sortedTokens.length) {
    return (
      <Card padding="lg">
        <div className="text-center py-8">
          <p className="text-text-secondary">No tokens found in portfolio</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-elevated border-b border-border">
            <tr>
              <SortableHeader
                label="Token"
                field="symbol"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                className="pl-4"
              />
              <SortableHeader
                label="Balance"
                field="balance"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <th className="py-3 px-4 text-xs font-medium text-text-muted text-right">
                Price
              </th>
              <SortableHeader
                label="Value"
                field="value"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="24h Change"
                field="change"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
                className="pr-4"
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTokens.map((token) => (
              <TokenRow key={token.address} token={token} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {sortedTokens.map((token) => (
          <TokenCard key={token.address} token={token} />
        ))}
      </div>
    </Card>
  );
}

/**
 * Sortable header component
 */
interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
  className?: string;
}

function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onSort,
  align = 'left',
  className,
}: SortableHeaderProps): React.ReactElement {
  const isActive = currentField === field;

  return (
    <th
      className={clsx(
        'py-3 px-4 text-xs font-medium text-text-muted cursor-pointer hover:text-text-primary transition-colors',
        align === 'right' && 'text-right',
        className
      )}
      onClick={() => onSort(field)}
    >
      <div
        className={clsx(
          'inline-flex items-center gap-1',
          align === 'right' && 'justify-end'
        )}
      >
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-50" />
        )}
      </div>
    </th>
  );
}

/**
 * Token row component
 */
function TokenRow({ token }: { token: TokenBalance }): React.ReactElement {
  return (
    <tr className="hover:bg-background-hover transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <span className="font-medium text-text-primary block">{token.symbol}</span>
            <span className="text-xs text-text-muted">{token.name}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="text-text-primary">{formatTokenBalance(token.balanceFormatted)}</span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="text-text-secondary">{formatUSD(token.priceUSD)}</span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="font-medium text-text-primary">{formatUSD(token.valueUSD)}</span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className={clsx('font-medium', getPriceChangeColor(token.change24hPercent))}>
          {formatPercent(token.change24hPercent)}
        </span>
      </td>
    </tr>
  );
}

/**
 * Token card component for mobile
 */
function TokenCard({ token }: { token: TokenBalance }): React.ReactElement {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
          {token.symbol.slice(0, 2)}
        </div>
        <div>
          <span className="font-medium text-text-primary block">{token.symbol}</span>
          <span className="text-xs text-text-muted">
            {formatTokenBalance(token.balanceFormatted)} @ {formatUSD(token.priceUSD)}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="font-medium text-text-primary block">{formatUSD(token.valueUSD)}</span>
        <span className={clsx('text-xs font-medium', getPriceChangeColor(token.change24hPercent))}>
          {formatPercent(token.change24hPercent)}
        </span>
      </div>
    </div>
  );
}

export default HoldingsTable;


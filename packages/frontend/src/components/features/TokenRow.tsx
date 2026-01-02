/**
 * Token Row Component (Memoized)
 * Individual token row for virtual scrolling
 */

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Badge, Avatar, Tooltip } from '@/components/ui';
import { getCategoryInfo, getActionInfo } from '@/lib/scanner/classifier';
import type { ScannedToken, TokenAction } from '@/lib/scanner/types';
import { CHAINS } from '@/lib/chains/config';
import { formatCurrency } from '@/lib/utils';

interface TokenRowProps {
  token: ScannedToken;
  isSelected: boolean;
  onSelect: (token: ScannedToken) => void;
  onAction: (action: TokenAction, token: ScannedToken) => void;
}

export const TokenRow = memo(function TokenRow({
  token,
  isSelected,
  onSelect,
  onAction,
}: TokenRowProps) {
  const categoryInfo = getCategoryInfo(token.category);
  const chainConfig = CHAINS[token.chain];

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100',
        isSelected && 'bg-sky-50'
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(token)}
        className="w-5 h-5 rounded border-neutral-300 text-sky-500 focus:ring-sky-500"
      />

      {/* Token Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar address={token.address} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-neutral-900 truncate">
              {token.symbol}
            </p>
            <Tooltip content={chainConfig?.name || token.chain}>
              <span className="text-lg">{chainConfig?.icon || '⚪'}</span>
            </Tooltip>
          </div>
          <p className="text-sm text-neutral-500 truncate">
            {token.name}
          </p>
        </div>
      </div>

      {/* Value */}
      <div className="text-right min-w-[100px]">
        <p className="font-semibold text-neutral-900">
          {formatCurrency(token.valueUSD)}
        </p>
        <p className="text-sm text-neutral-500">
          {token.balanceFormatted.toLocaleString()} tokens
        </p>
      </div>

      {/* Category Badge */}
      <Badge
        variant={
          token.category === 'PREMIUM' ? 'success' :
          token.category === 'RISK' ? 'danger' :
          token.category === 'DUST' ? 'warning' : 'default'
        }
        size="sm"
      >
        {categoryInfo.icon} {categoryInfo.label}
      </Badge>

      {/* Risk Score */}
      <div className="w-16 text-center">
        <div
          className={cn(
            'inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold',
            token.riskScore < 30 && 'bg-emerald-100 text-emerald-700',
            token.riskScore >= 30 && token.riskScore < 70 && 'bg-amber-100 text-amber-700',
            token.riskScore >= 70 && 'bg-red-100 text-red-700'
          )}
        >
          {token.riskScore}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {token.allowedActions.map(action => {
          const actionInfo = getActionInfo(action);
          return (
            <Tooltip key={action} content={actionInfo.label}>
              <button
                onClick={() => onAction(action, token)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                )}
              >
                {actionInfo.icon}
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return (
    prevProps.token.address === nextProps.token.address &&
    prevProps.token.balance === nextProps.token.balance &&
    prevProps.isSelected === nextProps.isSelected
  );
});


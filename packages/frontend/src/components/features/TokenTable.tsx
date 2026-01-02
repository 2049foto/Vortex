/**
 * Token Table Component
 * Virtualized token list with batch actions
 */

import React, { useState, useMemo, useRef, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import { Card, Badge, Button, Avatar, Tooltip, Switch } from '@/components/ui';
import { getCategoryInfo, getActionInfo } from '@/lib/scanner/classifier';
import type { ScannedToken, TokenCategory, TokenAction } from '@/lib/scanner/types';
import { CHAINS } from '@/lib/chains/config';

interface TokenTableProps {
  tokens: ScannedToken[];
  onBatchAction: (action: TokenAction, tokens: ScannedToken[]) => void;
  showHidden?: boolean;
  onToggleHidden?: (show: boolean) => void;
  className?: string;
}

export function TokenTable({
  tokens,
  onBatchAction,
  showHidden = false,
  onToggleHidden,
  className,
}: TokenTableProps) {
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'value' | 'risk' | 'chain'>('value');
  const [filterCategory, setFilterCategory] = useState<TokenCategory | 'ALL'>('ALL');
  const parentRef = useRef<HTMLDivElement>(null);

  // Filter and sort tokens
  const filteredTokens = useMemo(() => {
    let result = [...tokens];
    
    if (filterCategory !== 'ALL') {
      result = result.filter(t => t.category === filterCategory);
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.valueUSD - a.valueUSD;
        case 'risk':
          return b.riskScore - a.riskScore;
        case 'chain':
          return a.chain.localeCompare(b.chain);
        default:
          return 0;
      }
    });
    
    return result;
  }, [tokens, filterCategory, sortBy]);

  // Selection helpers
  const toggleSelect = (token: ScannedToken) => {
    const key = `${token.chain}:${token.address}`;
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedTokens(newSelected);
  };

  const selectAll = () => {
    setSelectedTokens(new Set(filteredTokens.map(t => `${t.chain}:${t.address}`)));
  };

  const clearSelection = () => {
    setSelectedTokens(new Set());
  };

  const selectedTokensList = filteredTokens.filter(t => 
    selectedTokens.has(`${t.chain}:${t.address}`)
  );

  // Get available batch actions for selection
  const availableActions = useMemo(() => {
    if (selectedTokensList.length === 0) return [];
    
    const actions = new Set<TokenAction>();
    for (const token of selectedTokensList) {
      for (const action of token.allowedActions) {
        actions.add(action);
      }
    }
    return Array.from(actions);
  }, [selectedTokensList]);

  // Virtual scrolling setup
  const virtualizer = useVirtualizer({
    count: filteredTokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Row height in pixels
    overscan: 5, // Render 5 extra items outside viewport
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            {(['ALL', 'PREMIUM', 'DUST', 'MICRO', 'RISK'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  filterCategory === cat
                    ? 'bg-white shadow-sm text-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                {cat === 'ALL' ? 'All' : getCategoryInfo(cat).icon}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium"
          >
            <option value="value">Sort: Value</option>
            <option value="risk">Sort: Risk</option>
            <option value="chain">Sort: Chain</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Show Hidden Toggle */}
          {onToggleHidden && (
            <Switch
              checked={showHidden}
              onChange={onToggleHidden}
              label="Show Hidden"
              size="sm"
            />
          )}

          {/* Selection Actions */}
          {selectedTokens.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="primary">{selectedTokens.size} selected</Badge>
              <Button variant="ghost" size="xs" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          )}

          {filteredTokens.length > 0 && selectedTokens.size === 0 && (
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Select All
            </Button>
          )}
        </div>
      </div>

      {/* Batch Actions Bar */}
      {selectedTokens.size > 0 && (
        <Card variant="glass" padding="md" className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-neutral-900">
              {selectedTokens.size} tokens selected
            </p>
            <p className="text-sm text-neutral-500">
              Total value: {formatCurrency(selectedTokensList.reduce((s, t) => s + t.valueUSD, 0))}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {availableActions.includes('SWAP') && (
              <Button
                size="sm"
                onClick={() => onBatchAction('SWAP', selectedTokensList)}
              >
                🔄 Swap All
              </Button>
            )}
            {availableActions.includes('HIDE') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onBatchAction('HIDE', selectedTokensList)}
              >
                👁️ Hide All
              </Button>
            )}
            {availableActions.includes('BURN') && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onBatchAction('BURN', selectedTokensList)}
              >
                🔥 Burn All
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Token List with Virtual Scrolling */}
      <Card padding="none">
        {filteredTokens.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            No tokens found
          </div>
        ) : (
          <div
            ref={parentRef}
            className="h-[600px] overflow-auto"
            style={{ contain: 'strict' }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const token = filteredTokens[virtualRow.index];
                if (!token) return null;

                const key = `${token.chain}:${token.address}`;
                const isSelected = selectedTokens.has(key);
                const categoryInfo = getCategoryInfo(token.category);
                const chainConfig = CHAINS[token.chain];

                return (
                  <div
                    key={key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className={cn(
                      'flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100',
                      isSelected && 'bg-sky-50'
                    )}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(token)}
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
                              onClick={() => onBatchAction(action, [token])}
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
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>Showing {filteredTokens.length} of {tokens.length} tokens</span>
        <span>
          Total value: {formatCurrency(filteredTokens.reduce((s, t) => s + t.valueUSD, 0))}
        </span>
      </div>
    </div>
  );
}


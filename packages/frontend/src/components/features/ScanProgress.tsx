/**
 * Scan Progress Component
 * Real-time chain scanning progress
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { CHAINS } from '@/lib/chains/config';
import type { ChainScanStatus } from '@/lib/scanner/types';

interface ScanProgressProps {
  chains: ChainScanStatus[];
  className?: string;
}

export function ScanProgress({ chains, className }: ScanProgressProps) {
  const completed = chains.filter(c => c.status === 'complete').length;
  const total = chains.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-sky-600 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Scanning Chains</p>
            <p className="text-sm text-neutral-500">{completed}/{total} complete</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-sky-600">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Chain Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {chains.map((chain) => {
          const config = CHAINS[chain.chain];
          const statusStyles = {
            pending: 'bg-neutral-100 text-neutral-400',
            scanning: 'bg-sky-100 text-sky-600 animate-pulse',
            complete: 'bg-emerald-100 text-emerald-600',
            error: 'bg-red-100 text-red-600',
          };

          return (
            <div
              key={chain.chain}
              className={cn(
                'flex flex-col items-center p-2 rounded-xl transition-all',
                statusStyles[chain.status]
              )}
            >
              <span className="text-2xl mb-1">{config?.icon || '⚪'}</span>
              <span className="text-xs font-medium truncate w-full text-center">
                {config?.name || chain.chain}
              </span>
              {chain.status === 'complete' && (
                <span className="text-xs mt-0.5">{chain.tokensFound} tokens</span>
              )}
              {chain.status === 'error' && (
                <span className="text-xs mt-0.5">Error</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Compact inline version
export function ScanProgressInline({ chains }: ScanProgressProps) {
  const completed = chains.filter(c => c.status === 'complete').length;
  const total = chains.length;

  return (
    <div className="flex items-center gap-2">
      {chains.map((chain) => {
        const config = CHAINS[chain.chain];
        return (
          <div
            key={chain.chain}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all',
              chain.status === 'pending' && 'bg-neutral-100 opacity-50',
              chain.status === 'scanning' && 'bg-sky-100 animate-pulse',
              chain.status === 'complete' && 'bg-emerald-100',
              chain.status === 'error' && 'bg-red-100'
            )}
          >
            {config?.icon || '⚪'}
          </div>
        );
      })}
      <span className="text-sm text-neutral-500 ml-2">
        {completed}/{total}
      </span>
    </div>
  );
}


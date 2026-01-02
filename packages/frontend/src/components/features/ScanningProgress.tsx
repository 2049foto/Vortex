/**
 * Scanning Progress Component
 * Shows real-time progress for each chain
 */

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ChainScanStatus } from '@/lib/scanner/types';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ScanningProgressProps {
  chains: ChainScanStatus[];
}

export function ScanningProgress({ chains }: ScanningProgressProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Scanning Progress</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {chains.map((chain) => (
          <div
            key={chain.chain}
            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              {chain.status === 'complete' && (
                <CheckCircle2 size={16} className="text-green-500" />
              )}
              {chain.status === 'error' && <XCircle size={16} className="text-red-500" />}
              {chain.status === 'scanning' && (
                <Loader2 size={16} className="text-blue-500 animate-spin" />
              )}
              {chain.status === 'pending' && (
                <div className="w-4 h-4 rounded-full bg-neutral-300" />
              )}
              <span className="text-sm font-medium text-neutral-900">{chain.chain}</span>
            </div>
            <div className="flex items-center gap-2">
              {chain.status === 'complete' && (
                <Badge variant="success" size="sm">
                  {chain.tokensFound} tokens
                </Badge>
              )}
              {chain.status === 'scanning' && (
                <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${chain.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


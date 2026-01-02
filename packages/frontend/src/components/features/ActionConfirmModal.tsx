/**
 * Action Confirm Modal
 * Confirms batch swap/hide/burn actions
 */

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ScannedToken } from '@/lib/scanner/types';
import { AlertTriangle, Zap, Eye, Flame } from 'lucide-react';

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'swap' | 'hide' | 'burn';
  tokens: ScannedToken[];
  onConfirm: () => void;
}

const actionConfig = {
  swap: {
    icon: <Zap size={20} />,
    title: 'Confirm Batch Swap',
    description: 'Swap selected tokens to Base ETH/USDC',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  hide: {
    icon: <Eye size={20} />,
    title: 'Confirm Hide Tokens',
    description: 'Hide selected tokens from view',
    color: 'text-neutral-600',
    bgColor: 'bg-neutral-50',
  },
  burn: {
    icon: <Flame size={20} />,
    title: 'Confirm Burn Tokens',
    description: 'Permanently burn selected tokens',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    warning: 'This action cannot be undone',
  },
};

export function ActionConfirmModal({
  isOpen,
  onClose,
  action,
  tokens,
  onConfirm,
}: ActionConfirmModalProps) {
  const config = actionConfig[action];
  const totalValue = tokens.reduce((sum, t) => sum + t.valueUSD, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={config.title}>
      <div className="space-y-4">
        {/* Action Info */}
        <div className={`p-4 rounded-xl ${config.bgColor}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={config.color}>{config.icon}</div>
            <p className="font-medium text-neutral-900">{config.description}</p>
          </div>
          {config.warning && (
            <div className="flex items-center gap-2 mt-2 text-red-600">
              <AlertTriangle size={16} />
              <span className="text-sm">{config.warning}</span>
            </div>
          )}
        </div>

        {/* Token Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Tokens selected</span>
            <Badge>{tokens.length}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Total value</span>
            <span className="font-semibold text-neutral-900">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Token List (max 5) */}
        {tokens.length <= 5 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tokens.map((token) => (
              <div
                key={`${token.chain}:${token.address}`}
                className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm text-neutral-900">{token.symbol}</p>
                  <p className="text-xs text-neutral-500">{token.chain}</p>
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  ${token.valueUSD.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} fullWidth>
            Confirm {action === 'swap' ? 'Swap' : action === 'hide' ? 'Hide' : 'Burn'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}


/**
 * Action Confirm Modal
 * Confirms batch swap/hide/burn actions
 */

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ScannedToken } from '@/lib/scanner/types';
import { AlertTriangle, Zap, Eye, Flame, Loader2 } from 'lucide-react';

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'swap' | 'hide' | 'burn';
  tokens: ScannedToken[];
  onConfirm: () => Promise<void>;
}

const actionConfig = {
  swap: {
    icon: <Zap size={20} />,
    title: 'Confirm Batch Swap',
    description: 'Swap selected tokens to Base ETH/USDC',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    warning: undefined,
  },
  hide: {
    icon: <Eye size={20} />,
    title: 'Confirm Hide Tokens',
    description: 'Hide selected tokens from view',
    color: 'text-neutral-600',
    bgColor: 'bg-neutral-50',
    warning: undefined,
  },
  burn: {
    icon: <Flame size={20} />,
    title: 'Confirm Burn Tokens',
    description: 'Permanently burn selected tokens',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    warning: 'This action cannot be undone',
  },
} as const;

export function ActionConfirmModal({
  isOpen,
  onClose,
  action,
  tokens,
  onConfirm,
}: ActionConfirmModalProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [burnConfirmed, setBurnConfirmed] = useState(false);
  
  const config = actionConfig[action];
  const totalValue = tokens.reduce((sum, t) => sum + t.valueUSD, 0);
  
  // Calculate XP rewards
  const xpMap: Record<string, number> = {
    swap: 50,
    hide: 25,
    burn: 10,
  };
  const totalXP = tokens.length * (xpMap[action] || 0);

  const handleConfirm = async () => {
    if (action === 'burn' && !burnConfirmed) return;
    
    setIsExecuting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={config.title}>
      <div className="space-y-6">
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
        <div className="space-y-3">
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
          {action === 'swap' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Estimated output</span>
              <span className="font-semibold text-blue-600">
                ~{(totalValue * 0.98).toFixed(2)} USDC
              </span>
            </div>
          )}
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

        {/* Burn Confirmation */}
        {action === 'burn' && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 mt-1" size={20} />
              <div>
                <div className="font-bold text-red-700 mb-1">WARNING: Burning is PERMANENT</div>
                <div className="text-sm text-red-600 mb-3">
                  Burned tokens will be sent to 0x000...000 and cannot be recovered.
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={burnConfirmed}
                    onChange={(e) => setBurnConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">I understand this cannot be undone</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Fee and XP Summary */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-600">⚡ Gas Fees</span>
            <span className="font-bold text-green-600">$0.00 (Sponsored by Pimlico)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-600">🎁 XP Reward</span>
            <span className="font-bold text-blue-600">+{totalXP} XP</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            fullWidth
            disabled={isExecuting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm} 
            fullWidth
            disabled={isExecuting || (action === 'burn' && !burnConfirmed)}
          >
            {isExecuting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Executing...
              </span>
            ) : (
              `Confirm ${action === 'swap' ? 'Swap' : action === 'hide' ? 'Hide' : 'Burn'}`
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}


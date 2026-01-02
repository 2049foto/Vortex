/**
 * Portfolio Page - Replace Dashboard
 * Smart filters, virtualized table, bulk actions
 */

import React, { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ScanningProgress } from '@/components/features/ScanningProgress';
import { SummaryCards } from '@/components/features/SummaryCards';
import { TokenTable } from '@/components/features/TokenTable';
import { ActionConfirmModal } from '@/components/features/ActionConfirmModal';
import { usePortfolioScan } from '@/hooks/usePortfolioScan';
import type { ScannedToken } from '@/lib/scanner/types';
import { Search, Filter, Zap } from 'lucide-react';

export function Portfolio() {
  const { address: evmAddress } = useAccount();
  const { publicKey: solanaAddress } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'actionable' | 'attention'>('all');
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [showActionModal, setShowActionModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'swap' | 'hide' | 'burn' | null>(null);

  const { scanResult, isScanning, scanProgress, scanPortfolio } = usePortfolioScan();

  // Get active address (EVM or Solana)
  const activeAddress = evmAddress || solanaAddress?.toBase58() || '';

  // Filter tokens
  const filteredTokens = useMemo(() => {
    if (!scanResult?.tokens) return [];

    let tokens = scanResult.tokens;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tokens = tokens.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query) ||
          t.name.toLowerCase().includes(query) ||
          t.address.toLowerCase().includes(query)
      );
    }

    // Smart filters
    if (filter === 'actionable') {
      tokens = tokens.filter(
        (t) => t.category === 'DUST' && t.valueUSD >= 0.01 && t.allowedActions.includes('SWAP')
      );
    } else if (filter === 'attention') {
      tokens = tokens.filter(
        (t) => t.category === 'RISK' || (t.riskScore > 70 && !t.verified)
      );
    }

    return tokens;
  }, [scanResult?.tokens, searchQuery, filter]);

  // Selected tokens for batch actions
  const selectedTokenObjects = useMemo(() => {
    return filteredTokens.filter((t) =>
      selectedTokens.has(`${t.chain}:${t.address}`)
    );
  }, [filteredTokens, selectedTokens]);

  const handleScan = async () => {
    if (!activeAddress) return;
    await scanPortfolio(activeAddress);
  };

  const handleBulkAction = (action: 'swap' | 'hide' | 'burn') => {
    if (selectedTokenObjects.length === 0) return;
    setPendingAction(action);
    setShowActionModal(true);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || selectedTokenObjects.length === 0) return;

    // TODO: Execute batch action via API
    console.log(`Executing ${pendingAction} for ${selectedTokenObjects.length} tokens`);

    setShowActionModal(false);
    setPendingAction(null);
    setSelectedTokens(new Set());
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Portfolio</h1>
            <p className="text-neutral-600">
              {activeAddress
                ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
                : 'Connect wallet to scan'}
            </p>
          </div>
          <Button onClick={handleScan} disabled={!activeAddress || isScanning}>
            {isScanning ? 'Scanning...' : 'Scan Portfolio'}
          </Button>
        </div>

        {/* Scanning Progress */}
        {isScanning && scanProgress && (
          <Card padding="lg" className="mb-8">
            <ScanningProgress chains={scanProgress} />
          </Card>
        )}

        {/* Summary Cards */}
        {scanResult && (
          <>
            <SummaryCards summary={scanResult.summary} data={scanResult} />

            {/* Filters & Search */}
            <Card padding="lg" className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search tokens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search size={18} />}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'actionable' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('actionable')}
                    icon={<Zap size={16} />}
                  >
                    Actionable
                  </Button>
                  <Button
                    variant={filter === 'attention' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('attention')}
                    icon={<Filter size={16} />}
                  >
                    Needs Attention
                  </Button>
                </div>
              </div>

              {/* Bulk Actions Toolbar */}
              {selectedTokens.size > 0 && (
                <div className="flex items-center justify-between p-4 bg-sky-50 rounded-xl mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{selectedTokens.size} selected</Badge>
                    <span className="text-sm text-neutral-600">
                      Total value:{' '}
                      {selectedTokenObjects
                        .reduce((sum, t) => sum + t.valueUSD, 0)
                        .toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleBulkAction('swap')}
                      disabled={selectedTokenObjects.some((t) => !t.allowedActions.includes('SWAP'))}
                    >
                      Swap Selected
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleBulkAction('hide')}
                      disabled={selectedTokenObjects.some((t) => !t.allowedActions.includes('HIDE'))}
                    >
                      Hide Selected
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleBulkAction('burn')}
                      disabled={selectedTokenObjects.some((t) => !t.allowedActions.includes('BURN'))}
                    >
                      Burn Selected
                    </Button>
                  </div>
                </div>
              )}

              {/* Token Table */}
              <TokenTable
                tokens={filteredTokens}
                selectedTokens={selectedTokens}
                onSelectTokens={setSelectedTokens}
                onBatchAction={handleBulkAction}
              />
            </Card>
          </>
        )}

        {/* Empty State */}
        {!scanResult && !isScanning && (
          <Card padding="lg" className="text-center">
            <p className="text-neutral-600 mb-4">No portfolio data</p>
            <Button onClick={handleScan} disabled={!activeAddress}>
              Scan Portfolio
            </Button>
          </Card>
        )}
      </div>

      {/* Action Confirm Modal */}
      {showActionModal && pendingAction && (
        <ActionConfirmModal
          isOpen={showActionModal}
          onClose={() => {
            setShowActionModal(false);
            setPendingAction(null);
          }}
          action={pendingAction}
          tokens={selectedTokenObjects}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
}

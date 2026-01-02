/**
 * Watchlist Page - Premium Token Tracking
 * Grid/List views + Alerts + Management
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/layout';
import { Card, Button, Badge, RiskBadge, Avatar, Input, Modal, ModalFooter, NoDataEmpty, Alert } from '@/components/ui';
import { formatCurrency, formatPercent, formatAddress } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';

// Mock watchlist data
const mockWatchlist = [
  { id: 1, address: '0x6982508...39ebc', symbol: 'PEPE', name: 'Pepe', price: 0.000012, change: 5.2, risk: 35, alertEnabled: true },
  { id: 2, address: '0x833589...2ECAB', symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.01, risk: 2, alertEnabled: false },
  { id: 3, address: '0x4200000...0006', symbol: 'WETH', name: 'Wrapped Ether', price: 3300, change: -1.2, risk: 5, alertEnabled: true },
  { id: 4, address: '0x940181...c5E3', symbol: 'AERO', name: 'Aerodrome', price: 0.85, change: 12.5, risk: 15, alertEnabled: false },
];

export function Watchlist() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [watchlist, setWatchlist] = useState(mockWatchlist);

  if (!isAuthenticated) {
    return (
      <Page title="Watchlist">
        <NoDataEmpty onAction={() => navigate('/auth')} />
      </Page>
    );
  }

  const handleRemove = (id: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleAlert = (id: number) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, alertEnabled: !item.alertEnabled } : item
      )
    );
  };

  const handleAddToken = () => {
    if (newAddress) {
      // In real app, would validate and fetch token info
      setWatchlist(prev => [
        ...prev,
        {
          id: Date.now(),
          address: newAddress,
          symbol: 'NEW',
          name: 'New Token',
          price: 0,
          change: 0,
          risk: 50,
          alertEnabled: false,
        },
      ]);
      setNewAddress('');
      setAddModalOpen(false);
    }
  };

  return (
    <Page>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Watchlist</h1>
          <p className="text-neutral-500">{watchlist.length} tokens tracked</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10h18M3 14h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Token
          </Button>
        </div>
      </div>

      {/* Alert Info */}
      <Alert variant="info" className="mb-6">
        Enable alerts to get notified when token risk scores change or prices move significantly.
      </Alert>

      {/* Watchlist */}
      {watchlist.length === 0 ? (
        <NoDataEmpty
          onAction={() => setAddModalOpen(true)}
        />
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {watchlist.map((token) => (
            <Card key={token.id} variant="elevated" padding="md" hover className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar address={token.address} size="md" />
                  <div>
                    <p className="font-bold text-neutral-900">{token.symbol}</p>
                    <p className="text-sm text-neutral-500">{token.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(token.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-neutral-500">Price</p>
                  <p className="text-xl font-bold text-neutral-900">
                    ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(2)}
                  </p>
                </div>
                <Badge variant={token.change >= 0 ? 'success' : 'danger'} size="sm">
                  {formatPercent(token.change)}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <RiskBadge score={token.risk} size="sm" />
                <button
                  onClick={() => handleToggleAlert(token.id)}
                  className={`p-2 rounded-lg transition-colors ${token.alertEnabled ? 'text-sky-600 bg-sky-50' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'}`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={token.alertEnabled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                </button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="mt-3"
                onClick={() => navigate(`/scanner?address=${token.address}`)}
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-neutral-100">
            {watchlist.map((token) => (
              <div key={token.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar address={token.address} size="md" />
                  <div>
                    <p className="font-bold text-neutral-900">{token.symbol}</p>
                    <p className="text-sm text-neutral-500">{token.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">
                      ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(2)}
                    </p>
                    <p className={`text-sm ${token.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatPercent(token.change)}
                    </p>
                  </div>
                  <RiskBadge score={token.risk} size="sm" />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAlert(token.id)}
                      className={`p-2 rounded-lg transition-colors ${token.alertEnabled ? 'text-sky-600 bg-sky-50' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'}`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={token.alertEnabled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                      </svg>
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/scanner?address=${token.address}`)}>
                      View
                    </Button>
                    <button
                      onClick={() => handleRemove(token.id)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Token Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Token to Watchlist"
        description="Enter the token contract address to start tracking"
      >
        <Input
          label="Token Address"
          placeholder="0x..."
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          fullWidth
        />
        <ModalFooter>
          <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddToken}>
            Add Token
          </Button>
        </ModalFooter>
      </Modal>
    </Page>
  );
}


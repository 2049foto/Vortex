/**
 * Portfolio Page - Premium Holdings View
 * Token list + P&L + Analytics
 */

import React, { useState } from 'react';
import { Page } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, RiskBadge, Avatar, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Tabs, TabList, TabTrigger, TabContent, Input, Select, NoDataEmpty } from '@/components/ui';
import { formatCurrency, formatPercent, formatAddress } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';

// Mock portfolio data
const mockTokens = [
  { symbol: 'ETH', name: 'Ethereum', address: '0x0000...0000', balance: 2.5, value: 8250, change: 3.45, risk: 5 },
  { symbol: 'USDC', name: 'USD Coin', address: '0x833589...2ECAB', balance: 5000, value: 5000, change: 0.01, risk: 2 },
  { symbol: 'PEPE', name: 'Pepe', address: '0x6982508...39ebc', balance: 1000000, value: 850, change: -12.5, risk: 45 },
  { symbol: 'AERO', name: 'Aerodrome', address: '0x940181...c5E3', balance: 500, value: 425, change: 8.2, risk: 15 },
];

const totalValue = mockTokens.reduce((sum, t) => sum + t.value, 0);
const totalChange = 4.25;

export function Portfolio() {
  const { isAuthenticated } = useAuthStore();
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState('value');
  const [filterRisk, setFilterRisk] = useState('all');

  if (!isAuthenticated) {
    return (
      <Page title="Portfolio">
        <NoDataEmpty onAction={() => window.location.href = '/auth'} />
      </Page>
    );
  }

  const filteredTokens = mockTokens.filter(t => {
    if (filterRisk === 'safe') return t.risk < 30;
    if (filterRisk === 'risky') return t.risk >= 30;
    return true;
  });

  return (
    <Page>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Portfolio</h1>
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-extrabold text-neutral-900">{formatCurrency(totalValue)}</span>
            <Badge variant={totalChange >= 0 ? 'success' : 'danger'} size="md">
              {formatPercent(totalChange)} (24h)
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card padding="md">
          <p className="text-sm text-neutral-500 mb-1">Total Tokens</p>
          <p className="text-2xl font-bold text-neutral-900">{mockTokens.length}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-neutral-500 mb-1">Safe Holdings</p>
          <p className="text-2xl font-bold text-emerald-600">{mockTokens.filter(t => t.risk < 30).length}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-neutral-500 mb-1">At Risk</p>
          <p className="text-2xl font-bold text-amber-600">{mockTokens.filter(t => t.risk >= 30).length}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-neutral-500 mb-1">24h P&L</p>
          <p className={`text-2xl font-bold ${totalChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(totalValue * totalChange / 100)}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Select
            options={[
              { value: 'all', label: 'All Tokens' },
              { value: 'safe', label: 'Safe Only' },
              { value: 'risky', label: 'Risky Only' },
            ]}
            value={filterRisk}
            onChange={setFilterRisk}
          />
          <Select
            options={[
              { value: 'value', label: 'Sort by Value' },
              { value: 'change', label: 'Sort by Change' },
              { value: 'risk', label: 'Sort by Risk' },
            ]}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-colors ${view === 'table' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10h18M3 14h18M3 6h18M3 18h18" />
            </svg>
          </button>
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
        </div>
      </div>

      {/* Token List */}
      {view === 'table' ? (
        <Card padding="none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTokens.map((token, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar address={token.address} size="sm" />
                      <div>
                        <p className="font-semibold text-neutral-900">{token.symbol}</p>
                        <p className="text-sm text-neutral-500">{token.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{token.balance.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{formatCurrency(token.value)}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${token.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatPercent(token.change)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RiskBadge score={token.risk} size="sm" />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="xs">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTokens.map((token, i) => (
            <Card key={i} variant="elevated" padding="md" hover interactive>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar address={token.address} size="md" />
                  <div>
                    <p className="font-bold text-neutral-900">{token.symbol}</p>
                    <p className="text-sm text-neutral-500">{token.name}</p>
                  </div>
                </div>
                <RiskBadge score={token.risk} size="sm" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Value</p>
                  <p className="text-xl font-bold text-neutral-900">{formatCurrency(token.value)}</p>
                </div>
                <Badge variant={token.change >= 0 ? 'success' : 'danger'} size="sm">
                  {formatPercent(token.change)}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}


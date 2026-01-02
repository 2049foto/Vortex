/**
 * Token Detail Page - Security Analysis
 * Risk score + Contract analysis + Recommendations
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Page } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, RiskBadge, Avatar, Progress, CircularProgress, Breadcrumb, Alert, Skeleton, Tabs, TabList, TabTrigger, TabContent } from '@/components/ui';
import { formatAddress } from '@/lib/utils';

// Mock scan result
const mockScanResult = {
  address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
  name: 'PEPE',
  symbol: 'PEPE',
  riskScore: 35,
  isHoneypot: false,
  buyTax: 0,
  sellTax: 0,
  ownershipRenounced: true,
  liquidityLocked: true,
  contractVerified: true,
  risks: [
    { name: 'Large holder concentration', severity: 'medium', description: 'Top 10 holders own 45% of supply' },
    { name: 'Hidden transfer fees', severity: 'low', description: 'No hidden fees detected' },
    { name: 'Mint function', severity: 'info', description: 'No mint function found' },
  ],
  holders: 450000,
  liquidity: '$125M',
  marketCap: '$3.2B',
};

export function TokenDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const address = searchParams.get('address');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<typeof mockScanResult | null>(null);

  useEffect(() => {
    if (address) {
      // Simulate API call
      setTimeout(() => {
        setResult(mockScanResult);
        setLoading(false);
      }, 1500);
    }
  }, [address]);

  if (!address) {
    return (
      <Page>
        <Alert variant="warning" title="No Token Address">
          Please provide a token address to scan.
        </Alert>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Go to Dashboard
        </Button>
      </Page>
    );
  }

  return (
    <Page>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Scanner', href: '/scanner' },
          { label: formatAddress(address) },
        ]}
        className="mb-6"
      />

      {loading ? (
        <div className="space-y-6">
          <Card padding="lg">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton variant="circular" width={64} height={64} />
              <div className="space-y-2">
                <Skeleton variant="text" width={150} height={28} />
                <Skeleton variant="text" width={300} height={20} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} variant="rectangular" height={80} />
              ))}
            </div>
          </Card>
        </div>
      ) : result ? (
        <div className="space-y-6">
          {/* Header Card */}
          <Card variant="glass" padding="lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar address={result.address} size="lg" />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-neutral-900">{result.name}</h1>
                    <Badge variant="default">{result.symbol}</Badge>
                  </div>
                  <p className="text-neutral-500 font-mono text-sm mt-1">{result.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <CircularProgress
                    value={100 - result.riskScore}
                    size={80}
                    strokeWidth={8}
                    variant={result.riskScore < 30 ? 'success' : result.riskScore < 60 ? 'warning' : 'danger'}
                  />
                  <p className="text-sm text-neutral-500 mt-2">Security Score</p>
                </div>
                <RiskBadge score={result.riskScore} size="lg" />
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="md">
              <p className="text-sm text-neutral-500 mb-1">Market Cap</p>
              <p className="text-2xl font-bold text-neutral-900">{result.marketCap}</p>
            </Card>
            <Card padding="md">
              <p className="text-sm text-neutral-500 mb-1">Liquidity</p>
              <p className="text-2xl font-bold text-neutral-900">{result.liquidity}</p>
            </Card>
            <Card padding="md">
              <p className="text-sm text-neutral-500 mb-1">Holders</p>
              <p className="text-2xl font-bold text-neutral-900">{result.holders.toLocaleString()}</p>
            </Card>
            <Card padding="md">
              <p className="text-sm text-neutral-500 mb-1">Tax (Buy/Sell)</p>
              <p className="text-2xl font-bold text-neutral-900">{result.buyTax}% / {result.sellTax}%</p>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Tabs defaultTab="security">
            <TabList>
              <TabTrigger value="security">Security Analysis</TabTrigger>
              <TabTrigger value="contract">Contract Info</TabTrigger>
              <TabTrigger value="holders">Holders</TabTrigger>
            </TabList>

            <TabContent value="security">
              <Card padding="lg">
                <h3 className="font-bold text-neutral-900 mb-4">Security Checks</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.isHoneypot ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {result.isHoneypot ? '⚠️' : '✓'}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Honeypot Check</p>
                      <p className="text-sm text-neutral-500">{result.isHoneypot ? 'Honeypot detected!' : 'Not a honeypot'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.ownershipRenounced ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {result.ownershipRenounced ? '✓' : '!'}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Ownership</p>
                      <p className="text-sm text-neutral-500">{result.ownershipRenounced ? 'Renounced' : 'Not renounced'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.liquidityLocked ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {result.liquidityLocked ? '🔒' : '🔓'}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Liquidity</p>
                      <p className="text-sm text-neutral-500">{result.liquidityLocked ? 'Locked' : 'Not locked'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.contractVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {result.contractVerified ? '✓' : '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Contract</p>
                      <p className="text-sm text-neutral-500">{result.contractVerified ? 'Verified' : 'Not verified'}</p>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-neutral-900 mb-3">Risk Factors</h4>
                <div className="space-y-3">
                  {result.risks.map((risk, i) => (
                    <Alert
                      key={i}
                      variant={risk.severity === 'high' ? 'danger' : risk.severity === 'medium' ? 'warning' : 'info'}
                      title={risk.name}
                    >
                      {risk.description}
                    </Alert>
                  ))}
                </div>
              </Card>
            </TabContent>

            <TabContent value="contract">
              <Card padding="lg">
                <h3 className="font-bold text-neutral-900 mb-4">Contract Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                    <span className="text-neutral-500">Contract Address</span>
                    <span className="font-mono text-sm">{result.address}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                    <span className="text-neutral-500">Token Name</span>
                    <span className="font-semibold">{result.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                    <span className="text-neutral-500">Symbol</span>
                    <span className="font-semibold">{result.symbol}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" size="sm">
                    View on Basescan
                  </Button>
                  <Button variant="outline" size="sm">
                    View on DexScreener
                  </Button>
                </div>
              </Card>
            </TabContent>

            <TabContent value="holders">
              <Card padding="lg">
                <h3 className="font-bold text-neutral-900 mb-4">Top Holders</h3>
                <p className="text-neutral-500">Holder distribution analysis coming soon...</p>
              </Card>
            </TabContent>
          </Tabs>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/watchlist')}>
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Add to Watchlist
            </Button>
            <Button variant="secondary">
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Share Report
            </Button>
          </div>
        </div>
      ) : (
        <Alert variant="danger" title="Scan Failed">
          Unable to scan this token. Please try again later.
        </Alert>
      )}
    </Page>
  );
}


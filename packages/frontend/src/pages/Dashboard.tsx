/**
 * Dashboard Page - Premium Overview
 * Stats + Scanner + Recent Activity
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, RiskBadge, Skeleton, Avatar, Progress } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import { formatCurrency, formatAddress } from '@/lib/utils';

// Mock data
const recentScans = [
  { address: '0x1234...5678', name: 'PEPE', risk: 25, time: '2 min ago' },
  { address: '0x2345...6789', name: 'SHIB', risk: 45, time: '5 min ago' },
  { address: '0x3456...7890', name: 'DOGE', risk: 15, time: '12 min ago' },
];

const portfolioStats = {
  totalValue: 45678.90,
  change24h: 5.67,
  tokens: 12,
  riskyTokens: 2,
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [tokenAddress, setTokenAddress] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    if (!tokenAddress) return;
    setScanning(true);
    // Simulate scan
    await new Promise(r => setTimeout(r, 1500));
    setScanning(false);
    navigate(`/scanner?address=${tokenAddress}`);
  };

  if (!isAuthenticated) {
    return (
      <Page>
        <Card variant="glass" padding="xl" className="max-w-md mx-auto text-center mt-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Connect Your Wallet</h2>
          <p className="text-neutral-500 mb-6">Connect your wallet to access your personalized dashboard.</p>
          <Button onClick={() => navigate('/auth')} fullWidth>
            Connect Wallet
          </Button>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500">Welcome back, {formatAddress(user?.walletAddress || '')}</p>
        </div>
        <Button onClick={() => navigate('/portfolio')}>
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12V7H5a2 2 0 010-4h14v4" />
            <path d="M3 5v14a2 2 0 002 2h16v-5" />
            <path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          View Portfolio
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card variant="gradient" padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-neutral-900">
                    {formatCurrency(portfolioStats.totalValue)}
                  </p>
                  <Badge variant={portfolioStats.change24h >= 0 ? 'success' : 'danger'} size="sm" className="mt-2">
                    {portfolioStats.change24h >= 0 ? '+' : ''}{portfolioStats.change24h}% (24h)
                  </Badge>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card variant="gradient" padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Token Holdings</p>
                  <p className="text-3xl font-bold text-neutral-900">{portfolioStats.tokens}</p>
                  <p className="text-sm text-neutral-500 mt-2">
                    <span className="text-amber-500 font-semibold">{portfolioStats.riskyTokens}</span> risky detected
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Token Scanner */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle>🔍 Token Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter token address (0x...)"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  leftIcon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  }
                  fullWidth
                />
                <Button onClick={handleScan} loading={scanning}>
                  {scanning ? 'Scanning...' : 'Scan Now'}
                </Button>
              </div>
              <p className="text-sm text-neutral-500 mt-3">
                Analyze any token for security risks, honeypot detection, and contract analysis.
              </p>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScans.map((scan, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/scanner?address=${scan.address}`)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar address={scan.address} size="sm" />
                      <div>
                        <p className="font-semibold text-neutral-900">{scan.name}</p>
                        <p className="text-sm text-neutral-500">{scan.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskBadge score={scan.risk} size="sm" />
                      <span className="text-sm text-neutral-400">{scan.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Score */}
          <Card variant="glass" padding="lg">
            <h3 className="font-bold text-neutral-900 mb-4">Portfolio Health</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <svg className="w-32 h-32 -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" strokeWidth="12" className="stroke-neutral-200" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="stroke-emerald-500"
                    strokeDasharray={352}
                    strokeDashoffset={352 * 0.15}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-neutral-900">85</p>
                    <p className="text-sm text-neutral-500">Score</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Safe Tokens</span>
                <span className="font-semibold text-emerald-600">10</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Medium Risk</span>
                <span className="font-semibold text-amber-600">1</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">High Risk</span>
                <span className="font-semibold text-red-600">1</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card padding="lg">
            <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" fullWidth onClick={() => navigate('/watchlist')}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Manage Watchlist
              </Button>
              <Button variant="secondary" fullWidth onClick={() => navigate('/settings')}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                Alert Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}


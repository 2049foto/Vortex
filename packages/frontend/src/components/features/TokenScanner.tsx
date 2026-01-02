/**
 * Token Scanner component for Vortex Protocol
 */

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AddressInput } from '@/components/ui/Input';
import { ChainSelect } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { scannerApi } from '@/lib/api';
import { isValidEvmAddress, isValidSolanaAddress } from '@/lib/validators';
import type { Chain, TokenRisk, RiskCheck } from '@/types';
import toast from 'react-hot-toast';

interface ScanResult {
  token: {
    address: string;
    symbol: string;
    name: string;
    chain: string;
  };
  risk: TokenRisk;
}

/**
 * Token Scanner component
 */
export function TokenScanner(): React.ReactElement {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState<Chain>('base');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAddress = (addr: string, selectedChain: Chain): boolean => {
    if (selectedChain === 'solana') {
      return isValidSolanaAddress(addr);
    }
    return isValidEvmAddress(addr);
  };

  const handleScan = async () => {
    setError(null);
    
    if (!address.trim()) {
      setError('Please enter a token address');
      return;
    }

    if (!validateAddress(address, chain)) {
      setError(`Invalid ${chain} address format`);
      return;
    }

    setIsScanning(true);

    try {
      const response = await scannerApi.scan({ tokenAddress: address, chain });
      
      if (response.success && response.data) {
        setResult(response.data);
        toast.success('Token scanned successfully');
      } else {
        throw new Error('Failed to scan token');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to scan token';
      setError(message);
      toast.error(message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <Card variant="gradient" padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-500/20 rounded-lg">
          <Shield className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Token Scanner</h2>
          <p className="text-sm text-text-secondary">Analyze any token for security risks</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <AddressInput
            placeholder="Enter token address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            error={error || undefined}
            fullWidth
          />
        </div>
        <ChainSelect
          value={chain}
          onChange={(e) => setChain(e.target.value as Chain)}
          className="w-full sm:w-40"
        />
        <Button
          onClick={handleScan}
          isLoading={isScanning}
          leftIcon={<Search className="w-4 h-4" />}
        >
          Scan
        </Button>
      </div>

      {/* Loading State */}
      {isScanning && (
        <div className="space-y-4">
          <Skeleton height={60} />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton height={80} />
            <Skeleton height={80} />
          </div>
          <Skeleton height={120} />
        </div>
      )}

      {/* Results */}
      {!isScanning && result && (
        <div className="space-y-6 animate-fade-up">
          {/* Token Info & Risk Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-background-elevated rounded-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-text-primary">
                  {result.token.symbol}
                </h3>
                <RiskBadge level={result.risk.riskLevel} />
              </div>
              <p className="text-sm text-text-secondary">{result.token.name}</p>
              <p className="text-xs text-text-muted font-mono mt-1">
                {result.token.address}
              </p>
            </div>
            <RiskScoreCircle score={result.risk.riskScore} level={result.risk.riskLevel} />
          </div>

          {/* Quick Checks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickCheck
              label="Safe"
              value={result.risk.safe}
              icon={<CheckCircle className="w-4 h-4" />}
            />
            <QuickCheck
              label="Honeypot"
              value={!result.risk.honeypot}
              invertColor
              icon={<AlertTriangle className="w-4 h-4" />}
            />
            <QuickCheck
              label="Rug Pull"
              value={!result.risk.rugpull}
              invertColor
              icon={<XCircle className="w-4 h-4" />}
            />
            <QuickCheck
              label="Transferable"
              value={result.risk.transferability}
              icon={<CheckCircle className="w-4 h-4" />}
            />
          </div>

          {/* Detailed Risks */}
          {result.risk.risks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-3">
                Risk Details ({result.risk.risks.length})
              </h4>
              <div className="space-y-2">
                {result.risk.risks.map((risk, index) => (
                  <RiskItem key={index} risk={risk} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isScanning && !result && !error && (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">
            Enter a token address to check for security risks
          </p>
        </div>
      )}
    </Card>
  );
}

/**
 * Risk Score Circle
 */
function RiskScoreCircle({
  score,
  level,
}: {
  score: number;
  level: 'SAFE' | 'WARNING' | 'DANGER';
}): React.ReactElement {
  const colorClass = {
    SAFE: 'text-success-light',
    WARNING: 'text-warning-light',
    DANGER: 'text-danger-light',
  }[level];

  const bgClass = {
    SAFE: 'bg-success-light/10',
    WARNING: 'bg-warning-light/10',
    DANGER: 'bg-danger-light/10',
  }[level];

  return (
    <div className={clsx('w-20 h-20 rounded-full flex flex-col items-center justify-center', bgClass)}>
      <span className={clsx('text-2xl font-bold', colorClass)}>{score}</span>
      <span className="text-xs text-text-muted">/ 100</span>
    </div>
  );
}

/**
 * Quick Check item
 */
function QuickCheck({
  label,
  value,
  icon,
  invertColor = false,
}: {
  label: string;
  value: boolean;
  icon: React.ReactNode;
  invertColor?: boolean;
}): React.ReactElement {
  const isGood = invertColor ? !value : value;
  
  return (
    <div
      className={clsx(
        'p-3 rounded-xl border',
        value
          ? 'bg-success-light/10 border-success-light/20'
          : 'bg-danger-light/10 border-danger-light/20'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={value ? 'text-success-light' : 'text-danger-light'}>
          {icon}
        </span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <span className={clsx('text-sm font-medium', value ? 'text-success-light' : 'text-danger-light')}>
        {value ? 'Pass' : 'Fail'}
      </span>
    </div>
  );
}

/**
 * Risk item
 */
function RiskItem({ risk }: { risk: RiskCheck }): React.ReactElement {
  const severityColors = {
    low: 'border-text-muted',
    medium: 'border-warning-light',
    high: 'border-danger-light',
    critical: 'border-danger-DEFAULT',
  };

  return (
    <div
      className={clsx(
        'p-3 rounded-lg border-l-4 bg-background-elevated',
        severityColors[risk.severity]
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-text-primary">{risk.name}</span>
        <span
          className={clsx(
            'text-xs px-2 py-0.5 rounded-full',
            risk.result ? 'bg-success-light/10 text-success-light' : 'bg-danger-light/10 text-danger-light'
          )}
        >
          {risk.result ? 'Pass' : 'Fail'}
        </span>
      </div>
      <p className="text-xs text-text-secondary">{risk.description}</p>
    </div>
  );
}

export default TokenScanner;


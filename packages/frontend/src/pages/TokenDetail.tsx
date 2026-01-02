/**
 * Token Detail page for Vortex Protocol
 */

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  ArrowLeft,
  Shield,
  Star,
  Bell,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RiskBadge, ChainBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { scannerApi, watchlistApi } from '@/lib/api';
import { truncateAddress, copyToClipboard, getRiskLevelColor, getRiskLevelBg } from '@/lib/format';
import { isValidEvmAddress, isValidSolanaAddress } from '@/lib/validators';
import type { Chain, TokenRisk, RiskCheck } from '@/types';
import toast from 'react-hot-toast';

interface TokenData {
  token: {
    address: string;
    symbol: string;
    name: string;
    chain: string;
  };
  risk: TokenRisk;
}

/**
 * Token Detail page component
 */
export default function TokenDetail(): React.ReactElement {
  const { address } = useParams<{ address: string }>();
  const [searchParams] = useSearchParams();
  const chain = (searchParams.get('chain') || 'base') as Chain;

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchToken = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const isValid =
          chain === 'solana'
            ? isValidSolanaAddress(address)
            : isValidEvmAddress(address);

        if (!isValid) {
          throw new Error('Invalid token address');
        }

        const response = await scannerApi.scan({ tokenAddress: address, chain });

        if (response.success && response.data) {
          setTokenData(response.data);
        } else {
          throw new Error('Failed to fetch token data');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load token';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [address, chain]);

  const handleCopyAddress = async () => {
    if (!address) return;
    const success = await copyToClipboard(address);
    if (success) {
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!tokenData) return;

    setWatchlistLoading(true);
    try {
      if (isInWatchlist) {
        // Remove from watchlist would need the ID
        setIsInWatchlist(false);
        toast.success('Removed from watchlist');
      } else {
        await watchlistApi.add({
          tokenAddress: tokenData.token.address,
          chain: tokenData.token.chain,
          symbol: tokenData.token.symbol,
          name: tokenData.token.name,
        });
        setIsInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch {
      toast.error('Failed to update watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={40} width={200} />
        <Skeleton height={200} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={100} />
          ))}
        </div>
        <Skeleton height={300} />
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-12 h-12 text-warning-light mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          {error || 'Token Not Found'}
        </h2>
        <p className="text-text-secondary mb-6">
          We couldn&apos;t find information for this token.
        </p>
        <Link to="/dashboard">
          <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const { token, risk } = tokenData;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Token Header */}
      <Card variant="gradient" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Token Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-text-primary">
                  {token.symbol}
                </h1>
                <RiskBadge level={risk.riskLevel} />
                <ChainBadge chain={token.chain} />
              </div>
              <p className="text-text-secondary">{token.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-xs text-text-muted font-mono bg-background-elevated px-2 py-1 rounded">
                  {truncateAddress(token.address, 10, 8)}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-background-hover rounded transition-colors"
                  aria-label="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success-light" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-muted" />
                  )}
                </button>
                <a
                  href={`https://basescan.org/token/${token.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-background-hover rounded transition-colors"
                  aria-label="View on explorer"
                >
                  <ExternalLink className="w-4 h-4 text-text-muted" />
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant={isInWatchlist ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleToggleWatchlist}
              isLoading={watchlistLoading}
              leftIcon={
                <Star
                  className={clsx(
                    'w-4 h-4',
                    isInWatchlist && 'fill-primary-400 text-primary-400'
                  )}
                />
              }
            >
              {isInWatchlist ? 'Watching' : 'Watch'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Bell className="w-4 h-4" />}
            >
              Set Alert
            </Button>
          </div>
        </div>
      </Card>

      {/* Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card variant="default" padding="lg" className="md:col-span-1">
          <div className="text-center">
            <h3 className="text-sm font-medium text-text-secondary mb-4">
              Risk Score
            </h3>
            <div
              className={clsx(
                'w-32 h-32 rounded-full mx-auto flex flex-col items-center justify-center',
                getRiskLevelBg(risk.riskLevel)
              )}
            >
              <span
                className={clsx('text-4xl font-bold', getRiskLevelColor(risk.riskLevel))}
              >
                {risk.riskScore}
              </span>
              <span className="text-sm text-text-muted">/ 100</span>
            </div>
            <p className="mt-4 text-text-secondary">
              {risk.riskLevel === 'SAFE' && 'This token appears to be safe.'}
              {risk.riskLevel === 'WARNING' && 'This token has some risk factors.'}
              {risk.riskLevel === 'DANGER' && 'This token has significant risks.'}
            </p>
          </div>
        </Card>

        {/* Quick Checks */}
        <Card variant="default" padding="lg" className="md:col-span-2">
          <h3 className="text-sm font-medium text-text-secondary mb-4">
            Security Checks
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <SecurityCheck label="Safe Token" passed={risk.safe} />
            <SecurityCheck label="Not Honeypot" passed={!risk.honeypot} />
            <SecurityCheck label="No Rug Pull Risk" passed={!risk.rugpull} />
            <SecurityCheck label="Transferable" passed={risk.transferability} />
          </div>
        </Card>
      </div>

      {/* Detailed Risks */}
      {risk.risks.length > 0 && (
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Risk Analysis ({risk.risks.length} checks)
          </h3>
          <div className="space-y-3">
            {risk.risks.map((check, index) => (
              <RiskCheckRow key={index} check={check} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * Security check component
 */
function SecurityCheck({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}): React.ReactElement {
  return (
    <div
      className={clsx(
        'p-4 rounded-xl border',
        passed
          ? 'bg-success-light/10 border-success-light/20'
          : 'bg-danger-light/10 border-danger-light/20'
      )}
    >
      <div className="flex items-center gap-3">
        {passed ? (
          <CheckCircle className="w-5 h-5 text-success-light" />
        ) : (
          <XCircle className="w-5 h-5 text-danger-light" />
        )}
        <span className="font-medium text-text-primary">{label}</span>
      </div>
    </div>
  );
}

/**
 * Risk check row component
 */
function RiskCheckRow({ check }: { check: RiskCheck }): React.ReactElement {
  const severityColors = {
    low: 'border-text-muted',
    medium: 'border-warning-light',
    high: 'border-danger-light',
    critical: 'border-danger-DEFAULT',
  };

  return (
    <div
      className={clsx(
        'p-4 rounded-xl border-l-4 bg-background-elevated',
        severityColors[check.severity]
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-text-primary">{check.name}</span>
        <span
          className={clsx(
            'text-xs px-2 py-0.5 rounded-full',
            check.result
              ? 'bg-success-light/10 text-success-light'
              : 'bg-danger-light/10 text-danger-light'
          )}
        >
          {check.result ? 'Pass' : 'Fail'}
        </span>
      </div>
      <p className="text-sm text-text-secondary">{check.description}</p>
    </div>
  );
}


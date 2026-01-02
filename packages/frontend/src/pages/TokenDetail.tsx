/**
 * Token Detail Page - Token analysis view
 */

import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/layout';
import { scannerApi } from '@/lib/api';
import { isValidEvmAddress, isValidSolanaAddress } from '@/lib/validators';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { Chain } from '@/types';

export default function TokenDetail() {
  const { address } = useParams<{ address: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chain = (searchParams.get('chain') || 'base') as Chain;
  
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!address) {
      navigate('/dashboard');
      return;
    }
    
    const fetchToken = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await scannerApi.scan({
          tokenAddress: address,
          chain,
        });
        
        if (response.success && response.data) {
          setTokenData(response.data);
        } else {
          throw new Error('Failed to fetch token data');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load token';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchToken();
  }, [address, chain, navigate]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <Card padding="lg">
            <Skeleton height="3rem" className="mb-4" />
            <Skeleton height="1rem" className="mb-2" />
            <Skeleton height="1rem" width="60%" />
          </Card>
        </div>
      </Layout>
    );
  }
  
  if (error || !tokenData) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <Card padding="lg">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Token Not Found</h1>
            <p className="text-neutral-600 mb-4">{error || 'Unable to load token data'}</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const { token, risk } = tokenData;
  const isSafe = risk?.safe;
  
  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-6 py-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              ← Back
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  {token?.name || 'Unknown Token'}
                </h1>
                <p className="text-neutral-600">{token?.symbol} • {chain}</p>
              </div>
              <Badge
                variant={isSafe ? 'success' : risk?.riskLevel === 'WARNING' ? 'warning' : 'danger'}
                size="lg"
              >
                {risk?.riskLevel || 'UNKNOWN'}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Risk Score */}
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Security Analysis</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-600">Risk Score</span>
                      <span className="text-2xl font-bold text-neutral-900">
                        {risk?.riskScore || 0}/100
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          risk?.riskScore < 30 ? 'bg-green-500' :
                          risk?.riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${risk?.riskScore || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Risk Checks */}
                  {risk?.risks && risk.risks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-neutral-900">Risk Checks</h3>
                      {risk.risks.map((check: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900">{check.name}</p>
                            <p className="text-sm text-neutral-600">{check.description}</p>
                          </div>
                          <Badge variant={check.result ? 'success' : 'danger'}>
                            {check.result ? 'Pass' : 'Fail'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card padding="lg">
                <h3 className="font-semibold text-neutral-900 mb-4">Token Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-600">Address</p>
                    <p className="font-mono text-sm text-neutral-900 break-all">{address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Chain</p>
                    <p className="font-medium text-neutral-900 capitalize">{chain}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Status</p>
                    <Badge variant={isSafe ? 'success' : 'danger'}>
                      {isSafe ? 'Safe' : 'Risky'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


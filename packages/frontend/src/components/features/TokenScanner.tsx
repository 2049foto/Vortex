/**
 * Token Scanner Component - Quick scan feature
 */

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { scannerApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import type { Chain } from '@/types';

export function TokenScanner() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState<Chain>('base');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleScan = async () => {
    if (!address.trim()) {
      toast.error('Please enter a token address');
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await scannerApi.scan({
        tokenAddress: address.trim(),
        chain,
      });
      
      if (response.success && response.data) {
        setResult(response.data);
        toast.success('Token scanned successfully');
      } else {
        throw new Error('Scan failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to scan token');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            icon={
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            }
            fullWidth
          />
        </div>
        <Button
          variant="primary"
          onClick={handleScan}
          loading={loading}
          className="sm:w-auto"
        >
          Scan Token
        </Button>
      </div>
      
      {/* Results */}
      {loading && (
        <Card padding="md">
          <div className="space-y-4">
            <Skeleton height="2rem" />
            <Skeleton height="1rem" />
            <Skeleton height="1rem" width="60%" />
          </div>
        </Card>
      )}
      
      {result && (
        <Card padding="md" className="animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {result.token?.name || 'Unknown Token'}
                </h3>
                <p className="text-sm text-neutral-600">{result.token?.symbol}</p>
              </div>
              <Badge
                variant={
                  result.risk?.safe ? 'success' :
                  result.risk?.riskLevel === 'WARNING' ? 'warning' : 'danger'
                }
              >
                {result.risk?.riskLevel || 'UNKNOWN'}
              </Badge>
            </div>
            
            {result.risk && (
              <div className="pt-4 border-t border-neutral-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Risk Score</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {result.risk.riskScore}/100
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Status</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {result.risk.safe ? 'Safe' : 'Risky'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}


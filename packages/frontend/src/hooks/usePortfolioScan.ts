/**
 * Portfolio Scan Hook
 * Handles multi-chain scanning with progress tracking
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ScanResult, ChainScanStatus } from '@/lib/scanner/types';

export function usePortfolioScan() {
  const [scanProgress, setScanProgress] = useState<ChainScanStatus[] | null>(null);

  const scanPortfolio = useCallback(async (address: string): Promise<ScanResult> => {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error('Scan failed');
    }

    return response.json();
  }, []);

  const {
    data: scanResult,
    isLoading: isScanning,
    error,
    refetch,
  } = useQuery<ScanResult>({
    queryKey: ['portfolio-scan'],
    queryFn: () => scanPortfolio(''), // Will be called with address
    enabled: false, // Manual trigger
  });

  return {
    scanResult: scanResult || null,
    isScanning,
    scanProgress,
    error,
    scanPortfolio: async (address: string) => {
      setScanProgress([]);
      // TODO: Implement WebSocket progress tracking
      const result = await scanPortfolio(address);
      setScanProgress(null);
      return result;
    },
    refetch,
  };
}


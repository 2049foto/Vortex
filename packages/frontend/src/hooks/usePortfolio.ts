/**
 * Portfolio hook for Vortex Protocol
 */

import { useCallback, useEffect } from 'react';
import { usePortfolioStore, usePortfolioStats } from '@/stores/portfolio';
import { useAuth } from './useAuth';
import type { Chain } from '@/types';

import type { Portfolio } from '@/types';

/**
 * Portfolio hook return type
 */
interface UsePortfolioReturn {
  /** Portfolio data */
  portfolio: Portfolio | null;
  /** Portfolio statistics */
  stats: ReturnType<typeof usePortfolioStats>;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Selected chain filter */
  selectedChain: Chain | 'all';
  /** Fetch portfolio */
  fetchPortfolio: (address?: string) => Promise<void>;
  /** Refresh portfolio */
  refresh: () => Promise<void>;
  /** Set chain filter */
  setChainFilter: (chain: Chain | 'all') => void;
  /** Clear portfolio */
  clear: () => void;
}

/**
 * Portfolio hook
 */
export function usePortfolio(): UsePortfolioReturn {
  const { user } = useAuth();
  const {
    portfolio,
    isLoading,
    error,
    selectedChain,
    fetchPortfolio: storeFetch,
    setSelectedChain,
    clearPortfolio,
    refresh: storeRefresh,
  } = usePortfolioStore();
  
  const stats = usePortfolioStats();

  /**
   * Fetch portfolio for address or current user
   */
  const fetchPortfolio = useCallback(
    async (address?: string) => {
      const targetAddress = address || user?.walletAddress;
      if (!targetAddress) return;
      await storeFetch(targetAddress);
    },
    [storeFetch, user?.walletAddress]
  );

  /**
   * Refresh current portfolio
   */
  const refresh = useCallback(async () => {
    await storeRefresh();
  }, [storeRefresh]);

  /**
   * Set chain filter
   */
  const setChainFilter = useCallback(
    (chain: Chain | 'all') => {
      setSelectedChain(chain);
    },
    [setSelectedChain]
  );

  /**
   * Clear portfolio
   */
  const clear = useCallback(() => {
    clearPortfolio();
  }, [clearPortfolio]);

  /**
   * Auto-fetch on user change
   */
  useEffect(() => {
    if (user?.walletAddress && !portfolio) {
      fetchPortfolio(user.walletAddress);
    }
  }, [user?.walletAddress, portfolio, fetchPortfolio]);

  return {
    portfolio,
    stats,
    isLoading,
    error,
    selectedChain,
    fetchPortfolio,
    refresh,
    setChainFilter,
    clear,
  };
}

export default usePortfolio;


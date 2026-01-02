/**
 * Portfolio state store using Zustand
 */

import { create } from 'zustand';
import type { Portfolio, TokenBalance, Chain } from '@/types';
import { portfolioApi } from '@/lib/api';

interface PortfolioState {
  /** Current portfolio data */
  portfolio: Portfolio | null;
  /** Selected chain filter */
  selectedChain: Chain | 'all';
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Last fetch timestamp */
  lastFetched: number | null;
}

interface PortfolioActions {
  /** Fetch portfolio for address */
  fetchPortfolio: (address: string, chain?: Chain) => Promise<void>;
  /** Set selected chain filter */
  setSelectedChain: (chain: Chain | 'all') => void;
  /** Clear portfolio data */
  clearPortfolio: () => void;
  /** Get filtered tokens */
  getFilteredTokens: () => TokenBalance[];
  /** Refresh portfolio */
  refresh: () => Promise<void>;
}

type PortfolioStore = PortfolioState & PortfolioActions;

/**
 * Cache duration in milliseconds (5 minutes)
 */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Initial state
 */
const initialState: PortfolioState = {
  portfolio: null,
  selectedChain: 'all',
  isLoading: false,
  error: null,
  lastFetched: null,
};

/**
 * Portfolio store
 */
export const usePortfolioStore = create<PortfolioStore>()((set, get) => ({
  ...initialState,

  fetchPortfolio: async (address: string, chain?: Chain) => {
    const { lastFetched, portfolio } = get();
    
    // Check cache validity
    if (
      lastFetched &&
      portfolio?.address === address &&
      Date.now() - lastFetched < CACHE_DURATION
    ) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await portfolioApi.get(address, chain);
      
      if (response.success && response.data) {
        set({
          portfolio: response.data,
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
        });
      } else {
        throw new Error('Failed to fetch portfolio');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch portfolio';
      set({
        isLoading: false,
        error: message,
      });
    }
  },

  setSelectedChain: (chain: Chain | 'all') => {
    set({ selectedChain: chain });
  },

  clearPortfolio: () => {
    set(initialState);
  },

  getFilteredTokens: () => {
    const { portfolio, selectedChain } = get();
    if (!portfolio) return [];
    
    if (selectedChain === 'all') {
      return portfolio.tokens;
    }
    
    // Note: In real implementation, tokens would have chain property
    return portfolio.tokens;
  },

  refresh: async () => {
    const { portfolio } = get();
    if (!portfolio) return;
    
    // Force refresh by clearing cache
    set({ lastFetched: null });
    await get().fetchPortfolio(portfolio.address);
  },
}));

/**
 * Selector hooks
 */
export const usePortfolio = () => usePortfolioStore((state) => state.portfolio);
export const usePortfolioLoading = () => usePortfolioStore((state) => state.isLoading);
export const usePortfolioError = () => usePortfolioStore((state) => state.error);
export const useSelectedChain = () => usePortfolioStore((state) => state.selectedChain);

/**
 * Computed selectors
 */
export const usePortfolioStats = () => {
  const portfolio = usePortfolioStore((state) => state.portfolio);
  
  if (!portfolio) {
    return {
      totalValue: 0,
      change24h: 0,
      change24hPercent: 0,
      tokenCount: 0,
      topGainer: null,
      topLoser: null,
    };
  }

  const tokens = portfolio.tokens;
  const topGainer = tokens.reduce<TokenBalance | null>((max, token) => {
    if (!max || token.change24hPercent > max.change24hPercent) return token;
    return max;
  }, null);

  const topLoser = tokens.reduce<TokenBalance | null>((min, token) => {
    if (!min || token.change24hPercent < min.change24hPercent) return token;
    return min;
  }, null);

  return {
    totalValue: portfolio.totalValueUSD,
    change24h: portfolio.change24hUSD,
    change24hPercent: portfolio.change24hPercent,
    tokenCount: tokens.length,
    topGainer,
    topLoser,
  };
};


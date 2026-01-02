/**
 * Vortex Token Classifier
 * Classifies tokens into 4 categories with allowed actions
 */

import type { ScannedToken, TokenCategory, TokenAction } from './types';

// Classification thresholds
export const THRESHOLDS = {
  // Premium: >$10, verified, liquidity >$100k, holders >500
  PREMIUM: {
    minValue: 10,
    minLiquidity: 100000,
    minHolders: 500,
    maxRisk: 25,
  },
  
  // Dust: $0.1-$10
  DUST: {
    minValue: 0.1,
    maxValue: 10,
    maxRisk: 50,
  },
  
  // Micro: <$0.1
  MICRO: {
    maxValue: 0.1,
    maxRisk: 75,
  },
  
  // Risk: risk score >75
  RISK: {
    minRisk: 75,
  },
};

// Action matrix per category
const ACTION_MATRIX: Record<TokenCategory, TokenAction[]> = {
  PREMIUM: ['HOLD', 'SWAP'],
  DUST: ['SWAP', 'HIDE'],
  MICRO: ['HIDE', 'BURN'],
  RISK: ['HIDE'],
};

/**
 * Classify a single token
 */
export function classifyToken(token: Partial<ScannedToken>): {
  category: TokenCategory;
  allowedActions: TokenAction[];
} {
  const { valueUSD = 0, riskScore = 0, verified = false, liquidity = 0, holders = 0 } = token;
  
  // Risk tokens first (highest priority)
  if (riskScore >= THRESHOLDS.RISK.minRisk) {
    return {
      category: 'RISK',
      allowedActions: ACTION_MATRIX.RISK,
    };
  }
  
  // Premium assets
  if (
    valueUSD >= THRESHOLDS.PREMIUM.minValue &&
    verified &&
    liquidity >= THRESHOLDS.PREMIUM.minLiquidity &&
    holders >= THRESHOLDS.PREMIUM.minHolders &&
    riskScore <= THRESHOLDS.PREMIUM.maxRisk
  ) {
    return {
      category: 'PREMIUM',
      allowedActions: ACTION_MATRIX.PREMIUM,
    };
  }
  
  // Dust tokens
  if (
    valueUSD >= THRESHOLDS.DUST.minValue &&
    valueUSD < THRESHOLDS.DUST.maxValue &&
    riskScore <= THRESHOLDS.DUST.maxRisk
  ) {
    return {
      category: 'DUST',
      allowedActions: ACTION_MATRIX.DUST,
    };
  }
  
  // Micro tokens (default for low value)
  return {
    category: 'MICRO',
    allowedActions: ACTION_MATRIX.MICRO,
  };
}

/**
 * Classify all tokens and generate summary
 */
export function classifyTokens(tokens: ScannedToken[]): {
  classified: ScannedToken[];
  summary: {
    premium: { count: number; value: number; tokens: ScannedToken[] };
    dust: { count: number; value: number; tokens: ScannedToken[] };
    micro: { count: number; value: number; tokens: ScannedToken[] };
    risk: { count: number; value: number; tokens: ScannedToken[] };
    totalValue: number;
    totalTokens: number;
  };
} {
  const classified: ScannedToken[] = [];
  const summary = {
    premium: { count: 0, value: 0, tokens: [] as ScannedToken[] },
    dust: { count: 0, value: 0, tokens: [] as ScannedToken[] },
    micro: { count: 0, value: 0, tokens: [] as ScannedToken[] },
    risk: { count: 0, value: 0, tokens: [] as ScannedToken[] },
    totalValue: 0,
    totalTokens: tokens.length,
  };
  
  for (const token of tokens) {
    const { category, allowedActions } = classifyToken(token);
    
    const classifiedToken: ScannedToken = {
      ...token,
      category,
      allowedActions,
    };
    
    classified.push(classifiedToken);
    
    // Update summary
    const categoryKey = category.toLowerCase() as 'premium' | 'dust' | 'micro' | 'risk';
    summary[categoryKey].count++;
    summary[categoryKey].value += token.valueUSD;
    summary[categoryKey].tokens.push(classifiedToken);
    summary.totalValue += token.valueUSD;
  }
  
  return { classified, summary };
}

/**
 * Get category display info
 */
export function getCategoryInfo(category: TokenCategory): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
} {
  switch (category) {
    case 'PREMIUM':
      return {
        label: 'Premium',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
        icon: '💎',
        description: 'High-value verified assets',
      };
    case 'DUST':
      return {
        label: 'Dust',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        icon: '🌾',
        description: 'Low-value tokens ($0.1-$10)',
      };
    case 'MICRO':
      return {
        label: 'Micro',
        color: 'text-neutral-700',
        bgColor: 'bg-neutral-100',
        icon: '🔬',
        description: 'Negligible value (<$0.1)',
      };
    case 'RISK':
      return {
        label: 'Risk',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: '⚠️',
        description: 'High-risk tokens (score >75)',
      };
  }
}

/**
 * Get action display info
 */
export function getActionInfo(action: TokenAction): {
  label: string;
  color: string;
  icon: string;
} {
  switch (action) {
    case 'SWAP':
      return { label: 'Swap', color: 'text-sky-600', icon: '🔄' };
    case 'HIDE':
      return { label: 'Hide', color: 'text-neutral-600', icon: '👁️' };
    case 'BURN':
      return { label: 'Burn', color: 'text-red-600', icon: '🔥' };
    case 'HOLD':
      return { label: 'Hold', color: 'text-emerald-600', icon: '💎' };
  }
}


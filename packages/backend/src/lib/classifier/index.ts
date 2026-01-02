/**
 * Token Classification Engine
 * Classifies tokens into Premium/Dust/Micro/Risk categories
 */

import { z } from 'zod';
import type { ScannedToken } from '../scanner/types';

export const TokenCategory = z.enum(['PREMIUM', 'DUST', 'MICRO', 'RISK']);
export type TokenCategory = z.infer<typeof TokenCategory>;

export interface ClassificationRules {
  PREMIUM: {
    minValue: number;        // USD
    minLiquidity: number;    // USD
    minHolders: number;
    minAge: number;          // days
    maxRisk: number;         // GoPlus score
  };
  DUST: {
    minValue: number;
    maxValue: number;
    maxRisk: number;
  };
  MICRO: {
    maxValue: number;
  };
  RISK: {
    minRisk: number;         // GoPlus score
  };
}

export const CLASSIFICATION_RULES: ClassificationRules = {
  PREMIUM: {
    minValue: 10,
    minLiquidity: 100000,
    minHolders: 500,
    minAge: 30,
    maxRisk: 40
  },
  DUST: {
    minValue: 0.10,
    maxValue: 10,
    maxRisk: 40
  },
  MICRO: {
    maxValue: 0.10
  },
  RISK: {
    minRisk: 75
  }
};

export interface TokenMetadata {
  liquidity: number;
  holders: number;
  age: number;        // days since creation
  isVerified: boolean;
}

export class TokenClassifier {
  /**
   * Classify a single token
   */
  async classifyToken(token: ScannedToken): Promise<ScannedToken> {
    // Get USD value (should already be fetched)
    const usdValue = token.valueUSD;
    
    // Get risk score (should already be fetched from GoPlus)
    const riskScore = token.riskScore;
    
    // Get metadata (liquidity, holders, age)
    const metadata = await this.getTokenMetadata(token);
    
    // Apply classification rules (order matters)
    if (riskScore >= CLASSIFICATION_RULES.RISK.minRisk) {
      return {
        ...token,
        category: 'RISK',
        allowedActions: ['HIDE']
      };
    }
    
    if (usdValue < CLASSIFICATION_RULES.MICRO.maxValue) {
      return {
        ...token,
        category: 'MICRO',
        allowedActions: ['HIDE', 'BURN']
      };
    }
    
    if (usdValue >= CLASSIFICATION_RULES.PREMIUM.minValue && 
        metadata.liquidity >= CLASSIFICATION_RULES.PREMIUM.minLiquidity && 
        metadata.holders >= CLASSIFICATION_RULES.PREMIUM.minHolders &&
        metadata.age >= CLASSIFICATION_RULES.PREMIUM.minAge &&
        riskScore <= CLASSIFICATION_RULES.PREMIUM.maxRisk) {
      return {
        ...token,
        category: 'PREMIUM',
        allowedActions: ['HOLD', 'SWAP']
      };
    }
    
    if (usdValue >= CLASSIFICATION_RULES.DUST.minValue && 
        usdValue < CLASSIFICATION_RULES.DUST.maxValue &&
        riskScore <= CLASSIFICATION_RULES.DUST.maxRisk) {
      return {
        ...token,
        category: 'DUST',
        allowedActions: ['HOLD', 'SWAP']
      };
    }
    
    // Default to MICRO if nothing else matches
    return {
      ...token,
      category: 'MICRO',
      allowedActions: ['HIDE', 'BURN']
    };
  }
  
  /**
   * Classify a batch of tokens
   */
  async classifyBatch(tokens: ScannedToken[]): Promise<ScannedToken[]> {
    const classified = await Promise.all(
      tokens.map(token => this.classifyToken(token))
    );
    
    return classified;
  }
  
  /**
   * Get token metadata (mock implementation)
   * In production, this would fetch from:
   * - DEX APIs for liquidity
  * - Explorer APIs for holder count
  * - Block explorer for creation date
   */
  private async getTokenMetadata(token: ScannedToken): Promise<TokenMetadata> {
    // Mock implementation - in production would fetch real data
    return {
      liquidity: token.liquidity || 0,
      holders: token.holders || 0,
      age: token.age || 0,
      isVerified: token.verified || false
    };
  }
}

// Export singleton instance
export const classifier = new TokenClassifier();

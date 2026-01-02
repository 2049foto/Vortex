/**
 * GoPlus API Integration
 * Fetches token security data via backend API
 */

import type { ScannedToken } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface GoPlusScanResult {
  token: {
    address: string;
    symbol: string;
    name: string;
    chain: string;
  };
  risk: {
    riskScore: number;
    riskLevel: 'SAFE' | 'WARNING' | 'DANGER';
    safe: boolean;
    honeypot: boolean;
    rugpull: boolean;
    transferability: boolean;
    risks: Array<{
      name: string;
      description: string;
      result: boolean;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  };
  cachedAt: string;
  expiresAt: string;
}

/**
 * Fetch token security from GoPlus via backend API
 */
export async function fetchTokenSecurity(
  tokenAddress: string,
  chain: string
): Promise<GoPlusScanResult | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan/${chain}/${tokenAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GoPlus API error: ${response.statusText}`);
    }

    const result = (await response.json()) as { success: boolean; data: GoPlusScanResult };
    
    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching token security:', error);
    return null;
  }
}

/**
 * Enhance token with GoPlus security data
 */
export async function enhanceTokenWithSecurity(
  token: ScannedToken
): Promise<ScannedToken> {
  // Skip if already has risk data
  if (token.riskScore > 0 || token.isHoneypot || token.isRugpull) {
    return token;
  }

  try {
    const securityData = await fetchTokenSecurity(token.address, token.chain);
    
    if (securityData) {
      return {
        ...token,
        riskScore: securityData.risk.riskScore,
        isHoneypot: securityData.risk.honeypot,
        isRugpull: securityData.risk.rugpull,
        verified: securityData.risk.safe && securityData.risk.riskLevel === 'SAFE',
      };
    }
  } catch (error) {
    console.error(`Error enhancing token ${token.address}:`, error);
  }

  return token;
}

/**
 * Batch enhance tokens with security data
 */
export async function enhanceTokensWithSecurity(
  tokens: ScannedToken[]
): Promise<ScannedToken[]> {
  // Process in batches of 5 to avoid rate limits
  const batchSize = 5;
  const enhanced: ScannedToken[] = [];

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(token => enhanceTokenWithSecurity(token))
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result && result.status === 'fulfilled') {
        enhanced.push(result.value);
      } else {
        // If enhancement fails, use original token
        const originalToken = batch[j];
        if (originalToken) {
          enhanced.push(originalToken);
        }
      }
    }

    // Small delay between batches to respect rate limits
    if (i + batchSize < tokens.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return enhanced;
}


/**
 * GoPlus API client for token security scanning
 */

import { config } from '../config';
import { GoPlusError } from '../errors';

/**
 * Chain ID mapping for GoPlus API
 */
const CHAIN_IDS: Record<string, string> = {
  ethereum: '1',
  base: '8453',
  arbitrum: '42161',
  optimism: '10',
  polygon: '137',
  bsc: '56',
  avalanche: '43114',
};

/**
 * GoPlus token security response structure
 */
export interface GoPlusTokenSecurity {
  is_honeypot?: string;
  is_open_source?: string;
  is_proxy?: string;
  is_mintable?: string;
  can_take_back_ownership?: string;
  owner_change_balance?: string;
  hidden_owner?: string;
  selfdestruct?: string;
  external_call?: string;
  buy_tax?: string;
  sell_tax?: string;
  cannot_buy?: string;
  cannot_sell_all?: string;
  slippage_modifiable?: string;
  is_blacklisted?: string;
  is_whitelisted?: string;
  is_in_dex?: string;
  transfer_pausable?: string;
  trading_cooldown?: string;
  personal_slippage_modifiable?: string;
  anti_whale_modifiable?: string;
  is_anti_whale?: string;
  holder_count?: string;
  total_supply?: string;
  holders?: Array<{ address: string; percent: number }>;
  token_name?: string;
  token_symbol?: string;
}

/**
 * Parsed risk check
 */
export interface RiskCheck {
  name: string;
  description: string;
  result: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Parsed security result
 */
export interface SecurityResult {
  riskScore: number;
  riskLevel: 'SAFE' | 'WARNING' | 'DANGER';
  safe: boolean;
  honeypot: boolean;
  rugpull: boolean;
  transferability: boolean;
  risks: RiskCheck[];
  tokenName?: string;
  tokenSymbol?: string;
}

/**
 * Fetch token security from GoPlus API with retry logic
 */
export async function fetchTokenSecurity(
  tokenAddress: string,
  chain: string,
  retries: number = 3
): Promise<GoPlusTokenSecurity | null> {
  const chainId = CHAIN_IDS[chain];
  if (!chainId) {
    throw new GoPlusError(`Unsupported chain: ${chain}`);
  }

  const url = `${config.goplus.baseUrl}/token_security/${chainId}?contract_addresses=${tokenAddress}`;
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      if (config.goplus.apiKey) {
        headers['Authorization'] = config.goplus.apiKey;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as { code: number; message?: string; result?: Record<string, GoPlusTokenSecurity> };
      
      if (data.code !== 1) {
        throw new Error(data.message || 'GoPlus API error');
      }

      const tokenData = data.result?.[tokenAddress.toLowerCase()];
      if (!tokenData) {
        return null; // Token not found
      }

      return tokenData as GoPlusTokenSecurity;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < retries) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new GoPlusError('Failed to fetch token security after retries', lastError);
}

/**
 * Parse GoPlus response into security result
 */
export function parseSecurityResult(
  data: GoPlusTokenSecurity
): SecurityResult {
  const risks: RiskCheck[] = [];
  let riskScore = 0;

  // Helper to check boolean string values
  const isTruthy = (val?: string) => val === '1' || val === 'true';
  const isFalsy = (val?: string) => val === '0' || val === 'false';

  // Honeypot check (critical)
  if (isTruthy(data.is_honeypot)) {
    riskScore += 40;
    risks.push({
      name: 'Honeypot Detected',
      description: 'This token cannot be sold after purchase',
      result: false,
      severity: 'critical',
    });
  } else if (isFalsy(data.is_honeypot)) {
    risks.push({
      name: 'Not a Honeypot',
      description: 'Token can be freely bought and sold',
      result: true,
      severity: 'low',
    });
  }

  // Open source check
  if (isFalsy(data.is_open_source)) {
    riskScore += 15;
    risks.push({
      name: 'Not Open Source',
      description: 'Contract source code is not verified',
      result: false,
      severity: 'high',
    });
  } else {
    risks.push({
      name: 'Open Source',
      description: 'Contract source code is verified',
      result: true,
      severity: 'low',
    });
  }

  // Mintable check
  if (isTruthy(data.is_mintable)) {
    riskScore += 20;
    risks.push({
      name: 'Mintable Token',
      description: 'New tokens can be minted by owner',
      result: false,
      severity: 'high',
    });
  }

  // Owner can change balance
  if (isTruthy(data.owner_change_balance)) {
    riskScore += 25;
    risks.push({
      name: 'Owner Can Modify Balances',
      description: 'Token owner can change holder balances',
      result: false,
      severity: 'critical',
    });
  }

  // Hidden owner
  if (isTruthy(data.hidden_owner)) {
    riskScore += 15;
    risks.push({
      name: 'Hidden Owner',
      description: 'Contract has a hidden owner mechanism',
      result: false,
      severity: 'high',
    });
  }

  // Self destruct
  if (isTruthy(data.selfdestruct)) {
    riskScore += 30;
    risks.push({
      name: 'Self Destruct',
      description: 'Contract can be destroyed by owner',
      result: false,
      severity: 'critical',
    });
  }

  // Buy/sell tax
  const buyTax = parseFloat(data.buy_tax || '0');
  const sellTax = parseFloat(data.sell_tax || '0');
  
  if (buyTax > 0.1 || sellTax > 0.1) {
    riskScore += 10;
    risks.push({
      name: 'High Tax',
      description: `Buy tax: ${(buyTax * 100).toFixed(1)}%, Sell tax: ${(sellTax * 100).toFixed(1)}%`,
      result: false,
      severity: 'medium',
    });
  } else if (buyTax > 0 || sellTax > 0) {
    risks.push({
      name: 'Transaction Tax',
      description: `Buy tax: ${(buyTax * 100).toFixed(1)}%, Sell tax: ${(sellTax * 100).toFixed(1)}%`,
      result: true,
      severity: 'low',
    });
  }

  // Cannot sell all
  if (isTruthy(data.cannot_sell_all)) {
    riskScore += 20;
    risks.push({
      name: 'Cannot Sell All',
      description: 'Token prevents selling full balance',
      result: false,
      severity: 'high',
    });
  }

  // Transfer pausable
  if (isTruthy(data.transfer_pausable)) {
    riskScore += 10;
    risks.push({
      name: 'Transfer Pausable',
      description: 'Token transfers can be paused',
      result: false,
      severity: 'medium',
    });
  }

  // Blacklist capability
  if (isTruthy(data.is_blacklisted)) {
    riskScore += 10;
    risks.push({
      name: 'Blacklist Function',
      description: 'Contract can blacklist addresses',
      result: false,
      severity: 'medium',
    });
  }

  // In DEX
  if (isTruthy(data.is_in_dex)) {
    risks.push({
      name: 'Listed on DEX',
      description: 'Token is tradeable on decentralized exchanges',
      result: true,
      severity: 'low',
    });
  } else {
    riskScore += 5;
    risks.push({
      name: 'Not on DEX',
      description: 'Token is not listed on known DEXes',
      result: false,
      severity: 'low',
    });
  }

  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);

  // Determine risk level
  let riskLevel: 'SAFE' | 'WARNING' | 'DANGER';
  if (riskScore <= 20) {
    riskLevel = 'SAFE';
  } else if (riskScore <= 50) {
    riskLevel = 'WARNING';
  } else {
    riskLevel = 'DANGER';
  }

  // Determine key flags
  const honeypot = isTruthy(data.is_honeypot);
  const rugpull = isTruthy(data.owner_change_balance) || isTruthy(data.selfdestruct);
  const transferability = !isTruthy(data.cannot_buy) && !isTruthy(data.cannot_sell_all);

  return {
    riskScore,
    riskLevel,
    safe: riskLevel === 'SAFE',
    honeypot,
    rugpull,
    transferability,
    risks,
    tokenName: data.token_name,
    tokenSymbol: data.token_symbol,
  };
}

export default {
  fetchTokenSecurity,
  parseSecurityResult,
};


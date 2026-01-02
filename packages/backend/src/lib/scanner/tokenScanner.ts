/**
 * Token Scanner service for Vortex Protocol
 * Coordinates GoPlus API, caching, and database
 */

import { fetchTokenSecurity, parseSecurityResult, type SecurityResult } from './goplusClient';
import { cache } from '../cache';
import { prisma } from '../db';
import { config } from '../config';
import { GoPlusError, InvalidAddressError, InvalidChainError } from '../errors';
import { isAddress } from 'viem';

/**
 * Supported chains
 */
const SUPPORTED_CHAINS = [
  'ethereum',
  'base',
  'arbitrum',
  'optimism',
  'polygon',
  'bsc',
  'avalanche',
];

/**
 * Scan result with token info
 */
export interface ScanResult {
  token: {
    address: string;
    symbol: string;
    name: string;
    chain: string;
  };
  risk: SecurityResult;
  cachedAt: string;
  expiresAt: string;
}

/**
 * Validate chain
 */
function validateChain(chain: string): void {
  if (!SUPPORTED_CHAINS.includes(chain.toLowerCase())) {
    throw new InvalidChainError(`Unsupported chain: ${chain}. Supported: ${SUPPORTED_CHAINS.join(', ')}`);
  }
}

/**
 * Validate address
 */
function validateAddress(address: string, chain: string): void {
  if (chain === 'solana') {
    // Solana addresses are base58 encoded
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      throw new InvalidAddressError('Invalid Solana address');
    }
  } else {
    // EVM addresses
    if (!isAddress(address)) {
      throw new InvalidAddressError('Invalid EVM address');
    }
  }
}

/**
 * Scan a token for security risks
 */
export async function scanToken(
  tokenAddress: string,
  chain: string
): Promise<ScanResult> {
  // Validate inputs
  validateChain(chain);
  validateAddress(tokenAddress, chain);

  const normalizedAddress = tokenAddress.toLowerCase();
  const cacheKey = cache.tokenScanKey(chain, normalizedAddress);

  // Check cache first
  const cachedResult = await cache.get<ScanResult>(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  // Check database cache
  const dbCached = await prisma.tokenCache.findUnique({
    where: {
      tokenAddress_chain: {
        tokenAddress: normalizedAddress,
        chain,
      },
    },
  });

  if (dbCached && new Date(dbCached.expiresAt) > new Date()) {
    const result: ScanResult = {
      token: {
        address: normalizedAddress,
        symbol: 'UNKNOWN',
        name: 'Unknown Token',
        chain,
      },
      risk: {
        riskScore: dbCached.riskScore,
        riskLevel: dbCached.riskLevel as 'SAFE' | 'WARNING' | 'DANGER',
        safe: dbCached.safe,
        honeypot: dbCached.honeypot,
        rugpull: dbCached.rugpull,
        transferability: dbCached.transferability,
        risks: typeof dbCached.risks === 'string' 
          ? JSON.parse(dbCached.risks)
          : dbCached.risks as SecurityResult['risks'],
      },
      cachedAt: dbCached.cachedAt.toISOString(),
      expiresAt: dbCached.expiresAt.toISOString(),
    };

    // Store in Redis cache
    await cache.set(cacheKey, result, config.cache.tokenScan);

    return result;
  }

  // Fetch from GoPlus API
  const goPlusData = await fetchTokenSecurity(normalizedAddress, chain);
  
  if (!goPlusData) {
    throw new GoPlusError('Token not found in GoPlus database');
  }

  // Parse the result
  const securityResult = parseSecurityResult(goPlusData);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.cache.tokenScan * 1000);

  // Store in database
  await prisma.tokenCache.upsert({
    where: {
      tokenAddress_chain: {
        tokenAddress: normalizedAddress,
        chain,
      },
    },
    create: {
      tokenAddress: normalizedAddress,
      chain,
      riskScore: securityResult.riskScore,
      riskLevel: securityResult.riskLevel,
      risks: JSON.stringify(securityResult.risks),
      safe: securityResult.safe,
      honeypot: securityResult.honeypot,
      rugpull: securityResult.rugpull,
      transferability: securityResult.transferability,
      cachedAt: now,
      expiresAt,
    },
    update: {
      riskScore: securityResult.riskScore,
      riskLevel: securityResult.riskLevel,
      risks: JSON.stringify(securityResult.risks),
      safe: securityResult.safe,
      honeypot: securityResult.honeypot,
      rugpull: securityResult.rugpull,
      transferability: securityResult.transferability,
      cachedAt: now,
      expiresAt,
    },
  });

  const result: ScanResult = {
    token: {
      address: normalizedAddress,
      symbol: securityResult.tokenSymbol || 'UNKNOWN',
      name: securityResult.tokenName || 'Unknown Token',
      chain,
    },
    risk: securityResult,
    cachedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  // Store in Redis cache
  await cache.set(cacheKey, result, config.cache.tokenScan);

  return result;
}

/**
 * Get cached scan result (no API call)
 */
export async function getCachedScan(
  tokenAddress: string,
  chain: string
): Promise<ScanResult | null> {
  const normalizedAddress = tokenAddress.toLowerCase();
  const cacheKey = cache.tokenScanKey(chain, normalizedAddress);

  // Check Redis first
  const cachedResult = await cache.get<ScanResult>(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  // Check database
  const dbCached = await prisma.tokenCache.findUnique({
    where: {
      tokenAddress_chain: {
        tokenAddress: normalizedAddress,
        chain,
      },
    },
  });

  if (dbCached && new Date(dbCached.expiresAt) > new Date()) {
    return {
      token: {
        address: normalizedAddress,
        symbol: 'UNKNOWN',
        name: 'Unknown Token',
        chain,
      },
      risk: {
        riskScore: dbCached.riskScore,
        riskLevel: dbCached.riskLevel as 'SAFE' | 'WARNING' | 'DANGER',
        safe: dbCached.safe,
        honeypot: dbCached.honeypot,
        rugpull: dbCached.rugpull,
        transferability: dbCached.transferability,
        risks: typeof dbCached.risks === 'string'
          ? JSON.parse(dbCached.risks)
          : dbCached.risks as SecurityResult['risks'],
      },
      cachedAt: dbCached.cachedAt.toISOString(),
      expiresAt: dbCached.expiresAt.toISOString(),
    };
  }

  return null;
}

export default {
  scanToken,
  getCachedScan,
  SUPPORTED_CHAINS,
};


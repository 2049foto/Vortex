/**
 * Portfolio API routes for Vortex Protocol
 */

import { Hono } from 'hono';
import { prisma } from '../../lib/db';
import { cache } from '../../lib/cache';
import { config } from '../../lib/config';
import { ValidationError } from '../../lib/errors';
import { isAddress } from 'viem';
import { portfolioRateLimit } from '../../middleware/rateLimit';

const portfolio = new Hono();

// Apply rate limiting to portfolio endpoints
portfolio.use('*', portfolioRateLimit);

/**
 * Token balance with price data
 */
interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: number;
  priceUSD: number;
  valueUSD: number;
  change24h: number;
  change24hPercent: number;
}

/**
 * Portfolio data
 */
interface PortfolioData {
  address: string;
  totalValueUSD: number;
  change24hUSD: number;
  change24hPercent: number;
  tokens: TokenBalance[];
  lastUpdated: string;
}

/**
 * Mock portfolio data for MVP
 * In production, this would fetch from blockchain/indexer
 */
function generateMockPortfolio(address: string): PortfolioData {
  const tokens: TokenBalance[] = [
    {
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      balance: '2500000000000000000',
      balanceFormatted: 2.5,
      priceUSD: 3200.45,
      valueUSD: 8001.13,
      change24h: 234.50,
      change24hPercent: 3.02,
    },
    {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      balance: '5000000000',
      balanceFormatted: 5000,
      priceUSD: 1.00,
      valueUSD: 5000.00,
      change24h: 0,
      change24hPercent: 0,
    },
    {
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      balance: '1500000000000000000000',
      balanceFormatted: 1500,
      priceUSD: 0.9998,
      valueUSD: 1499.70,
      change24h: -0.30,
      change24hPercent: -0.02,
    },
  ];

  const totalValueUSD = tokens.reduce((sum, t) => sum + t.valueUSD, 0);
  const change24hUSD = tokens.reduce((sum, t) => sum + t.change24h, 0);
  const change24hPercent = totalValueUSD > 0 ? (change24hUSD / (totalValueUSD - change24hUSD)) * 100 : 0;

  return {
    address: address.toLowerCase(),
    totalValueUSD,
    change24hUSD,
    change24hPercent,
    tokens,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * GET /api/portfolio/:address
 * Get portfolio for a wallet address
 */
portfolio.get('/:address', async (c) => {
  const address = c.req.param('address');
  const chain = c.req.query('chain') || 'base';

  if (!address) {
    throw new ValidationError('Address is required');
  }

  // Validate address format
  if (!isAddress(address)) {
    throw new ValidationError('Invalid wallet address format');
  }

  const cacheKey = cache.portfolioKey(address, chain);

  // Check cache first
  const cached = await cache.get<PortfolioData>(cacheKey);
  if (cached) {
    return c.json({
      success: true,
      data: cached,
      cached: true,
    });
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { walletAddress: address.toLowerCase() },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: address.toLowerCase(),
      },
    });
  }

  // Generate portfolio data (MVP: mock data)
  // In production: fetch from Moralis, Covalent, or blockchain
  const portfolioData = generateMockPortfolio(address);

  // Cache for 5 minutes
  await cache.set(cacheKey, portfolioData, config.cache.portfolio);

  return c.json({
    success: true,
    data: portfolioData,
    cached: false,
  });
});

/**
 * GET /api/portfolio/:address/transactions
 * Get transaction history for a wallet
 */
portfolio.get('/:address/transactions', async (c) => {
  const address = c.req.param('address');
  const limit = parseInt(c.req.query('limit') || '20', 10);
  const offset = parseInt(c.req.query('offset') || '0', 10);

  if (!address) {
    throw new ValidationError('Address is required');
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { walletAddress: address.toLowerCase() },
    include: {
      transactions: {
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          tokens: true,
        },
      },
    },
  });

  if (!user) {
    return c.json({
      success: true,
      data: {
        transactions: [],
        total: 0,
        hasMore: false,
      },
    });
  }

  const total = await prisma.transaction.count({
    where: { userId: user.id },
  });

  return c.json({
    success: true,
    data: {
      transactions: user.transactions.map((tx) => ({
        id: tx.id,
        txHash: tx.txHash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        chainId: tx.chainId,
        blockNumber: tx.blockNumber.toString(),
        createdAt: tx.createdAt.toISOString(),
        tokens: tx.tokens.map((t) => ({
          address: t.tokenAddress,
          symbol: t.symbol,
          name: t.name,
          amount: t.amount,
        })),
      })),
      total,
      hasMore: offset + limit < total,
    },
  });
});

export default portfolio;


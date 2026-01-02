/**
 * Database seed script for Vortex Protocol
 * Creates test data for development
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  console.log('Cleaning existing data...');
  await prisma.alert.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.transactionToken.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.tokenCache.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  console.log('Creating test users...');
  const user1 = await prisma.user.create({
    data: {
      walletAddress: '0xAdFB2776EB40e5218784386aa576ca9E08450127',
      name: 'Test User 1',
      email: 'test1@vortex.protocol',
      preferences: {
        create: {
          darkMode: true,
          notifications: true,
          language: 'en',
          theme: 'dark',
        },
      },
      achievements: {
        create: [
          { type: 'first_scan' },
          { type: 'early_adopter' },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f5Ef1F',
      name: 'Test User 2',
      preferences: {
        create: {
          darkMode: true,
          notifications: false,
          language: 'en',
          theme: 'dark',
        },
      },
    },
  });

  console.log(`Created users: ${user1.id}, ${user2.id}`);

  // Create watchlist items
  console.log('Creating watchlist items...');
  await prisma.watchlist.createMany({
    data: [
      {
        userId: user1.id,
        tokenAddress: '0x4200000000000000000000000000000000000006',
        chain: 'base',
        symbol: 'WETH',
        name: 'Wrapped Ether',
      },
      {
        userId: user1.id,
        tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        chain: 'base',
        symbol: 'USDC',
        name: 'USD Coin',
      },
      {
        userId: user1.id,
        tokenAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
        chain: 'ethereum',
        symbol: 'PEPE',
        name: 'Pepe',
      },
    ],
  });

  // Create alerts
  console.log('Creating alerts...');
  await prisma.alert.createMany({
    data: [
      {
        userId: user1.id,
        type: 'price',
        token: '0x4200000000000000000000000000000000000006',
        condition: 'above',
        value: 4000,
        enabled: true,
      },
      {
        userId: user1.id,
        type: 'price',
        token: '0x4200000000000000000000000000000000000006',
        condition: 'below',
        value: 3000,
        enabled: true,
      },
      {
        userId: user1.id,
        type: 'risk',
        token: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
        condition: 'above',
        value: 50,
        enabled: true,
      },
    ],
  });

  // Create token cache entries
  console.log('Creating token cache entries...');
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.tokenCache.createMany({
    data: [
      {
        tokenAddress: '0x4200000000000000000000000000000000000006',
        chain: 'base',
        riskScore: 5,
        riskLevel: 'SAFE',
        risks: JSON.stringify([
          { name: 'Contract Verified', description: 'Contract source code is verified', result: true, severity: 'low' },
          { name: 'No Honeypot', description: 'Token can be sold freely', result: true, severity: 'low' },
        ]),
        safe: true,
        honeypot: false,
        rugpull: false,
        transferability: true,
        expiresAt: oneHourFromNow,
      },
      {
        tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        chain: 'base',
        riskScore: 3,
        riskLevel: 'SAFE',
        risks: JSON.stringify([
          { name: 'Contract Verified', description: 'Contract source code is verified', result: true, severity: 'low' },
          { name: 'Audited', description: 'Contract has been audited', result: true, severity: 'low' },
        ]),
        safe: true,
        honeypot: false,
        rugpull: false,
        transferability: true,
        expiresAt: oneHourFromNow,
      },
      {
        tokenAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
        chain: 'ethereum',
        riskScore: 35,
        riskLevel: 'WARNING',
        risks: JSON.stringify([
          { name: 'High Concentration', description: 'Top holders own significant supply', result: false, severity: 'medium' },
          { name: 'No Honeypot', description: 'Token can be sold freely', result: true, severity: 'low' },
          { name: 'Tax Warning', description: 'Token has buy/sell tax', result: false, severity: 'medium' },
        ]),
        safe: false,
        honeypot: false,
        rugpull: false,
        transferability: true,
        expiresAt: oneHourFromNow,
      },
    ],
  });

  // Create sample transactions
  console.log('Creating sample transactions...');
  const tx = await prisma.transaction.create({
    data: {
      userId: user1.id,
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      from: user1.walletAddress,
      to: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      value: '1000000000000000000',
      chainId: 8453,
      blockNumber: BigInt(12345678),
      tokens: {
        create: [
          {
            tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            symbol: 'USDC',
            name: 'USD Coin',
            amount: '1000000000',
          },
        ],
      },
    },
  });

  console.log(`Created transaction: ${tx.id}`);

  // Summary
  const userCount = await prisma.user.count();
  const watchlistCount = await prisma.watchlist.count();
  const alertCount = await prisma.alert.count();
  const cacheCount = await prisma.tokenCache.count();

  console.log('\n✅ Seed completed successfully!');
  console.log('Summary:');
  console.log(`  - Users: ${userCount}`);
  console.log(`  - Watchlist items: ${watchlistCount}`);
  console.log(`  - Alerts: ${alertCount}`);
  console.log(`  - Cached tokens: ${cacheCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


/**
 * Database client singleton for Vortex Protocol
 * Uses Prisma ORM with PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import { config } from './config';

/**
 * Create Prisma client with logging in development
 */
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: config.isDev ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });
}

/**
 * Global Prisma client instance
 * Ensures single connection pool across hot reloads in development
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? createPrismaClient();

if (config.isDev) {
  global.prisma = prisma;
}

/**
 * Graceful shutdown handler
 */
async function shutdown() {
  await prisma.$disconnect();
}

// Handle process termination
process.on('beforeExit', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default prisma;


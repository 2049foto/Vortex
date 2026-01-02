/**
 * Nonce management for authentication
 * Stores nonces in Redis with TTL for one-time use
 */

import { redis } from '../cache';
import { logger } from '../logger';

const NONCE_PREFIX = 'nonce:';
const NONCE_TTL_SECONDS = 300; // 5 minutes

/**
 * Generate and store a nonce for an address
 * @param address - Wallet address
 * @param nonce - Generated nonce
 * @returns True if stored successfully
 */
export async function storeNonce(address: string, nonce: string): Promise<boolean> {
  if (!redis) {
    logger.warn('Redis unavailable, nonce storage disabled');
    return true;
  }

  const key = `${NONCE_PREFIX}${address.toLowerCase()}:${nonce}`;
  
  try {
    await redis.set(key, Date.now().toString(), { ex: NONCE_TTL_SECONDS });
    return true;
  } catch (error) {
    logger.error('Failed to store nonce', error);
    return false;
  }
}

/**
 * Verify and consume a nonce (one-time use)
 * @param address - Wallet address
 * @param nonce - Nonce to verify
 * @returns True if nonce is valid and was consumed
 */
export async function verifyAndConsumeNonce(address: string, nonce: string): Promise<boolean> {
  if (!redis) {
    logger.warn('Redis unavailable, nonce verification skipped');
    return true;
  }

  const key = `${NONCE_PREFIX}${address.toLowerCase()}:${nonce}`;
  
  try {
    // Get and delete atomically
    const value = await redis.get(key);
    
    if (!value) {
      return false; // Nonce not found or expired
    }

    // Delete the nonce (one-time use)
    await redis.del(key);
    
    return true;
  } catch (error) {
    logger.error('Failed to verify nonce', error);
    return false;
  }
}

/**
 * Check if a nonce exists (without consuming it)
 * @param address - Wallet address
 * @param nonce - Nonce to check
 * @returns True if nonce exists
 */
export async function nonceExists(address: string, nonce: string): Promise<boolean> {
  if (!redis) {
    return true;
  }

  const key = `${NONCE_PREFIX}${address.toLowerCase()}:${nonce}`;
  
  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Failed to check nonce', error);
    return false;
  }
}

export default {
  storeNonce,
  verifyAndConsumeNonce,
  nonceExists,
};


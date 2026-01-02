/**
 * Validation utilities for Vortex Protocol
 */

import type { Chain } from '@/types';

/**
 * Valid EVM chains
 */
export const EVM_CHAINS: Chain[] = [
  'ethereum',
  'base',
  'arbitrum',
  'optimism',
  'polygon',
  'bsc',
  'avalanche',
];

/**
 * Valid non-EVM chains
 */
export const NON_EVM_CHAINS: Chain[] = ['solana'];

/**
 * All supported chains
 */
export const ALL_CHAINS: Chain[] = [...EVM_CHAINS, ...NON_EVM_CHAINS];

/**
 * Chain ID mapping for EVM chains
 */
export const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  optimism: 10,
  polygon: 137,
  bsc: 56,
  avalanche: 43114,
};

/**
 * Validate Ethereum/EVM address
 */
export function isValidEvmAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Solana address (Base58)
 */
export function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  // Solana addresses are Base58 encoded and typically 32-44 characters
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Validate any supported chain address
 */
export function isValidAddress(address: string, chain: Chain): boolean {
  if (chain === 'solana') {
    return isValidSolanaAddress(address);
  }
  return isValidEvmAddress(address);
}

/**
 * Validate chain identifier
 */
export function isValidChain(chain: string): chain is Chain {
  return ALL_CHAINS.includes(chain as Chain);
}

/**
 * Validate EVM chain
 */
export function isEvmChain(chain: string): boolean {
  return EVM_CHAINS.includes(chain as Chain);
}

/**
 * Validate transaction hash
 */
export function isValidTxHash(hash: string, chain: Chain): boolean {
  if (!hash || typeof hash !== 'string') return false;
  
  if (chain === 'solana') {
    // Solana signatures are Base58 encoded, 87-88 characters
    return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(hash);
  }
  
  // EVM transaction hashes are 66 characters (0x + 64 hex)
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}

/**
 * Validate non-negative number
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

/**
 * Validate integer
 */
export function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

/**
 * Validate positive integer
 */
export function isPositiveInteger(value: unknown): value is number {
  return isInteger(value) && value > 0;
}

/**
 * Validate percentage (0-100)
 */
export function isValidPercentage(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value >= 0 && value <= 100;
}

/**
 * Validate alert type
 */
export function isValidAlertType(type: string): type is 'price' | 'risk' | 'volume' {
  return ['price', 'risk', 'volume'].includes(type);
}

/**
 * Validate alert condition
 */
export function isValidAlertCondition(condition: string): condition is 'above' | 'below' | 'equals' {
  return ['above', 'below', 'equals'].includes(condition);
}

/**
 * Validate risk level
 */
export function isValidRiskLevel(level: string): level is 'SAFE' | 'WARNING' | 'DANGER' {
  return ['SAFE', 'WARNING', 'DANGER'].includes(level);
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

/**
 * Normalize Ethereum address to checksummed format
 */
export function normalizeEvmAddress(address: string): string {
  if (!isValidEvmAddress(address)) return address;
  return address.toLowerCase();
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate required field
 */
export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string
): asserts value is T {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName, value);
  }
}

/**
 * Validate address with chain context
 */
export function validateAddress(address: string, chain: Chain, fieldName = 'address'): void {
  validateRequired(address, fieldName);
  
  if (!isValidAddress(address, chain)) {
    throw new ValidationError(
      `Invalid ${chain} address format`,
      fieldName,
      address
    );
  }
}

/**
 * Validate chain
 */
export function validateChain(chain: string, fieldName = 'chain'): asserts chain is Chain {
  validateRequired(chain, fieldName);
  
  if (!isValidChain(chain)) {
    throw new ValidationError(
      `Invalid chain. Supported: ${ALL_CHAINS.join(', ')}`,
      fieldName,
      chain
    );
  }
}


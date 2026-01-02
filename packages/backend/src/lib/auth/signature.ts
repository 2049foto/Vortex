/**
 * Web3 signature verification for Vortex Protocol
 * Handles EVM wallet signature verification
 */

import { recoverMessageAddress, type Address, isAddress } from 'viem';
import { config } from '../config';

/**
 * Generate a message for wallet signing
 * @param address - Wallet address
 * @returns Message object with nonce and timestamp
 */
export function generateSignMessage(address: string): {
  message: string;
  nonce: string;
  timestamp: number;
} {
  const timestamp = Date.now();
  const nonce = generateNonce();
  
  const message = [
    config.auth.messagePrefix,
    `Address: ${address}`,
    `Nonce: ${nonce}`,
    `Timestamp: ${timestamp}`,
    '',
    'This signature will be used to authenticate your wallet.',
  ].join('\n');

  return { message, nonce, timestamp };
}

/**
 * Generate a random nonce
 * @returns Random nonce string
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify an EVM signature and recover the signer address
 * @param message - Original message that was signed
 * @param signature - Signature hex string
 * @returns Recovered address or null if invalid
 */
export async function verifyEVMSignature(
  message: string,
  signature: `0x${string}`
): Promise<Address | null> {
  try {
    const recoveredAddress = await recoverMessageAddress({
      message,
      signature,
    });
    return recoveredAddress;
  } catch (error) {
    return null;
  }
}

/**
 * Verify that a signature matches the expected address
 * @param message - Original message
 * @param signature - Signature hex string
 * @param expectedAddress - Expected signer address
 * @returns True if signature is valid and matches address
 */
export async function verifySignatureForAddress(
  message: string,
  signature: `0x${string}`,
  expectedAddress: string
): Promise<boolean> {
  const recoveredAddress = await verifyEVMSignature(message, signature);
  
  if (!recoveredAddress) return false;
  
  // Compare addresses case-insensitively
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
}

/**
 * Validate message timestamp (prevent replay attacks)
 * @param timestamp - Message timestamp
 * @param maxAgeMs - Maximum allowed age in milliseconds (default: 5 minutes)
 * @returns True if timestamp is valid
 */
export function isValidTimestamp(
  timestamp: number,
  maxAgeMs: number = 5 * 60 * 1000
): boolean {
  const now = Date.now();
  const age = now - timestamp;
  
  // Reject if too old or in the future
  return age >= 0 && age <= maxAgeMs;
}

/**
 * Validate Ethereum address format
 * @param address - Address to validate
 * @returns True if valid EVM address
 */
export function isValidEVMAddress(address: string): boolean {
  return isAddress(address);
}

/**
 * Normalize address to lowercase
 * @param address - Address to normalize
 * @returns Lowercase address
 */
export function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

export default {
  generateSignMessage,
  verifyEVMSignature,
  verifySignatureForAddress,
  isValidTimestamp,
  isValidEVMAddress,
  normalizeAddress,
};


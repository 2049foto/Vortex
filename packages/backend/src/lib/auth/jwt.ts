/**
 * JWT utilities for Vortex Protocol
 * Handles token generation and verification
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { config } from '../config';

/**
 * JWT payload structure
 */
export interface VortexJWTPayload extends JWTPayload {
  userId: string;
  walletAddress: string;
  iat?: number;
  exp?: number;
}

/**
 * Get secret key as Uint8Array
 */
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(config.auth.jwtSecret);
}

/**
 * Generate a JWT token for a user
 * @param userId - User ID
 * @param walletAddress - User's wallet address
 * @returns JWT token string
 */
export async function generateJWT(
  userId: string,
  walletAddress: string
): Promise<string> {
  const secretKey = getSecretKey();
  const jti = crypto.randomUUID(); // Unique token ID for revocation support
  
  const token = await new SignJWT({
    userId,
    walletAddress: walletAddress.toLowerCase(),
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(config.auth.jwtExpiresIn)
    .setIssuer('vortex-protocol')
    .setAudience('vortex-app')
    .setJti(jti)
    .setSubject(userId)
    .sign(secretKey);

  return token;
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export async function verifyJWT(
  token: string
): Promise<VortexJWTPayload | null> {
  try {
    const secretKey = getSecretKey();
    
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: 'vortex-protocol',
      audience: 'vortex-app',
    });

    return payload as VortexJWTPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1] || null;
}

/**
 * Get token expiration date
 * @returns Expiration date
 */
export function getTokenExpiration(): Date {
  // Parse expiration string (e.g., '7d')
  const match = config.auth.jwtExpiresIn.match(/^(\d+)([dhms])$/);
  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
  }

  const value = parseInt(match[1] || '7', 10);
  const unit = match[2];
  
  let ms = 0;
  switch (unit) {
    case 'd': ms = value * 24 * 60 * 60 * 1000; break;
    case 'h': ms = value * 60 * 60 * 1000; break;
    case 'm': ms = value * 60 * 1000; break;
    case 's': ms = value * 1000; break;
    default: ms = 7 * 24 * 60 * 60 * 1000;
  }

  return new Date(Date.now() + ms);
}

export default { generateJWT, verifyJWT, extractToken, getTokenExpiration };


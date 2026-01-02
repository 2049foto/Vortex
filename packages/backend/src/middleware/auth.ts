/**
 * Authentication middleware for Vortex Protocol
 */

import { type Context, type Next } from 'hono';
import { verifyJWT, extractToken, type VortexJWTPayload } from '../lib/auth/jwt';
import { UnauthorizedError, TokenExpiredError } from '../lib/errors';
import { prisma } from '../lib/db';

/**
 * Extend Hono context with user info
 */
declare module 'hono' {
  interface ContextVariableMap {
    user: {
      id: string;
      walletAddress: string;
    };
    jwtPayload: VortexJWTPayload;
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to context
 */
export function authMiddleware() {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);

    if (!token) {
      throw new UnauthorizedError('Missing authentication token');
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      throw new TokenExpiredError('Invalid or expired token');
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, walletAddress: true },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to context
    c.set('user', {
      id: user.id,
      walletAddress: user.walletAddress,
    });
    c.set('jwtPayload', payload);

    await next();
  };
}

/**
 * Optional authentication middleware
 * Sets user if token is valid, but doesn't require it
 */
export function optionalAuthMiddleware() {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);

    if (token) {
      const payload = await verifyJWT(token);

      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, walletAddress: true },
        });

        if (user) {
          c.set('user', {
            id: user.id,
            walletAddress: user.walletAddress,
          });
          c.set('jwtPayload', payload);
        }
      }
    }

    await next();
  };
}

export default authMiddleware;


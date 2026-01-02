/**
 * Authentication API routes for Vortex Protocol
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { generateJWT, verifyJWT, extractToken, getTokenExpiration } from '../../lib/auth/jwt';
import { generateSignMessage, verifySignatureForAddress, isValidEVMAddress, isValidTimestamp } from '../../lib/auth/signature';
import { storeNonce, verifyAndConsumeNonce } from '../../lib/auth/nonce';
import { prisma } from '../../lib/db';
import { ValidationError, InvalidSignatureError, UnauthorizedError } from '../../lib/errors';
import { authRateLimit } from '../../middleware/rateLimit';

const auth = new Hono();

// Apply rate limiting to auth endpoints
auth.use('*', authRateLimit);

/**
 * Request schemas
 */
const messageSchema = z.object({
  address: z.string().min(1, 'Address is required'),
});

const loginSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
});

/**
 * POST /api/auth/message
 * Get a message for wallet signing
 */
auth.post('/message', async (c) => {
  const body = await c.req.json();
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Invalid request body', parsed.error.flatten().fieldErrors);
  }

  const { address } = parsed.data;

  // Validate address format
  if (!isValidEVMAddress(address)) {
    throw new ValidationError('Invalid wallet address format');
  }

  // Generate signing message
  const { message, nonce, timestamp } = generateSignMessage(address);

  // Store nonce in Redis for one-time use
  await storeNonce(address, nonce);

  return c.json({
    success: true,
    data: {
      message,
      nonce,
      timestamp,
    },
  });
});

/**
 * POST /api/auth/login
 * Login with wallet signature
 */
auth.post('/login', async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Invalid request body', parsed.error.flatten().fieldErrors);
  }

  const { address, signature, message } = parsed.data;

  // Validate address format
  if (!isValidEVMAddress(address)) {
    throw new ValidationError('Invalid wallet address format');
  }

  // Extract nonce and timestamp from message for validation
  const nonceMatch = message.match(/Nonce: ([a-f0-9]+)/);
  const timestampMatch = message.match(/Timestamp: (\d+)/);
  
  if (!nonceMatch || !timestampMatch) {
    throw new ValidationError('Invalid message format');
  }

  const nonce = nonceMatch[1];
  const timestamp = parseInt(timestampMatch[1] || '0', 10);

  // Validate timestamp (5 minute window)
  if (!isValidTimestamp(timestamp)) {
    throw new InvalidSignatureError('Message expired. Please request a new message.');
  }

  // Verify and consume nonce (one-time use)
  const nonceValid = await verifyAndConsumeNonce(address, nonce || '');
  if (!nonceValid) {
    throw new InvalidSignatureError('Invalid or already used nonce');
  }

  // Verify signature
  const isValid = await verifySignatureForAddress(
    message,
    signature as `0x${string}`,
    address
  );

  if (!isValid) {
    throw new InvalidSignatureError('Signature verification failed');
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { walletAddress: address.toLowerCase() },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: address.toLowerCase(),
        preferences: {
          create: {
            darkMode: true,
            notifications: true,
            language: 'en',
            theme: 'dark',
          },
        },
      },
    });

    // Grant first_scan achievement
    await prisma.userAchievement.create({
      data: {
        userId: user.id,
        type: 'early_adopter',
      },
    }).catch(() => {}); // Ignore if already exists
  }

  // Generate JWT
  const token = await generateJWT(user.id, user.walletAddress);
  const expiresAt = getTokenExpiration();

  return c.json({
    success: true,
    token,
    user: {
      id: user.id,
      walletAddress: user.walletAddress,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    expiresAt: expiresAt.toISOString(),
  });
});

/**
 * POST /api/auth/verify
 * Verify JWT token
 */
auth.post('/verify', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);

  if (!token) {
    throw new UnauthorizedError('No token provided');
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return c.json({
      valid: false,
    });
  }

  // Verify user still exists
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, walletAddress: true },
  });

  if (!user) {
    return c.json({
      valid: false,
    });
  }

  return c.json({
    valid: true,
    user: {
      id: user.id,
      walletAddress: user.walletAddress,
    },
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : undefined,
  });
});

export default auth;


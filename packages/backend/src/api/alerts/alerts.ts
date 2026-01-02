/**
 * Alerts API routes for Vortex Protocol
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../../lib/db';
import { ValidationError, NotFoundError } from '../../lib/errors';
import { authMiddleware } from '../../middleware/auth';

const alerts = new Hono();

// Apply auth middleware to all routes
alerts.use('*', authMiddleware());

/**
 * Request schemas
 */
const createSchema = z.object({
  type: z.enum(['price', 'risk', 'volume']),
  token: z.string().min(1, 'Token address is required'),
  condition: z.enum(['above', 'below', 'equals']),
  value: z.number().positive('Value must be positive'),
});

const updateSchema = z.object({
  enabled: z.boolean().optional(),
  value: z.number().positive('Value must be positive').optional(),
  condition: z.enum(['above', 'below', 'equals']).optional(),
});

/**
 * GET /api/alerts
 * Get all alerts for the authenticated user
 */
alerts.get('/', async (c) => {
  const user = c.get('user');

  const items = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return c.json({
    success: true,
    data: items.map((item) => ({
      id: item.id,
      userId: item.userId,
      type: item.type,
      token: item.token,
      condition: item.condition,
      value: item.value,
      enabled: item.enabled,
      createdAt: item.createdAt.toISOString(),
    })),
  });
});

/**
 * POST /api/alerts
 * Create a new alert
 */
alerts.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Invalid request body', parsed.error.flatten().fieldErrors);
  }

  const { type, token, condition, value } = parsed.data;

  // Create alert
  const alert = await prisma.alert.create({
    data: {
      userId: user.id,
      type,
      token: token.toLowerCase(),
      condition,
      value,
      enabled: true,
    },
  });

  return c.json(
    {
      success: true,
      data: {
        id: alert.id,
        userId: alert.userId,
        type: alert.type,
        token: alert.token,
        condition: alert.condition,
        value: alert.value,
        enabled: alert.enabled,
        createdAt: alert.createdAt.toISOString(),
      },
    },
    201
  );
});

/**
 * PATCH /api/alerts/:id
 * Update an alert
 */
alerts.patch('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Invalid request body', parsed.error.flatten().fieldErrors);
  }

  if (!id) {
    throw new ValidationError('Alert ID is required');
  }

  // Find the alert
  const existing = await prisma.alert.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError('Alert not found');
  }

  // Verify ownership
  if (existing.userId !== user.id) {
    throw new NotFoundError('Alert not found');
  }

  // Update alert
  const alert = await prisma.alert.update({
    where: { id },
    data: parsed.data,
  });

  return c.json({
    success: true,
    data: {
      id: alert.id,
      userId: alert.userId,
      type: alert.type,
      token: alert.token,
      condition: alert.condition,
      value: alert.value,
      enabled: alert.enabled,
      createdAt: alert.createdAt.toISOString(),
    },
  });
});

/**
 * DELETE /api/alerts/:id
 * Delete an alert
 */
alerts.delete('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');

  if (!id) {
    throw new ValidationError('Alert ID is required');
  }

  // Find the alert
  const existing = await prisma.alert.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError('Alert not found');
  }

  // Verify ownership
  if (existing.userId !== user.id) {
    throw new NotFoundError('Alert not found');
  }

  // Delete alert
  await prisma.alert.delete({
    where: { id },
  });

  return c.json({
    success: true,
    message: 'Alert deleted',
  });
});

export default alerts;


/**
 * Error handling middleware for Vortex Protocol
 */

import { type Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ApiError, isApiError, toApiError } from '../lib/errors';
import { config } from '../lib/config';
import { logger } from '../lib/logger';

/**
 * Error response structure
 */
interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  status: number;
  timestamp: string;
  details?: Record<string, unknown>;
  stack?: string;
}

/**
 * Global error handler
 * Converts all errors to consistent JSON response format
 */
export function errorHandler(err: Error, c: Context): Response {
  // Log error using structured logger
  logger.error('Request error', err, {
    path: c.req.path,
    method: c.req.method,
  });

  let apiError: ApiError;

  // Handle Hono HTTP exceptions
  if (err instanceof HTTPException) {
    apiError = new ApiError(
      err.message || 'An error occurred',
      'HTTP_ERROR',
      err.status
    );
  } 
  // Handle our custom API errors
  else if (isApiError(err)) {
    apiError = err;
  }
  // Handle unknown errors
  else {
    apiError = toApiError(err);
  }

  const response: ErrorResponse = {
    success: false,
    error: apiError.message,
    code: apiError.code,
    status: apiError.status,
    timestamp: new Date().toISOString(),
  };

  // Include details if present
  if (apiError.details) {
    response.details = apiError.details;
  }

  // Include stack trace in development
  if (config.isDev && err.stack) {
    response.stack = err.stack;
  }

  return c.json(response, apiError.status as 400);
}

/**
 * Not found handler
 */
export function notFoundHandler(c: Context): Response {
  return c.json(
    {
      success: false,
      error: 'Not Found',
      code: 'NOT_FOUND',
      status: 404,
      timestamp: new Date().toISOString(),
    },
    404
  );
}

export default errorHandler;


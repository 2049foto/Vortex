/**
 * Custom error classes for Vortex Protocol
 */

/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      status: this.status,
      timestamp: new Date().toISOString(),
      ...(this.details && { details: this.details }),
    };
  }
}

/**
 * Authentication errors
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    super(message, code, 401);
    this.name = 'UnauthorizedError';
  }
}

export class InvalidSignatureError extends UnauthorizedError {
  constructor(message: string = 'Invalid signature') {
    super(message, 'INVALID_SIGNATURE');
    this.name = 'InvalidSignatureError';
  }
}

export class TokenExpiredError extends UnauthorizedError {
  constructor(message: string = 'Token expired') {
    super(message, 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class InvalidAddressError extends ValidationError {
  constructor(message: string = 'Invalid address format') {
    super(message, { field: 'address' });
    this.name = 'InvalidAddressError';
  }
}

export class InvalidChainError extends ValidationError {
  constructor(message: string = 'Invalid or unsupported chain') {
    super(message, { field: 'chain' });
    this.name = 'InvalidChainError';
  }
}

/**
 * Resource errors
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', resource?: string) {
    super(message, 'NOT_FOUND', 404, resource ? { resource } : undefined);
    this.name = 'NotFoundError';
  }
}

export class AlreadyExistsError extends ApiError {
  constructor(message: string = 'Resource already exists', resource?: string) {
    super(message, 'ALREADY_EXISTS', 409, resource ? { resource } : undefined);
    this.name = 'AlreadyExistsError';
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends ApiError {
  constructor(
    message: string = 'Too many requests',
    retryAfterSeconds?: number
  ) {
    super(message, 'RATE_LIMITED', 429, retryAfterSeconds ? { retryAfter: retryAfterSeconds } : undefined);
    this.name = 'RateLimitError';
  }
}

/**
 * External API errors
 */
export class ExternalApiError extends ApiError {
  constructor(message: string, service: string, originalError?: unknown) {
    super(message, 'EXTERNAL_API_ERROR', 503, {
      service,
      originalError: originalError instanceof Error ? originalError.message : String(originalError),
    });
    this.name = 'ExternalApiError';
  }
}

export class GoPlusError extends ExternalApiError {
  constructor(message: string = 'GoPlus API error', originalError?: unknown) {
    super(message, 'goplus', originalError);
    this.name = 'GoPlusError';
    this.code = 'GOPLUS_ERROR';
  }
}

/**
 * Server errors
 */
export class InternalError extends ApiError {
  constructor(message: string = 'Internal server error', details?: Record<string, unknown>) {
    super(message, 'INTERNAL_ERROR', 500, details);
    this.name = 'InternalError';
  }
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Convert unknown error to ApiError
 */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalError(error.message);
  }

  return new InternalError(String(error));
}

export default {
  ApiError,
  UnauthorizedError,
  InvalidSignatureError,
  TokenExpiredError,
  ValidationError,
  InvalidAddressError,
  InvalidChainError,
  NotFoundError,
  AlreadyExistsError,
  RateLimitError,
  ExternalApiError,
  GoPlusError,
  InternalError,
  isApiError,
  toApiError,
};


/**
 * Error class tests
 */

import { describe, test, expect } from 'bun:test';
import {
  ApiError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  AlreadyExistsError,
  RateLimitError,
  isApiError,
  toApiError,
} from '../../src/lib/errors';

describe('Error Classes', () => {
  describe('ApiError', () => {
    test('should create error with correct properties', () => {
      const error = new ApiError('Test error', 'TEST_ERROR', 400);
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.status).toBe(400);
      expect(error.name).toBe('ApiError');
    });

    test('should convert to JSON correctly', () => {
      const error = new ApiError('Test error', 'TEST_ERROR', 400, { field: 'test' });
      const json = error.toJSON();
      
      expect(json.success).toBe(false);
      expect(json.error).toBe('Test error');
      expect(json.code).toBe('TEST_ERROR');
      expect(json.status).toBe(400);
      expect(json.details).toEqual({ field: 'test' });
      expect(json.timestamp).toBeDefined();
    });
  });

  describe('UnauthorizedError', () => {
    test('should have correct defaults', () => {
      const error = new UnauthorizedError();
      
      expect(error.message).toBe('Unauthorized');
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.status).toBe(401);
    });

    test('should accept custom message', () => {
      const error = new UnauthorizedError('Custom message');
      expect(error.message).toBe('Custom message');
    });
  });

  describe('ValidationError', () => {
    test('should have correct status', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.status).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    test('should include details', () => {
      const error = new ValidationError('Invalid input', { field: 'email' });
      expect(error.details).toEqual({ field: 'email' });
    });
  });

  describe('NotFoundError', () => {
    test('should have correct status', () => {
      const error = new NotFoundError();
      
      expect(error.status).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });
  });

  describe('AlreadyExistsError', () => {
    test('should have correct status', () => {
      const error = new AlreadyExistsError();
      
      expect(error.status).toBe(409);
      expect(error.code).toBe('ALREADY_EXISTS');
    });
  });

  describe('RateLimitError', () => {
    test('should have correct status', () => {
      const error = new RateLimitError();
      
      expect(error.status).toBe(429);
      expect(error.code).toBe('RATE_LIMITED');
    });
  });

  describe('isApiError', () => {
    test('should identify ApiError instances', () => {
      expect(isApiError(new ApiError('test', 'TEST', 400))).toBe(true);
      expect(isApiError(new ValidationError('test'))).toBe(true);
      expect(isApiError(new Error('test'))).toBe(false);
      expect(isApiError('string')).toBe(false);
    });
  });

  describe('toApiError', () => {
    test('should return ApiError unchanged', () => {
      const original = new ValidationError('test');
      const result = toApiError(original);
      expect(result).toBe(original);
    });

    test('should convert Error to ApiError', () => {
      const original = new Error('test message');
      const result = toApiError(original);
      
      expect(isApiError(result)).toBe(true);
      expect(result.message).toBe('test message');
    });

    test('should convert string to ApiError', () => {
      const result = toApiError('error string');
      
      expect(isApiError(result)).toBe(true);
      expect(result.message).toBe('error string');
    });
  });
});


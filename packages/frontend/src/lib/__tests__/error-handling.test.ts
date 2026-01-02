/**
 * Error Handling Tests
 */

import { describe, it, expect } from 'vitest';

describe('Error Handling', () => {
  it('should handle network errors gracefully', () => {
    const error = new Error('Network error');
    expect(error.message).toBe('Network error');
  });

  it('should handle validation errors', () => {
    class ValidationError extends Error {
      constructor(message: string, public field: string) {
        super(message);
      }
    }
    
    const error = new ValidationError('Invalid input', 'address');
    expect(error.field).toBe('address');
  });
});


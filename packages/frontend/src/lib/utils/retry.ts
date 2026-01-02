/**
 * Retry Utility
 * Implements exponential backoff retry logic
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryable?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryable: () => true,
};

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      if (!opts.retryable(lastError)) {
        throw lastError;
      }

      // Don't wait after last attempt
      if (attempt === opts.maxAttempts) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt - 1),
        opts.maxDelay
      );

      console.warn(
        `Retry attempt ${attempt}/${opts.maxAttempts} failed. Retrying in ${delay}ms...`,
        lastError
      );

      await sleep(delay);
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Retry with custom retry condition
 */
export function retryOnNetworkError<T>(
  fn: () => Promise<T>,
  options: Omit<RetryOptions, 'retryable'> = {}
): Promise<T> {
  return retry(fn, {
    ...options,
    retryable: (error) => {
      // Retry on network errors, timeouts, and 5xx errors
      const message = error.message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('fetch') ||
        message.includes('connection')
      );
    },
  });
}


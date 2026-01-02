/**
 * Generic API hook with loading, error, and retry states
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiRequestError } from '@/lib/api';

/**
 * API state
 */
interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
}

/**
 * API hook options
 */
interface UseApiOptions<T> {
  /** Initial data */
  initialData?: T | null;
  /** Fetch on mount */
  fetchOnMount?: boolean;
  /** Retry count */
  retryCount?: number;
  /** Retry delay in ms */
  retryDelay?: number;
  /** Cache duration in ms */
  cacheDuration?: number;
  /** On success callback */
  onSuccess?: (data: T) => void;
  /** On error callback */
  onError?: (error: string, code: string | null) => void;
}

/**
 * API hook return type
 */
interface UseApiReturn<T, P extends unknown[]> {
  /** Fetched data */
  data: T | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Error code */
  errorCode: string | null;
  /** Execute the API call */
  execute: (...params: P) => Promise<T | null>;
  /** Reset state */
  reset: () => void;
  /** Retry last call */
  retry: () => Promise<T | null>;
  /** Set data manually */
  setData: (data: T | null) => void;
}

/**
 * Generic API hook for handling async operations
 */
export function useApi<T, P extends unknown[] = []>(
  apiFunction: (...params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const {
    initialData = null,
    fetchOnMount = false,
    retryCount = 0,
    retryDelay = 1000,
    cacheDuration = 0,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    errorCode: null,
  });

  const lastParamsRef = useRef<P | null>(null);
  const cacheTimeRef = useRef<number>(0);
  const mountedRef = useRef(true);

  /**
   * Set data manually
   */
  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      errorCode: null,
    });
    lastParamsRef.current = null;
    cacheTimeRef.current = 0;
  }, [initialData]);

  /**
   * Execute API call
   */
  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      // Check cache
      if (
        cacheDuration > 0 &&
        state.data !== null &&
        Date.now() - cacheTimeRef.current < cacheDuration
      ) {
        return state.data;
      }

      lastParamsRef.current = params;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        errorCode: null,
      }));

      let attempts = 0;
      const maxAttempts = retryCount + 1;

      while (attempts < maxAttempts) {
        try {
          const result = await apiFunction(...params);

          if (!mountedRef.current) return null;

          setState({
            data: result,
            isLoading: false,
            error: null,
            errorCode: null,
          });

          cacheTimeRef.current = Date.now();
          onSuccess?.(result);

          return result;
        } catch (err) {
          attempts++;

          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay * attempts));
            continue;
          }

          if (!mountedRef.current) return null;

          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          const errorCode = err instanceof ApiRequestError ? err.code : null;

          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
            errorCode,
          }));

          onError?.(errorMessage, errorCode);
          return null;
        }
      }

      return null;
    },
    [apiFunction, cacheDuration, retryCount, retryDelay, onSuccess, onError, state.data]
  );

  /**
   * Retry last call
   */
  const retry = useCallback(async (): Promise<T | null> => {
    if (lastParamsRef.current) {
      return execute(...lastParamsRef.current);
    }
    return null;
  }, [execute]);

  /**
   * Fetch on mount if enabled
   */
  useEffect(() => {
    mountedRef.current = true;

    if (fetchOnMount) {
      execute(...([] as unknown as P));
    }

    return () => {
      mountedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    errorCode: state.errorCode,
    execute,
    reset,
    retry,
    setData,
  };
}

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 */
export function useMutation<T, P extends unknown[] = []>(
  mutationFunction: (...params: P) => Promise<T>,
  options: Omit<UseApiOptions<T>, 'fetchOnMount' | 'cacheDuration'> = {}
): UseApiReturn<T, P> {
  return useApi(mutationFunction, {
    ...options,
    fetchOnMount: false,
    cacheDuration: 0,
  });
}

export default useApi;


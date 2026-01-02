/**
 * Authentication hook for Vortex Protocol
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api';

import type { User } from '@/types';

/**
 * Hook return type
 */
interface UseAuthReturn {
  /** Current user */
  user: User | null;
  /** Is user authenticated */
  isAuthenticated: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Login with wallet */
  login: (address: string, signMessage: (message: string) => Promise<string>) => Promise<void>;
  /** Logout */
  logout: () => void;
  /** Verify token */
  verify: () => Promise<boolean>;
  /** Clear error */
  clearError: () => void;
}

/**
 * Authentication hook
 * Handles wallet-based authentication flow
 */
export function useAuth(): UseAuthReturn {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setAuth,
    clearAuth,
    setLoading,
    setError,
    logout: storeLogout,
  } = useAuthStore();

  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Login with wallet signature
   */
  const login = useCallback(
    async (address: string, signMessage: (message: string) => Promise<string>) => {
      setLoading(true);
      setError(null);

      try {
        // Get message to sign from backend
        const { message } = await authApi.getMessage(address);
        
        // Request signature from wallet
        const signature = await signMessage(message);

        // Send to backend for verification
        const response = await authApi.login({
          address,
          signature,
          message,
        });

        if (response.success && response.token && response.user) {
          setAuth(response.user, response.token);
        } else {
          throw new Error('Login failed');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      }
    },
    [setAuth, setLoading, setError]
  );

  /**
   * Logout
   */
  const logout = useCallback(() => {
    storeLogout();
    clearAuth();
  }, [storeLogout, clearAuth]);

  /**
   * Verify current token
   */
  const verify = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated) return false;

    setIsVerifying(true);
    try {
      const response = await authApi.verify();
      if (!response.valid) {
        logout();
        return false;
      }
      return true;
    } catch {
      logout();
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [isAuthenticated, logout]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Verify token on mount if authenticated
   */
  useEffect(() => {
    if (isAuthenticated && !isVerifying) {
      verify();
    }
  }, []); // Only on mount

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isVerifying,
    error,
    login,
    logout,
    verify,
    clearError,
  };
}

/**
 * Hook to get just the current user
 */
export function useUser() {
  return useAuthStore((state) => state.user);
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}

export default useAuth;


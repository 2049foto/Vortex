/**
 * Authentication store using Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi, removeAuthToken } from '@/lib/api';

interface AuthState {
  /** Current authenticated user */
  user: User | null;
  /** JWT token */
  token: string | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
}

interface AuthActions {
  /** Set user and token after successful login */
  setAuth: (user: User, token: string) => void;
  /** Clear authentication state */
  clearAuth: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Login with wallet signature */
  login: (address: string, signature: string, message: string) => Promise<void>;
  /** Verify current token */
  verify: () => Promise<boolean>;
  /** Logout */
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

/**
 * Initial state
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Auth store with persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      clearAuth: () => {
        removeAuthToken();
        set(initialState);
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      login: async (address: string, signature: string, message: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login({
            address,
            signature,
            message,
          });

          if (response.success && response.token && response.user) {
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Login failed');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      verify: async () => {
        const { token } = get();
        if (!token) {
          get().clearAuth();
          return false;
        }

        try {
          const response = await authApi.verify();
          if (response.valid && response.user) {
            return true;
          }
          get().clearAuth();
          return false;
        } catch {
          get().clearAuth();
          return false;
        }
      },

      logout: () => {
        authApi.logout();
        get().clearAuth();
      },
    }),
    {
      name: 'vortex-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Selector hooks for better performance
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);


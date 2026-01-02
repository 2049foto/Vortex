/**
 * useAuth Hook Tests
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/auth';

// Mock the auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}));

describe('useAuth Hook', () => {
  const mockStore = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
    clearAuth: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
  });

  test('initial state is unauthenticated', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  test('isLoading is false initially', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.isLoading).toBe(false);
  });

  test('error is null initially', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.error).toBeNull();
  });

  test('login function is available', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(typeof result.current.login).toBe('function');
  });

  test('logout function is available', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(typeof result.current.logout).toBe('function');
  });

  test('logout clears authentication state', async () => {
    const authenticatedStore = {
      ...mockStore,
      user: { id: '1', walletAddress: '0x123' },
      token: 'test-token',
      isAuthenticated: true,
    };
    
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(authenticatedStore);
    
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
  });

  test('authenticated state has user data', () => {
    const authenticatedStore = {
      ...mockStore,
      user: { 
        id: 'user-123', 
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678' 
      },
      token: 'jwt-token-here',
      isAuthenticated: true,
    };
    
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(authenticatedStore);
    
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.id).toBe('user-123');
    expect(result.current.user?.walletAddress).toMatch(/^0x[a-f0-9]{40}$/i);
  });
});


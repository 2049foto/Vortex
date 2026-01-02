/**
 * API client for Vortex Protocol backend
 * Handles all HTTP requests with authentication, error handling, and retry logic
 */

import type { ApiResponse, ApiError } from '@/types';

const API_BASE_URL = '/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * Custom error class for API errors
 */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/**
 * Get the stored JWT token
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vortex_token');
}

/**
 * Set the JWT token
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('vortex_token', token);
}

/**
 * Remove the JWT token
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('vortex_token');
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build request headers
 */
function buildHeaders(customHeaders?: HeadersInit): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (customHeaders) {
    const customHeadersObj = customHeaders instanceof Headers 
      ? Object.fromEntries(customHeaders.entries())
      : customHeaders;
    
    Object.entries(customHeadersObj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers.set(key, value);
      }
    });
  }

  return headers;
}

/**
 * Parse API response
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new ApiRequestError(
      'Invalid response format',
      'INVALID_RESPONSE',
      response.status,
      { body: text }
    );
  }

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new ApiRequestError(
      error.error || 'Request failed',
      error.code || 'UNKNOWN_ERROR',
      error.status || response.status,
      data
    );
  }

  return data as T;
}

/**
 * Make an API request with retry logic
 */
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = buildHeaders(options.headers);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return await parseResponse<T>(response);
  } catch (error) {
    // Don't retry on client errors (4xx)
    if (error instanceof ApiRequestError && error.status >= 400 && error.status < 500) {
      throw error;
    }

    // Retry on network errors or server errors
    if (retries > 0) {
      await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1));
      return makeRequest<T>(endpoint, options, retries - 1);
    }

    throw error;
  }
}

/**
 * API client methods
 */
export const api = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url = `${endpoint}?${searchParams.toString()}`;
    }
    return makeRequest<T>(url, { method: 'GET' });
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return makeRequest<T>(endpoint, { method: 'DELETE' });
  },
};

// ============================================
// Typed API Functions
// ============================================

import type {
  AuthMessageResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthVerifyResponse,
  ScanTokenRequest,
  ScanTokenResponse,
  PortfolioResponse,
  WatchlistResponse,
  WatchlistCreateRequest,
  AlertsResponse,
  AlertCreateRequest,
  AlertUpdateRequest,
  HealthResponse,
} from '@/types/api';

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Get message to sign for authentication
   */
  async getMessage(address: string): Promise<AuthMessageResponse> {
    const response = await api.post<{ success: boolean; data: AuthMessageResponse }>('/auth/message', { address });
    return response.data;
  },

  /**
   * Login with signed message
   */
  async login(data: AuthLoginRequest): Promise<AuthLoginResponse> {
    const response = await api.post<AuthLoginResponse>('/auth/login', data);
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  /**
   * Verify current token
   */
  async verify(): Promise<AuthVerifyResponse> {
    return api.post<AuthVerifyResponse>('/auth/verify');
  },

  /**
   * Logout (clear token)
   */
  logout(): void {
    removeAuthToken();
  },
};

/**
 * Scanner API
 */
export const scannerApi = {
  /**
   * Scan a token for security risks
   */
  async scan(data: ScanTokenRequest): Promise<ScanTokenResponse> {
    return api.post<ScanTokenResponse>('/scan', data);
  },
};

/**
 * Portfolio API
 */
export const portfolioApi = {
  /**
   * Get portfolio for an address
   */
  async get(address: string, chain?: string): Promise<PortfolioResponse> {
    const params: Record<string, string> = {};
    if (chain) params.chain = chain;
    return api.get<PortfolioResponse>(`/portfolio/${address}`, params);
  },
};

/**
 * Watchlist API
 */
export const watchlistApi = {
  /**
   * Get all watchlist items
   */
  async getAll(): Promise<WatchlistResponse> {
    return api.get<WatchlistResponse>('/watchlist');
  },

  /**
   * Add token to watchlist
   */
  async add(data: WatchlistCreateRequest): Promise<ApiResponse<{ id: string }>> {
    return api.post<ApiResponse<{ id: string }>>('/watchlist', data);
  },

  /**
   * Remove token from watchlist
   */
  async remove(id: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/watchlist/${id}`);
  },
};

/**
 * Alerts API
 */
export const alertsApi = {
  /**
   * Get all alerts
   */
  async getAll(): Promise<AlertsResponse> {
    return api.get<AlertsResponse>('/alerts');
  },

  /**
   * Create new alert
   */
  async create(data: AlertCreateRequest): Promise<ApiResponse<{ id: string }>> {
    return api.post<ApiResponse<{ id: string }>>('/alerts', data);
  },

  /**
   * Update alert
   */
  async update(id: string, data: AlertUpdateRequest): Promise<ApiResponse<void>> {
    return api.patch<ApiResponse<void>>(`/alerts/${id}`, data);
  },

  /**
   * Delete alert
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/alerts/${id}`);
  },
};

/**
 * Health API
 */
export const healthApi = {
  /**
   * Check API health
   */
  async check(): Promise<HealthResponse> {
    return api.get<HealthResponse>('/health');
  },
};

export default api;


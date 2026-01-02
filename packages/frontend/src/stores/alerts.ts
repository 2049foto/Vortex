/**
 * Alerts state store using Zustand
 */

import { create } from 'zustand';
import type { Alert, CreateAlertRequest, UpdateAlertRequest } from '@/types';
import { alertsApi } from '@/lib/api';

interface AlertsState {
  /** All alerts */
  alerts: Alert[];
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Last fetch timestamp */
  lastFetched: number | null;
}

interface AlertsActions {
  /** Fetch all alerts */
  fetchAlerts: () => Promise<void>;
  /** Create new alert */
  createAlert: (data: CreateAlertRequest) => Promise<Alert>;
  /** Update alert */
  updateAlert: (id: string, data: UpdateAlertRequest) => Promise<void>;
  /** Delete alert */
  deleteAlert: (id: string) => Promise<void>;
  /** Toggle alert enabled state */
  toggleAlert: (id: string) => Promise<void>;
  /** Clear all alerts */
  clearAlerts: () => void;
}

type AlertsStore = AlertsState & AlertsActions;

/**
 * Initial state
 */
const initialState: AlertsState = {
  alerts: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

/**
 * Alerts store
 */
export const useAlertsStore = create<AlertsStore>()((set, get) => ({
  ...initialState,

  fetchAlerts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await alertsApi.getAll();
      
      if (response.success && response.data) {
        set({
          alerts: response.data,
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
        });
      } else {
        throw new Error('Failed to fetch alerts');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch alerts';
      set({
        isLoading: false,
        error: message,
      });
    }
  },

  createAlert: async (data: CreateAlertRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await alertsApi.create(data);
      
      if (response.success && response.data) {
        const newAlert: Alert = {
          id: response.data.id,
          userId: '', // Will be set by backend
          ...data,
          enabled: true,
          createdAt: new Date().toISOString(),
        };
        
        set({
          alerts: [...get().alerts, newAlert],
          isLoading: false,
        });
        
        return newAlert;
      }
      throw new Error('Failed to create alert');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create alert';
      set({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  updateAlert: async (id: string, data: UpdateAlertRequest) => {
    set({ isLoading: true, error: null });

    try {
      await alertsApi.update(id, data);
      
      set({
        alerts: get().alerts.map((alert) =>
          alert.id === id ? { ...alert, ...data } : alert
        ),
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update alert';
      set({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  deleteAlert: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await alertsApi.delete(id);
      
      set({
        alerts: get().alerts.filter((alert) => alert.id !== id),
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete alert';
      set({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  toggleAlert: async (id: string) => {
    const alert = get().alerts.find((a) => a.id === id);
    if (!alert) return;

    await get().updateAlert(id, { enabled: !alert.enabled });
  },

  clearAlerts: () => {
    set(initialState);
  },
}));

/**
 * Selector hooks
 */
export const useAlerts = () => useAlertsStore((state) => state.alerts);
export const useAlertsLoading = () => useAlertsStore((state) => state.isLoading);
export const useAlertsError = () => useAlertsStore((state) => state.error);

/**
 * Computed selectors
 */
export const useEnabledAlerts = () =>
  useAlertsStore((state) => state.alerts.filter((a) => a.enabled));

export const useAlertsByType = (type: 'price' | 'risk' | 'volume') =>
  useAlertsStore((state) => state.alerts.filter((a) => a.type === type));

export const useAlertsByToken = (token: string) =>
  useAlertsStore((state) =>
    state.alerts.filter((a) => a.token.toLowerCase() === token.toLowerCase())
  );


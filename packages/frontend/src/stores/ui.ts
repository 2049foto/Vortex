/**
 * UI state store using Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  /** Dark mode enabled */
  darkMode: boolean;
  /** Sidebar collapsed */
  sidebarCollapsed: boolean;
  /** Mobile menu open */
  mobileMenuOpen: boolean;
  /** Active modal */
  activeModal: string | null;
  /** Modal data */
  modalData: Record<string, unknown> | null;
  /** Toast notifications */
  toasts: Toast[];
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIActions {
  /** Toggle dark mode */
  toggleDarkMode: () => void;
  /** Set dark mode */
  setDarkMode: (enabled: boolean) => void;
  /** Toggle sidebar */
  toggleSidebar: () => void;
  /** Set sidebar state */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Toggle mobile menu */
  toggleMobileMenu: () => void;
  /** Set mobile menu state */
  setMobileMenuOpen: (open: boolean) => void;
  /** Open modal */
  openModal: (name: string, data?: Record<string, unknown>) => void;
  /** Close modal */
  closeModal: () => void;
  /** Add toast */
  addToast: (toast: Omit<Toast, 'id'>) => void;
  /** Remove toast */
  removeToast: (id: string) => void;
  /** Clear all toasts */
  clearToasts: () => void;
}

type UIStore = UIState & UIActions;

/**
 * Generate unique toast ID
 */
function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * UI store with partial persistence
 */
export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // State
      darkMode: true,
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      activeModal: null,
      modalData: null,
      toasts: [],

      // Actions
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;
        set({ darkMode: newDarkMode });
        
        // Update DOM
        if (typeof document !== 'undefined') {
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      setDarkMode: (enabled: boolean) => {
        set({ darkMode: enabled });
        
        if (typeof document !== 'undefined') {
          if (enabled) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      toggleSidebar: () => {
        set({ sidebarCollapsed: !get().sidebarCollapsed });
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      toggleMobileMenu: () => {
        set({ mobileMenuOpen: !get().mobileMenuOpen });
      },

      setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
      },

      openModal: (name: string, data?: Record<string, unknown>) => {
        set({ activeModal: name, modalData: data || null });
      },

      closeModal: () => {
        set({ activeModal: null, modalData: null });
      },

      addToast: (toast: Omit<Toast, 'id'>) => {
        const id = generateToastId();
        const newToast: Toast = { ...toast, id };
        
        set({ toasts: [...get().toasts, newToast] });

        // Auto-remove after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },

      removeToast: (id: string) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },

      clearToasts: () => {
        set({ toasts: [] });
      },
    }),
    {
      name: 'vortex-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

/**
 * Initialize dark mode on load
 */
export function initializeDarkMode(): void {
  if (typeof document === 'undefined') return;
  
  const { darkMode } = useUIStore.getState();
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Selector hooks
 */
export const useDarkMode = () => useUIStore((state) => state.darkMode);
export const useSidebarCollapsed = () => useUIStore((state) => state.sidebarCollapsed);
export const useMobileMenuOpen = () => useUIStore((state) => state.mobileMenuOpen);
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useModalData = () => useUIStore((state) => state.modalData);
export const useToasts = () => useUIStore((state) => state.toasts);


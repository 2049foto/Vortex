/**
 * Toast Component - Notification system using react-hot-toast
 */

import { Toaster, toast as hotToast } from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

/**
 * Toast utility functions
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    hotToast.success(message, {
      duration: options?.duration ?? 4000,
      style: {
        background: '#10B981',
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontWeight: 500,
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  },
  
  error: (message: string, options?: ToastOptions) => {
    hotToast.error(message, {
      duration: options?.duration ?? 5000,
      style: {
        background: '#EF4444',
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontWeight: 500,
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    });
  },
  
  warning: (message: string, options?: ToastOptions) => {
    hotToast(message, {
      duration: options?.duration ?? 4000,
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontWeight: 500,
      },
    });
  },
  
  info: (message: string, options?: ToastOptions) => {
    hotToast(message, {
      duration: options?.duration ?? 4000,
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontWeight: 500,
      },
    });
  },
  
  loading: (message: string) => {
    return hotToast.loading(message, {
      style: {
        background: '#fff',
        color: '#1C1917',
        borderRadius: '12px',
        padding: '12px 16px',
        fontWeight: 500,
        border: '1px solid #E7E5E4',
      },
    });
  },
  
  dismiss: (toastId?: string) => {
    if (toastId) {
      hotToast.dismiss(toastId);
    } else {
      hotToast.dismiss();
    }
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return hotToast.promise(promise, messages, {
      style: {
        borderRadius: '12px',
        padding: '12px 16px',
        fontWeight: 500,
      },
    });
  },
};

/**
 * Toast Provider Component
 * Add this to your app root to enable toasts
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{
        top: 80,
      }}
      toastOptions={{
        className: '',
        style: {
          maxWidth: '400px',
        },
      }}
    />
  );
}

export { Toaster };


/**
 * Premium Modal Component
 * Animated dialog with backdrop
 */

import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: Size;
  title?: string;
  description?: string;
  children: React.ReactNode;
  showClose?: boolean;
  preventClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  size = 'md',
  title,
  description,
  children,
  showClose = true,
  preventClose = false,
}: ModalProps) {
  // Close on escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !preventClose) {
      onClose();
    }
  }, [onClose, preventClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={preventClose ? undefined : onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full bg-white rounded-2xl shadow-2xl',
            'animate-in zoom-in-95 slide-in-from-bottom-4 duration-200',
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {showClose && !preventClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Header */}
          {(title || description) && (
            <div className="px-6 pt-6 pb-4">
              {title && (
                <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-neutral-500 mt-1">{description}</p>
              )}
            </div>
          )}

          {/* Content */}
          <div className={cn('px-6 pb-6', !title && 'pt-6')}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal Footer
export function ModalFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-4', className)} {...props}>
      {children}
    </div>
  );
}


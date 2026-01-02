/**
 * Premium Button Component
 * Supports multiple variants, sizes, and states
 */

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
          'transition-all duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'active:scale-[0.98]',
          fullWidth && 'w-full',

          // Variants
          variant === 'primary' && [
            'bg-gradient-to-r from-sky-500 to-blue-600 text-white',
            'shadow-lg shadow-sky-500/25',
            'hover:shadow-xl hover:shadow-sky-500/30 hover:brightness-110',
            'focus-visible:ring-sky-500',
          ],
          
          variant === 'secondary' && [
            'bg-neutral-100 text-neutral-900',
            'border border-neutral-200',
            'hover:bg-neutral-200 hover:border-neutral-300',
            'focus-visible:ring-neutral-500',
          ],
          
          variant === 'ghost' && [
            'text-neutral-700 bg-transparent',
            'hover:bg-neutral-100 hover:text-neutral-900',
            'focus-visible:ring-neutral-500',
          ],
          
          variant === 'danger' && [
            'bg-red-500 text-white',
            'shadow-lg shadow-red-500/25',
            'hover:bg-red-600 hover:shadow-xl',
            'focus-visible:ring-red-500',
          ],
          
          variant === 'outline' && [
            'border-2 border-neutral-300 text-neutral-700 bg-transparent',
            'hover:bg-neutral-50 hover:border-neutral-400',
            'focus-visible:ring-neutral-500',
          ],

          variant === 'success' && [
            'bg-emerald-500 text-white',
            'shadow-lg shadow-emerald-500/25',
            'hover:bg-emerald-600 hover:shadow-xl',
            'focus-visible:ring-emerald-500',
          ],

          // Sizes
          size === 'xs' && 'px-2.5 py-1 text-xs',
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-5 py-2.5 text-base',
          size === 'xl' && 'px-6 py-3 text-lg',

          className
        )}
        {...props}
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {iconPosition === 'left' && icon && !loading && icon}
        {children && <span>{children}</span>}
        {iconPosition === 'right' && icon && !loading && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';


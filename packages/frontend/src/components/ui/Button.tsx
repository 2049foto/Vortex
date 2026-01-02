/**
 * Button component for Vortex Protocol
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Loading state */
  isLoading?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
    'bg-primary-500 text-white',
    'hover:bg-primary-400',
    'active:bg-primary-600',
    'focus-visible:ring-primary-500/50',
    'disabled:bg-primary-500/50'
  ),
  secondary: clsx(
    'bg-background-elevated text-text-primary',
    'hover:bg-background-hover',
    'active:bg-background-card',
    'focus-visible:ring-border-light',
    'border border-border',
    'disabled:bg-background-elevated/50'
  ),
  outline: clsx(
    'bg-transparent text-primary-400',
    'border border-primary-500',
    'hover:bg-primary-500/10',
    'active:bg-primary-500/20',
    'focus-visible:ring-primary-500/50',
    'disabled:border-primary-500/50 disabled:text-primary-500/50'
  ),
  ghost: clsx(
    'bg-transparent text-text-secondary',
    'hover:bg-background-hover hover:text-text-primary',
    'active:bg-background-elevated',
    'focus-visible:ring-border-light',
    'disabled:text-text-disabled'
  ),
  danger: clsx(
    'bg-danger-DEFAULT text-white',
    'hover:bg-danger-light',
    'active:bg-danger-dark',
    'focus-visible:ring-danger-DEFAULT/50',
    'disabled:bg-danger-DEFAULT/50'
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
};

const iconSizes: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

/**
 * Button component with multiple variants and sizes
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background-dark',
          'disabled:cursor-not-allowed',
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className={clsx('animate-spin', iconSizes[size])} />
        ) : (
          leftIcon && <span className={iconSizes[size]}>{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className={iconSizes[size]}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;


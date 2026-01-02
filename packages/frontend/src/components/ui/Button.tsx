/**
 * Vortex Protocol 2026 - Button Component
 * Neumorphic + Glassmorphism hybrid
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

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
      loading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const variants = {
      primary: 'neumo text-white hover:neumo-hover focus:neumo-focus',
      secondary: 'glass text-text-primary hover:glass-hover focus:glass-focus',
      ghost: 'text-text-primary hover:bg-glass-bg focus:bg-glass-bg',
      outline: 'glass border border-glass-border text-text-primary hover:glass-hover focus:glass-focus',
      danger: 'bg-gradient-to-r from-category-risk to-red-600 text-white shadow-risk hover:shadow-lg',
      success: 'bg-gradient-to-r from-category-premium to-emerald-600 text-white shadow-premium hover:shadow-lg',
    };

    const sizes = {
      xs: 'px-3 py-2 text-xs rounded-neumo',
      sm: 'px-4 py-2.5 text-sm rounded-neumo',
      md: 'px-6 py-3 text-base rounded-neumo',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-2xl',
    };

    const innerClasses = variant === 'primary' 
      ? 'glass-inner' 
      : '';

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
          'focus-ring disabled:disabled relative overflow-hidden group',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className={cn('h-4 w-4 animate-spin', iconPosition === 'right' ? 'order-last' : 'order-first')} />
        )}
        {icon && iconPosition === 'left' && icon}
        <span className={innerClasses}>
          {children}
        </span>
        {icon && iconPosition === 'right' && icon}
        {variant === 'primary' && (
          <div className="absolute inset-0 rounded-inset bg-gradient-to-r from-transparent via-glass-light to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';


/**
 * Badge component for Vortex Protocol
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Dot indicator */
  dot?: boolean;
  /** Removable with close button */
  onRemove?: () => void;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-background-elevated text-text-secondary border-border',
  success: 'bg-success-light/10 text-success-light border-success-light/20',
  warning: 'bg-warning-light/10 text-warning-light border-warning-light/20',
  danger: 'bg-danger-light/10 text-danger-light border-danger-light/20',
  info: 'bg-accent-400/10 text-accent-400 border-accent-400/20',
  primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
};

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-text-secondary',
  success: 'bg-success-light',
  warning: 'bg-warning-light',
  danger: 'bg-danger-light',
  info: 'bg-accent-400',
  primary: 'bg-primary-400',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

/**
 * Badge component for status indicators and labels
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dot = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={clsx(
          // Base styles
          'inline-flex items-center font-medium rounded-full border',
          'transition-colors duration-150',
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={clsx(
              'rounded-full animate-pulse',
              dotStyles[variant],
              dotSizeStyles[size]
            )}
          />
        )}
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={clsx(
              'ml-1 -mr-1 p-0.5 rounded-full',
              'hover:bg-white/10 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'focus:ring-current focus:ring-offset-transparent'
            )}
            aria-label="Remove"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

/**
 * Risk badge specifically for token risk levels
 */
export interface RiskBadgeProps extends Omit<BadgeProps, 'variant'> {
  /** Risk level */
  level: 'SAFE' | 'WARNING' | 'DANGER';
}

export const RiskBadge = forwardRef<HTMLSpanElement, RiskBadgeProps>(
  ({ level, ...props }, ref) => {
    const variantMap: Record<string, BadgeVariant> = {
      SAFE: 'success',
      WARNING: 'warning',
      DANGER: 'danger',
    };

    const labelMap: Record<string, string> = {
      SAFE: 'Safe',
      WARNING: 'Warning',
      DANGER: 'Danger',
    };

    return (
      <Badge ref={ref} variant={variantMap[level]} dot {...props}>
        {labelMap[level]}
      </Badge>
    );
  }
);

RiskBadge.displayName = 'RiskBadge';

/**
 * Chain badge for blockchain networks
 */
export interface ChainBadgeProps extends Omit<BadgeProps, 'variant'> {
  /** Chain name */
  chain: string;
}

export const ChainBadge = forwardRef<HTMLSpanElement, ChainBadgeProps>(
  ({ chain, ...props }, ref) => {
    const chainColors: Record<string, BadgeVariant> = {
      ethereum: 'info',
      base: 'primary',
      arbitrum: 'info',
      optimism: 'danger',
      polygon: 'info',
      bsc: 'warning',
      avalanche: 'danger',
      solana: 'primary',
    };

    return (
      <Badge
        ref={ref}
        variant={chainColors[chain.toLowerCase()] || 'default'}
        {...props}
      >
        {chain}
      </Badge>
    );
  }
);

ChainBadge.displayName = 'ChainBadge';

export default Badge;


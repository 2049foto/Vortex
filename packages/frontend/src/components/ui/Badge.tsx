/**
 * Vortex Protocol 2026 - Badge Component
 * Category badges with risk transparency
 */

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'premium' | 'dust' | 'micro' | 'risk' | 'default' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  pulse?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  pulse = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    premium: 'badge-premium',
    dust: 'badge-dust', 
    micro: 'badge-micro',
    risk: 'badge-risk',
    default: 'glass text-text-primary',
    outline: 'glass border border-glass-border text-text-primary',
  };

  const sizes = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200',
        variants[variant],
        sizes[size],
        pulse && variant === 'risk' && 'animate-pulse-slow',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';


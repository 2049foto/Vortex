/**
 * Premium Badge Component
 * Status indicators and tags
 */

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  dot,
  pulse,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        'transition-all duration-150',
        
        // Variants
        variant === 'default' && 'bg-neutral-100 text-neutral-700',
        variant === 'success' && 'bg-emerald-100 text-emerald-700',
        variant === 'warning' && 'bg-amber-100 text-amber-700',
        variant === 'danger' && 'bg-red-100 text-red-700',
        variant === 'info' && 'bg-blue-100 text-blue-700',
        variant === 'primary' && 'bg-sky-100 text-sky-700',
        variant === 'outline' && 'bg-transparent border-2 border-neutral-300 text-neutral-600',

        // Sizes
        size === 'xs' && 'px-2 py-0.5 text-xs',
        size === 'sm' && 'px-2.5 py-1 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-1.5 text-sm',

        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            variant === 'default' && 'bg-neutral-500',
            variant === 'success' && 'bg-emerald-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'primary' && 'bg-sky-500',
            pulse && 'animate-pulse'
          )}
        />
      )}
      {icon}
      {children}
    </span>
  );
}

// Risk Score Badge
interface RiskBadgeProps {
  score: number;
  size?: Size;
}

export function RiskBadge({ score, size = 'md' }: RiskBadgeProps) {
  const variant = score >= 70 ? 'danger' : score >= 40 ? 'warning' : 'success';
  const label = score >= 70 ? 'HIGH RISK' : score >= 40 ? 'MEDIUM' : 'SAFE';

  return (
    <Badge variant={variant} size={size} dot pulse={score >= 70}>
      {label} • {score}
    </Badge>
  );
}


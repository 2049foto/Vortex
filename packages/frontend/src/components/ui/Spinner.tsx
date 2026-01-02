/**
 * Premium Spinner Component
 * Loading indicators
 */

import React from 'react';
import { cn } from '@/lib/utils';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'default' | 'primary' | 'white';

interface SpinnerProps {
  size?: Size;
  variant?: Variant;
  className?: string;
}

export function Spinner({ size = 'md', variant = 'primary', className }: SpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    default: 'text-neutral-400',
    primary: 'text-sky-500',
    white: 'text-white',
  };

  return (
    <svg
      className={cn('animate-spin', sizeClasses[size], colorClasses[variant], className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Full page loader
interface LoaderProps {
  text?: string;
}

export function Loader({ text = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="xl" />
      <p className="text-neutral-500 font-medium">{text}</p>
    </div>
  );
}

// Inline loader
export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner size="sm" />
      <span className="text-sm text-neutral-500">Loading...</span>
    </div>
  );
}


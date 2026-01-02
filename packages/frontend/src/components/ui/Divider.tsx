/**
 * Premium Divider Component
 * Visual separators
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={cn('w-px bg-neutral-200 self-stretch', className)} />;
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-sm text-neutral-500 font-medium">{label}</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>
    );
  }

  return <div className={cn('h-px bg-neutral-200 w-full', className)} />;
}


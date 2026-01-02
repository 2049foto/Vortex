/**
 * Premium Empty State Component
 * Friendly empty state illustrations
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const defaultIcon = (
    <svg className="w-16 h-16 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z" />
    </svg>
  );

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="mb-4">{icon || defaultIcon}</div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
      {description && (
        <p className="text-neutral-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

// Specific empty states
export function NoDataEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
        </div>
      }
      title="No data yet"
      description="Start by adding some items to see them here."
      action={onAction ? { label: 'Get Started', onClick: onAction } : undefined}
    />
  );
}

export function SearchEmpty({ query }: { query: string }) {
  return (
    <EmptyState
      icon={
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
      }
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try a different search term.`}
    />
  );
}


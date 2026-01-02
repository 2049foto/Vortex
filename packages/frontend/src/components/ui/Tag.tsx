/**
 * Premium Tag Component
 * Removable tags and chips
 */

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface TagProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Tag({
  children,
  variant = 'default',
  size = 'md',
  removable,
  onRemove,
  icon,
  className,
}: TagProps) {
  const variantStyles = {
    default: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
    primary: 'bg-sky-100 text-sky-700 hover:bg-sky-200',
    success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    warning: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 p-0.5 rounded hover:bg-black/10 transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Tag Input Component
interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  label?: string;
  maxTags?: number;
}

export function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Add tag...',
  label,
  maxTags,
}: TagInputProps) {
  const [input, setInput] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!maxTags || tags.length < maxTags) {
        onAdd(input.trim());
        setInput('');
      }
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onRemove(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700">{label}</label>
      )}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border-2 border-neutral-200 bg-white focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all">
        {tags.map((tag, i) => (
          <Tag key={i} size="sm" removable onRemove={() => onRemove(i)}>
            {tag}
          </Tag>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] outline-none text-sm"
          disabled={maxTags !== undefined && tags.length >= maxTags}
        />
      </div>
    </div>
  );
}


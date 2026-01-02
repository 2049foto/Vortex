/**
 * Premium Switch Component
 * Toggle with smooth animation
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  size = 'md',
  className,
}: SwitchProps) {
  const sizeStyles = {
    sm: { track: 'w-8 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-3.5' },
    md: { track: 'w-11 h-6', thumb: 'w-4.5 h-4.5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-5.5 h-5.5', translate: 'translate-x-7' },
  };

  const styles = sizeStyles[size];

  return (
    <label className={cn('flex items-start gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 rounded-full',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
          styles.track,
          checked ? 'bg-sky-500' : 'bg-neutral-300'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0',
            'transform transition-transform duration-200 ease-in-out',
            styles.thumb,
            'mt-[3px] ml-[3px]',
            checked && styles.translate
          )}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-semibold text-neutral-900">{label}</span>}
          {description && <span className="text-sm text-neutral-500">{description}</span>}
        </div>
      )}
    </label>
  );
}


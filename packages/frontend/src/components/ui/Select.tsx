/**
 * Premium Select Component
 * Custom dropdown with search
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  disabled,
  fullWidth,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find(opt => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', fullWidth && 'w-full', className)}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl',
          'bg-white border-2 border-neutral-200 text-left',
          'transition-all duration-150',
          'hover:border-neutral-300',
          'focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10',
          isOpen && 'border-sky-500 ring-4 ring-sky-500/10',
          error && 'border-red-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn('flex items-center gap-2', !selected && 'text-neutral-400')}>
          {selected?.icon}
          {selected?.label || placeholder}
        </span>
        <svg
          className={cn('w-5 h-5 text-neutral-400 transition-transform', isOpen && 'rotate-180')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2.5 text-left',
                  'transition-colors duration-100',
                  option.value === value
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-neutral-700 hover:bg-neutral-50'
                )}
              >
                {option.icon}
                {option.label}
                {option.value === value && (
                  <svg className="w-4 h-4 ml-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}


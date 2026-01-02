/**
 * Premium Input Component
 * Professional form input with validation states
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, fullWidth, type = 'text', ...props }, ref) => {
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-semibold text-neutral-700">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={cn(
              // Base
              'w-full px-4 py-3 rounded-xl text-neutral-900',
              'bg-white border-2 border-neutral-200',
              'placeholder:text-neutral-400',
              'transition-all duration-150',
              
              // Focus
              'focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10',
              
              // Hover
              'hover:border-neutral-300',
              
              // Error
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
              
              // Disabled
              'disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60',

              // Icons
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',

              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || hint) && (
          <p className={cn('text-sm', error ? 'text-red-500' : 'text-neutral-500')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, fullWidth, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-semibold text-neutral-700">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-neutral-900',
            'bg-white border-2 border-neutral-200',
            'placeholder:text-neutral-400',
            'transition-all duration-150 resize-none',
            'focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10',
            'hover:border-neutral-300',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
            'disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60',
            className
          )}
          {...props}
        />

        {(error || hint) && (
          <p className={cn('text-sm', error ? 'text-red-500' : 'text-neutral-500')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';


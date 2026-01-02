/**
 * Input component for Vortex Protocol
 */

import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { AlertCircle, Check } from 'lucide-react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size */
  size?: InputSize;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Left icon or addon */
  leftAddon?: React.ReactNode;
  /** Right icon or addon */
  rightAddon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-8 text-sm px-3',
  md: 'h-10 text-sm px-4',
  lg: 'h-12 text-base px-4',
};

const addonSizeStyles: Record<InputSize, string> = {
  sm: 'px-2',
  md: 'px-3',
  lg: 'px-4',
};

/**
 * Input component with label, helper text, and validation states
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      label,
      helperText,
      error,
      success = false,
      leftAddon,
      rightAddon,
      fullWidth = false,
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const hasError = !!error;
    const showSuccess = success && !hasError;

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative flex">
          {leftAddon && (
            <div
              className={clsx(
                'flex items-center justify-center',
                'bg-background-elevated border border-r-0 border-border',
                'rounded-l-xl text-text-muted',
                addonSizeStyles[size]
              )}
            >
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={clsx(
              // Base styles
              'flex-1 bg-background-card text-text-primary',
              'border border-border rounded-xl',
              'placeholder:text-text-muted',
              'transition-all duration-150',
              // Focus styles
              'focus:outline-none focus:border-primary-500',
              'focus:ring-2 focus:ring-primary-500/20',
              // Disabled styles
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'disabled:bg-background-elevated',
              // Error styles
              hasError && 'border-danger-DEFAULT focus:border-danger-DEFAULT focus:ring-danger-DEFAULT/20',
              // Success styles
              showSuccess && 'border-success-DEFAULT focus:border-success-DEFAULT focus:ring-success-DEFAULT/20',
              // Size styles
              sizeStyles[size],
              // Addon styles
              leftAddon && 'rounded-l-none',
              rightAddon && 'rounded-r-none',
              // Right padding for status icon
              (hasError || showSuccess) && !rightAddon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightAddon && (
            <div
              className={clsx(
                'flex items-center justify-center',
                'bg-background-elevated border border-l-0 border-border',
                'rounded-r-xl text-text-muted',
                addonSizeStyles[size]
              )}
            >
              {rightAddon}
            </div>
          )}

          {/* Status icon */}
          {!rightAddon && (hasError || showSuccess) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError && (
                <AlertCircle className="w-4 h-4 text-danger-DEFAULT" />
              )}
              {showSuccess && (
                <Check className="w-4 h-4 text-success-DEFAULT" />
              )}
            </div>
          )}
        </div>

        {/* Helper text or error */}
        {(helperText || error) && (
          <p
            className={clsx(
              'text-xs',
              hasError ? 'text-danger-DEFAULT' : 'text-text-muted'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Search input with search icon
 */
export interface SearchInputProps extends Omit<InputProps, 'leftAddon'> {
  /** Loading state */
  isSearching?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ isSearching = false, placeholder = 'Search...', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        leftAddon={
          <svg
            className={clsx('w-4 h-4', isSearching && 'animate-pulse')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

/**
 * Token address input with validation
 */
export interface AddressInputProps extends Omit<InputProps, 'leftAddon'> {
  /** Chain for address validation */
  chain?: string;
}

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ placeholder = '0x...', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="font-mono"
        {...props}
      />
    );
  }
);

AddressInput.displayName = 'AddressInput';

export default Input;


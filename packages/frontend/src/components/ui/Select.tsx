/**
 * Select component for Vortex Protocol
 */

import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Select size */
  size?: SelectSize;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Options */
  options: SelectOption[];
  /** Placeholder */
  placeholder?: string;
  /** Full width */
  fullWidth?: boolean;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: 'h-8 text-sm pl-3 pr-8',
  md: 'h-10 text-sm pl-4 pr-10',
  lg: 'h-12 text-base pl-4 pr-10',
};

const iconSizeStyles: Record<SelectSize, string> = {
  sm: 'w-4 h-4 right-2',
  md: 'w-4 h-4 right-3',
  lg: 'w-5 h-5 right-3',
};

/**
 * Select component with options
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      size = 'md',
      label,
      helperText,
      error,
      options,
      placeholder,
      fullWidth = false,
      disabled,
      id: providedId,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const hasError = !!error;

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

        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            value={value}
            className={clsx(
              // Base styles
              'w-full appearance-none',
              'bg-background-card text-text-primary',
              'border border-border rounded-xl',
              'transition-all duration-150',
              'cursor-pointer',
              // Focus styles
              'focus:outline-none focus:border-primary-500',
              'focus:ring-2 focus:ring-primary-500/20',
              // Disabled styles
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'disabled:bg-background-elevated',
              // Error styles
              hasError && 'border-danger-DEFAULT focus:border-danger-DEFAULT focus:ring-danger-DEFAULT/20',
              // Size styles
              sizeStyles[size],
              // Placeholder color
              !value && 'text-text-muted',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <ChevronDown
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 pointer-events-none',
              'text-text-muted',
              iconSizeStyles[size]
            )}
          />
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

Select.displayName = 'Select';

/**
 * Chain select component
 */
export interface ChainSelectProps extends Omit<SelectProps, 'options'> {
  /** Include all chains option */
  includeAll?: boolean;
}

const CHAIN_OPTIONS: SelectOption[] = [
  { value: 'base', label: 'Base' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'optimism', label: 'Optimism' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'bsc', label: 'BNB Chain' },
  { value: 'avalanche', label: 'Avalanche' },
  { value: 'solana', label: 'Solana' },
];

export const ChainSelect = forwardRef<HTMLSelectElement, ChainSelectProps>(
  ({ includeAll = false, ...props }, ref) => {
    const options = includeAll
      ? [{ value: 'all', label: 'All Chains' }, ...CHAIN_OPTIONS]
      : CHAIN_OPTIONS;

    return <Select ref={ref} options={options} {...props} />;
  }
);

ChainSelect.displayName = 'ChainSelect';

/**
 * Alert type select component
 */
export const AlertTypeSelect = forwardRef<HTMLSelectElement, Omit<SelectProps, 'options'>>(
  (props, ref) => {
    const options: SelectOption[] = [
      { value: 'price', label: 'Price Alert' },
      { value: 'risk', label: 'Risk Alert' },
      { value: 'volume', label: 'Volume Alert' },
    ];

    return <Select ref={ref} options={options} {...props} />;
  }
);

AlertTypeSelect.displayName = 'AlertTypeSelect';

/**
 * Alert condition select component
 */
export const AlertConditionSelect = forwardRef<HTMLSelectElement, Omit<SelectProps, 'options'>>(
  (props, ref) => {
    const options: SelectOption[] = [
      { value: 'above', label: 'Above' },
      { value: 'below', label: 'Below' },
      { value: 'equals', label: 'Equals' },
    ];

    return <Select ref={ref} options={options} {...props} />;
  }
);

AlertConditionSelect.displayName = 'AlertConditionSelect';

export default Select;


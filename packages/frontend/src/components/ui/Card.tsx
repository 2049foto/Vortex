/**
 * Card component for Vortex Protocol
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'gradient';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: CardVariant;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Hoverable */
  hoverable?: boolean;
  /** Clickable (adds cursor and click effect) */
  clickable?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-background-card border border-border',
  elevated: 'bg-background-elevated shadow-lg shadow-black/20',
  bordered: 'bg-background-card border-2 border-border-light',
  gradient: clsx(
    'bg-gradient-to-br from-background-card via-background-elevated to-background-card',
    'border border-border'
  ),
};

const paddingStyles: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6 lg:p-8',
};

/**
 * Card component with multiple variants
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          // Base styles
          'rounded-2xl transition-all duration-200',
          // Variant styles
          variantStyles[variant],
          // Padding
          paddingStyles[padding],
          // Hover effects
          hoverable && 'hover:border-border-light hover:shadow-lg hover:shadow-black/10',
          // Clickable
          clickable && 'cursor-pointer active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title */
  title?: string;
  /** Description */
  description?: string;
  /** Right side action */
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('flex items-start justify-between gap-4', className)}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-text-primary truncate">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
          {children}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Body component
 */
export const CardBody = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx('mt-4', className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

/**
 * Card Footer component
 */
export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'mt-4 pt-4 border-t border-border flex items-center gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export default Card;


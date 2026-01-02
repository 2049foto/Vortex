/**
 * Vortex Protocol 2026 - Card Component
 * Glassmorphism + Neumorphism hybrid
 */

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'glass' | 'glass-lg' | 'neumo' | 'category' | 'default';
type Padding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: Padding;
  hover?: boolean;
  interactive?: boolean;
  category?: 'premium' | 'dust' | 'micro' | 'risk';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', padding = 'md', hover = false, interactive = false, category, children, ...props }, ref) => {
    const variants = {
      glass: 'glass rounded-glass',
      'glass-lg': 'glass-lg rounded-xl',
      neumo: 'neumo rounded-neumo',
      category: category ? `badge-${category} rounded-xl` : 'glass rounded-xl',
      default: 'bg-bg-secondary border border-glass-border rounded-xl',
    };

    const hoverEffects = hover ? 'hover-lift' : '';
    const interactiveEffects = interactive ? 'cursor-pointer active:scale-[0.98]' : '';

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-200',
          variants[variant],
          hoverEffects,
          interactiveEffects,
          
          // Padding
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-4',
          padding === 'md' && 'p-6',
          padding === 'lg' && 'p-8',
          padding === 'xl' && 'p-10',

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

// Card Header
export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pb-4 border-b border-neutral-100', className)} {...props}>
      {children}
    </div>
  );
}

// Card Title
export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-bold text-neutral-900', className)} {...props}>
      {children}
    </h3>
  );
}

// Card Description
export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-neutral-500 mt-1', className)} {...props}>
      {children}
    </p>
  );
}

// Card Content
export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-4', className)} {...props}>
      {children}
    </div>
  );
}

// Card Footer
export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-4 border-t border-neutral-100 mt-4', className)} {...props}>
      {children}
    </div>
  );
}


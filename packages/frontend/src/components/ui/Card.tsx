/**
 * Premium Card Component
 * Glassmorphism and elevated variants
 */

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'glass' | 'elevated' | 'outlined' | 'gradient';
type Padding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: Padding;
  hover?: boolean;
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover, interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200',
          
          // Variants
          variant === 'default' && 'bg-white border border-neutral-200 shadow-sm',
          variant === 'glass' && 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl',
          variant === 'elevated' && 'bg-white border border-neutral-100 shadow-lg',
          variant === 'outlined' && 'bg-transparent border-2 border-neutral-200',
          variant === 'gradient' && 'bg-gradient-to-br from-white to-neutral-50 border border-neutral-100 shadow-lg',

          // Padding
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-4',
          padding === 'md' && 'p-6',
          padding === 'lg' && 'p-8',
          padding === 'xl' && 'p-10',

          // Effects
          hover && 'hover:shadow-xl hover:scale-[1.02] hover:border-neutral-300',
          interactive && 'cursor-pointer active:scale-[0.98]',

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


/**
 * Premium Breadcrumb Component
 * Navigation trail
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ items, separator, className }: BreadcrumbProps) {
  const defaultSeparator = (
    <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium',
                    'text-neutral-500 hover:text-neutral-900 transition-colors'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium',
                    isLast ? 'text-neutral-900' : 'text-neutral-500'
                  )}
                >
                  {item.icon}
                  {item.label}
                </span>
              )}
              {!isLast && (separator || defaultSeparator)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


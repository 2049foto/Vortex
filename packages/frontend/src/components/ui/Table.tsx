/**
 * Premium Table Component
 * Data tables with sorting and selection
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto rounded-xl border border-neutral-200">
      <table className={cn('w-full text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-neutral-50 border-b border-neutral-200', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-neutral-100', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-neutral-50',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 text-neutral-900', className)} {...props}>
      {children}
    </td>
  );
}

// Sortable Table Head
interface SortableTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

export function SortableTableHead({ className, sorted, onSort, children, ...props }: SortableTableHeadProps) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-900 transition-colors',
        className
      )}
      onClick={onSort}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        <div className="flex flex-col">
          <svg
            className={cn('w-3 h-3 -mb-1', sorted === 'asc' ? 'text-sky-500' : 'text-neutral-300')}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 5l-7 7h14l-7-7z" />
          </svg>
          <svg
            className={cn('w-3 h-3', sorted === 'desc' ? 'text-sky-500' : 'text-neutral-300')}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 19l7-7H5l7 7z" />
          </svg>
        </div>
      </div>
    </th>
  );
}


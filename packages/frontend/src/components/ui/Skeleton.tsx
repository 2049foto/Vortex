/**
 * Skeleton component for loading states
 */

import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Animation */
  animate?: boolean;
}

const roundedStyles: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

/**
 * Skeleton loading placeholder
 */
export function Skeleton({
  className,
  width,
  height,
  rounded = 'lg',
  animate = true,
  style,
  ...props
}: SkeletonProps): React.ReactElement {
  return (
    <div
      className={clsx(
        'bg-background-elevated',
        animate && 'shimmer',
        roundedStyles[rounded],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * Skeleton text line
 */
export interface SkeletonTextProps {
  /** Number of lines */
  lines?: number;
  /** Last line width */
  lastLineWidth?: string;
  /** Line height */
  lineHeight?: string | number;
  /** Gap between lines */
  gap?: string | number;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  lineHeight = '1rem',
  gap = '0.5rem',
}: SkeletonTextProps): React.ReactElement {
  return (
    <div className="flex flex-col" style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          rounded="md"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton avatar
 */
export interface SkeletonAvatarProps {
  /** Size in pixels */
  size?: number;
}

export function SkeletonAvatar({ size = 40 }: SkeletonAvatarProps): React.ReactElement {
  return <Skeleton width={size} height={size} rounded="full" />;
}

/**
 * Skeleton card
 */
export function SkeletonCard(): React.ReactElement {
  return (
    <div className="p-4 bg-background-card rounded-2xl border border-border">
      <div className="flex items-center gap-3 mb-4">
        <SkeletonAvatar size={48} />
        <div className="flex-1">
          <Skeleton height={16} width="60%" className="mb-2" />
          <Skeleton height={12} width="40%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * Skeleton table row
 */
export interface SkeletonTableRowProps {
  /** Number of columns */
  columns?: number;
}

export function SkeletonTableRow({ columns = 5 }: SkeletonTableRowProps): React.ReactElement {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          className={clsx(
            i === 0 ? 'w-24' : 'flex-1',
            i === columns - 1 && 'w-20'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton table
 */
export interface SkeletonTableProps {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
}

export function SkeletonTable({
  rows = 5,
  columns = 5,
}: SkeletonTableProps): React.ReactElement {
  return (
    <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-background-elevated">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            height={12}
            className={clsx(
              i === 0 ? 'w-24' : 'flex-1',
              i === columns - 1 && 'w-20'
            )}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} columns={columns} />
      ))}
    </div>
  );
}

/**
 * Skeleton stats card
 */
export function SkeletonStatsCard(): React.ReactElement {
  return (
    <div className="p-5 bg-background-card rounded-2xl border border-border">
      <Skeleton height={12} width="40%" className="mb-3" />
      <Skeleton height={32} width="70%" className="mb-2" />
      <Skeleton height={16} width="30%" />
    </div>
  );
}

/**
 * Skeleton portfolio header
 */
export function SkeletonPortfolioHeader(): React.ReactElement {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-background-card rounded-2xl border border-border">
      <div className="flex-1">
        <Skeleton height={14} width="120px" className="mb-2" />
        <Skeleton height={40} width="200px" className="mb-2" />
        <Skeleton height={20} width="80px" />
      </div>
      <div className="flex gap-3">
        <Skeleton height={40} width="100px" rounded="xl" />
        <Skeleton height={40} width="100px" rounded="xl" />
      </div>
    </div>
  );
}

/**
 * Skeleton token row
 */
export function SkeletonTokenRow(): React.ReactElement {
  return (
    <div className="flex items-center gap-4 p-4">
      <SkeletonAvatar size={40} />
      <div className="flex-1">
        <Skeleton height={16} width="80px" className="mb-1" />
        <Skeleton height={12} width="120px" />
      </div>
      <div className="text-right">
        <Skeleton height={16} width="60px" className="mb-1 ml-auto" />
        <Skeleton height={12} width="40px" className="ml-auto" />
      </div>
    </div>
  );
}

export default Skeleton;


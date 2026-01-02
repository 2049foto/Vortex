/**
 * Skeleton Component - Loading placeholder
 */

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = 'md',
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  return (
    <div
      className={`
        bg-neutral-200 animate-pulse
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
}


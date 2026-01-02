/**
 * Premium Avatar Component
 * Wallet address avatars with gradient backgrounds
 */

import React from 'react';
import { cn } from '@/lib/utils';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  address?: string;
  src?: string;
  alt?: string;
  size?: Size;
  ring?: boolean;
}

// Generate consistent color from address
function getGradientFromAddress(address: string): string {
  const hash = address.slice(2, 10);
  const hue1 = parseInt(hash.slice(0, 4), 16) % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 80%, 50%))`;
}

export function Avatar({
  className,
  address,
  src,
  alt,
  size = 'md',
  ring,
  ...props
}: AvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const initials = address ? address.slice(2, 4).toUpperCase() : '??';
  const gradient = address ? getGradientFromAddress(address) : 'linear-gradient(135deg, #64748b, #475569)';

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center font-bold text-white overflow-hidden',
        'transition-all duration-200',
        sizeClasses[size],
        ring && 'ring-2 ring-white ring-offset-2',
        className
      )}
      style={{ background: !src ? gradient : undefined }}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

// Avatar Group
interface AvatarGroupProps {
  addresses: string[];
  max?: number;
  size?: Size;
}

export function AvatarGroup({ addresses, max = 4, size = 'sm' }: AvatarGroupProps) {
  const shown = addresses.slice(0, max);
  const remaining = addresses.length - max;

  return (
    <div className="flex -space-x-2">
      {shown.map((address, i) => (
        <Avatar
          key={i}
          address={address}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-neutral-200 text-neutral-600 font-semibold ring-2 ring-white',
            size === 'xs' && 'w-6 h-6 text-xs',
            size === 'sm' && 'w-8 h-8 text-xs',
            size === 'md' && 'w-10 h-10 text-sm',
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}


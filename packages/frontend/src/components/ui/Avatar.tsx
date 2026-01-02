/**
 * Avatar Component - User/wallet avatars
 */

interface AvatarProps {
  address?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ address, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };
  
  const getInitials = (addr: string) => {
    return addr.slice(2, 4).toUpperCase();
  };
  
  const getColor = (addr: string) => {
    const hash = addr.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-teal-500',
      'bg-cyan-500',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  if (!address) {
    return (
      <div className={`${sizes[size]} rounded-full bg-neutral-200 ${className}`} />
    );
  }
  
  return (
    <div
      className={`
        ${sizes[size]} rounded-full
        ${getColor(address)}
        text-white font-semibold
        flex items-center justify-center
        ${className}
      `}
    >
      {getInitials(address)}
    </div>
  );
}


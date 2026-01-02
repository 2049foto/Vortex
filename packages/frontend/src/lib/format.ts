/**
 * Formatting utilities for Vortex Protocol
 */

/**
 * Format a number as USD currency
 */
export function formatUSD(value: number, options?: Intl.NumberFormatOptions): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });

  if (Math.abs(value) >= 1_000_000_000) {
    return formatter.format(value / 1_000_000_000).replace('$', '$') + 'B';
  }
  if (Math.abs(value) >= 1_000_000) {
    return formatter.format(value / 1_000_000).replace('$', '$') + 'M';
  }
  if (Math.abs(value) >= 1_000) {
    return formatter.format(value / 1_000).replace('$', '$') + 'K';
  }

  return formatter.format(value);
}

/**
 * Format a number as compact USD (1K, 1M, 1B)
 */
export function formatCompactUSD(value: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number as a compact representation
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, includeSign = true): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: includeSign ? 'exceptZero' : 'auto',
  }).format(value / 100);
  return formatted;
}

/**
 * Format a token balance with appropriate precision
 */
export function formatTokenBalance(balance: number | string, decimals = 4): string {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  
  if (isNaN(num)) return '0';
  
  if (num === 0) return '0';
  if (num < 0.0001) return '<0.0001';
  if (num < 1) return num.toFixed(decimals);
  if (num < 1000) return num.toFixed(Math.min(decimals, 2));
  
  return formatCompact(num);
}

/**
 * Truncate an Ethereum address
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format a date relative to now
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a full date
 */
export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date | string | number): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a transaction hash
 */
export function formatTxHash(hash: string, chars = 8): string {
  if (!hash) return '';
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

/**
 * Get color class for price change
 */
export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-success-light';
  if (change < 0) return 'text-danger-light';
  return 'text-text-secondary';
}

/**
 * Get background color class for price change
 */
export function getPriceChangeBg(change: number): string {
  if (change > 0) return 'bg-success-light/10';
  if (change < 0) return 'bg-danger-light/10';
  return 'bg-text-secondary/10';
}

/**
 * Get color for risk level
 */
export function getRiskLevelColor(level: 'SAFE' | 'WARNING' | 'DANGER'): string {
  switch (level) {
    case 'SAFE':
      return 'text-success-light';
    case 'WARNING':
      return 'text-warning-light';
    case 'DANGER':
      return 'text-danger-light';
    default:
      return 'text-text-secondary';
  }
}

/**
 * Get background color for risk level
 */
export function getRiskLevelBg(level: 'SAFE' | 'WARNING' | 'DANGER'): string {
  switch (level) {
    case 'SAFE':
      return 'bg-success-light/10';
    case 'WARNING':
      return 'bg-warning-light/10';
    case 'DANGER':
      return 'bg-danger-light/10';
    default:
      return 'bg-text-secondary/10';
  }
}

/**
 * Calculate risk level from score
 */
export function getRiskLevelFromScore(score: number): 'SAFE' | 'WARNING' | 'DANGER' {
  if (score <= 30) return 'SAFE';
  if (score <= 70) return 'WARNING';
  return 'DANGER';
}

/**
 * Validate Ethereum address
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Solana address
 */
export function isValidSolAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}


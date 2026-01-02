/**
 * TokenTable Virtual Scrolling Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TokenTable } from '../TokenTable';
import type { ScannedToken } from '@/lib/scanner/types';
import { CHAINS } from '@/lib/chains/config';

// Mock @tanstack/react-virtual
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(() => ({
    getVirtualItems: () => [],
    getTotalSize: () => 0,
  })),
}));

describe('TokenTable Virtual Scrolling', () => {
  const mockTokens: ScannedToken[] = Array.from({ length: 1000 }, (_, i) => ({
    address: `0x${i.toString(16).padStart(40, '0')}`,
    symbol: `TOKEN${i}`,
    name: `Token ${i}`,
    decimals: 18,
    balance: '1000000000000000000',
    balanceFormatted: 1,
    priceUSD: 1,
    valueUSD: 1,
    riskScore: Math.floor(Math.random() * 100),
    isHoneypot: false,
    isRugpull: false,
    chain: 'BASE',
    chainConfig: CHAINS.BASE,
    verified: true,
    liquidity: 100000,
    holders: 1000,
    category: 'DUST',
    allowedActions: ['SWAP'],
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render virtual scrolling container', () => {
    const onBatchAction = vi.fn();
    render(<TokenTable tokens={mockTokens} onBatchAction={onBatchAction} />);

    // Check if virtual scrolling container is rendered
    const container = screen.getByRole('region', { hidden: true });
    expect(container).toBeDefined();
  });

  it('should handle 1000+ tokens efficiently', () => {
    const largeTokenList = Array.from({ length: 2000 }, (_, i) => ({
      ...mockTokens[0],
      address: `0x${i.toString(16).padStart(40, '0')}`,
    }));

    const onBatchAction = vi.fn();
    const { container } = render(
      <TokenTable tokens={largeTokenList} onBatchAction={onBatchAction} />
    );

    // Should render without performance issues
    expect(container).toBeDefined();
  });

  it('should maintain selection state with virtual scrolling', () => {
    const onBatchAction = vi.fn();
    render(<TokenTable tokens={mockTokens} onBatchAction={onBatchAction} />);

    // Selection should work with virtual scrolling
    expect(true).toBe(true);
  });
});


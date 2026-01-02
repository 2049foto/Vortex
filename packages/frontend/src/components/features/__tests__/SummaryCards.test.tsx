/**
 * SummaryCards Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SummaryCards } from '../SummaryCards';
import type { ScanResult } from '@/lib/scanner/types';

const createMockScanResult = (): ScanResult => ({
  address: '0x1234',
  timestamp: Date.now(),
  chains: [],
  tokens: [],
  summary: {
    totalValue: 1000,
    totalTokens: 10,
    premium: { count: 2, value: 500, tokens: [] },
    dust: { count: 5, value: 100, tokens: [] },
    micro: { count: 2, value: 1, tokens: [] },
    risk: { count: 1, value: 50, tokens: [] },
  },
  fromCache: false,
});

describe('SummaryCards', () => {
  it('should render summary data', () => {
    const data = createMockScanResult();
    render(<SummaryCards data={data} />);
    
    expect(screen.getByText(/1,000/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('should call onQuickAction when button clicked', () => {
    const mockAction = vi.fn();
    const data = createMockScanResult();
    
    render(<SummaryCards data={data} onQuickAction={mockAction} />);
    
    const swapButton = screen.getByText(/Swap Dust/);
    fireEvent.click(swapButton);
    
    expect(mockAction).toHaveBeenCalledWith('swap-dust');
  });

  it('should handle null data', () => {
    render(<SummaryCards data={null} />);
    // Should render empty state or loading
  });
});


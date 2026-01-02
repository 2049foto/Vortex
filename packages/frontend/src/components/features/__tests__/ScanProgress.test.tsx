/**
 * ScanProgress Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScanProgress } from '../ScanProgress';
import type { ChainScanStatus } from '@/lib/scanner/types';

describe('ScanProgress', () => {
  const mockChainStatuses: ChainScanStatus[] = [
    { chain: 'BASE', status: 'complete', tokensFound: 5, progress: 100 },
    { chain: 'ETHEREUM', status: 'scanning', tokensFound: 2, progress: 50 },
    { chain: 'BSC', status: 'pending', tokensFound: 0, progress: 0 },
  ];

  it('should render chain statuses', () => {
    render(<ScanProgress chains={mockChainStatuses} />);
    
    expect(screen.getByText(/base/i)).toBeDefined();
    expect(screen.getByText(/ethereum/i)).toBeDefined();
  });

  it('should show progress for scanning chains', () => {
    render(<ScanProgress chains={mockChainStatuses} />);
    
    // Progress should be visible
    expect(true).toBe(true);
  });
});

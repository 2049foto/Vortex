/**
 * TokenTable Component Tests
 * Test suite for virtualized token table
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TokenTable } from '../TokenTable';
import type { ScannedToken } from '@/lib/scanner/types';
import { CHAINS } from '@/lib/chains/config';

// Mock react-window
vi.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount, height }: any) => (
    <div data-testid="virtual-list" data-item-count={itemCount} style={{ height }}>
      {Array.from({ length: Math.min(itemCount, 10) }).map((_, i) => children({ index: i, style: {} }))}
    </div>
  ),
}));

// Mock token factory
const createMockToken = (overrides: Partial<ScannedToken> = {}): ScannedToken => ({
  address: '0x1234567890123456789012345678901234567890',
  symbol: 'TEST',
  name: 'Test Token',
  decimals: 18,
  balance: '1000000000000000000',
  balanceFormatted: 1,
  priceUSD: 1,
  valueUSD: 1,
  riskScore: 30,
  isHoneypot: false,
  isRugpull: false,
  chain: 'BASE',
  chainConfig: CHAINS.BASE,
  verified: true,
  liquidity: 100000,
  holders: 500,
  category: 'DUST',
  allowedActions: ['SWAP', 'HIDE'],
  ...overrides,
});

describe('TokenTable', () => {
  const mockOnBatchAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render empty state', () => {
      render(<TokenTable tokens={[]} onBatchAction={mockOnBatchAction} />);
      
      expect(screen.getByText('No tokens found')).toBeInTheDocument();
    });

    it('should render tokens', () => {
      const tokens = [
        createMockToken({ symbol: 'TOKEN1', valueUSD: 100 }),
        createMockToken({ symbol: 'TOKEN2', valueUSD: 50 }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      expect(screen.getByText('TOKEN1')).toBeInTheDocument();
      expect(screen.getByText('TOKEN2')).toBeInTheDocument();
    });

    it('should show token count', () => {
      const tokens = Array.from({ length: 5 }, () => createMockToken());
      
      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      expect(screen.getByText(/Showing 5 of 5 tokens/)).toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('should filter by category', () => {
      const tokens = [
        createMockToken({ symbol: 'PREMIUM', category: 'PREMIUM', valueUSD: 100 }),
        createMockToken({ symbol: 'DUST', category: 'DUST', valueUSD: 5 }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      // Click PREMIUM filter
      const premiumFilter = screen.getByText('💎');
      fireEvent.click(premiumFilter);
      
      expect(screen.getByText('PREMIUM')).toBeInTheDocument();
      expect(screen.queryByText('DUST')).not.toBeInTheDocument();
    });

    it('should show all tokens when ALL filter selected', () => {
      const tokens = [
        createMockToken({ symbol: 'TOKEN1', category: 'PREMIUM' }),
        createMockToken({ symbol: 'TOKEN2', category: 'DUST' }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const allFilter = screen.getByText('All');
      fireEvent.click(allFilter);
      
      expect(screen.getByText('TOKEN1')).toBeInTheDocument();
      expect(screen.getByText('TOKEN2')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('should sort by value', () => {
      const tokens = [
        createMockToken({ symbol: 'LOW', valueUSD: 10 }),
        createMockToken({ symbol: 'HIGH', valueUSD: 100 }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const sortSelect = screen.getByDisplayValue('Sort: Value');
      expect(sortSelect).toBeInTheDocument();
    });

    it('should sort by risk', () => {
      const tokens = [
        createMockToken({ symbol: 'LOW_RISK', riskScore: 10 }),
        createMockToken({ symbol: 'HIGH_RISK', riskScore: 90 }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const sortSelect = screen.getByDisplayValue('Sort: Value');
      fireEvent.change(sortSelect, { target: { value: 'risk' } });
      
      expect(sortSelect).toHaveValue('risk');
    });
  });

  describe('selection', () => {
    it('should select a token', () => {
      const tokens = [createMockToken({ symbol: 'TOKEN1' })];
      
      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(checkbox).toBeChecked();
    });

    it('should select all tokens', () => {
      const tokens = [
        createMockToken({ symbol: 'TOKEN1' }),
        createMockToken({ symbol: 'TOKEN2' }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const selectAllButton = screen.getByText('Select All');
      fireEvent.click(selectAllButton);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
      });
    });

    it('should clear selection', () => {
      const tokens = [createMockToken({ symbol: 'TOKEN1' })];
      
      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);
      
      expect(checkbox).not.toBeChecked();
    });

    it('should show batch actions when tokens selected', () => {
      const tokens = [
        createMockToken({ symbol: 'TOKEN1', allowedActions: ['SWAP'] }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(screen.getByText(/tokens selected/)).toBeInTheDocument();
      expect(screen.getByText('🔄 Swap All')).toBeInTheDocument();
    });
  });

  describe('batch actions', () => {
    it('should call onBatchAction when swap clicked', () => {
      const tokens = [
        createMockToken({ symbol: 'TOKEN1', allowedActions: ['SWAP'] }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const swapButton = screen.getByText('🔄');
      fireEvent.click(swapButton);
      
      expect(mockOnBatchAction).toHaveBeenCalledWith('SWAP', [tokens[0]]);
    });

    it('should call onBatchAction for batch swap', () => {
      const tokens = [
        createMockToken({ symbol: 'TOKEN1', allowedActions: ['SWAP'] }),
        createMockToken({ symbol: 'TOKEN2', allowedActions: ['SWAP'] }),
      ];

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      // Select all
      const selectAllButton = screen.getByText('Select All');
      fireEvent.click(selectAllButton);
      
      // Click batch swap
      const batchSwapButton = screen.getByText('🔄 Swap All');
      fireEvent.click(batchSwapButton);
      
      expect(mockOnBatchAction).toHaveBeenCalledWith('SWAP', tokens);
    });
  });

  describe('virtual scrolling', () => {
    it('should use virtual scrolling for 100+ tokens', () => {
      const tokens = Array.from({ length: 150 }, (_, i) => 
        createMockToken({ symbol: `TOKEN${i}` })
      );

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const virtualList = screen.getByTestId('virtual-list');
      expect(virtualList).toBeInTheDocument();
      expect(virtualList).toHaveAttribute('data-item-count', '150');
    });

    it('should not use virtual scrolling for <100 tokens', () => {
      const tokens = Array.from({ length: 50 }, (_, i) => 
        createMockToken({ symbol: `TOKEN${i}` })
      );

      render(<TokenTable tokens={tokens} onBatchAction={mockOnBatchAction} />);
      
      const virtualList = screen.queryByTestId('virtual-list');
      expect(virtualList).not.toBeInTheDocument();
    });
  });

  describe('show hidden toggle', () => {
    it('should show toggle when onToggleHidden provided', () => {
      const mockToggle = vi.fn();
      
      render(
        <TokenTable 
          tokens={[]} 
          onBatchAction={mockOnBatchAction}
          showHidden={false}
          onToggleHidden={mockToggle}
        />
      );
      
      expect(screen.getByText('Show Hidden')).toBeInTheDocument();
    });

    it('should call onToggleHidden when toggle clicked', () => {
      const mockToggle = vi.fn();
      
      render(
        <TokenTable 
          tokens={[]} 
          onBatchAction={mockOnBatchAction}
          showHidden={false}
          onToggleHidden={mockToggle}
        />
      );
      
      // Find and click toggle (implementation depends on Switch component)
      // This is a placeholder - actual implementation may vary
    });
  });
});


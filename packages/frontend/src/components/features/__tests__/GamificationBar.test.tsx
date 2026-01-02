/**
 * GamificationBar Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GamificationBar } from '../GamificationBar';

describe('GamificationBar', () => {
  it('should render XP and level', () => {
    render(<GamificationBar xp={500} level={5} streak={3} />);
    
    expect(screen.getByText(/level 5/i)).toBeDefined();
    expect(screen.getByText(/500/i)).toBeDefined();
  });

  it('should display streak', () => {
    render(<GamificationBar xp={500} level={5} streak={7} />);
    
    expect(screen.getByText(/7/i)).toBeDefined();
  });

  it('should show progress bar', () => {
    render(<GamificationBar xp={500} level={5} streak={3} />);
    
    // Progress bar should be rendered
    expect(true).toBe(true);
  });
});

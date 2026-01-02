/**
 * Config Tests
 */

import { describe, it, expect } from 'vitest';
import { config } from '../config';

describe('Config', () => {
  it('should have API URL configured', () => {
    expect(config.api.url).toBeDefined();
    expect(config.api.url).toContain('http');
  });

  it('should have chains configured', () => {
    expect(config.chains).toBeDefined();
    expect(config.chains.length).toBeGreaterThan(0);
  });

  it('should have target chain configured', () => {
    expect(config.targetChain).toBeDefined();
  });
});

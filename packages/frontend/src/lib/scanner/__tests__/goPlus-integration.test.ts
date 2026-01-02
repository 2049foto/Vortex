/**
 * GoPlus Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchTokenSecurity,
  enhanceTokenWithSecurity,
  enhanceTokensWithSecurity,
} from '../goPlus-integration';
import type { ScannedToken } from '../types';

// Mock fetch
global.fetch = vi.fn();

describe('GoPlus Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTokenSecurity', () => {
    it('should fetch token security from backend API', async () => {
      const mockResponse = {
        success: true,
        data: {
          token: {
            address: '0x123',
            symbol: 'TEST',
            name: 'Test Token',
            chain: 'base',
          },
          risk: {
            riskScore: 25,
            riskLevel: 'SAFE' as const,
            safe: true,
            honeypot: false,
            rugpull: false,
            transferability: true,
            risks: [],
          },
          cachedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchTokenSecurity('0x123', 'base');
      expect(result).toBeDefined();
      expect(result?.risk.riskScore).toBe(25);
    });

    it('should return null on 404', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchTokenSecurity('0x123', 'base');
      expect(result).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await fetchTokenSecurity('0x123', 'base');
      expect(result).toBeNull();
    });
  });

  describe('enhanceTokenWithSecurity', () => {
    it('should enhance token with security data', async () => {
      const token: ScannedToken = {
        address: '0x123',
        symbol: 'TEST',
        name: 'Test Token',
        decimals: 18,
        balance: '1000',
        balanceFormatted: 1000,
        priceUSD: 1,
        valueUSD: 1000,
        riskScore: 0,
        isHoneypot: false,
        isRugpull: false,
        chain: 'BASE',
        chainConfig: { id: 8453, name: 'Base', symbol: 'ETH', rpc: '', explorer: '', color: '', icon: '' },
        verified: false,
        liquidity: 0,
        holders: 0,
        category: 'DUST',
        allowedActions: ['SWAP'],
      };

      const mockResponse = {
        success: true,
        data: {
          token: { address: '0x123', symbol: 'TEST', name: 'Test Token', chain: 'base' },
          risk: {
            riskScore: 30,
            riskLevel: 'WARNING' as const,
            safe: false,
            honeypot: false,
            rugpull: false,
            transferability: true,
            risks: [],
          },
          cachedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const enhanced = await enhanceTokenWithSecurity(token);
      expect(enhanced.riskScore).toBe(30);
    });

    it('should skip enhancement if token already has risk data', async () => {
      const token: ScannedToken = {
        address: '0x123',
        symbol: 'TEST',
        name: 'Test Token',
        decimals: 18,
        balance: '1000',
        balanceFormatted: 1000,
        priceUSD: 1,
        valueUSD: 1000,
        riskScore: 50,
        isHoneypot: true,
        isRugpull: false,
        chain: 'BASE',
        chainConfig: { id: 8453, name: 'Base', symbol: 'ETH', rpc: '', explorer: '', color: '', icon: '' },
        verified: false,
        liquidity: 0,
        holders: 0,
        category: 'RISK',
        allowedActions: ['HIDE'],
      };

      const enhanced = await enhanceTokenWithSecurity(token);
      expect(enhanced.riskScore).toBe(50);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('enhanceTokensWithSecurity', () => {
    it('should enhance multiple tokens in batches', async () => {
      const tokens: ScannedToken[] = Array.from({ length: 10 }, (_, i) => ({
        address: `0x${i}`,
        symbol: `TEST${i}`,
        name: `Test Token ${i}`,
        decimals: 18,
        balance: '1000',
        balanceFormatted: 1000,
        priceUSD: 1,
        valueUSD: 1000,
        riskScore: 0,
        isHoneypot: false,
        isRugpull: false,
        chain: 'BASE',
        chainConfig: { id: 8453, name: 'Base', symbol: 'ETH', rpc: '', explorer: '', color: '', icon: '' },
        verified: false,
        liquidity: 0,
        holders: 0,
        category: 'DUST',
        allowedActions: ['SWAP'],
      }));

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            token: { address: '0x0', symbol: 'TEST', name: 'Test', chain: 'base' },
            risk: {
              riskScore: 25,
              riskLevel: 'SAFE' as const,
              safe: true,
              honeypot: false,
              rugpull: false,
              transferability: true,
              risks: [],
            },
            cachedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
          },
        }),
      });

      const enhanced = await enhanceTokensWithSecurity(tokens);
      expect(enhanced.length).toBe(10);
    });
  });
});


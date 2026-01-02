/**
 * Token scanner tests
 */

import { describe, test, expect } from 'bun:test';
import { parseSecurityResult, type GoPlusTokenSecurity } from '../../src/lib/scanner/goplusClient';

describe('Token Scanner', () => {
  describe('parseSecurityResult', () => {
    test('should parse safe token correctly', () => {
      const data: GoPlusTokenSecurity = {
        is_honeypot: '0',
        is_open_source: '1',
        is_mintable: '0',
        owner_change_balance: '0',
        hidden_owner: '0',
        selfdestruct: '0',
        buy_tax: '0',
        sell_tax: '0',
        cannot_sell_all: '0',
        is_in_dex: '1',
        token_name: 'Test Token',
        token_symbol: 'TEST',
      };

      const result = parseSecurityResult(data);

      expect(result.riskLevel).toBe('SAFE');
      expect(result.safe).toBe(true);
      expect(result.honeypot).toBe(false);
      expect(result.rugpull).toBe(false);
      expect(result.transferability).toBe(true);
      expect(result.riskScore).toBeLessThanOrEqual(20);
    });

    test('should detect honeypot', () => {
      const data: GoPlusTokenSecurity = {
        is_honeypot: '1',
        is_open_source: '1',
      };

      const result = parseSecurityResult(data);

      expect(result.honeypot).toBe(true);
      expect(result.riskScore).toBeGreaterThanOrEqual(40);
      expect(result.risks.some(r => r.name === 'Honeypot Detected')).toBe(true);
    });

    test('should detect rugpull risks', () => {
      const data: GoPlusTokenSecurity = {
        is_honeypot: '0',
        owner_change_balance: '1',
        selfdestruct: '1',
      };

      const result = parseSecurityResult(data);

      expect(result.rugpull).toBe(true);
      expect(result.riskLevel).not.toBe('SAFE');
    });

    test('should flag high tax tokens', () => {
      const data: GoPlusTokenSecurity = {
        is_honeypot: '0',
        buy_tax: '0.15',
        sell_tax: '0.20',
      };

      const result = parseSecurityResult(data);

      expect(result.risks.some(r => r.name === 'High Tax')).toBe(true);
    });

    test('should flag non-open source', () => {
      const data: GoPlusTokenSecurity = {
        is_honeypot: '0',
        is_open_source: '0',
      };

      const result = parseSecurityResult(data);

      expect(result.risks.some(r => r.name === 'Not Open Source')).toBe(true);
    });

    test('should cap risk score at 100', () => {
      const data: GoPlusTokenSecurity = {
        is_honeypot: '1',
        is_open_source: '0',
        is_mintable: '1',
        owner_change_balance: '1',
        hidden_owner: '1',
        selfdestruct: '1',
        cannot_sell_all: '1',
        transfer_pausable: '1',
        is_blacklisted: '1',
      };

      const result = parseSecurityResult(data);

      expect(result.riskScore).toBe(100);
      expect(result.riskLevel).toBe('DANGER');
    });
  });

  describe('Risk Level Classification', () => {
    test('should classify as SAFE for score <= 20', () => {
      const data: GoPlusTokenSecurity = {
        is_honeypot: '0',
        is_open_source: '1',
        is_in_dex: '1',
      };

      const result = parseSecurityResult(data);
      expect(result.riskLevel).toBe('SAFE');
    });

    test('should classify as DANGER for score > 50', () => {
      const data: GoPlusTokenSecurity = {
        is_honeypot: '1',
        is_open_source: '0',
      };

      const result = parseSecurityResult(data);
      expect(result.riskLevel).toBe('DANGER');
    });
  });
});


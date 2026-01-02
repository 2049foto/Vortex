/**
 * Vortex Hide/Burn Logic
 * Action matrix validation and batch operations
 */

import type { ScannedToken, TokenCategory, TokenAction } from '../scanner/types';
import { batchEngine } from './engine';
import { swapEngine } from './swap-engine';

// Action matrix: defines allowed actions per category
const ACTION_MATRIX: Record<TokenCategory, TokenAction[]> = {
  PREMIUM: ['HOLD', 'SWAP'], // Premium tokens can only be held or swapped
  DUST: ['SWAP', 'HIDE'], // Dust tokens can be swapped or hidden
  MICRO: ['HIDE', 'BURN'], // Micro tokens can be hidden or burned
  RISK: ['HIDE'], // Risk tokens can only be hidden
};

/**
 * Validate if action is allowed for token category
 */
export function isActionAllowed(
  category: TokenCategory,
  action: TokenAction
): boolean {
  const allowedActions = ACTION_MATRIX[category];
  return allowedActions.includes(action);
}

/**
 * Validate batch action for multiple tokens
 */
export function validateBatchAction(
  tokens: ScannedToken[],
  action: TokenAction
): {
  valid: boolean;
  eligibleTokens: ScannedToken[];
  invalidTokens: ScannedToken[];
  errors: string[];
} {
  const eligibleTokens: ScannedToken[] = [];
  const invalidTokens: ScannedToken[] = [];
  const errors: string[] = [];

  for (const token of tokens) {
    // Check if action is allowed for this category
    if (!isActionAllowed(token.category, action)) {
      invalidTokens.push(token);
      errors.push(
        `${token.symbol} (${token.category}): Action ${action} not allowed. Allowed: ${ACTION_MATRIX[token.category].join(', ')}`
      );
      continue;
    }

    // Additional validation based on action type
    switch (action) {
      case 'SWAP':
        if (token.valueUSD < 0.01) {
          invalidTokens.push(token);
          errors.push(`${token.symbol}: Value too low for swap (<$0.01)`);
          continue;
        }
        if (!token.allowedActions.includes('SWAP')) {
          invalidTokens.push(token);
          errors.push(`${token.symbol}: SWAP not in allowed actions`);
          continue;
        }
        break;

      case 'HIDE':
        if (!token.allowedActions.includes('HIDE')) {
          invalidTokens.push(token);
          errors.push(`${token.symbol}: HIDE not in allowed actions`);
          continue;
        }
        break;

      case 'BURN':
        if (token.valueUSD >= 0.1) {
          invalidTokens.push(token);
          errors.push(`${token.symbol}: Value too high for burn (>=$0.1)`);
          continue;
        }
        if (!token.allowedActions.includes('BURN')) {
          invalidTokens.push(token);
          errors.push(`${token.symbol}: BURN not in allowed actions`);
          continue;
        }
        break;

      case 'HOLD':
        if (token.category !== 'PREMIUM') {
          invalidTokens.push(token);
          errors.push(`${token.symbol}: HOLD only allowed for PREMIUM tokens`);
          continue;
        }
        break;
    }

    eligibleTokens.push(token);
  }

  return {
    valid: eligibleTokens.length > 0 && invalidTokens.length === 0,
    eligibleTokens,
    invalidTokens,
    errors,
  };
}

/**
 * Execute batch hide operation
 */
export async function executeBatchHide(
  tokens: ScannedToken[]
): Promise<{
  success: boolean;
  tokensProcessed: number;
  errors: string[];
}> {
  const validation = validateBatchAction(tokens, 'HIDE');

  if (validation.eligibleTokens.length === 0) {
    return {
      success: false,
      tokensProcessed: 0,
      errors: validation.errors,
    };
  }

  try {
    const result = await batchEngine.batchHide(validation.eligibleTokens);

    return {
      success: result.success,
      tokensProcessed: result.tokensProcessed,
      errors: result.success ? [] : [result.error || 'Batch hide failed'],
    };
  } catch (error) {
    return {
      success: false,
      tokensProcessed: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Execute batch burn operation
 */
export async function executeBatchBurn(
  tokens: ScannedToken[],
  ownerPrivateKey?: `0x${string}`
): Promise<{
  success: boolean;
  txHash?: string;
  tokensProcessed: number;
  errors: string[];
}> {
  const validation = validateBatchAction(tokens, 'BURN');

  if (validation.eligibleTokens.length === 0) {
    return {
      success: false,
      tokensProcessed: 0,
      errors: validation.errors,
    };
  }

  try {
    if (ownerPrivateKey) {
      // Use ERC-4337 for gasless burn
      const result = await swapEngine.executeBatchBurn(validation.eligibleTokens, ownerPrivateKey);
      return {
        success: result.success,
        txHash: result.txHash,
        tokensProcessed: result.tokensProcessed,
        errors: result.success ? [] : [result.error || 'Batch burn failed'],
      };
    } else {
      // Fallback to batch engine (local only)
      const result = await batchEngine.batchBurn(validation.eligibleTokens);
      return {
        success: result.success,
        txHash: result.txHash,
        tokensProcessed: result.tokensProcessed,
        errors: result.success ? [] : [result.error || 'Batch burn failed'],
      };
    }
  } catch (error) {
    return {
      success: false,
      tokensProcessed: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Execute batch swap with validation
 */
export async function executeBatchSwap(
  tokens: ScannedToken[],
  ownerPrivateKey: `0x${string}`,
  targetToken?: string,
  slippage?: number
): Promise<{
  success: boolean;
  txHash?: string;
  tokensProcessed: number;
  totalValueSaved: number;
  errors: string[];
}> {
  const validation = validateBatchAction(tokens, 'SWAP');

  if (validation.eligibleTokens.length === 0) {
    return {
      success: false,
      tokensProcessed: 0,
      totalValueSaved: 0,
      errors: validation.errors,
    };
  }

  try {
    const result = await swapEngine.executeBatchSwap(
      validation.eligibleTokens,
      ownerPrivateKey,
      targetToken as `0x${string}` | undefined,
      slippage
    );

    return {
      success: result.success,
      txHash: result.txHash,
      tokensProcessed: result.tokensProcessed,
      totalValueSaved: result.totalValueSaved,
      errors: result.success ? [] : [result.error || 'Batch swap failed'],
    };
  } catch (error) {
    return {
      success: false,
      tokensProcessed: 0,
      totalValueSaved: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Get action matrix for display
 */
export function getActionMatrix(): Record<TokenCategory, TokenAction[]> {
  return { ...ACTION_MATRIX };
}

/**
 * Get allowed actions for a token
 */
export function getAllowedActions(token: ScannedToken): TokenAction[] {
  return ACTION_MATRIX[token.category];
}

/**
 * Check if token can be hidden
 */
export function canHide(token: ScannedToken): boolean {
  return isActionAllowed(token.category, 'HIDE');
}

/**
 * Check if token can be burned
 */
export function canBurn(token: ScannedToken): boolean {
  return isActionAllowed(token.category, 'BURN') && token.valueUSD < 0.1;
}

/**
 * Check if token can be swapped
 */
export function canSwap(token: ScannedToken): boolean {
  return isActionAllowed(token.category, 'SWAP') && token.valueUSD >= 0.01;
}

/**
 * Persist hidden tokens to backend (sync)
 */
export async function syncHiddenTokensToBackend(
  hiddenTokens: string[]
): Promise<boolean> {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/api/watchlist/hidden`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokens: hiddenTokens }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error syncing hidden tokens:', error);
    return false;
  }
}

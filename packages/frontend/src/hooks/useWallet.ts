/**
 * Wallet connection hook for Vortex Protocol
 * Handles wallet connection, signing, and network switching
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Wallet state
 */
interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

/**
 * Wallet hook return type
 */
interface UseWalletReturn extends WalletState {
  /** Connect wallet */
  connect: () => Promise<void>;
  /** Disconnect wallet */
  disconnect: () => void;
  /** Sign a message */
  signMessage: (message: string) => Promise<string>;
  /** Switch network */
  switchNetwork: (chainId: number) => Promise<void>;
  /** Check if MetaMask is installed */
  isMetaMaskInstalled: boolean;
}

/**
 * Ethereum provider type
 */
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

/**
 * Wallet hook
 */
export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const { login, logout } = useAuth();

  const isMetaMaskInstalled = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;

  /**
   * Get current accounts
   */
  const getAccounts = useCallback(async (): Promise<string[]> => {
    if (!window.ethereum) return [];
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts as string[];
    } catch {
      return [];
    }
  }, []);

  /**
   * Get current chain ID
   */
  const getChainId = useCallback(async (): Promise<number | null> => {
    if (!window.ethereum) return null;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId as string, 16);
    } catch {
      return null;
    }
  }, []);

  /**
   * Connect wallet
   */
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: 'Please install MetaMask to connect your wallet',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const accountsArray = accounts as string[];
      if (accountsArray.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accountsArray[0] ?? null;
      const chainId = await getChainId();

      if (!address) {
        throw new Error('No accounts found');
      }

      setState({
        address,
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      // Authenticate with backend
      await login(address, signMessage);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: message,
      }));
    }
  }, [getChainId, login]);

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(() => {
    setState({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
    logout();
  }, [logout]);

  /**
   * Sign a message
   */
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!window.ethereum || !state.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, state.address],
      });

      return signature as string;
    } catch (err) {
      if (err instanceof Error && err.message.includes('User rejected')) {
        throw new Error('Signature request was rejected');
      }
      throw err;
    }
  }, [state.address]);

  /**
   * Switch network
   */
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!window.ethereum) {
      throw new Error('Wallet not connected');
    }

    const hexChainId = `0x${chainId.toString(16)}`;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (err) {
      // Chain not added, try to add it
      if ((err as { code: number }).code === 4902) {
        throw new Error('Please add this network to your wallet');
      }
      throw err;
    }
  }, []);

  /**
   * Handle account changes
   */
  const handleAccountsChanged = useCallback((accounts: unknown) => {
    const accountsArray = accounts as string[];
    if (accountsArray.length === 0) {
      disconnect();
    } else {
      const newAddress = accountsArray[0] ?? null;
      setState((prev) => ({
        ...prev,
        address: newAddress,
      }));
    }
  }, [disconnect]);

  /**
   * Handle chain changes
   */
  const handleChainChanged = useCallback((chainId: unknown) => {
    const newChainId = parseInt(chainId as string, 16);
    setState((prev) => ({
      ...prev,
      chainId: newChainId,
    }));
  }, []);

  /**
   * Setup event listeners and check initial state
   */
  useEffect(() => {
    if (!window.ethereum) return;

    // Check if already connected
    const checkConnection = async () => {
      const accounts = await getAccounts();
      if (accounts.length > 0) {
        const chainId = await getChainId();
        const address = accounts[0] ?? null;
        setState({
          address,
          chainId,
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      }
    };

    checkConnection();

    // Setup event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [getAccounts, getChainId, handleAccountsChanged, handleChainChanged]);

  return {
    ...state,
    connect,
    disconnect,
    signMessage,
    switchNetwork,
    isMetaMaskInstalled,
  };
}

export default useWallet;


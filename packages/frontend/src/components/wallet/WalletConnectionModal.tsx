/**
 * Wallet Connection Modal
 * Dual wallet support (EVM via RainbowKit + Solana)
 */

import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Wallet, LogOut } from 'lucide-react';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectionModal({ isOpen, onClose }: WalletConnectionModalProps) {
  const { address: evmAddress, isConnected: isEVMConnected } = useAccount();
  const { disconnect: disconnectEVM } = useDisconnect();
  const { publicKey: solanaAddress, connected: isSolanaConnected } = useWallet();
  const { openConnectModal } = useConnectModal();

  const handleConnectEVM = () => {
    openConnectModal?.();
  };

  const handleConnectSolana = () => {
    // Solana wallet modal is handled by WalletModalProvider
    // This would trigger the Solana wallet adapter modal
    const button = document.querySelector('[data-wallet-adapter-button]') as HTMLElement;
    button?.click();
  };

  const handleDisconnectAll = () => {
    if (isEVMConnected) disconnectEVM();
    if (isSolanaConnected) {
      // Disconnect Solana wallet
      const wallet = useWallet();
      wallet.disconnect();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Wallets">
      <div className="space-y-4">
        {/* EVM Wallet Section */}
        <div className="p-4 border border-neutral-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-neutral-900">EVM Wallets</h3>
              <p className="text-sm text-neutral-600">Base, Arbitrum, Optimism, etc.</p>
            </div>
            {isEVMConnected ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                <span className="text-sm text-neutral-500">Not Connected</span>
              </div>
            )}
          </div>

          {isEVMConnected ? (
            <div className="space-y-2">
              <p className="text-sm font-mono text-neutral-700 break-all">
                {evmAddress}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => disconnectEVM()}
                icon={<LogOut size={16} />}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => openConnectModal?.()}
              icon={<Wallet size={16} />}
              fullWidth
            >
              Connect EVM Wallet
            </Button>
          )}
        </div>

        {/* Solana Wallet Section */}
        <div className="p-4 border border-neutral-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-neutral-900">Solana Wallet</h3>
              <p className="text-sm text-neutral-600">Phantom, Solflare, etc.</p>
            </div>
            {isSolanaConnected ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                <span className="text-sm text-neutral-500">Not Connected</span>
              </div>
            )}
          </div>

          {isSolanaConnected ? (
            <div className="space-y-2">
              <p className="text-sm font-mono text-neutral-700 break-all">
                {solanaAddress?.toBase58()}
              </p>
              <Button
                variant="secondary"
                size="sm"
              onClick={async () => {
                const { disconnect } = useWallet();
                await disconnect();
              }}
                icon={<LogOut size={16} />}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnectSolana}
              icon={<Wallet size={16} />}
              fullWidth
            >
              Connect Solana Wallet
            </Button>
          )}
        </div>

        {/* Combined Status */}
        {(isEVMConnected || isSolanaConnected) && (
          <div className="pt-4 border-t border-neutral-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnectAll}
              fullWidth
            >
              Disconnect All
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}


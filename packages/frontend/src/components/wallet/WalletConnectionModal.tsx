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
import { Wallet, LogOut, CheckCircle } from 'lucide-react';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (addresses: { evm?: string; solana?: string }) => void;
}

export function WalletConnectionModal({ isOpen, onClose, onSuccess }: WalletConnectionModalProps) {
  const { address: evmAddress, isConnected: isEVMConnected } = useAccount();
  const { disconnect: disconnectEVM } = useDisconnect();
  const { publicKey: solanaAddress, connected: isSolanaConnected, disconnect: disconnectSolana } = useWallet();
  const { openConnectModal } = useConnectModal();

  const [selectedEVMWallet, setSelectedEVMWallet] = useState<string>('');
  const [selectedSolanaWallet, setSelectedSolanaWallet] = useState<string>('');

  const handleConnectEVM = (walletName: string) => {
    setSelectedEVMWallet(walletName);
    openConnectModal?.();
  };

  const handleConnectSolana = (walletName: string) => {
    setSelectedSolanaWallet(walletName);
    // Solana wallet modal is handled by WalletModalProvider
    const button = document.querySelector('[data-wallet-adapter-button]') as HTMLElement;
    button?.click();
  };

  const handleStartScanning = () => {
    const addresses: { evm?: string; solana?: string } = {};
    if (isEVMConnected && evmAddress) {
      addresses.evm = evmAddress;
    }
    if (isSolanaConnected && solanaAddress) {
      addresses.solana = solanaAddress.toBase58();
    }
    onSuccess?.(addresses);
    onClose();
  };

  const walletsConnected = isEVMConnected || isSolanaConnected;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Your Wallets" size="large">
      <div className="space-y-6">
        {/* EVM Wallet Section */}
        <div className="p-6 border border-neutral-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">🔷 EVM Wallets</h3>
              <p className="text-sm text-neutral-600">Base, Arbitrum, Optimism, BSC, Ethereum, Polygon, AVAX, Monad</p>
            </div>
            {isEVMConnected ? (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-600">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-300" />
                <span className="text-sm text-neutral-500">Not Connected</span>
              </div>
            )}
          </div>

          {isEVMConnected ? (
            <div className="space-y-3">
              <p className="text-sm font-mono text-neutral-700 break-all bg-neutral-50 p-3 rounded-lg">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <WalletCard
                icon="🦊"
                name="MetaMask"
                description="Most popular"
                onClick={() => handleConnectEVM('MetaMask')}
                selected={selectedEVMWallet === 'MetaMask'}
              />
              <WalletCard
                icon="🔗"
                name="WalletConnect"
                description="300+ wallets"
                onClick={() => handleConnectEVM('WalletConnect')}
                selected={selectedEVMWallet === 'WalletConnect'}
              />
              <WalletCard
                icon="🛡️"
                name="Coinbase Wallet"
                description="Built for Base"
                onClick={() => handleConnectEVM('Coinbase')}
                selected={selectedEVMWallet === 'Coinbase'}
              />
              <WalletCard
                icon="🌈"
                name="Rainbow"
                description="Mobile first"
                onClick={() => handleConnectEVM('Rainbow')}
                selected={selectedEVMWallet === 'Rainbow'}
              />
            </div>
          )}
        </div>

        {/* Solana Wallet Section */}
        <div className="p-6 border border-neutral-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">◆ Solana Wallet</h3>
              <p className="text-sm text-neutral-600">Phantom, Solflare, Backpack</p>
            </div>
            {isSolanaConnected ? (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-600">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-300" />
                <span className="text-sm text-neutral-500">Not Connected</span>
              </div>
            )}
          </div>

          {isSolanaConnected ? (
            <div className="space-y-3">
              <p className="text-sm font-mono text-neutral-700 break-all bg-neutral-50 p-3 rounded-lg">
                {solanaAddress?.toBase58()}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => await disconnectSolana()}
                icon={<LogOut size={16} />}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <WalletCard
                icon="👻"
                name="Phantom"
                description="Most popular"
                onClick={() => handleConnectSolana('Phantom')}
                selected={selectedSolanaWallet === 'Phantom'}
              />
              <WalletCard
                icon="☀️"
                name="Solflare"
                description="Power users"
                onClick={() => handleConnectSolana('Solflare')}
                selected={selectedSolanaWallet === 'Solflare'}
              />
              <WalletCard
                icon="🎒"
                name="Backpack"
                description="Cross-chain"
                onClick={() => handleConnectSolana('Backpack')}
                selected={selectedSolanaWallet === 'Backpack'}
              />
            </div>
          )}
        </div>

        {/* Start Scanning Button */}
        <div className="pt-4 border-t border-neutral-200">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartScanning}
            disabled={!walletsConnected}
            fullWidth
            className="py-4"
          >
            {walletsConnected ? (
              <span className="flex items-center justify-center gap-2">
                Start Scanning ({[isEVMConnected, isSolanaConnected].filter(Boolean).length} wallet{[isEVMConnected, isSolanaConnected].filter(Boolean).length > 1 ? 's' : ''})
                <Wallet size={20} />
              </span>
            ) : (
              'Connect at least one wallet to continue'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function WalletCard({ 
  icon, 
  name, 
  description, 
  onClick, 
  selected 
}: { 
  icon: string; 
  name: string; 
  description: string; 
  onClick: () => void; 
  selected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={` 
        p-4 border-2 rounded-xl text-left transition-all
        ${selected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
        }
      `}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-neutral-900">{name}</div>
      <div className="text-sm text-neutral-500">{description}</div>
    </button>
  );
}

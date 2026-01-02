/**
 * Wallet Provider - Wagmi + RainbowKit + Solana
 * Dual wallet support (EVM + Solana)
 */

import React, { useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { config as wagmiConfig } from '@/lib/wagmi/config';
import { config as appConfig } from '@/lib/config';
import '@rainbow-me/rainbowkit/styles.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient();

interface WalletProviderProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

export function WalletProvider({ children, theme = 'light' }: WalletProviderProps) {
  // Solana wallet adapters
  const solanaWallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  // Get Solana RPC endpoint (priority: Helius > QuickNode > Alchemy > fallback)
  const solanaEndpoint = useMemo(() => {
    return (
      appConfig.rpc.heliusRpc ||
      appConfig.rpc.heliusMainnet ||
      appConfig.rpc.quicknodeSolana ||
      appConfig.rpc.alchemySolana ||
      'https://solana.drpc.org'
    );
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={theme === 'dark' ? darkTheme() : lightTheme()}
          modalSize="compact"
        >
          <ConnectionProvider endpoint={solanaEndpoint}>
            <SolanaWalletProvider wallets={solanaWallets} autoConnect>
              <WalletModalProvider>
                {children}
              </WalletModalProvider>
            </SolanaWalletProvider>
          </ConnectionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


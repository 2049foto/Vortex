/**
 * Wagmi 3.1.4 Configuration
 * Multi-chain support (Base, Arbitrum, Optimism, Polygon, Ethereum, BSC, Avalanche)
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, arbitrum, optimism, polygon, mainnet, bsc, avalanche } from 'wagmi/chains';
import { config as appConfig } from '../config';

export const wagmiConfig = getDefaultConfig({
  appName: appConfig.app.name || 'Vortex Protocol',
  projectId: appConfig.wallet.walletConnectProjectId || import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || import.meta.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [base, arbitrum, optimism, polygon, mainnet, bsc, avalanche],
  ssr: false, // Client-side only
});

// Export as config for backward compatibility
export const config = wagmiConfig;

// Target chain (Base)
export const TARGET_CHAIN = base;


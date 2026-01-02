/**
 * Wagmi 3.1.4 Configuration
 * Multi-chain support (Base, Arbitrum, Optimism, Polygon, Ethereum, BSC, Avalanche)
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, arbitrum, optimism, polygon, mainnet, bsc, avalanche } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Vortex Protocol',
  projectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [base, arbitrum, optimism, polygon, mainnet, bsc, avalanche],
  ssr: false, // Client-side only
});

// Target chain (Base)
export const TARGET_CHAIN = base;


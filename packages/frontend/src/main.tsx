/**
 * Vortex Protocol - Entry Point
 */

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initializeWalletHandler } from './lib/wallet-handler';
import './styles/globals.css';
import './styles/mobile.css';
import './styles/animations.css';

// Initialize wallet handler BEFORE React
initializeWalletHandler();

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create and render app
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

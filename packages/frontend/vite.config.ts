import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite configuration for Vortex Protocol frontend
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Proxy only in development
    proxy: mode === 'development' ? {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
      },
    } : undefined,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          wagmi: ['wagmi', 'viem'],
          rainbowkit: ['@rainbow-me/rainbowkit'],
          charts: ['recharts'],
          utils: ['zustand', 'clsx'],
          virtual: ['@tanstack/react-virtual'],
          solana: ['@solana/web3.js', '@solana/spl-token'],
        },
      },
    },
    // Tree shaking is enabled by default in Vite
    treeshake: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));


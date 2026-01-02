/**
 * Vortex Protocol 2026 - Landing Page
 * Hero + Connect CTA ONLY (No manual input, No tabs)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WalletConnectionModal } from '@/components/wallet/WalletConnectionModal';

export default function Home() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">🌀</span>
            </div>
            <span className="text-xl font-bold text-white">Vortex Protocol</span>
          </div>
          
          {!isConnected && (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl
                         shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40
                         transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Connect & Scan Portfolio
            </button>
          )}
        </div>
      </header>
      
      {/* Hero */}
      <div className="relative pt-24 pb-32 max-w-7xl mx-auto px-6">
        <div className="text-center">
          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-8 drop-shadow-2xl"
          >
            🌀 VORTEX
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Clean Your Crypto Portfolio Across <span className="font-bold text-blue-400">9 Chains</span>
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-slate-400 mb-20 max-w-2xl mx-auto"
          >
            Scan -  Classify -  <span className="text-blue-400">Gasless</span> Swap -  Earn XP
          </motion.p>
          
          {/* Primary CTA */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => setWalletModalOpen(true)}
            className="px-12 py-6 text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                       text-white rounded-3xl shadow-2xl shadow-blue-500/50
                       hover:shadow-3xl hover:shadow-blue-500/70
                       hover:scale-[1.05] active:scale-[0.98]
                       transition-all duration-300 backdrop-blur-xl"
          >
            🔗 Connect & Scan Portfolio
          </motion.button>
        </div>
        
        {/* Trust Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <FeatureCard
            icon="🔗"
            title="9 Chains"
            description="BSC, Base, Arbitrum, Polygon, Ethereum, AVAX, Optimism, Monad, Solana"
          />
          <FeatureCard
            icon="🛡️"
            title="AI Security"
            description="GoPlus API + Multi-factor risk scoring"
          />
          <FeatureCard
            icon="⚡"
            title="Gasless Swaps"
            description="Pimlico ERC-4337 - All swaps to Base ETH/USDC"
          />
        </motion.div>
        
        {/* Built for Base */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-24 pt-16 border-t border-white/20"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
            <img src="/base-logo.png" className="w-8 h-8" alt="Base" />
            <span className="text-xl font-semibold text-white">Built for Base Network</span>
          </div>
        </motion.div>
      </div>
      
      {/* Wallet Modal */}
      <WalletConnectionModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onSuccess={() => {
          setIsConnected(true);
          setWalletModalOpen(false);
          // Navigate to portfolio after successful connection
          window.location.href = '/portfolio';
        }}
      />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8
                 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-blue-500/30
                 transition-all duration-500"
    >
      <div className="text-4xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}

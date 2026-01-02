/**
 * Scanning Progress Component
 * Full-screen modal with real-time WebSocket updates
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { ChainScanStatus } from '@/lib/scanner/types';

interface ScanningProgressProps {
  scanId: string;
  onComplete: (result: any) => void;
}

interface ChainProgress {
  chainId: number | string;
  name: string;
  progress: number;  // 0-100
  status: 'pending' | 'scanning' | 'complete' | 'error';
  tokensFound: number;
}

export function ScanningProgress({ scanId, onComplete }: ScanningProgressProps) {
  const [chains, setChains] = useState<ChainProgress[]>([
    { chainId: 56, name: 'BSC', progress: 0, status: 'pending', tokensFound: 0 },
    { chainId: 42161, name: 'Arbitrum', progress: 0, status: 'pending', tokensFound: 0 },
    { chainId: 8453, name: 'Base', progress: 0, status: 'pending', tokensFound: 0 },
    { chainId: 137, name: 'Polygon', progress: 0, status: 'pending', tokensFound: 0 },
    { chainId: 838592, name: 'Monad', progress: 0, status: 'pending', tokensFound: 0 },
    { chainId: 43114, name: 'Avalanche', progress: 0, status: 'pending', tokensFound: 0 },
    { chainId: 10, name: 'Optimism', progress: 0, status: 'pending', tokensFound: 0 },
    { chainId: 1, name: 'Ethereum', progress: 0, status: 'pending', tokensFound: 0 },
    { chainId: 'solana', name: 'Solana', progress: 0, status: 'pending', tokensFound: 0 },
  ]);
  
  const [totalTokens, setTotalTokens] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    // WebSocket connection to backend
    const wsUrl = import.meta.env.VITE_API_URL?.replace('http', 'ws') || 'ws://localhost:8787';
    const ws = new WebSocket(`${wsUrl}/scan/${scanId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      if (update.type === 'chain_progress') {
        setChains(prev => prev.map(chain =>
          chain.chainId === update.chainId
            ? { ...chain, progress: update.progress, status: update.status, tokensFound: update.tokensFound }
            : chain
        ));
        
        if (update.tokensFound) {
          setTotalTokens(prev => prev + update.tokensFound);
        }
      }
      
      if (update.type === 'scan_complete') {
        onComplete(update.result);
      }
    };
    
    // Timer
    const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    
    // Calculate overall progress
    const progressInterval = setInterval(() => {
      const completed = chains.filter(c => c.status === 'complete').length;
      const total = chains.length;
      setOverallProgress((completed / total) * 100);
    }, 500);
    
    return () => {
      ws.close();
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, [scanId, chains.length]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-spin">🌀</div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Scanning Your Portfolio</h2>
          <p className="text-neutral-600">Analyzing 9 chains in parallel...</p>
        </div>
        
        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        {/* Chain Progress Bars */}
        <div className="space-y-3 mb-8">
          {chains.map((chain) => (
            <ChainProgressBar key={chain.chainId} chain={chain} />
          ))}
        </div>
        
        {/* Stats Footer */}
        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
          <span>Found {totalTokens} tokens</span>
          <span>~{Math.max(0, 15 - timeElapsed)}s remaining</span>
        </div>
      </motion.div>
    </div>
  );
}

function ChainProgressBar({ chain }: { chain: ChainProgress }) {
  const statusColors = {
    pending: 'bg-gray-200',
    scanning: 'bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse',
    complete: 'bg-green-500',
    error: 'bg-red-500'
  };
  
  return (
    <div className="flex items-center gap-3">
      {/* Chain Logo */}
      <div className="w-8 h-8 flex-shrink-0">
        <img 
          src={`/chains/${chain.name.toLowerCase()}.png`} 
          alt={chain.name} 
          className="w-full h-full rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/chains/default.png';
          }}
        />
      </div>
      
      {/* Chain Name */}
      <div className="w-24 flex-shrink-0">
        <span className="text-sm font-medium">{chain.name}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${statusColors[chain.status]}`}
          initial={{ width: 0 }}
          animate={{ width: `${chain.progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Status Icon */}
      <div className="w-6 flex-shrink-0">
        {chain.status === 'complete' && <CheckCircle2 size={16} className="text-green-500" />}
        {chain.status === 'error' && <XCircle size={16} className="text-red-500" />}
        {chain.status === 'scanning' && <Loader2 size={16} className="text-blue-500 animate-spin" />}
      </div>
      
      {/* Tokens Found */}
      {chain.tokensFound > 0 && (
        <div className="w-16 text-right text-sm text-gray-500">
          {chain.tokensFound} tokens
        </div>
      )}
    </div>
  );
}


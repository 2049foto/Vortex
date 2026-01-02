/**
 * Dashboard Page - S++ Complete Implementation
 * 9-Chain Scanner + Gamification + Batch Actions
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/layout';
import { Card, Button, Badge, Modal, ModalFooter, Alert } from '@/components/ui';
import {
  GamificationBar,
  ScanProgress,
  TokenTable,
  SummaryCards,
  AchievementToast,
} from '@/components/features';
import { useAuthStore } from '@/stores/auth';
import { scanner } from '@/lib/scanner/scanner';
import { gamification } from '@/lib/gamification/engine';
import { batchEngine } from '@/lib/batch/engine';
import { formatCurrency, formatAddress } from '@/lib/utils';
import type { ScanResult, ChainScanStatus, ScannedToken, TokenAction } from '@/lib/scanner/types';
import type { Achievement, UserGamification } from '@/lib/gamification/types';
import { CHAINS } from '@/lib/chains/config';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [chainStatuses, setChainStatuses] = useState<ChainScanStatus[]>([]);
  
  // Gamification state
  const [userGamification, setUserGamification] = useState<UserGamification | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  // Batch action state
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchAction, setBatchAction] = useState<TokenAction | null>(null);
  const [batchTokens, setBatchTokens] = useState<ScannedToken[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [batchResult, setBatchResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Hidden tokens
  const [showHidden, setShowHidden] = useState(false);

  // Load gamification on mount
  useEffect(() => {
    if (user?.walletAddress) {
      const userData = gamification.getUser(user.walletAddress);
      setUserGamification(userData);
      
      // Track daily login
      gamification.trackLogin(user.walletAddress);
    }
  }, [user?.walletAddress]);

  // Scan portfolio
  const handleScan = useCallback(async () => {
    if (!user?.walletAddress) return;
    
    setIsScanning(true);
    setChainStatuses(
      Object.keys(CHAINS).map(chain => ({
        chain,
        status: 'pending',
        tokensFound: 0,
        progress: 0,
      }))
    );

    try {
      const result = await scanner.scan(
        user.walletAddress,
        { useCache: false },
        (statuses) => setChainStatuses([...statuses])
      );
      
      setScanResult(result);
      
      // Award XP for scanning
      const xpResult = gamification.awardXP(user.walletAddress, 'SCAN');
      
      // Check achievements
      const achievements = gamification.checkAchievements(user.walletAddress, result);
      if (achievements.length > 0 && achievements[0]) {
        setNewAchievement(achievements[0]);
      }
      
      // Refresh gamification data
      setUserGamification(gamification.getUser(user.walletAddress));
      
      // Update leaderboard
      gamification.updateLeaderboard(user.walletAddress);
      
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  }, [user?.walletAddress]);

  // Handle batch action
  const handleBatchAction = useCallback((action: TokenAction, tokens: ScannedToken[]) => {
    setBatchAction(action);
    setBatchTokens(tokens);
    setBatchResult(null);
    setBatchModalOpen(true);
  }, []);

  // Execute batch action
  const executeBatchAction = useCallback(async () => {
    if (!batchAction || batchTokens.length === 0 || !user?.walletAddress) return;
    
    setIsExecuting(true);
    
    try {
      let result;
      
      switch (batchAction) {
        case 'SWAP':
          result = await batchEngine.batchSwap(batchTokens);
          if (result.success) {
            gamification.awardXP(user.walletAddress, 'SWAP_DUST', 50 * batchTokens.length);
          }
          break;
        case 'HIDE':
          result = await batchEngine.batchHide(batchTokens);
          if (result.success) {
            gamification.awardXP(user.walletAddress, 'HIDE_RISK', 25 * batchTokens.length);
          }
          break;
        case 'BURN':
          result = await batchEngine.batchBurn(batchTokens);
          if (result.success) {
            gamification.awardXP(user.walletAddress, 'BURN_MICRO', 30 * batchTokens.length);
          }
          break;
        default:
          return;
      }
      
      setBatchResult({
        success: result.success,
        message: result.success
          ? `Successfully processed ${result.tokensProcessed} tokens!`
          : result.error || 'Action failed',
      });
      
      // Refresh gamification
      setUserGamification(gamification.getUser(user.walletAddress));
      
      // Re-scan after successful action
      if (result.success) {
        setTimeout(() => {
          setBatchModalOpen(false);
          handleScan();
        }, 2000);
      }
      
    } catch (error) {
      setBatchResult({
        success: false,
        message: error instanceof Error ? error.message : 'Action failed',
      });
    } finally {
      setIsExecuting(false);
    }
  }, [batchAction, batchTokens, user?.walletAddress, handleScan]);

  // Quick actions
  const handleQuickAction = useCallback((action: 'swap-dust' | 'hide-risk' | 'burn-micro') => {
    if (!scanResult) return;
    
    switch (action) {
      case 'swap-dust':
        handleBatchAction('SWAP', scanResult.summary.dust.tokens);
        break;
      case 'hide-risk':
        handleBatchAction('HIDE', scanResult.summary.risk.tokens);
        break;
      case 'burn-micro':
        handleBatchAction('BURN', scanResult.summary.micro.tokens);
        break;
    }
  }, [scanResult, handleBatchAction]);

  // Filter visible tokens
  const visibleTokens = scanResult?.tokens.filter(t => 
    showHidden || !batchEngine.isHidden(t.chain, t.address)
  ) || [];

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Page>
        <Card variant="glass" padding="xl" className="max-w-md mx-auto text-center mt-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Connect Your Wallet</h2>
          <p className="text-neutral-500 mb-6">
            Connect your wallet to scan your portfolio across 9 chains.
          </p>
          <Button onClick={() => navigate('/auth')} fullWidth>
            Connect Wallet
          </Button>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      {/* Achievement Toast */}
      <AchievementToast
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      {/* Header with Gamification */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
          <p className="text-neutral-500">
            {formatAddress(user?.walletAddress || '')} • 9-Chain Scanner
          </p>
        </div>
        
        {userGamification && (
          <GamificationBar
            xp={userGamification.xp}
            level={userGamification.level}
            streak={userGamification.streak}
          />
        )}
      </div>

      {/* Scan Button / Progress */}
      {isScanning ? (
        <Card variant="glass" padding="lg" className="mb-8">
          <ScanProgress chains={chainStatuses} />
        </Card>
      ) : (
        <Card variant="gradient" padding="lg" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-1">
                {scanResult ? 'Rescan Portfolio' : 'Scan Your Portfolio'}
              </h2>
              <p className="text-neutral-600">
                {scanResult
                  ? `Last scan: ${new Date(scanResult.timestamp).toLocaleTimeString()}`
                  : 'Scan all 9 chains in parallel (~15s)'}
              </p>
            </div>
            <Button size="lg" onClick={handleScan}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              {scanResult ? 'Rescan' : 'Start Scan'}
            </Button>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <SummaryCards
        data={scanResult}
        onQuickAction={handleQuickAction}
        className="mb-8"
      />

      {/* Token Table */}
      {scanResult && (
        <TokenTable
          tokens={visibleTokens}
          onBatchAction={handleBatchAction}
          showHidden={showHidden}
          onToggleHidden={setShowHidden}
        />
      )}

      {/* Empty State */}
      {!scanResult && !isScanning && (
        <Card variant="outlined" padding="xl" className="text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">No Scan Data</h3>
          <p className="text-neutral-500 mb-6">
            Scan your portfolio to see all your tokens across 9 chains.
          </p>
          <Button onClick={handleScan}>
            Start Scanning
          </Button>
        </Card>
      )}

      {/* Batch Action Modal */}
      <Modal
        isOpen={batchModalOpen}
        onClose={() => !isExecuting && setBatchModalOpen(false)}
        title={`${batchAction === 'SWAP' ? '🔄 Batch Swap' : batchAction === 'HIDE' ? '👁️ Hide Tokens' : '🔥 Burn Tokens'}`}
        description={`${batchTokens.length} tokens selected`}
        preventClose={isExecuting}
      >
        {batchResult ? (
          <Alert
            variant={batchResult.success ? 'success' : 'danger'}
            title={batchResult.success ? 'Success!' : 'Failed'}
          >
            {batchResult.message}
          </Alert>
        ) : (
          <>
            {/* Preview */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <span className="text-neutral-600">Tokens to process</span>
                <span className="font-bold text-neutral-900">{batchTokens.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <span className="text-neutral-600">Total value</span>
                <span className="font-bold text-neutral-900">
                  {formatCurrency(batchTokens.reduce((s, t) => s + t.valueUSD, 0))}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <span className="text-emerald-700">Gas cost</span>
                <span className="font-bold text-emerald-700">$0.00 (Gasless!)</span>
              </div>
            </div>

            {/* Warning for burn */}
            {batchAction === 'BURN' && (
              <Alert variant="warning" className="mb-4">
                Burning tokens is irreversible. Make sure you want to permanently remove these tokens.
              </Alert>
            )}
          </>
        )}

        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setBatchModalOpen(false)}
            disabled={isExecuting}
          >
            Cancel
          </Button>
          {!batchResult && (
            <Button
              variant={batchAction === 'BURN' ? 'danger' : 'primary'}
              onClick={executeBatchAction}
              loading={isExecuting}
            >
              {isExecuting ? 'Processing...' : `Confirm ${batchAction}`}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </Page>
  );
}

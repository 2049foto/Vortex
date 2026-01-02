/**
 * Vortex Protocol - Main App Component
 * Premium routing and layout
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Loader } from '@/components/ui';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Portfolio = lazy(() => import('@/pages/Portfolio').then(m => ({ default: m.Portfolio })));
const TokenDetail = lazy(() => import('@/pages/TokenDetail').then(m => ({ default: m.TokenDetail })));
const Watchlist = lazy(() => import('@/pages/Watchlist').then(m => ({ default: m.Watchlist })));
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader text="Loading..." />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Home (no footer for cleaner landing) */}
          <Route
            path="/"
            element={
              <Layout showFooter={true}>
                <Home />
              </Layout>
            }
          />

          {/* App Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/scanner" element={<TokenDetail />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Auth Route (placeholder) */}
          <Route
            path="/auth"
            element={
              <Layout showFooter={false}>
                <Dashboard />
              </Layout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

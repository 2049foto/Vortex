/**
 * Vortex Protocol - Main App Component
 * Premium routing and layout
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Loader } from '@/components/ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WalletProvider } from '@/providers/WalletProvider';

{/* Lazy load pages for code splitting */}
const Home = lazy(() => import('@/pages/Home'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const TokenDetail = lazy(() => import('@/pages/TokenDetail'));
const Settings = lazy(() => import('@/pages/Settings'));

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
    <div className="dark">
      <ErrorBoundary>
        <WalletProvider>
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

              {/* App Routes with Layout - POST-CONNECT ONLY */}
              <Route element={<Layout />}>
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/scanner" element={<TokenDetail />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Auth Route (placeholder) */}
              <Route
                path="/auth"
                element={
                  <Layout showFooter={false}>
                    <Portfolio />
                  </Layout>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </WalletProvider>
    </ErrorBoundary>
    </div>
  );
}

export default App;

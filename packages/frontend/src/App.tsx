/**
 * Main App component with routing for Vortex Protocol
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, PageLayout } from '@/components/layout';
import { Skeleton } from '@/components/ui/Skeleton';
import { initializeDarkMode } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const TokenDetail = lazy(() => import('@/pages/TokenDetail'));
const Watchlist = lazy(() => import('@/pages/Watchlist'));
const Settings = lazy(() => import('@/pages/Settings'));

/**
 * Loading fallback component
 */
function PageLoader(): React.ReactElement {
  return (
    <div className="p-8 space-y-6">
      <Skeleton height={60} className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
      </div>
      <Skeleton height={400} />
    </div>
  );
}

/**
 * Protected Route wrapper
 */
function ProtectedRoute({ children }: { children: React.ReactNode }): React.ReactElement {
  const { isAuthenticated } = useAuthStore();

  // For now, allow access even without authentication
  // In production, redirect to login
  // if (!isAuthenticated) {
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
}

/**
 * App component
 */
function App(): React.ReactElement {
  // Initialize dark mode on app load
  useEffect(() => {
    initializeDarkMode();
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageLayout>
              <Home />
            </PageLayout>
          }
        />

        {/* Dashboard Routes (with sidebar) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <Portfolio />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tokens/:address"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <TokenDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <Watchlist />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;


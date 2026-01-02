/**
 * Main App component with routing for Vortex Protocol
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
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
    <div className="min-h-screen bg-neutral-50 p-8 space-y-6">
      <Skeleton height="3rem" className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton height="8rem" />
        <Skeleton height="8rem" />
        <Skeleton height="8rem" />
      </div>
      <Skeleton height="24rem" />
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
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/token/:address"
          element={
            <ProtectedRoute>
              <TokenDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
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


/**
 * Layout component for Vortex Protocol
 */

import React from 'react';
import { clsx } from 'clsx';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useUIStore } from '@/stores/ui';

export interface LayoutProps {
  children: React.ReactNode;
  /** Show sidebar */
  showSidebar?: boolean;
  /** Show footer */
  showFooter?: boolean;
  /** Full width content (no max-width) */
  fullWidth?: boolean;
  /** Custom class for main content */
  className?: string;
}

/**
 * Main layout component with header, sidebar, and footer
 */
export function Layout({
  children,
  showSidebar = true,
  showFooter = false,
  fullWidth = false,
  className,
}: LayoutProps): React.ReactElement {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content */}
        <main
          className={clsx(
            'flex-1 min-w-0',
            'transition-all duration-300',
            className
          )}
        >
          <div
            className={clsx(
              'py-6 px-4 sm:px-6 lg:px-8',
              !fullWidth && 'max-w-7xl mx-auto'
            )}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}

/**
 * Page layout without sidebar (for landing pages)
 */
export function PageLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      <Header />
      <main className={clsx('flex-1', className)}>{children}</main>
      <Footer />
    </div>
  );
}

/**
 * Auth layout for login/register pages
 */
export function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

/**
 * Dashboard layout with sidebar
 */
export function DashboardLayout({
  children,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}): React.ReactElement {
  return (
    <Layout showSidebar showFooter={false}>
      {/* Page Header */}
      {(title || actions) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-text-secondary">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}

      {/* Page Content */}
      {children}
    </Layout>
  );
}

export default Layout;


/**
 * Premium Layout Component
 * Main app layout wrapper
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastProvider } from '@/components/ui';

interface LayoutProps {
  children?: React.ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-sky-50/30 flex flex-col">
        <Header />
        <main className="flex-1">
          {children || <Outlet />}
        </main>
        {showFooter && <Footer />}
      </div>
    </ToastProvider>
  );
}

// Page wrapper with max-width
interface PageProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function Page({ children, title, description, className }: PageProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className || ''}`}>
      {(title || description) && (
        <div className="mb-8">
          {title && <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>}
          {description && <p className="text-neutral-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// Auth Layout (no header/footer)
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-sky-50/30 flex items-center justify-center p-4">
      {children}
    </div>
  );
}


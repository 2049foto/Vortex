/**
 * Header component for Vortex Protocol
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Menu,
  X,
  Sun,
  Moon,
  Wallet,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/format';

/**
 * Header component
 */
export function Header(): React.ReactElement {
  const location = useLocation();
  const { darkMode, toggleDarkMode, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { address, isConnected, connect, disconnect, isConnecting } = useWallet();
  
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/watchlist', label: 'Watchlist' },
  ];

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDisconnect = () => {
    disconnect();
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background-dark/80 backdrop-blur-xl">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-text-primary"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
              <span className="text-white text-sm font-black">V</span>
            </div>
            <span className="hidden sm:inline">Vortex</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-background-elevated text-text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-hover'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                'text-text-secondary hover:text-text-primary',
                'hover:bg-background-hover'
              )}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <button
                className={clsx(
                  'p-2 rounded-lg transition-colors relative',
                  'text-text-secondary hover:text-text-primary',
                  'hover:bg-background-hover'
                )}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
              </button>
            )}

            {/* Wallet Button */}
            {isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-xl',
                    'bg-background-elevated border border-border',
                    'text-sm font-medium text-text-primary',
                    'hover:border-border-light transition-colors'
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-500" />
                  <span className="hidden sm:inline">{truncateAddress(address)}</span>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className={clsx(
                      'absolute right-0 top-full mt-2 w-56 z-20',
                      'bg-background-card border border-border rounded-xl',
                      'shadow-xl shadow-black/20 py-2',
                      'animate-fade-in'
                    )}>
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-text-primary">
                          {user?.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-text-muted font-mono">
                          {truncateAddress(address)}
                        </p>
                      </div>
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleDisconnect}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger-light hover:bg-background-hover transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                isLoading={isConnecting}
                leftIcon={<Wallet className="w-4 h-4" />}
                size="sm"
              >
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={clsx(
                'md:hidden p-2 rounded-lg transition-colors',
                'text-text-secondary hover:text-text-primary',
                'hover:bg-background-hover'
              )}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-background-elevated text-text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-hover'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;


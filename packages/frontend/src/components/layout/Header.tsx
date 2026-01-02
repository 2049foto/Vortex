/**
 * Header Component - Base-inspired navigation
 */

import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { address, connect, disconnect } = useWallet();
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/watchlist', label: 'Watchlist' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Vortex</span>
          </Link>
          
          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && address ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg">
                  <Avatar address={address} size="sm" />
                  <span className="text-sm font-medium text-neutral-700 hidden sm:inline">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button variant="primary" onClick={connect}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


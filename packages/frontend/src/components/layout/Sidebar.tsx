/**
 * Sidebar component for Vortex Protocol
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Wallet,
  Search,
  Star,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/portfolio', label: 'Portfolio', icon: <Wallet className="w-5 h-5" /> },
  { path: '/watchlist', label: 'Watchlist', icon: <Star className="w-5 h-5" /> },
  { path: '/alerts', label: 'Alerts', icon: <Bell className="w-5 h-5" />, badge: 3 },
];

const secondaryNavItems: NavItem[] = [
  { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  { path: '/docs', label: 'Documentation', icon: <FileText className="w-5 h-5" /> },
  { path: '/help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> },
];

/**
 * Sidebar component
 */
export function Sidebar(): React.ReactElement {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col',
        'h-[calc(100vh-4rem)] sticky top-16',
        'bg-background-card border-r border-border',
        'transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="mb-6">
          {!sidebarCollapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              Main Menu
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              collapsed={sidebarCollapsed}
            />
          ))}
        </div>

        {/* Quick Scan */}
        <div className="py-4 border-t border-border">
          <Link
            to="/dashboard"
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl',
              'bg-gradient-to-r from-primary-500/20 to-accent-500/20',
              'border border-primary-500/30',
              'text-primary-400 hover:text-primary-300',
              'transition-all duration-200',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <Search className="w-5 h-5" />
            {!sidebarCollapsed && (
              <span className="font-medium">Quick Scan</span>
            )}
          </Link>
        </div>

        {/* Secondary Navigation */}
        <div className="pt-4 border-t border-border">
          {!sidebarCollapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              Settings
            </p>
          )}
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              collapsed={sidebarCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border">
        <button
          onClick={toggleSidebar}
          className={clsx(
            'flex items-center gap-2 w-full px-3 py-2 rounded-lg',
            'text-text-muted hover:text-text-primary',
            'hover:bg-background-hover transition-colors',
            sidebarCollapsed && 'justify-center'
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

/**
 * Navigation link component
 */
interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}

function NavLink({ item, isActive, collapsed }: NavLinkProps): React.ReactElement {
  return (
    <Link
      to={item.path}
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'transition-all duration-200',
        isActive
          ? 'bg-background-elevated text-text-primary shadow-sm'
          : 'text-text-secondary hover:text-text-primary hover:bg-background-hover',
        collapsed && 'justify-center'
      )}
      title={collapsed ? item.label : undefined}
    >
      <span className={clsx(isActive && 'text-primary-400')}>{item.icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 font-medium">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full">
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 text-2xs font-bold bg-primary-500 text-white rounded-full flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default Sidebar;


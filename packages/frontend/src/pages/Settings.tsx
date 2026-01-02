/**
 * Settings page for Vortex Protocol
 */

import React, { useState } from 'react';
import { clsx } from 'clsx';
import {
  User,
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  Trash2,
  LogOut,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { truncateAddress, copyToClipboard } from '@/lib/format';
import toast from 'react-hot-toast';

/**
 * Settings section component
 */
interface SettingsSectionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingsSection({
  title,
  description,
  icon,
  children,
}: SettingsSectionProps): React.ReactElement {
  return (
    <Card variant="default" padding="lg">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </Card>
  );
}

/**
 * Toggle setting component
 */
interface ToggleSettingProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSetting({
  label,
  description,
  enabled,
  onChange,
}: ToggleSettingProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-text-primary">{label}</p>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={clsx(
          'relative w-12 h-6 rounded-full transition-colors',
          enabled ? 'bg-primary-500' : 'bg-background-elevated'
        )}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={clsx(
            'absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform',
            enabled && 'translate-x-6'
          )}
        />
      </button>
    </div>
  );
}

/**
 * Settings page component
 */
export default function Settings(): React.ReactElement {
  const { darkMode, toggleDarkMode } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleCopyAddress = async () => {
    if (!user?.walletAddress) return;
    const success = await copyToClipboard(user.walletAddress);
    if (success) {
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account preferences and settings.
        </p>
      </div>

      {/* Account Section */}
      <SettingsSection
        title="Account"
        description="Your wallet and account information."
        icon={<User className="w-5 h-5" />}
      >
        {isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background-elevated rounded-xl">
              <div>
                <p className="text-sm text-text-muted">Connected Wallet</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-text-primary font-mono">
                    {truncateAddress(user.walletAddress, 10, 8)}
                  </code>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 hover:bg-background-hover rounded transition-colors"
                    aria-label="Copy address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-success-light" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-muted" />
                    )}
                  </button>
                </div>
              </div>
              <a
                href={`https://basescan.org/address/${user.walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-background-hover rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-text-muted" />
              </a>
            </div>

            <div className="flex items-center justify-between p-4 bg-background-elevated rounded-xl">
              <div>
                <p className="text-sm text-text-muted">Member Since</p>
                <p className="text-text-primary">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-4 h-4" />}
              className="text-danger-light border-danger-light/30 hover:bg-danger-light/10"
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-secondary mb-4">
              Connect your wallet to access account settings.
            </p>
            <Button>Connect Wallet</Button>
          </div>
        )}
      </SettingsSection>

      {/* Appearance Section */}
      <SettingsSection
        title="Appearance"
        description="Customize how Vortex looks."
        icon={darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      >
        <div className="space-y-1 divide-y divide-border">
          <ToggleSetting
            label="Dark Mode"
            description="Use dark theme across the app."
            enabled={darkMode}
            onChange={toggleDarkMode}
          />
        </div>
      </SettingsSection>

      {/* Notifications Section */}
      <SettingsSection
        title="Notifications"
        description="Manage your notification preferences."
        icon={<Bell className="w-5 h-5" />}
      >
        <div className="space-y-1 divide-y divide-border">
          <ToggleSetting
            label="Push Notifications"
            description="Receive browser push notifications for alerts."
            enabled={notifications}
            onChange={setNotifications}
          />
          <ToggleSetting
            label="Email Alerts"
            description="Get email notifications for important alerts."
            enabled={emailAlerts}
            onChange={setEmailAlerts}
          />
        </div>
      </SettingsSection>

      {/* Language Section */}
      <SettingsSection
        title="Language & Region"
        description="Set your preferred language."
        icon={<Globe className="w-5 h-5" />}
      >
        <Select
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
            { value: 'zh', label: '中文' },
            { value: 'ja', label: '日本語' },
          ]}
          fullWidth
        />
      </SettingsSection>

      {/* Security Section */}
      <SettingsSection
        title="Security"
        description="Security and privacy settings."
        icon={<Shield className="w-5 h-5" />}
      >
        <div className="p-4 bg-background-elevated rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-5 h-5 text-success-light" />
            <span className="font-medium text-text-primary">Non-Custodial</span>
          </div>
          <p className="text-sm text-text-secondary">
            Vortex Protocol never has access to your private keys or seed phrases.
            You maintain full control of your assets at all times.
          </p>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions."
        icon={<Trash2 className="w-5 h-5" />}
      >
        <div className="p-4 bg-danger-light/10 border border-danger-light/20 rounded-xl">
          <h4 className="font-medium text-text-primary mb-2">
            Delete All Data
          </h4>
          <p className="text-sm text-text-secondary mb-4">
            This will permanently delete your watchlist, alerts, and preferences.
            This action cannot be undone.
          </p>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete All Data
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}


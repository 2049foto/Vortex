/**
 * Settings Page - User settings and preferences
 */

import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
            <p className="text-neutral-600">Manage your preferences</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Notifications */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Email Notifications</p>
                    <p className="text-sm text-neutral-600">Receive alerts via email</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onChange={setNotifications}
                  />
                </div>
              </div>
            </Card>
            
            {/* Privacy */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Privacy</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Analytics</p>
                    <p className="text-sm text-neutral-600">Help improve Vortex by sharing usage data</p>
                  </div>
                  <Switch
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                </div>
              </div>
            </Card>
            
            {/* Account */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Account</h2>
              <div className="space-y-4">
                <Button variant="danger" onClick={handleLogout}>
                  Disconnect Wallet
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}


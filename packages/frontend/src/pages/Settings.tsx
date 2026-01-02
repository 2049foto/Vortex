/**
 * Settings Page - Premium User Preferences
 * Profile + Notifications + Security
 */

import React, { useState } from 'react';
import { Page } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Switch, Select, Badge, Avatar, Tabs, TabList, TabTrigger, TabContent, Alert, Divider } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import { formatAddress } from '@/lib/utils';

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    riskAlerts: true,
    newsletter: false,
    marketing: false,
  });
  const [riskThreshold, setRiskThreshold] = useState('50');

  if (!isAuthenticated) {
    return (
      <Page title="Settings">
        <Alert variant="warning">
          Please connect your wallet to access settings.
        </Alert>
      </Page>
    );
  }

  return (
    <Page>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Settings</h1>

        <Tabs defaultTab="account">
          <TabList className="mb-6">
            <TabTrigger value="account">Account</TabTrigger>
            <TabTrigger value="notifications">Notifications</TabTrigger>
            <TabTrigger value="security">Security</TabTrigger>
          </TabList>

          <TabContent value="account">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar address={user?.walletAddress || ''} size="xl" />
                  <div>
                    <p className="font-bold text-neutral-900">Connected Wallet</p>
                    <p className="text-neutral-500 font-mono">{user?.walletAddress}</p>
                  </div>
                </div>

                <Divider className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">Account Status</p>
                      <p className="text-sm text-neutral-500">Your account is active and verified</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">Member Since</p>
                      <p className="text-sm text-neutral-500">January 2, 2026</p>
                    </div>
                    <Badge variant="primary">Early Adopter</Badge>
                  </div>
                </div>

                <Divider className="my-6" />

                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                  <div>
                    <p className="font-semibold text-red-700">Disconnect Wallet</p>
                    <p className="text-sm text-red-600">This will log you out of your account</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={logout}>
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabContent>

          <TabContent value="notifications">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Switch
                    checked={notifications.priceAlerts}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, priceAlerts: checked }))}
                    label="Price Alerts"
                    description="Get notified when tracked tokens have significant price movements"
                  />

                  <Switch
                    checked={notifications.riskAlerts}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, riskAlerts: checked }))}
                    label="Risk Score Alerts"
                    description="Get notified when a token's risk score changes significantly"
                  />

                  <Divider />

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Risk Alert Threshold
                    </label>
                    <Select
                      options={[
                        { value: '30', label: 'Low (30+)' },
                        { value: '50', label: 'Medium (50+)' },
                        { value: '70', label: 'High (70+)' },
                      ]}
                      value={riskThreshold}
                      onChange={setRiskThreshold}
                    />
                    <p className="text-sm text-neutral-500 mt-2">
                      You'll be alerted when a token's risk score exceeds this threshold
                    </p>
                  </div>

                  <Divider />

                  <Switch
                    checked={notifications.newsletter}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, newsletter: checked }))}
                    label="Newsletter"
                    description="Receive weekly updates about DeFi security and market trends"
                  />

                  <Switch
                    checked={notifications.marketing}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                    label="Product Updates"
                    description="Get notified about new features and improvements"
                  />
                </div>

                <div className="mt-8">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabContent>

          <TabContent value="security">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert variant="success" className="mb-6">
                  Your wallet connection uses secure Web3 authentication. No password is stored.
                </Alert>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Secure Connection</p>
                        <p className="text-sm text-neutral-500">HTTPS encryption enabled</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Wallet Verification</p>
                        <p className="text-sm text-neutral-500">Signature-based authentication</p>
                      </div>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Session Timeout</p>
                        <p className="text-sm text-neutral-500">Auto-logout after 24 hours</p>
                      </div>
                    </div>
                    <Badge variant="default">7 days</Badge>
                  </div>
                </div>

                <Divider className="my-6" />

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">Active Sessions</h4>
                  <div className="p-4 rounded-xl border border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">Current Session</p>
                          <p className="text-sm text-neutral-500">Windows • Chrome</p>
                        </div>
                      </div>
                      <Badge variant="success" dot>Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabContent>
        </Tabs>
      </div>
    </Page>
  );
}


/**
 * Home Page - Premium Landing
 * Hero + Features + Stats + CTA
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Badge } from '@/components/ui';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    ),
    title: 'Real-time Security',
    description: 'AI-powered token analysis detects rugs, honeypots, and scams before you invest.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
    title: 'Portfolio Analytics',
    description: 'Track your holdings with real-time P&L, risk indicators, and performance insights.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
      </svg>
    ),
    title: 'Smart Alerts',
    description: 'Get instant notifications for price movements, risk changes, and suspicious activity.',
  },
];

const stats = [
  { label: 'Tokens Scanned', value: '2.4M+' },
  { label: 'Users Protected', value: '150K+' },
  { label: 'Scams Detected', value: '45K+' },
  { label: 'Networks Supported', value: '9' },
];

export function Home() {
  const navigate = useNavigate();
  const [tokenAddress, setTokenAddress] = useState('');

  const handleQuickScan = () => {
    if (tokenAddress) {
      navigate(`/scanner?address=${tokenAddress}`);
    }
  };

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-sky-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge variant="primary" size="md" className="mb-6">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse mr-1" />
              Built for Base Network
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="text-neutral-900">Trade Safely</span>
              <br />
              <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 bg-clip-text text-transparent">
                On Base
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time DeFi security scanner powered by AI. Protect your portfolio from rugs, honeypots, and scams instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" onClick={() => navigate('/dashboard')} className="px-8">
                Get Started
                <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </div>

            {/* Quick Scanner */}
            <Card variant="glass" padding="lg" className="max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Security Scan</h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Paste token address (0x...)"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  leftIcon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  }
                  fullWidth
                />
                <Button onClick={handleQuickScan}>Scan</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-extrabold text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="default" size="md" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Everything for safe trading
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Comprehensive protection powered by AI & real-time blockchain analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card
                key={i}
                variant="elevated"
                padding="lg"
                hover
                className="group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-sky-500/30">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to protect your portfolio?
          </h2>
          <p className="text-xl text-sky-100 mb-8">
            Join 150,000+ traders who trust Vortex for secure DeFi trading.
          </p>
          <Button
            size="lg"
            className="px-10 bg-white text-sky-600 hover:bg-neutral-100"
            onClick={() => navigate('/auth')}
          >
            Start Free Today
          </Button>
        </div>
      </section>
    </main>
  );
}


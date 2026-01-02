/**
 * Home/Landing page for Vortex Protocol
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Shield,
  Wallet,
  BarChart3,
  Zap,
  Lock,
  Globe,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Token Security Scanner',
    description:
      'Analyze any token for honeypots, rug pulls, and other security risks with real-time data from GoPlus.',
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: 'Portfolio Tracking',
    description:
      'Track your holdings across multiple chains with real-time prices and 24h performance metrics.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Advanced Analytics',
    description:
      'Deep insights into token performance, holder distribution, and market trends.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Alerts',
    description:
      'Set price, risk, and volume alerts to stay ahead of market movements.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Non-Custodial',
    description:
      'Your keys, your crypto. We never ask for private keys or seed phrases.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Multi-Chain Support',
    description:
      'Support for Base, Ethereum, Arbitrum, Optimism, Polygon, and more chains.',
  },
];

const stats = [
  { value: '50K+', label: 'Tokens Scanned' },
  { value: '10K+', label: 'Active Users' },
  { value: '9', label: 'Chains Supported' },
  { value: '99.9%', label: 'Uptime' },
];

/**
 * Home page component
 */
export default function Home(): React.ReactElement {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-sm text-primary-400 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              Built on Base • Powered by GoPlus
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight animate-fade-up">
              Protect Your Crypto with{' '}
              <span className="gradient-text">Advanced Security</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-up stagger-1">
              Scan tokens for security risks, track your portfolio, and stay
              ahead of the market with real-time analytics and alerts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-2">
              <Link to="/dashboard">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Launch App
                </Button>
              </Link>
              <a
                href="https://docs.vortex.protocol"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline">
                  Read Docs
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-background-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={clsx('text-center animate-fade-up', `stagger-${index + 1}`)}
              >
                <div className="text-3xl sm:text-4xl font-bold text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything You Need for Safe DeFi
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Comprehensive tools to analyze, track, and protect your crypto
              investments across multiple chains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={clsx(
                  'p-6 bg-background-card rounded-2xl border border-border',
                  'hover:border-border-light hover:shadow-lg hover:shadow-black/10',
                  'transition-all duration-300 group',
                  'animate-fade-up',
                  `stagger-${(index % 6) + 1}`
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background-dark to-background-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
              Ready to Secure Your Portfolio?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Join thousands of traders using Vortex Protocol to protect their
              investments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/dashboard">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success-light" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success-light" />
                Non-custodial
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success-light" />
                100% free to use
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


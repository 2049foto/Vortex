/**
 * Home Page - Landing page with hero section
 */

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleConnect = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      // Trigger wallet connection
      navigate('/dashboard');
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Powered by Base Network
            </div>
            
            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
              Trade Safely.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Stay Informed.
              </span>
            </h1>
            
            <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Real-time token security analysis powered by AI. Protect your portfolio from scams, rugs, and honeypots.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="primary"
                onClick={handleConnect}
                className="text-lg px-8"
              >
                Connect Wallet
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
              
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                View Demo
              </Button>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-20 max-w-6xl mx-auto">
            <Card variant="glass" padding="none" className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 relative">
                {/* Floating cards animation */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} padding="md" hover className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className="h-24 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-lg"></div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Everything you need to trade safely
            </h2>
            <p className="text-lg text-neutral-600">
              Comprehensive security analysis in milliseconds
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🛡️',
                title: 'Real-time Protection',
                desc: 'Instant security checks using GoPlus API and AI analysis',
              },
              {
                icon: '📊',
                title: 'Portfolio Tracking',
                desc: 'Monitor your investments with live P&L calculations',
              },
              {
                icon: '🔔',
                title: 'Smart Alerts',
                desc: 'Get notified when tokens in your watchlist show suspicious activity',
              },
            ].map((feature, i) => (
              <Card key={i} padding="lg" hover className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="bg-neutral-900 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
              {[
                { value: '$2.4M+', label: 'Protected' },
                { value: '12K+', label: 'Scans Daily' },
                { value: '99.8%', label: 'Accuracy' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-neutral-400 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}


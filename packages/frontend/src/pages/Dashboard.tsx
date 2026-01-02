/**
 * Dashboard Page - Main app dashboard
 */

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Layout } from '@/components/layout';
import { TokenScanner } from '@/components/features/TokenScanner';
import { PortfolioSummary } from '@/components/features/PortfolioSummary';
import { RecentScans } from '@/components/features/RecentScans';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Welcome back
                </h1>
                <p className="text-neutral-600">
                  {user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'Loading...'}
                </p>
              </div>
              
              <Button variant="primary" onClick={() => navigate('/portfolio')}>
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Token Scanner */}
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Quick Scan
                </h2>
                <TokenScanner />
              </Card>
              
              {/* Recent Scans */}
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Recent Scans
                </h2>
                <RecentScans />
              </Card>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Portfolio Summary */}
              <PortfolioSummary data={portfolio} loading={isLoading} />
              
              {/* Quick Stats */}
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Your Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Total Scans</span>
                    <Badge>24</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Watchlist</span>
                    <Badge variant="info">8 tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Alerts</span>
                    <Badge variant="warning">3 active</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


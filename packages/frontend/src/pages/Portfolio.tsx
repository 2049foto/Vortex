/**
 * Portfolio Page - Portfolio view with holdings
 */

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Layout } from '@/components/layout';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { formatNumber, formatPercent } from '@/lib/format';

export default function Portfolio() {
  const { isAuthenticated } = useAuth();
  const { portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <Card padding="lg">
            <Skeleton height="2rem" className="mb-4" />
            <Skeleton height="1rem" className="mb-2" />
            <Skeleton height="1rem" width="60%" />
          </Card>
        </div>
      </Layout>
    );
  }
  
  if (!portfolio) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <Card padding="lg">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Portfolio</h1>
            <p className="text-neutral-600">No portfolio data available</p>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const isPositive = portfolio.change24hPercent >= 0;
  
  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Portfolio</h1>
            <p className="text-neutral-600">Track your token holdings</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card padding="lg">
              <p className="text-sm text-neutral-600 mb-2">Total Value</p>
              <p className="text-3xl font-bold text-neutral-900">
                ${formatNumber(portfolio.totalValueUSD)}
              </p>
            </Card>
            
            <Card padding="lg">
              <p className="text-sm text-neutral-600 mb-2">24h Change</p>
              <div className="flex items-center gap-2">
                <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{formatPercent(portfolio.change24hPercent)}
                </p>
                <Badge variant={isPositive ? 'success' : 'danger'}>
                  {isPositive ? '+' : ''}${formatNumber(Math.abs(portfolio.change24hUSD))}
                </Badge>
              </div>
            </Card>
            
            <Card padding="lg">
              <p className="text-sm text-neutral-600 mb-2">Holdings</p>
              <p className="text-3xl font-bold text-neutral-900">
                {portfolio.tokens?.length || 0}
              </p>
            </Card>
          </div>
          
          {/* Holdings Table */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Holdings</h2>
            
            {portfolio.tokens && portfolio.tokens.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Token</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Balance</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Price</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Value</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">24h</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.tokens.map((token, i) => (
                      <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-neutral-900">{token.symbol}</p>
                            <p className="text-sm text-neutral-600">{token.name}</p>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <p className="font-medium text-neutral-900">{token.balanceFormatted.toFixed(4)}</p>
                        </td>
                        <td className="text-right py-4 px-4">
                          <p className="text-neutral-900">${formatNumber(token.priceUSD)}</p>
                        </td>
                        <td className="text-right py-4 px-4">
                          <p className="font-medium text-neutral-900">${formatNumber(token.valueUSD)}</p>
                        </td>
                        <td className="text-right py-4 px-4">
                          <Badge variant={token.change24hPercent >= 0 ? 'success' : 'danger'}>
                            {token.change24hPercent >= 0 ? '+' : ''}{formatPercent(token.change24hPercent)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600">No holdings found</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}


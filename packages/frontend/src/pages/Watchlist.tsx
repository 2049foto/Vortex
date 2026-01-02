/**
 * Watchlist Page - Saved tokens management
 */

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { watchlistApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Watchlist() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    const fetchWatchlist = async () => {
      try {
        const response = await watchlistApi.getAll();
        if (response.success && response.data) {
          setWatchlist(response.data);
        }
      } catch (error) {
        toast.error('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatchlist();
  }, [isAuthenticated, navigate]);
  
  const handleRemove = async (id: string) => {
    try {
      await watchlistApi.remove(id);
      setWatchlist(watchlist.filter((item) => item.id !== id));
      toast.success('Removed from watchlist');
    } catch (error) {
      toast.error('Failed to remove token');
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Watchlist</h1>
                <p className="text-neutral-600">Manage your saved tokens</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Add Token
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} padding="lg">
                  <Skeleton height="1.5rem" className="mb-4" />
                  <Skeleton height="1rem" />
                </Card>
              ))}
            </div>
          ) : watchlist.length === 0 ? (
            <Card padding="lg" className="text-center py-12">
              <p className="text-neutral-600 mb-4">Your watchlist is empty</p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Start Adding Tokens
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map((item) => (
                <Card key={item.id} padding="lg" hover>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {item.symbol || 'Unknown'}
                      </h3>
                      <p className="text-sm text-neutral-600">{item.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="info">{item.chain}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/token/${item.tokenAddress}?chain=${item.chain}`)}
                    >
                      View Details →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}


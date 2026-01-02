/**
 * Watchlist page for Vortex Protocol
 */

import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, SearchInput, AddressInput } from '@/components/ui/Input';
import { ChainSelect } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { WatchlistCard, WatchlistEmpty } from '@/components/features/WatchlistCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { watchlistApi } from '@/lib/api';
import { isValidEvmAddress } from '@/lib/validators';
import type { WatchlistItem, Chain } from '@/types';
import toast from 'react-hot-toast';

/**
 * Watchlist page component
 */
export default function Watchlist(): React.ReactElement {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Add form state
  const [addAddress, setAddAddress] = useState('');
  const [addChain, setAddChain] = useState<Chain>('base');
  const [addSymbol, setAddSymbol] = useState('');
  const [addName, setAddName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchWatchlist = async () => {
    setIsLoading(true);
    try {
      const response = await watchlistApi.getAll();
      if (response.success && response.data) {
        setItems(response.data);
      }
    } catch (error) {
      toast.error('Failed to load watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await watchlistApi.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Token removed from watchlist');
    } catch {
      toast.error('Failed to remove token');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!addAddress.trim()) {
      setAddError('Please enter a token address');
      return;
    }

    if (!isValidEvmAddress(addAddress)) {
      setAddError('Invalid address format');
      return;
    }

    setIsAdding(true);
    try {
      const response = await watchlistApi.add({
        tokenAddress: addAddress,
        chain: addChain,
        symbol: addSymbol || 'UNKNOWN',
        name: addName || 'Unknown Token',
      });

      if (response.success && response.data) {
        // Refresh the list
        await fetchWatchlist();
        toast.success('Token added to watchlist');
        setShowAddModal(false);
        resetAddForm();
      }
    } catch {
      setAddError('Failed to add token. It might already be in your watchlist.');
    } finally {
      setIsAdding(false);
    }
  };

  const resetAddForm = () => {
    setAddAddress('');
    setAddChain('base');
    setAddSymbol('');
    setAddName('');
    setAddError(null);
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.symbol.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.tokenAddress.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Watchlist</h1>
          <p className="text-sm text-text-secondary mt-1">
            Track your favorite tokens and get quick access to their security info.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchWatchlist}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Token
          </Button>
        </div>
      </div>

      {/* Search */}
      {items.length > 0 && (
        <SearchInput
          placeholder="Search by symbol, name, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && <WatchlistEmpty />}

      {/* No Results */}
      {!isLoading && items.length > 0 && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No tokens found
          </h3>
          <p className="text-sm text-text-secondary">
            Try a different search term.
          </p>
        </div>
      )}

      {/* Watchlist Grid */}
      {!isLoading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <WatchlistCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
              isRemoving={removingId === item.id}
            />
          ))}
        </div>
      )}

      {/* Add Token Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetAddForm();
        }}
        title="Add to Watchlist"
        description="Add a token to track its security status."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <AddressInput
            label="Token Address"
            placeholder="0x..."
            value={addAddress}
            onChange={(e) => setAddAddress(e.target.value)}
            error={addError || undefined}
            fullWidth
          />

          <ChainSelect
            label="Chain"
            value={addChain}
            onChange={(e) => setAddChain(e.target.value as Chain)}
            fullWidth
          />

          <Input
            label="Symbol (optional)"
            placeholder="e.g., PEPE"
            value={addSymbol}
            onChange={(e) => setAddSymbol(e.target.value)}
            fullWidth
          />

          <Input
            label="Name (optional)"
            placeholder="e.g., Pepe Token"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            fullWidth
          />

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                resetAddForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isAdding}>
              Add Token
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


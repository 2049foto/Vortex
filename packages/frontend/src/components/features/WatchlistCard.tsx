/**
 * Watchlist Card component for Vortex Protocol
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Star, Trash2, ExternalLink, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChainBadge } from '@/components/ui/Badge';
import { truncateAddress } from '@/lib/format';
import type { WatchlistItem } from '@/types';

export interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: (id: string) => void;
  isRemoving?: boolean;
}

/**
 * Watchlist Card component
 */
export function WatchlistCard({
  item,
  onRemove,
  isRemoving = false,
}: WatchlistCardProps): React.ReactElement {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <Card
      variant="default"
      padding="md"
      hoverable
      className="relative group"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Token Info */}
        <Link
          to={`/tokens/${item.tokenAddress}?chain=${item.chain}`}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {item.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-primary truncate">
                {item.symbol}
              </span>
              <ChainBadge chain={item.chain} size="sm" />
            </div>
            <span className="text-xs text-text-muted truncate block">
              {item.name}
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={clsx(
              'p-1.5 rounded-lg transition-colors',
              'text-text-muted hover:text-text-primary',
              'hover:bg-background-hover',
              'opacity-0 group-hover:opacity-100'
            )}
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-background-card border border-border rounded-lg shadow-xl py-1 min-w-[140px] animate-fade-in">
                <Link
                  to={`/tokens/${item.tokenAddress}?chain=${item.chain}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Details
                </Link>
                <button
                  onClick={() => {
                    onRemove(item.id);
                    setShowMenu(false);
                  }}
                  disabled={isRemoving}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger-light hover:bg-background-hover transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="mt-3 flex items-center gap-2">
        <code className="text-xs text-text-muted font-mono bg-background-elevated px-2 py-1 rounded">
          {truncateAddress(item.tokenAddress)}
        </code>
      </div>

      {/* Star indicator */}
      <div className="absolute top-3 left-3 opacity-10">
        <Star className="w-16 h-16 text-primary-400" fill="currentColor" />
      </div>
    </Card>
  );
}

/**
 * Empty watchlist state
 */
export function WatchlistEmpty(): React.ReactElement {
  return (
    <Card padding="lg" className="text-center">
      <Star className="w-12 h-12 text-text-muted mx-auto mb-4" />
      <h3 className="text-lg font-medium text-text-primary mb-2">
        Your watchlist is empty
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
        Start tracking tokens by adding them to your watchlist. You&apos;ll be able to
        quickly access their security information and market data.
      </p>
      <Link to="/dashboard">
        <Button leftIcon={<Star className="w-4 h-4" />}>
          Scan a Token
        </Button>
      </Link>
    </Card>
  );
}

/**
 * Add to watchlist button
 */
export interface AddToWatchlistButtonProps {
  tokenAddress: string;
  chain: string;
  symbol: string;
  name: string;
  isInWatchlist: boolean;
  onAdd: () => void;
  onRemove: () => void;
  isLoading?: boolean;
}

export function AddToWatchlistButton({
  isInWatchlist,
  onAdd,
  onRemove,
  isLoading = false,
}: AddToWatchlistButtonProps): React.ReactElement {
  return (
    <Button
      variant={isInWatchlist ? 'secondary' : 'outline'}
      size="sm"
      onClick={isInWatchlist ? onRemove : onAdd}
      isLoading={isLoading}
      leftIcon={
        <Star
          className={clsx('w-4 h-4', isInWatchlist && 'fill-primary-400 text-primary-400')}
        />
      }
    >
      {isInWatchlist ? 'Watching' : 'Watch'}
    </Button>
  );
}

export default WatchlistCard;


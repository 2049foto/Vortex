/**
 * Recent Scans Component
 */

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export function RecentScans() {
  // TODO: Fetch from API/store
  const scans: any[] = [];
  const loading = false;
  
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} padding="md">
            <Skeleton height="1rem" className="mb-2" />
            <Skeleton height="0.75rem" width="60%" />
          </Card>
        ))}
      </div>
    );
  }
  
  if (scans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600">No recent scans</p>
        <p className="text-sm text-neutral-500 mt-2">
          Scan tokens to see them here
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {scans.map((scan, i) => (
        <Card key={i} padding="md" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">{scan.token?.name}</p>
              <p className="text-sm text-neutral-600">{scan.token?.address.slice(0, 8)}...</p>
            </div>
            <Badge
              variant={
                scan.risk?.safe ? 'success' :
                scan.risk?.riskLevel === 'WARNING' ? 'warning' : 'danger'
              }
            >
              {scan.risk?.riskLevel || 'UNKNOWN'}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}


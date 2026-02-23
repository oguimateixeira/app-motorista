import type { RideRecord, DailySummary } from '../types';

export function getDateKey(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function ridesToDailySummaries(rides: RideRecord[]): DailySummary[] {
  const byDate = new Map<string, RideRecord[]>();
  for (const ride of rides) {
    const list = byDate.get(ride.dateKey) ?? [];
    list.push(ride);
    byDate.set(ride.dateKey, list);
  }

  return Array.from(byDate.entries())
    .map(([dateKey, dayRides]) => ({
      dateKey,
      totalRides: dayRides.length,
      totalDistanceKm: sum(dayRides, (r) => r.distanceKm),
      totalPayout: sum(dayRides, (r) => r.payout),
      totalCost: sum(dayRides, (r) => r.totalCost),
      netProfit: sum(dayRides, (r) => r.netProfit),
      totalMinutes: sum(
        dayRides,
        (r) => r.durationMinutes ?? 0
      ),
    }))
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

export function netProfitForDate(rides: RideRecord[], dateKey: string): number {
  return rides
    .filter((r) => r.dateKey === dateKey)
    .reduce((acc, r) => acc + r.netProfit, 0);
}

export function averageNetProfitPerRide(rides: RideRecord[]): number {
  if (rides.length === 0) return 0;
  const total = rides.reduce((acc, r) => acc + r.netProfit, 0);
  return total / rides.length;
}

function sum<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((acc, item) => acc + fn(item), 0);
}

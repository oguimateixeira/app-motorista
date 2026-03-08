import type { RideRecord, DailySummary } from '../types';
export declare function getDateKey(timestamp: number): string;
export declare function ridesToDailySummaries(rides: RideRecord[]): DailySummary[];
export declare function netProfitForDate(rides: RideRecord[], dateKey: string): number;
export declare function averageNetProfitPerRide(rides: RideRecord[]): number;

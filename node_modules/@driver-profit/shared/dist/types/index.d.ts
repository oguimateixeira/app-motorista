export type VehicleType = 'car' | 'motorcycle' | 'bicycle';
export type FuelType = 'gasoline' | 'ethanol' | 'diesel' | 'cng' | 'electric' | 'none';
export type RideType = 'delivery' | 'passenger';
export type WorthItVerdict = 'worth_it' | 'low_margin' | 'not_worth_it';
export interface VehicleProfile {
    id: string;
    name: string;
    vehicleType: VehicleType;
    fuelType: FuelType;
    fuelPricePerLiter: number;
    consumptionKmPerLiter: number;
    maintenanceCostPerKm: number;
    createdAt: number;
}
export interface RideInput {
    distanceKm: number;
    payout: number;
    rideType: RideType;
    durationMinutes?: number;
}
export interface RideCostBreakdown {
    fuelCost: number;
    maintenanceCost: number;
    totalCost: number;
    netProfit: number;
    profitPerKm: number;
    profitPerHour: number;
}
export interface RideRecord extends RideInput, RideCostBreakdown {
    id: string;
    vehicleId: string;
    timestamp: number;
    dateKey: string;
}
export interface WorthItThresholds {
    minNetProfit: number;
    minProfitPerKm: number;
    minProfitPerHour: number;
}
export interface DailyGoal {
    targetNetProfit: number;
    currency: string;
}
export interface AppSettings {
    vehicleId: string | null;
    dailyGoal: DailyGoal;
    worthItThresholds: WorthItThresholds;
    currency: string;
    theme: 'light' | 'dark' | 'system';
}
export interface DailySummary {
    dateKey: string;
    totalRides: number;
    totalDistanceKm: number;
    totalPayout: number;
    totalCost: number;
    netProfit: number;
    totalMinutes: number;
}

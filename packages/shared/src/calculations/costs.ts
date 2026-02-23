import type { VehicleProfile, RideInput, RideCostBreakdown } from '../types';

export function calculateRideCost(
  input: RideInput,
  vehicle: VehicleProfile
): RideCostBreakdown {
  const fuelCost = calculateFuelCost(
    input.distanceKm,
    vehicle.fuelPricePerLiter,
    vehicle.consumptionKmPerLiter,
    vehicle.fuelType
  );
  const maintenanceCost = input.distanceKm * vehicle.maintenanceCostPerKm;
  const totalCost = fuelCost + maintenanceCost;
  const netProfit = input.payout - totalCost;
  const profitPerKm = input.distanceKm > 0 ? netProfit / input.distanceKm : 0;
  const durationHours =
    input.durationMinutes != null && input.durationMinutes > 0
      ? input.durationMinutes / 60
      : 0;
  const profitPerHour = durationHours > 0 ? netProfit / durationHours : 0;

  return {
    fuelCost,
    maintenanceCost,
    totalCost,
    netProfit,
    profitPerKm,
    profitPerHour,
  };
}

function calculateFuelCost(
  distanceKm: number,
  pricePerLiter: number,
  kmPerLiter: number,
  fuelType: string
): number {
  if (fuelType === 'none' || fuelType === 'electric') return 0;
  if (kmPerLiter <= 0) return 0;
  const litersUsed = distanceKm / kmPerLiter;
  return litersUsed * pricePerLiter;
}

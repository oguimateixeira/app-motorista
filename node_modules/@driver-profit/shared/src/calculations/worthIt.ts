import type { WorthItVerdict, WorthItThresholds, RideCostBreakdown } from '../types';

export function evaluateWorthIt(
  breakdown: RideCostBreakdown,
  thresholds: WorthItThresholds,
  durationMinutes?: number
): WorthItVerdict {
  const { minNetProfit, minProfitPerKm, minProfitPerHour } = thresholds;
  const hourRate =
    durationMinutes != null && durationMinutes > 0
      ? (breakdown.netProfit / durationMinutes) * 60
      : 0;

  const failsNet = breakdown.netProfit < minNetProfit;
  const failsPerKm = breakdown.profitPerKm < minProfitPerKm;
  const failsPerHour =
    minProfitPerHour > 0 && durationMinutes != null && hourRate < minProfitPerHour;

  if (failsNet || failsPerKm || failsPerHour) {
    if (breakdown.netProfit <= 0) return 'not_worth_it';
    return 'low_margin';
  }

  return 'worth_it';
}

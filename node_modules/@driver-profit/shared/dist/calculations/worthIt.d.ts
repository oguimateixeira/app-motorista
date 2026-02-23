import type { WorthItVerdict, WorthItThresholds, RideCostBreakdown } from '../types';
export declare function evaluateWorthIt(breakdown: RideCostBreakdown, thresholds: WorthItThresholds, durationMinutes?: number): WorthItVerdict;

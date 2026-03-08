"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateWorthIt = evaluateWorthIt;
function evaluateWorthIt(breakdown, thresholds, durationMinutes) {
    const { minNetProfit, minProfitPerKm, minProfitPerHour } = thresholds;
    const hourRate = durationMinutes != null && durationMinutes > 0
        ? (breakdown.netProfit / durationMinutes) * 60
        : 0;
    const failsNet = breakdown.netProfit < minNetProfit;
    const failsPerKm = breakdown.profitPerKm < minProfitPerKm;
    const failsPerHour = minProfitPerHour > 0 && durationMinutes != null && hourRate < minProfitPerHour;
    if (failsNet || failsPerKm || failsPerHour) {
        if (breakdown.netProfit <= 0)
            return 'not_worth_it';
        return 'low_margin';
    }
    return 'worth_it';
}

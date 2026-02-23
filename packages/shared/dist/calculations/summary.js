"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateKey = getDateKey;
exports.ridesToDailySummaries = ridesToDailySummaries;
exports.netProfitForDate = netProfitForDate;
exports.averageNetProfitPerRide = averageNetProfitPerRide;
function getDateKey(timestamp) {
    const d = new Date(timestamp);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function ridesToDailySummaries(rides) {
    const byDate = new Map();
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
        totalMinutes: sum(dayRides, (r) => r.durationMinutes ?? 0),
    }))
        .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
function netProfitForDate(rides, dateKey) {
    return rides
        .filter((r) => r.dateKey === dateKey)
        .reduce((acc, r) => acc + r.netProfit, 0);
}
function averageNetProfitPerRide(rides) {
    if (rides.length === 0)
        return 0;
    const total = rides.reduce((acc, r) => acc + r.netProfit, 0);
    return total / rides.length;
}
function sum(arr, fn) {
    return arr.reduce((acc, item) => acc + fn(item), 0);
}

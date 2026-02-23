"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENCY_SYMBOLS = exports.DEFAULT_APP_SETTINGS = exports.DEFAULT_DAILY_GOAL = exports.DEFAULT_WORTH_IT_THRESHOLDS = void 0;
exports.DEFAULT_WORTH_IT_THRESHOLDS = {
    minNetProfit: 5,
    minProfitPerKm: 1.5,
    minProfitPerHour: 15,
};
exports.DEFAULT_DAILY_GOAL = {
    targetNetProfit: 100,
    currency: 'BRL',
};
exports.DEFAULT_APP_SETTINGS = {
    dailyGoal: exports.DEFAULT_DAILY_GOAL,
    worthItThresholds: exports.DEFAULT_WORTH_IT_THRESHOLDS,
    currency: 'BRL',
    theme: 'system',
};
exports.CURRENCY_SYMBOLS = {
    BRL: 'R$',
    USD: '$',
    EUR: '€',
};

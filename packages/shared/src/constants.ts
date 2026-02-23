import type { WorthItThresholds, DailyGoal, AppSettings } from './types';

export const DEFAULT_WORTH_IT_THRESHOLDS: WorthItThresholds = {
  minNetProfit: 5,
  minProfitPerKm: 1.5,
  minProfitPerHour: 15,
};

export const DEFAULT_DAILY_GOAL: DailyGoal = {
  targetNetProfit: 100,
  currency: 'BRL',
};

export const DEFAULT_APP_SETTINGS: Omit<AppSettings, 'vehicleId'> = {
  dailyGoal: DEFAULT_DAILY_GOAL,
  worthItThresholds: DEFAULT_WORTH_IT_THRESHOLDS,
  currency: 'BRL',
  theme: 'system',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
};

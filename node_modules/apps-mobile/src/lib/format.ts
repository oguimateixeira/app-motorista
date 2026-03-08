import { CURRENCY_SYMBOLS } from '@driver-profit/shared';

export function formatCurrency(value: number, currency = 'BRL'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + ' ';
  return `${symbol}${value.toFixed(2).replace('.', ',')}`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace('.', ',');
}

export function formatKm(value: number): string {
  return `${formatNumber(value, 1)} km`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

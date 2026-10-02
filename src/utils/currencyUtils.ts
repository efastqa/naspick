import { CurrencyMode } from '../types';

export const EXCHANGE_RATES_FROM_LKR: Record<CurrencyMode, number> = {
  LKR: 1,
  USD: 1 / 302.5,
  EUR: 1 / 328.0,
  GBP: 1 / 394.0,
  AUD: 1 / 198.5,
};

export const CURRENCY_SYMBOLS: Record<CurrencyMode, string> = {
  LKR: 'Rs.',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
};

export function convertLkr(amountLkr: number, currency: CurrencyMode): number {
  if (currency === 'LKR') return amountLkr;
  const rate = EXCHANGE_RATES_FROM_LKR[currency];
  return Math.round((amountLkr * rate) * 100) / 100;
}

export function formatPrice(amountLkr: number, currency: CurrencyMode = 'LKR', showDual = false): string {
  if (currency === 'LKR') {
    return `LKR ${Math.round(amountLkr).toLocaleString()}`;
  }

  const converted = convertLkr(amountLkr, currency);
  const symbol = CURRENCY_SYMBOLS[currency];
  const formattedForeign = `${symbol}${converted.toFixed(2)}`;

  if (showDual) {
    return `${formattedForeign} (~LKR ${Math.round(amountLkr).toLocaleString()})`;
  }

  return formattedForeign;
}

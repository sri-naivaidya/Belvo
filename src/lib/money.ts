export const DEFAULT_CURRENCY = 'INR';
export const PAYMENT_AMOUNT_MAX = 9_999_999_999.99;

const currencyCodePattern = /^[A-Z]{3}$/;

export function normalizeCurrency(value: string | null | undefined) {
  const currency = (value || DEFAULT_CURRENCY).trim().toUpperCase();
  return currencyCodePattern.test(currency) ? currency : DEFAULT_CURRENCY;
}

export function formatCurrency(amount: number, currency = DEFAULT_CURRENCY) {
  const normalizedCurrency = normalizeCurrency(currency);

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: normalizedCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toLocaleString('en-IN')}`;
  }
}

export function formatCompactCurrency(amount: number, currency = DEFAULT_CURRENCY) {
  const normalizedCurrency = normalizeCurrency(currency);

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: normalizedCurrency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toLocaleString('en-IN')}`;
  }
}

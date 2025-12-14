/**
 * Утилиты для работы с валютой
 * Валюта по умолчанию: KZT (казахстанский тенге)
 */

export type Currency = 'KZT' | 'USD' | 'EUR';

export const DEFAULT_CURRENCY: Currency = 'KZT';

// Моковые курсы валют (для демо)
const EXCHANGE_RATES: Record<Currency, number> = {
  KZT: 1,
  USD: 450, // Примерный курс
  EUR: 490, // Примерный курс
};

/**
 * Форматирует число как валюту
 */
export function formatCurrency(
  amount: number,
  currency: Currency = DEFAULT_CURRENCY,
  options?: Intl.NumberFormatOptions
): string {
  const formatter = new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  });

  return formatter.format(amount);
}

/**
 * Форматирует число как тенге с символом ₸
 */
export function formatKZT(amount: number): string {
  return `${amount.toLocaleString('ru-KZ')} ₸`;
}

/**
 * Конвертирует сумму из одной валюты в другую
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;
  
  // Конвертируем в базовую валюту (KZT), затем в целевую
  const amountInKZT = amount * EXCHANGE_RATES[from];
  return amountInKZT / EXCHANGE_RATES[to];
}

/**
 * Получает символ валюты
 */
export function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    KZT: '₸',
    USD: '$',
    EUR: '€',
  };
  return symbols[currency];
}


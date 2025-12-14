/**
 * Утилиты для форматирования валюты
 * По умолчанию используется казахстанский тенге (KZT)
 */

export const CURRENCY_SYMBOL = '₸';
export const DEFAULT_CURRENCY = 'KZT';

/**
 * Форматирует число в казахстанский тенге
 * @param amount - сумма в тенге
 * @param options - опции форматирования
 */
export function formatKZT(
  amount: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
  }
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSymbol = true,
  } = options || {};

  const formatter = new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits,
    maximumFractionDigits,
    currencyDisplay: 'symbol',
  });

  let formatted = formatter.format(amount);
  
  // Заменяем стандартный символ на наш
  if (showSymbol) {
    formatted = formatted.replace(/KZT|KZT\s/g, CURRENCY_SYMBOL);
  } else {
    formatted = formatted.replace(/KZT|KZT\s|₸/g, '').trim();
  }

  return formatted;
}

/**
 * Конвертирует USD в KZT (моковая функция)
 * @param usdAmount - сумма в долларах
 * @param rate - курс обмена (по умолчанию ~450)
 */
export function convertUSDToKZT(usdAmount: number, rate: number = 450): number {
  return Math.round(usdAmount * rate);
}

/**
 * Форматирует цену для отображения в UI
 * @param amount - сумма в тенге
 */
export function formatPrice(amount: number): string {
  return formatKZT(amount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}


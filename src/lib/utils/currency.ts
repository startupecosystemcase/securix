/**
 * Утилиты для работы с валютой KZT (казахстанский тенге)
 */

export const formatCurrency = (amount: number, currency: string = 'KZT'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatKZT = (amount: number): string => {
  return `${amount.toLocaleString('ru-RU')} ₸`;
};

export const parseKZT = (value: string): number => {
  return parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
};

// Конвертация из USD в KZT (мок, использует примерный курс)
export const convertUSDToKZT = (usd: number): number => {
  // Примерный курс: 1 USD = 450 KZT
  return Math.round(usd * 450);
};

// Конвертация из KZT в USD (мок)
export const convertKZTToUSD = (kzt: number): number => {
  return Math.round((kzt / 450) * 100) / 100;
};


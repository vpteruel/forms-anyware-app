/**
 * Format a number as currency
 */
export function formatCurrency(value: number, locale = 'en-US', currency = 'CAD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a date string
 */
export function formatDate(dateString: string, locale = 'en-US'): string {
  return new Date(dateString).toLocaleDateString(locale);
}
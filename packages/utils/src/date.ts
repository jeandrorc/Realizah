/**
 * Utilitários para manipulação de datas
 */

export function formatDate(date: Date, format: string = 'yyyy-MM-dd'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format.replace('yyyy', String(year)).replace('MM', month).replace('dd', day);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function isExpired(date: Date): boolean {
  return date < new Date();
}

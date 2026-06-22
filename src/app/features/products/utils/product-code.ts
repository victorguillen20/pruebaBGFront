export const CATEGORY_PREFIX_RECORD: Record<string, string> = {
  'Bebidas': 'BE',
  'Frutas y Verduras': 'FV',
  'Panadería': 'PA',
  'Bocadillos': 'BO',
  'Lácteos': 'LA',
};

export function resolveCategoryPrefix(categoryName: string): string | null {
  return CATEGORY_PREFIX_RECORD[categoryName] ?? null;
}

export class ProductCode {
  static generate(prefix: string, existingCodes: readonly string[]): string {
    const upperPrefix = prefix.toUpperCase();
    const pattern = new RegExp(`^${upperPrefix}-(\\d+)$`);
    const numbers = existingCodes
      .map(c => c.match(pattern)?.[1])
      .filter((n): n is string => n != null)
      .map(n => parseInt(n, 10))
      .filter(n => !isNaN(n));
    const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
    const digits = Math.max(3, String(next).length);
    return `${upperPrefix}-${String(next).padStart(digits, '0')}`;
  }
}

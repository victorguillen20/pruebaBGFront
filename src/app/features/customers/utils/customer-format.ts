export class CustomerFormat {
  static readonly IDENT_MIN_LENGTH = 10;
  static readonly IDENT_MAX_LENGTH = 13;
  static readonly PHONE_MAX_LENGTH = 6;
  private static readonly dashRegex = /-/g;

  static normalizeIdentification(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(this.dashRegex, '').trim();
  }

  static normalizePhone(value: string | null | undefined): string | null {
    if (!value) return null;
    const cleaned = value.replace(this.dashRegex, '').trim();
    return cleaned.length === 0 ? null : cleaned;
  }

  static isValidIdentification(value: string): boolean {
    return value.length >= this.IDENT_MIN_LENGTH
      && value.length <= this.IDENT_MAX_LENGTH
      && /^\d+$/.test(value);
  }

  static isValidPhone(value: string): boolean {
    return value.length >= 1
      && value.length <= this.PHONE_MAX_LENGTH
      && /^\d+$/.test(value);
  }
}

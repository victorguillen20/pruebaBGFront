import { CustomerFormat } from './customer-format';

describe('CustomerFormat', () => {
  describe('normalizeIdentification', () => {
    it('retorna string vacia para null', () => {
      expect(CustomerFormat.normalizeIdentification(null)).toBe('');
    });

    it('retorna string vacia para undefined', () => {
      expect(CustomerFormat.normalizeIdentification(undefined)).toBe('');
    });

    it('retorna string vacia para empty string', () => {
      expect(CustomerFormat.normalizeIdentification('')).toBe('');
    });

    it('remueve guiones simples', () => {
      expect(CustomerFormat.normalizeIdentification('001-0123456-7')).toBe('00101234567');
    });

    it('remueve guiones multiples', () => {
      expect(CustomerFormat.normalizeIdentification('001-0123-456-7890')).toBe('00101234567890');
    });

    it('retorna el mismo valor sin guiones', () => {
      expect(CustomerFormat.normalizeIdentification('00101234567')).toBe('00101234567');
    });

    it('limpia espacios en los bordes', () => {
      expect(CustomerFormat.normalizeIdentification('  001-0123456-7  ')).toBe('00101234567');
    });
  });

  describe('normalizePhone', () => {
    it('retorna null para null', () => {
      expect(CustomerFormat.normalizePhone(null)).toBeNull();
    });

    it('retorna null para undefined', () => {
      expect(CustomerFormat.normalizePhone(undefined)).toBeNull();
    });

    it('retorna null para empty string', () => {
      expect(CustomerFormat.normalizePhone('')).toBeNull();
    });

    it('remueve guiones', () => {
      expect(CustomerFormat.normalizePhone('555-100')).toBe('555100');
    });

    it('retorna el mismo valor sin guiones', () => {
      expect(CustomerFormat.normalizePhone('555100')).toBe('555100');
    });

    it('limpia espacios en los bordes', () => {
      expect(CustomerFormat.normalizePhone('  555-100  ')).toBe('555100');
    });

    it('retorna null si solo espacios', () => {
      expect(CustomerFormat.normalizePhone('   ')).toBeNull();
    });
  });

  describe('isValidIdentification', () => {
    it('retorna true para 10 digitos', () => {
      expect(CustomerFormat.isValidIdentification('0010123456')).toBeTrue();
    });

    it('retorna true para 13 digitos', () => {
      expect(CustomerFormat.isValidIdentification('0010123456789')).toBeTrue();
    });

    it('retorna false para menos de 10 digitos', () => {
      expect(CustomerFormat.isValidIdentification('001012345')).toBeFalse();
    });

    it('retorna false para mas de 13 digitos', () => {
      expect(CustomerFormat.isValidIdentification('00101234567890')).toBeFalse();
    });

    it('retorna false para caracteres no numericos', () => {
      expect(CustomerFormat.isValidIdentification('001-0123456-7')).toBeFalse();
    });

    it('retorna false para string vacia', () => {
      expect(CustomerFormat.isValidIdentification('')).toBeFalse();
    });
  });

  describe('isValidPhone', () => {
    it('retorna true para telefono valido de 6 digitos', () => {
      expect(CustomerFormat.isValidPhone('555100')).toBeTrue();
    });

    it('retorna true para telefono valido de 1 digito', () => {
      expect(CustomerFormat.isValidPhone('5')).toBeTrue();
    });

    it('retorna false para mas de 6 digitos', () => {
      expect(CustomerFormat.isValidPhone('5551000')).toBeFalse();
    });

    it('retorna false para caracteres no numericos', () => {
      expect(CustomerFormat.isValidPhone('555-10')).toBeFalse();
    });

    it('retorna false para string vacia', () => {
      expect(CustomerFormat.isValidPhone('')).toBeFalse();
    });
  });
});

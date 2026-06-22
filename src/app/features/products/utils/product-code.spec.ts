import { ProductCode, resolveCategoryPrefix, CATEGORY_PREFIX_RECORD } from './product-code';

describe('ProductCode', () => {
  describe('generate', () => {
    it('retorna PREFIX-001 cuando no hay codigos existentes', () => {
      const result = ProductCode.generate('BE', []);
      expect(result).toBe('BE-001');
    });

    it('incrementa cuando existe el ultimo codigo', () => {
      const result = ProductCode.generate('BE', ['BE-001']);
      expect(result).toBe('BE-002');
    });

    it('incrementa secuencialmente', () => {
      const result = ProductCode.generate('BE', ['BE-001', 'BE-002']);
      expect(result).toBe('BE-003');
    });

    it('ignora gaps y usa max + 1', () => {
      const result = ProductCode.generate('BE', ['BE-001', 'BE-003']);
      expect(result).toBe('BE-004');
    });

    it('ignora codigos de otros prefijos', () => {
      const result = ProductCode.generate('LA', ['FV-001', 'PA-002', 'BE-003']);
      expect(result).toBe('LA-001');
    });

    it('normaliza prefijo a mayusculas', () => {
      const result = ProductCode.generate('be', ['BE-001']);
      expect(result).toBe('BE-002');
    });

    it('incrementa el padding cuando pasa de 999', () => {
      const existing = Array.from({ length: 999 }, (_, i) => `BE-${String(i + 1).padStart(3, '0')}`);
      const result = ProductCode.generate('BE', existing);
      expect(result).toBe('BE-1000');
    });

    it('no incluye padding en numeros de 4 digitos', () => {
      const existing = ['BE-999'];
      const result = ProductCode.generate('BE', ['BE-001', ...existing]);
      expect(result).toBe('BE-1000');
    });

    it('ignora codigos con formato invalido', () => {
      const result = ProductCode.generate('BE', ['INVALIDO', 'BE-ABC', '', 'BE-001']);
      expect(result).toBe('BE-002');
    });

    it('funciona con prefijo de 2 letras comun', () => {
      expect(ProductCode.generate('FV', ['FV-001', 'FV-002'])).toBe('FV-003');
      expect(ProductCode.generate('PA', ['PA-001'])).toBe('PA-002');
      expect(ProductCode.generate('BO', [])).toBe('BO-001');
      expect(ProductCode.generate('LA', ['LA-005'])).toBe('LA-006');
    });

    it('es inmutable con el array de entrada', () => {
      const codes = ['BE-001', 'BE-002'];
      const copy = [...codes];
      ProductCode.generate('BE', codes);
      expect(codes).toEqual(copy);
    });
  });

  describe('resolveCategoryPrefix', () => {
    it('resuelve Bebidas a BE', () => {
      expect(resolveCategoryPrefix('Bebidas')).toBe('BE');
    });

    it('resuelve Frutas y Verduras a FV', () => {
      expect(resolveCategoryPrefix('Frutas y Verduras')).toBe('FV');
    });

    it('resuelve Panaderia a PA', () => {
      expect(resolveCategoryPrefix('Panadería')).toBe('PA');
    });

    it('resuelve Bocadillos a BO', () => {
      expect(resolveCategoryPrefix('Bocadillos')).toBe('BO');
    });

    it('resuelve Lacteos a LA', () => {
      expect(resolveCategoryPrefix('Lácteos')).toBe('LA');
    });

    it('retorna null para categoria desconocida', () => {
      expect(resolveCategoryPrefix('Inexistente')).toBeNull();
    });
  });

  describe('CATEGORY_PREFIX_RECORD', () => {
    it('contiene los 5 mapeos esperados', () => {
      expect(Object.keys(CATEGORY_PREFIX_RECORD).length).toBe(5);
    });
  });
});

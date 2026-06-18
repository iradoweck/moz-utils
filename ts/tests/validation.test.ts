import { describe, it, expect } from 'vitest';
import {
  isValidNUIT,
  getNUITEntityType,
  isValidMozambicanPhone,
  getMobileOperator,
  isValidBI,
  formatMZN,
  getDistrictsByProvince,
  getAllDistricts,
  isValidPostalCode,
  getPostalCodeLocality,
  getPostalCodeProvince
} from '../dist/index.js';

describe('NUIT Validation', () => {
  function generateValidNUIT(first8: string) {
    const weights = [8, 9, 4, 5, 6, 7, 8, 9];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(first8.charAt(i), 10) * weights[i];
    }
    const remainder = sum % 11;
    const checkMap = "01234567891";
    return first8 + checkMap.charAt(remainder);
  }

  const nuitSingular = generateValidNUIT('10000000');
  const nuitSingular2 = generateValidNUIT('20000000');
  const nuitEquivalent = generateValidNUIT('30000000');
  const nuitCollective = generateValidNUIT('40000000');
  const nuitPublico = generateValidNUIT('50000000');

  it('validates strictly correct NUITs', () => {
    expect(isValidNUIT(nuitSingular)).toBe(true);
    expect(isValidNUIT(nuitSingular2)).toBe(true);
    expect(isValidNUIT(nuitEquivalent)).toBe(true);
    expect(isValidNUIT(nuitCollective)).toBe(true);
    expect(isValidNUIT(nuitPublico)).toBe(true);
  });

  it('invalidates incorrect NUITs', () => {
    expect(isValidNUIT('012345678')).toBe(false); // starts with 0
    expect(isValidNUIT('1234')).toBe(false); // too short
    expect(isValidNUIT('1234567890')).toBe(false); // too long
    expect(isValidNUIT('111111111')).toBe(false); // repeated
    expect(isValidNUIT(nuitSingular.slice(0, 8) + '9')).toBe(false); // wrong check digit
  });

  it('classifies NUIT Entity Type correctly', () => {
    expect(getNUITEntityType(nuitSingular)).toBe('Pessoas Singulares');
    expect(getNUITEntityType(nuitSingular2)).toBe('Pessoas Singulares');
    expect(getNUITEntityType(nuitEquivalent)).toBe('Pessoas Singulares');
    expect(getNUITEntityType(nuitCollective)).toBe('Pessoas Colectivas');
    expect(getNUITEntityType(nuitPublico)).toBe('Pessoas Colectivas');
    expect(getNUITEntityType(generateValidNUIT('60000000'))).toBe('Entidades Equiparadas');
    expect(getNUITEntityType(generateValidNUIT('70000000'))).toBe('Estado / Públicas');
    expect(getNUITEntityType(generateValidNUIT('80000000'))).toBe('Outras Entidades');
    expect(getNUITEntityType(generateValidNUIT('90000000'))).toBe('Entidades Estrangeiras');
    expect(getNUITEntityType('000000000')).toBe(null);
  });
});

describe('Mobile Phones Validation', () => {
  it('validates correct numbers', () => {
    expect(isValidMozambicanPhone('841234567')).toBe(true);
    expect(isValidMozambicanPhone('851234567')).toBe(true);
    expect(isValidMozambicanPhone('821234567')).toBe(true);
    expect(isValidMozambicanPhone('831234567')).toBe(true);
    expect(isValidMozambicanPhone('861234567')).toBe(true);
    expect(isValidMozambicanPhone('871234567')).toBe(true);
    expect(isValidMozambicanPhone('881234567')).toBe(true);
  });

  it('validates numbers with country code or spaces', () => {
    expect(isValidMozambicanPhone('+258 84 123 4567')).toBe(true);
    expect(isValidMozambicanPhone('+258841234567')).toBe(true);
    expect(isValidMozambicanPhone('84 123 4567')).toBe(true);
  });

  it('invalidates incorrect numbers', () => {
    expect(isValidMozambicanPhone('811234567')).toBe(false);
    expect(isValidMozambicanPhone('891234567')).toBe(false);
    expect(isValidMozambicanPhone('801234567')).toBe(false);
    expect(isValidMozambicanPhone('911234567')).toBe(false);
  });

  it('identifies mobile operators correctly', () => {
    expect(getMobileOperator('841234567')).toBe('Vodacom');
    expect(getMobileOperator('851234567')).toBe('Vodacom');
    expect(getMobileOperator('821234567')).toBe('Tmcel');
    expect(getMobileOperator('831234567')).toBe('Tmcel');
    expect(getMobileOperator('861234567')).toBe('Movitel');
    expect(getMobileOperator('871234567')).toBe('Movitel');
    expect(getMobileOperator('881234567')).toBe('Movitel');
    expect(getMobileOperator('911234567')).toBe(null);
  });
});

describe('BI Validation', () => {
  it('validates BI structure', () => {
    expect(isValidBI('110101234567A')).toBe(true);
    expect(isValidBI('110101234567 A')).toBe(true);
    expect(isValidBI('110101234567a')).toBe(true);
    expect(isValidBI('1101012345670')).toBe(false);
    expect(isValidBI('11010123456A')).toBe(false);
  });
});

describe('Monetary Formatting', () => {
  it('formats values according to AT/SI standards', () => {
    expect(formatMZN(1500)).toBe('1 500,00 MT');
    expect(formatMZN(0.5)).toBe('0,50 MT');
    expect(formatMZN(1000000)).toBe('1 000 000,00 MT');
    expect(formatMZN(99.99)).toBe('99,99 MT');
    expect(formatMZN(0)).toBe('0,00 MT');
    expect(formatMZN(999)).toBe('999,00 MT');
    expect(formatMZN(1000)).toBe('1 000,00 MT');
    expect(formatMZN(-500)).toBe('-500,00 MT');
    expect(formatMZN(-1500)).toBe('-1 500,00 MT');
  });

  it('supports custom symbol', () => {
    expect(formatMZN(1500, 'MZN')).toBe('1 500,00 MZN');
    expect(formatMZN(50000, 'MZN')).toBe('50 000,00 MZN');
  });
});

describe('Districts and Geography', () => {
  it('returns districts correctly by province', () => {
    expect(getDistrictsByProvince('cab').length).toBe(17);
    expect(getDistrictsByProvince('cab')[0]).toBe('Ancuabe');
    expect(getDistrictsByProvince('CaB').length).toBe(17);
    expect(getDistrictsByProvince('mpc').length).toBe(7);
  });

  it('throws error for invalid province', () => {
    expect(() => getDistrictsByProvince('xyz')).toThrow();
  });

  it('loads all districts', () => {
    const all = getAllDistricts();
    expect(all.length).toBe(161);
    expect(all[0].name).toBe('Ancuabe');
    expect(all[0].provinceId).toBe('cab');
  });
});

describe('Postal Codes (CEPs)', () => {
  it('validates postal codes formats', () => {
    expect(isValidPostalCode('1100')).toBe(true);
    expect(isValidPostalCode(' 1101 ')).toBe(true);
    expect(isValidPostalCode('11-02')).toBe(true);
    expect(isValidPostalCode('1202')).toBe(true);
    expect(isValidPostalCode('3311')).toBe(true);
    expect(isValidPostalCode('1199')).toBe(false);
    expect(isValidPostalCode('11000')).toBe(false);
    expect(isValidPostalCode('110')).toBe(false);
    expect(isValidPostalCode('ABCD')).toBe(false);
  });

  it('identifies localities and provinces correctly', () => {
    expect(getPostalCodeLocality('1100')).toBe('Maputo ECP (Sede)');
    expect(getPostalCodeLocality('1205')).toBe('Chilembene / Magoanine');
    expect(getPostalCodeProvince('1100')).toBe('Maputo');
    expect(getPostalCodeProvince('2100')).toBe('Sofala');
    expect(getPostalCodeProvince('3311')).toBe('Niassa');
    expect(getPostalCodeLocality('9999')).toBe(null);
    expect(getPostalCodeProvince('9999')).toBe(null);
  });
});

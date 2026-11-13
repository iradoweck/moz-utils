import { describe, it, expect } from 'vitest';
import {
  // Telecom
  isValidMozambicanPhone,
  formatMozambicanPhone,
  getMobileOperator,
  getMobileWallet,
  buildWhatsAppUrl,

  // Civil & Fiscal ID
  isValidNUIT,
  formatNUIT,
  getNUITEntityType,
  isValidBI,
  isValidDIRE,
  isValidPassport,
  isValidDrivingLicense,

  // Currency
  formatMZN,
  parseMZN,

  // Territorial Division
  getMozambiqueProvinces,
  mozambiqueProvinces,
  getDistrictsByProvince,
  getAllDistricts,

  // Sanitization
  isValidName,
  sanitizeName,
  sanitizeDocumentField,
  sanitizeAlphanumericField,

  // Postal Codes
  legacyPostalCodes,
  isValidPostalCode,
  getPostalCodeLocality,
  getPostalCodeProvince,
  isValidNewCEP,
  suggestCEPs,

  // Banking Module
  MOZAMBIQUE_BANKS,
  isValidNIB,
  formatNIB,
  getBankFromNIB,
  getBankByNIB,
  nibToIBAN,
  isValidIBAN,
} from '../dist/index.js';

// Função auxiliar para gerar NIBs matematicamente válidos conforme ISO 7064 MOD 97-10
function createValidNIB(bankCode: string, branch = '0000', account = '00000000000'): string {
  const first19 = `${bankCode.padStart(4, '0')}${branch.padStart(4, '0')}${account.padStart(11, '0')}`;
  const check = Number(98n - ((BigInt(first19) * 100n) % 97n));
  const checkStr = check.toString().padStart(2, '0');
  return `${first19}${checkStr}`;
}

// Função auxiliar para gerar NUITs válidos conforme Módulo 11 da AT
function createValidNUIT(first8: string): string {
  const weights = [8, 9, 4, 5, 6, 7, 8, 9];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(first8.charAt(i), 10) * weights[i];
  }
  const checkIdx = sum % 11;
  const checkMap = '01234567891';
  return `${first8}${checkMap.charAt(checkIdx)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. VALIDAÇÃO DE NUIT E ENTIDADES
// ─────────────────────────────────────────────────────────────────────────────

describe('NUIT & Fiscal Validation', () => {
  const nuitSingular = createValidNUIT('10000000');
  const nuitSingular2 = createValidNUIT('20000000');
  const nuitEquivalent = createValidNUIT('30000000');
  const nuitCollective = createValidNUIT('40000000');
  const nuitPublico = createValidNUIT('50000000');
  const nuitEquiparadas = createValidNUIT('60000000');
  const nuitEstado = createValidNUIT('70000000');
  const nuitOutras = createValidNUIT('80000000');
  const nuitEstrangeiras = createValidNUIT('90000000');

  it('validates strictly correct NUITs', () => {
    expect(isValidNUIT(nuitSingular)).toBe(true);
    expect(isValidNUIT(nuitSingular2)).toBe(true);
    expect(isValidNUIT(nuitEquivalent)).toBe(true);
    expect(isValidNUIT(nuitCollective)).toBe(true);
    expect(isValidNUIT(nuitPublico)).toBe(true);
    expect(isValidNUIT(nuitEquiparadas)).toBe(true);
    expect(isValidNUIT(nuitEstado)).toBe(true);
    expect(isValidNUIT(nuitOutras)).toBe(true);
    expect(isValidNUIT(nuitEstrangeiras)).toBe(true);
    expect(isValidNUIT(Number(nuitSingular))).toBe(true);
  });

  it('invalidates incorrect NUITs', () => {
    expect(isValidNUIT('012345678')).toBe(false); // começa com 0
    expect(isValidNUIT('1234')).toBe(false); // muito curto
    expect(isValidNUIT('1234567890')).toBe(false); // muito longo
    expect(isValidNUIT('111111111')).toBe(false); // dígitos repetidos
    expect(isValidNUIT(nuitSingular.slice(0, 8) + '9')).toBe(false); // dígito de controlo errado
    expect(isValidNUIT(null as any)).toBe(false);
    expect(isValidNUIT(undefined as any)).toBe(false);
    expect(isValidNUIT({} as any)).toBe(false);
  });

  it('classifies NUIT Entity Type correctly for 1 through 9', () => {
    expect(getNUITEntityType(nuitSingular)).toBe('Pessoas Singulares');
    expect(getNUITEntityType(nuitSingular2)).toBe('Pessoas Singulares');
    expect(getNUITEntityType(nuitEquivalent)).toBe('Pessoas Singulares');
    expect(getNUITEntityType(nuitCollective)).toBe('Pessoas Colectivas');
    expect(getNUITEntityType(nuitPublico)).toBe('Pessoas Colectivas');
    expect(getNUITEntityType(nuitEquiparadas)).toBe('Entidades Equiparadas');
    expect(getNUITEntityType(nuitEstado)).toBe('Estado / Públicas');
    expect(getNUITEntityType(nuitOutras)).toBe('Outras Entidades');
    expect(getNUITEntityType(nuitEstrangeiras)).toBe('Entidades Estrangeiras');
    expect(getNUITEntityType('000000000')).toBe(null);
    expect(getNUITEntityType(null as any)).toBe(null);
  });

  it('formats NUIT in 3 groups of digits', () => {
    expect(formatNUIT(nuitCollective)).toBe(`${nuitCollective.slice(0, 3)} ${nuitCollective.slice(3, 6)} ${nuitCollective.slice(6)}`);
    expect(formatNUIT(Number(nuitSingular))).toBe(`${nuitSingular.slice(0, 3)} ${nuitSingular.slice(3, 6)} ${nuitSingular.slice(6)}`);
    expect(() => formatNUIT('123456789')).toThrow();
    expect(() => formatNUIT(null as any)).toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. TELEFONIA MÓVEL E CARTEIRAS MÓVEIS
// ─────────────────────────────────────────────────────────────────────────────

describe('Mobile Phones & Wallets', () => {
  it('validates mobile phones from all operators', () => {
    expect(isValidMozambicanPhone('841234567')).toBe(true);
    expect(isValidMozambicanPhone('851234567')).toBe(true);
    expect(isValidMozambicanPhone('821234567')).toBe(true);
    expect(isValidMozambicanPhone('831234567')).toBe(true);
    expect(isValidMozambicanPhone('861234567')).toBe(true);
    expect(isValidMozambicanPhone('871234567')).toBe(true);
    expect(isValidMozambicanPhone('881234567')).toBe(true);
  });

  it('validates numbers with country code (+258 / 258), spaces and punctuation', () => {
    expect(isValidMozambicanPhone('+258 84 123 4567')).toBe(true);
    expect(isValidMozambicanPhone('+258841234567')).toBe(true);
    expect(isValidMozambicanPhone('258-84-123-4567')).toBe(true);
    expect(isValidMozambicanPhone('(258) 84 123 4567')).toBe(true);
    expect(isValidMozambicanPhone('84 123 4567')).toBe(true);
  });

  it('invalidates non-mobile or malformed numbers', () => {
    expect(isValidMozambicanPhone('811234567')).toBe(false);
    expect(isValidMozambicanPhone('891234567')).toBe(false);
    expect(isValidMozambicanPhone('801234567')).toBe(false);
    expect(isValidMozambicanPhone('911234567')).toBe(false);
    expect(isValidMozambicanPhone('84123456')).toBe(false); // 8 dígitos
    expect(isValidMozambicanPhone('8412345678')).toBe(false); // 10 dígitos
    expect(isValidMozambicanPhone(null as any)).toBe(false);
    expect(isValidMozambicanPhone(undefined as any)).toBe(false);
  });

  it('formats Mozambican phone with custom options', () => {
    // Padrão international
    expect(formatMozambicanPhone('841234567')).toBe('+258 84 123 4567');
    expect(formatMozambicanPhone('+258841234567', { format: 'international' })).toBe('+258 84 123 4567');

    // E.164 compacto
    expect(formatMozambicanPhone('84 123 4567', { format: 'e164' })).toBe('+258841234567');

    // Nacional com espaços
    expect(formatMozambicanPhone('+258 84 123 4567', { format: 'national' })).toBe('84 123 4567');

    // Dashed
    expect(formatMozambicanPhone('841234567', { format: 'dashed' })).toBe('84-123-4567');

    // Erros para números inválidos
    expect(() => formatMozambicanPhone('12345')).toThrow();
    expect(() => formatMozambicanPhone(null as any)).toThrow();
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
    expect(getMobileOperator(null as any)).toBe(null);
  });

  it('identifies mobile wallets correctly', () => {
    expect(getMobileWallet('841234567')).toBe('M-Pesa');
    expect(getMobileWallet('851234567')).toBe('M-Pesa');
    expect(getMobileWallet('821234567')).toBe('mKesh');
    expect(getMobileWallet('831234567')).toBe('mKesh');
    expect(getMobileWallet('861234567')).toBe('e-Mola');
    expect(getMobileWallet('871234567')).toBe('e-Mola');
    expect(getMobileWallet('881234567')).toBe('e-Mola');
    expect(getMobileWallet('911234567')).toBe(null);
  });

  it('builds WhatsApp URLs correctly', () => {
    expect(buildWhatsAppUrl('841234567')).toBe('https://wa.me/258841234567');
    expect(buildWhatsAppUrl('+258 84 123 4567', 'Olá Mundo')).toBe('https://wa.me/258841234567?text=Ol%C3%A1%20Mundo');
    expect(buildWhatsAppUrl('258841234567')).toBe('https://wa.me/258841234567');
    expect(() => buildWhatsAppUrl(null as any)).toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. DOCUMENTOS DE IDENTIFICAÇÃO (BI, DIRE, PASSAPORTE, CARTA)
// ─────────────────────────────────────────────────────────────────────────────

describe('Civil Identification Documents', () => {
  it('validates Mozambican BI', () => {
    expect(isValidBI('110101234567A')).toBe(true);
    expect(isValidBI('110101234567 A')).toBe(true);
    expect(isValidBI('110101234567a')).toBe(true);
    expect(isValidBI('1101012345670')).toBe(false); // termina em número
    expect(isValidBI('11010123456A')).toBe(false); // 11 dígitos
    expect(isValidBI('1101012345678A')).toBe(false); // 13 dígitos
    expect(isValidBI(null as any)).toBe(false);
  });

  it('validates DIRE (modern SENAMI and legacy)', () => {
    expect(isValidDIRE('120345678A')).toBe(true); // 9 dígitos + letra
    expect(isValidDIRE('00008312C')).toBe(true); // 8 dígitos + letra
    expect(isValidDIRE('12C00008312C')).toBe(true); // legado longo
    expect(isValidDIRE('1203456789')).toBe(false);
    expect(isValidDIRE('ABC')).toBe(false);
    expect(isValidDIRE(null as any)).toBe(false);
  });

  it('validates Mozambican Passport', () => {
    expect(isValidPassport('AO1234567')).toBe(true);
    expect(isValidPassport('ao1234567')).toBe(true);
    expect(isValidPassport('A1234567')).toBe(false); // 1 letra
    expect(isValidPassport('AB123456')).toBe(false); // 6 dígitos
    expect(isValidPassport('AB12345678')).toBe(false); // 8 dígitos
    expect(isValidPassport(null as any)).toBe(false);
  });

  it('validates Mozambican Driving License', () => {
    expect(isValidDrivingLicense('MP1234567')).toBe(true); // INATRO 2 letras + 7 dígitos
    expect(isValidDrivingLicense('M123456')).toBe(true); // 1 letra + 6 dígitos
    expect(isValidDrivingLicense('110101234567A')).toBe(true); // formato 12 dígitos + letra
    expect(isValidDrivingLicense('123')).toBe(false);
    expect(isValidDrivingLicense(null as any)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. VALORES MONETÁRIOS (MZN / METICAIS)
// ─────────────────────────────────────────────────────────────────────────────

describe('Monetary Formatting & Parsing', () => {
  it('formats MZN values according to official AT/SI standards', () => {
    expect(formatMZN(1500)).toBe('1 500,00 MT');
    expect(formatMZN(0.5)).toBe('0,50 MT');
    expect(formatMZN(1000000)).toBe('1 000 000,00 MT');
    expect(formatMZN(99.99)).toBe('99,99 MT');
    expect(formatMZN(0)).toBe('0,00 MT');
    expect(formatMZN(-500)).toBe('-500,00 MT');
    expect(formatMZN(-1500)).toBe('-1 500,00 MT');
    expect(formatMZN(1500, 'MZN')).toBe('1 500,00 MZN');
  });

  it('throws error when formatting invalid numbers', () => {
    expect(() => formatMZN(NaN)).toThrow();
    expect(() => formatMZN(Infinity)).toThrow();
    expect(() => formatMZN('1500' as any)).toThrow();
  });

  it('parses currency strings to numbers', () => {
    expect(parseMZN('1 500,00 MT')).toBe(1500.00);
    expect(parseMZN('1.500,00 MT')).toBe(1500.00);
    expect(parseMZN('1 500,00MZN')).toBe(1500.00);
    expect(parseMZN('1,500.00')).toBe(1500.00);
    expect(parseMZN('250 MT')).toBe(250);
    expect(parseMZN('-500,50 MT')).toBe(-500.50);
    expect(parseMZN('invalid')).toBe(null);
    expect(parseMZN('-')).toBe(null);
    expect(parseMZN(null as any)).toBe(null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. DIVISÃO TERRITORIAL E GEOGRAFIA
// ─────────────────────────────────────────────────────────────────────────────

describe('Territorial Division (Provinces & Districts)', () => {
  it('returns all 11 provinces', () => {
    const provinces = getMozambiqueProvinces();
    expect(provinces.length).toBe(11);
    expect(mozambiqueProvinces.length).toBe(11);
  });

  it('returns districts flexibly by ID, sigla, and name', () => {
    // Por ID
    const cabDistricts = getDistrictsByProvince('cab');
    expect(cabDistricts.length).toBe(17);
    expect(cabDistricts[0]).toBe('Ancuabe');

    // Por Sigla
    expect(getDistrictsByProvince('CBD').length).toBe(17);
    expect(getDistrictsByProvince('NPL').length).toBe(23);

    // Por Nome exato
    expect(getDistrictsByProvince('Cabo Delgado').length).toBe(17);
    expect(getDistrictsByProvince('Nampula').length).toBe(23);

    // Case-insensitive e sem acentos
    expect(getDistrictsByProvince('cabo delgado').length).toBe(17);
    expect(getDistrictsByProvince('zambezia').length).toBe(22);
    expect(getDistrictsByProvince('Zambézia').length).toBe(22);

    // Maputo Província vs Maputo Cidade
    expect(getDistrictsByProvince('mpp').length).toBe(8);
    expect(getDistrictsByProvince('Maputo').length).toBe(8);
    expect(getDistrictsByProvince('Maputo Província').length).toBe(8);

    expect(getDistrictsByProvince('mpc').length).toBe(7);
    expect(getDistrictsByProvince('MC').length).toBe(7);
    expect(getDistrictsByProvince('Maputo (Cidade)').length).toBe(7);
    expect(getDistrictsByProvince('Cidade de Maputo').length).toBe(7);
  });

  it('throws error for invalid province identifiers', () => {
    expect(() => getDistrictsByProvince('xyz')).toThrow('Província inválida: xyz');
    expect(() => getDistrictsByProvince('')).toThrow();
    expect(() => getDistrictsByProvince(null as any)).toThrow();
  });

  it('returns all 161 districts with proper structure', () => {
    const all = getAllDistricts();
    expect(all.length).toBe(161);
    expect(all[0].name).toBe('Ancuabe');
    expect(all[0].provinceId).toBe('cab');
    expect(Array.isArray(all[0].administrative_posts)).toBe(true);
    expect(Array.isArray(all[0].neighborhoods)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. SANEAMENTO E VALIDAÇÃO DE NOMES E CAMPOS
// ─────────────────────────────────────────────────────────────────────────────

describe('Sanitization & Name Validation', () => {
  it('validates personal names requiring at least 2 alphabetic characters', () => {
    expect(isValidName('Edmilson Muacigarro')).toBe(true);
    expect(isValidName("João O'Brian")).toBe(true);
    expect(isValidName('Jean-Pierre Dupont')).toBe(true);
    expect(isValidName('Ana')).toBe(true);

    // Rejeição de símbolos e pontuações isoladas
    expect(isValidName('---')).toBe(false);
    expect(isValidName(' - ')).toBe(false);
    expect(isValidName(" ' ")).toBe(false);
    expect(isValidName('-')).toBe(false);
    expect(isValidName('A')).toBe(false); // Apenas 1 letra
    expect(isValidName('123')).toBe(false);
    expect(isValidName('Edmilson123')).toBe(false);
    expect(isValidName(null as any)).toBe(false);
    expect(isValidName(undefined as any)).toBe(false);
  });

  it('sanitizes names into Title Case preserving particles in lowercase', () => {
    // Conversão de maiúsculas prévias
    expect(sanitizeName('EDMILSON MUACIGARRO')).toBe('Edmilson Muacigarro');

    // Preservação de partículas (de, da, do, dos, das, e)
    expect(sanitizeName('EDMILSON DE JESUS MUACIGARRO')).toBe('Edmilson de Jesus Muacigarro');
    expect(sanitizeName('MARIA DA SILVA E SOUSA')).toBe('Maria da Silva e Sousa');
    expect(sanitizeName('antonio dos santos')).toBe('Antonio dos Santos');

    // Partícula no início capitaliza
    expect(sanitizeName('de sousa')).toBe('De Sousa');

    // Hífens e apóstrofos
    expect(sanitizeName('jean-pierre dupont')).toBe('Jean-Pierre Dupont');
    expect(sanitizeName("joão o'brian")).toBe("João O'Brian");

    // Limpeza de caracteres especiais e espaços extras
    expect(sanitizeName('  edmilson   ###  muacigarro  ')).toBe('Edmilson Muacigarro');

    // Opção allCaps
    expect(sanitizeName('joão da silva', { allCaps: true })).toBe('JOÃO DA SILVA');
    expect(sanitizeName(null as any)).toBe('');
  });

  it('sanitizes document numeric fields', () => {
    expect(sanitizeDocumentField('123 456 789')).toBe('123456789');
    expect(sanitizeDocumentField('123-456-789')).toBe('123456789');
    expect(sanitizeDocumentField('abc')).toBe('');
    expect(sanitizeDocumentField(null as any)).toBe('');
  });

  it('sanitizes alphanumeric fields forcing uppercase', () => {
    expect(sanitizeAlphanumericField('110 101 234567a')).toBe('110101234567A');
    expect(sanitizeAlphanumericField('abc-123-xyz!')).toBe('ABC123XYZ');
    expect(sanitizeAlphanumericField(null as any)).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. CÓDIGOS POSTAIS (LEGADOS E NOVOS CEPS)
// ─────────────────────────────────────────────────────────────────────────────

describe('Postal Codes & CEPs', () => {
  it('validates legacy postal codes', () => {
    expect(isValidPostalCode('1100')).toBe(true);
    expect(isValidPostalCode(' 1101 ')).toBe(true);
    expect(isValidPostalCode('3100')).toBe(true);
    expect(isValidPostalCode('1199')).toBe(false);
    expect(isValidPostalCode('1100abc')).toBe(false); // Rejeita strings com caracteres não-numéricos adicionais
    expect(isValidPostalCode('110')).toBe(false);
    expect(isValidPostalCode('11000')).toBe(false);
    expect(isValidPostalCode(null as any)).toBe(false);
  });

  it('resolves legacy postal code locality and province', () => {
    expect(getPostalCodeLocality('1100')).toBe('Maputo ECP (Sede)');
    expect(getPostalCodeLocality('1205')).toBe('Chilembene / Magoanine');
    expect(getPostalCodeProvince('1100')).toBe('Maputo');
    expect(getPostalCodeProvince('2100')).toBe('Sofala');
    expect(getPostalCodeProvince('3100')).toBe('Nampula');
    expect(getPostalCodeLocality('9999')).toBe(null);
    expect(getPostalCodeProvince('9999')).toBe(null);
    expect(getPostalCodeLocality(null as any)).toBe(null);
  });

  it('validates new CEP format (XXXX-XX)', () => {
    expect(isValidNewCEP('0101-01')).toBe(true);
    expect(isValidNewCEP('0909-09')).toBe(true);
    expect(isValidNewCEP(' 0101-01 ')).toBe(true);
    expect(isValidNewCEP('010101')).toBe(false);
    expect(isValidNewCEP('0101-1')).toBe(false);
    expect(isValidNewCEP('ABC-DE')).toBe(false);
    expect(isValidNewCEP(null as any)).toBe(false);
  });

  it('suggests CEPs by new CEP, legacy code, and textual locality', () => {
    // 1. Busca por novo CEP exato
    const byCep = suggestCEPs('0909-09');
    expect(byCep.length).toBeGreaterThan(0);
    expect(byCep[0].locality).toBe('Namutequeliua');
    expect(byCep[0].district).toBe('Nampula');

    // 2. Busca por código postal legado
    const byLegacy = suggestCEPs('3100');
    expect(byLegacy.length).toBeGreaterThan(0);
    expect(byLegacy.every(c => c.province === 'Nampula')).toBe(true);

    // 3. Busca por localidade (com e sem acentos)
    const byLocality = suggestCEPs('Namutequeliua');
    expect(byLocality.length).toBeGreaterThan(0);
    expect(byLocality[0].cep).toBe('0909-09');

    const byWithoutAccent = suggestCEPs('Alto Mae');
    expect(byWithoutAccent.length).toBeGreaterThan(0);

    // 4. Sem correspondência
    expect(suggestCEPs('nao_existe_localidade_xyz')).toEqual([]);
    expect(suggestCEPs(null as any)).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. MÓDULO BANCÁRIO MOÇAMBICANO (NIB, IBAN E BANCOS)
// ─────────────────────────────────────────────────────────────────────────────

describe('Mozambique Banking Module (NIB & IBAN)', () => {
  const bimNib = createValidNIB('0001', '0000', '12345678901');
  const standardNib = createValidNIB('0003', '0001', '98765432100');
  const bciNib = createValidNIB('0008', '0100', '11122233344');
  const mozaNib = createValidNIB('0016', '0002', '55566677788');
  const absaNib = createValidNIB('0006', '0005', '99988877766');

  it('contains the catalog of 18 commercial banks in Mozambique', () => {
    expect(Object.keys(MOZAMBIQUE_BANKS).length).toBeGreaterThanOrEqual(18);
    expect(MOZAMBIQUE_BANKS['0001'].shortName).toBe('Millennium BIM');
    expect(MOZAMBIQUE_BANKS['0003'].shortName).toBe('Standard Bank');
    expect(MOZAMBIQUE_BANKS['0006'].shortName).toBe('Absa');
    expect(MOZAMBIQUE_BANKS['0008'].shortName).toBe('BCI');
    expect(MOZAMBIQUE_BANKS['0014'].shortName).toBe('FNB');
    expect(MOZAMBIQUE_BANKS['0016'].shortName).toBe('Moza Banco');
  });

  it('validates legitimate Mozambican NIBs via ISO 7064 Modulo 97-10', () => {
    expect(isValidNIB(bimNib)).toBe(true);
    expect(isValidNIB(standardNib)).toBe(true);
    expect(isValidNIB(bciNib)).toBe(true);
    expect(isValidNIB(mozaNib)).toBe(true);
    expect(isValidNIB(absaNib)).toBe(true);

    // Aceita NIBs com espaços ou pontos se tiverem os 21 dígitos numéricos
    expect(isValidNIB(`0001 0000 12345678901 ${bimNib.slice(19)}`)).toBe(true);
  });

  it('invalidates erroneous, altered or fake NIBs', () => {
    // Dígito de controlo adulterado
    const badCheck = bimNib.slice(0, 19) + (bimNib.slice(19) === '00' ? '01' : '00');
    expect(isValidNIB(badCheck)).toBe(false);

    // Banco inexistente no cadastro oficial
    expect(isValidNIB('999900001234567890123')).toBe(false);

    // Comprimento incorreto
    expect(isValidNIB('0001000012345678901')).toBe(false); // 19 dígitos
    expect(isValidNIB('0001000012345678901234')).toBe(false); // 22 dígitos

    // Tipos inválidos e null
    expect(isValidNIB(null as any)).toBe(false);
    expect(isValidNIB(undefined as any)).toBe(false);
    expect(isValidNIB('ABC')).toBe(false);
  });

  it('formats NIB in 4 distinct blocks', () => {
    const formattedSpace = formatNIB(bimNib);
    expect(formattedSpace).toBe(`0001 0000 12345678901 ${bimNib.slice(19)}`);

    const formattedDot = formatNIB(bimNib, '.');
    expect(formattedDot).toBe(`0001.0000.12345678901.${bimNib.slice(19)}`);

    expect(() => formatNIB('00000')).toThrow();
    expect(() => formatNIB(null as any)).toThrow();
  });

  it('identifies bank information from NIB (getBankFromNIB and getBankByNIB)', () => {
    const bankBim = getBankFromNIB(bimNib);
    expect(bankBim).not.toBeNull();
    expect(bankBim?.shortName).toBe('Millennium BIM');
    expect(bankBim?.name).toBe('Banco Internacional de Moçambique');

    const bankStandard = getBankByNIB(standardNib);
    expect(bankStandard?.shortName).toBe('Standard Bank');

    expect(getBankFromNIB('999900001234567890123')).toBeNull();
    expect(getBankFromNIB('12')).toBeNull();
    expect(getBankFromNIB(null as any)).toBeNull();
  });

  it('converts NIB to official Mozambican IBAN (MZ59 + 21 digits)', () => {
    const iban = nibToIBAN(bimNib);
    expect(iban).toBe(`MZ59${bimNib}`);
    expect(iban.length).toBe(25);

    expect(() => nibToIBAN('12345')).toThrow();
    expect(() => nibToIBAN(null as any)).toThrow();
  });

  it('validates Mozambican IBAN format and checksum', () => {
    const validIban = `MZ59${bimNib}`;
    expect(isValidIBAN(validIban)).toBe(true);
    expect(isValidIBAN(`mz59${bimNib}`)).toBe(true); // tolerante a minúsculas
    expect(isValidIBAN(`MZ59 ${bimNib.slice(0, 4)} ${bimNib.slice(4)}`)).toBe(true); // tolerante a espaços

    // Inválidos
    expect(isValidIBAN(`PT50${bimNib}`)).toBe(false); // país errado
    expect(isValidIBAN(`MZ58${bimNib}`)).toBe(false); // check IBAN errado
    expect(isValidIBAN('MZ590001000012345678901')).toBe(false); // muito curto
    expect(isValidIBAN(null as any)).toBe(false);
  });
});

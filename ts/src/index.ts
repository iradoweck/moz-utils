/**
 * moz-utils
 *
 * Biblioteca de utilitários para Moçambique: telecomunicações, identificação civil e fiscal,
 * divisão administrativa territorial, códigos postais e sistema bancário (NIB/IBAN).
 *
 * @license Apache-2.0
 */

import { mozambiqueProvinces } from './data/provinces.js';
import { legacyPostalCodes, legacyToNewCEPPrefix } from './data/postalCodes.js';
import { newCEPData } from './cep_data.js';

// Reexportação de contratos de tipos desacoplados
export * from './types.js';
import type {
  CEPInfo,
  District,
  Province,
  MobileOperator,
  MobileWallet,
  NUITEntityType,
  BankInfo,
  PhoneFormatOptions,
} from './types.js';

export { mozambiqueProvinces, legacyPostalCodes, legacyToNewCEPPrefix, newCEPData };

// ─────────────────────────────────────────────────────────────────────────────
// TELECOMUNICAÇÕES E NÚMEROS DE TELEFONE (+258)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valida se um número de telefone é um contacto móvel válido em Moçambique.
 * Suporta formatos: 84XXXXXXX, +258 84XXXXXXX, 258-84-XXX-XXXX, etc.
 * Operadoras válidas: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88).
 */
export function isValidMozambicanPhone(phone: string): boolean {
  if (typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned;
  return /^8[2-8]\d{7}$/.test(withoutCountryCode);
}

/**
 * Formata um número de telefone moçambicano de acordo com as opções especificadas.
 * Padrão: formato internacional "+258 84 123 4567".
 *
 * @param phone - O número de telefone a formatar
 * @param options - Opções de formato ('international' | 'e164' | 'national' | 'dashed')
 * @returns Número de telefone formatado
 */
export function formatMozambicanPhone(phone: string, options?: PhoneFormatOptions): string {
  if (typeof phone !== 'string') {
    throw new Error(`Número de telefone inválido: ${phone}`);
  }

  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned;

  if (!isValidMozambicanPhone(withoutCountryCode)) {
    throw new Error(`Número de telefone inválido: ${phone}`);
  }

  const prefix = withoutCountryCode.slice(0, 2);
  const part1 = withoutCountryCode.slice(2, 5);
  const part2 = withoutCountryCode.slice(5);

  const format = options?.format ?? 'international';

  switch (format) {
    case 'e164':
      return `+258${withoutCountryCode}`;
    case 'national':
      return `${prefix} ${part1} ${part2}`;
    case 'dashed':
      return `${prefix}-${part1}-${part2}`;
    case 'international':
    default:
      return `+258 ${prefix} ${part1} ${part2}`;
  }
}

/**
 * Identifica a operadora de telefonia móvel associada a um número moçambicano.
 */
export function getMobileOperator(phone: string): MobileOperator | null {
  if (typeof phone !== 'string') return null;

  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned;

  if (!isValidMozambicanPhone(withoutCountryCode)) return null;

  const prefix = withoutCountryCode.slice(0, 2);
  const operators: Record<string, MobileOperator> = {
    '84': 'Vodacom',
    '85': 'Vodacom',
    '82': 'Tmcel',
    '83': 'Tmcel',
    '86': 'Movitel',
    '87': 'Movitel',
    '88': 'Movitel',
  };

  return operators[prefix] ?? null;
}

/**
 * Identifica a carteira móvel (Mobile Wallet) associada ao número moçambicano.
 */
export function getMobileWallet(phone: string): MobileWallet | null {
  const operator = getMobileOperator(phone);
  if (!operator) return null;

  const wallets: Record<MobileOperator, MobileWallet> = {
    Vodacom: 'M-Pesa',
    Tmcel: 'mKesh',
    Movitel: 'e-Mola',
  };

  return wallets[operator] ?? null;
}

/**
 * Gera um link de contacto direto para o WhatsApp com mensagem opcional pré-formatada.
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  if (typeof phone !== 'string') {
    throw new Error(`Número de telefone inválido: ${phone}`);
  }

  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  const international = cleaned.startsWith('258') ? cleaned : `258${cleaned}`;
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${international}${encodedMessage}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// IDENTIFICAÇÃO CIVIL E FISCAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valida o NUIT (Número Único de Identificação Tributária) de Moçambique.
 *
 * Regras da Autoridade Tributária (AT):
 * - Composto por 9 dígitos numéricos.
 * - Primeiro dígito: 1 a 9 (Classificação da Entidade).
 * - Nono dígito: Dígito de Controlo calculado pelo algoritmo oficial Módulo 11
 *   com pesos fixos [8, 9, 4, 5, 6, 7, 8, 9] e tabela de substituição "01234567891".
 */
export function isValidNUIT(nuit: string | number): boolean {
  if (nuit === null || nuit === undefined) return false;
  if (typeof nuit !== 'string' && typeof nuit !== 'number') return false;

  const cleaned = String(nuit).replace(/\D/g, '');

  if (cleaned.length !== 9) return false;
  if (/^(\d)\1{8}$/.test(cleaned)) return false;

  // O primeiro dígito deve estar entre 1 e 9
  if (!/^[1-9]/.test(cleaned)) return false;

  // Validação do Dígito de Controlo (Módulo 11 da AT Moçambique)
  const weights = [8, 9, 4, 5, 6, 7, 8, 9];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * weights[i];
  }

  const checkIdx = sum % 11;
  const checkMap = '01234567891';

  return cleaned.charAt(8) === checkMap[checkIdx];
}

/**
 * Formata um NUIT válido no padrão de 3 blocos (ex: "400 000 008").
 */
export function formatNUIT(nuit: string | number): string {
  if (nuit === null || nuit === undefined) {
    throw new Error(`NUIT inválido: ${nuit}`);
  }

  const cleaned = String(nuit).replace(/\D/g, '');
  if (!isValidNUIT(cleaned)) {
    throw new Error(`NUIT inválido: ${nuit}`);
  }

  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
}

/**
 * Classifica a natureza da entidade com base no primeiro dígito do NUIT.
 */
export function getNUITEntityType(nuit: string | number): NUITEntityType | null {
  if (nuit === null || nuit === undefined) return null;
  const cleaned = String(nuit).replace(/\D/g, '');
  if (!isValidNUIT(cleaned)) return null;

  const firstDigit = cleaned.charAt(0);
  const types: Record<string, NUITEntityType> = {
    '1': 'Pessoas Singulares',
    '2': 'Pessoas Singulares',
    '3': 'Pessoas Singulares',
    '4': 'Pessoas Colectivas',
    '5': 'Pessoas Colectivas',
    '6': 'Entidades Equiparadas',
    '7': 'Estado / Públicas',
    '8': 'Outras Entidades',
    '9': 'Entidades Estrangeiras',
  };

  return types[firstDigit] ?? null;
}

/**
 * Valida o Bilhete de Identidade (B.I.) moçambicano.
 * Padrão oficial: 12 dígitos seguidos de 1 letra maiúscula (ex: 110101234567A).
 */
export function isValidBI(bi: string): boolean {
  if (typeof bi !== 'string') return false;
  const cleaned = bi.replace(/[\s\-]/g, '').toUpperCase();
  return /^\d{12}[A-Z]$/.test(cleaned);
}

/**
 * Valida o DIRE (Documento de Identificação de Residente Estrangeiro).
 * Suporta o formato moderno do SENAMI (9 dígitos + 1 letra) e formatos legados.
 */
export function isValidDIRE(dire: string): boolean {
  if (typeof dire !== 'string') return false;
  const cleaned = dire.replace(/[\s\-]/g, '').toUpperCase();
  return /^(?:\d{8}[A-Z]|\d{2}[A-Z]\d{8}[A-Z0-9]|\d{9}[A-Z])$/.test(cleaned);
}

/**
 * Valida o Passaporte moçambicano.
 * Padrão oficial: Exatamente 2 letras seguidas de 7 dígitos numéricos (ex: AO1234567).
 */
export function isValidPassport(passport: string): boolean {
  if (typeof passport !== 'string') return false;
  const cleaned = passport.replace(/[\s\-]/g, '').toUpperCase();
  return /^[A-Z]{2}\d{7}$/.test(cleaned);
}

/**
 * Valida a Carta de Condução moçambicana.
 * Suporta o formato biométrico INATRO (2 letras + 7 dígitos) e modelos anteriores.
 */
export function isValidDrivingLicense(license: string): boolean {
  if (typeof license !== 'string') return false;
  const cleaned = license.replace(/[\s\-]/g, '').toUpperCase();
  return /^(?:[A-Z]\d{5,7}|\d{12}[A-Z]|[A-Z]{2}\d{7})$/.test(cleaned);
}

// ─────────────────────────────────────────────────────────────────────────────
// VALORES MONETÁRIOS (MZN / MT)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formata um valor monetário em Meticais de acordo com o padrão oficial de Moçambique.
 * Separador de milhares: espaço; separador decimal: vírgula; símbolo após o valor.
 *
 * @param value - Valor numérico a formatar
 * @param currency - 'MT' para padrão nacional ou 'MZN' para ISO 4217
 * @returns String formatada (ex: "1 500,00 MT")
 */
export function formatMZN(value: number, currency: 'MT' | 'MZN' = 'MT'): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Valor monetário inválido: ${value}`);
  }

  const formattedNumber = new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);

  const cleanFormatted = formattedNumber.replace(/\u00A0|\u202F/g, ' ');
  return `${cleanFormatted} ${currency}`;
}

/**
 * Converte uma representação textual de valor monetário em número float.
 * Aceita entradas como "1.500,00 MT", "1 500,00MZN", "1,500.00", etc.
 */
export function parseMZN(value: string): number | null {
  if (typeof value !== 'string') return null;

  let clean = value.replace(/[^\d.,\-]/g, '');
  if (!clean || clean === '-') return null;

  const lastComma = clean.lastIndexOf(',');
  const lastDot = clean.lastIndexOf('.');

  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
  } else if (lastComma > -1) {
    const parts = clean.split(',');
    if (parts.length === 2 && parts[1].length !== 3) {
      clean = clean.replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
  } else if (lastDot > -1) {
    const parts = clean.split('.');
    if (parts.length === 2 && parts[1].length === 3) {
      clean = clean.replace('.', '');
    } else if (parts.length > 2) {
      clean = clean.replace(/\./g, '');
    }
  }

  const result = parseFloat(clean);
  return isNaN(result) ? null : result;
}

// ─────────────────────────────────────────────────────────────────────────────
// DIVISÃO ADMINISTRATIVA TERRITORIAL (PROVÍNCIAS E DISTRITOS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normaliza um texto para buscas tolerantes a acentuação e maiúsculas.
 */
function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Retorna a lista oficial de províncias de Moçambique e seus respectivos distritos.
 */
export function getMozambiqueProvinces() {
  return mozambiqueProvinces;
}

/**
 * Retorna os nomes dos distritos de uma dada província moçambicana.
 * Aceita identificador flexível: ID ('mpp', 'mpc', 'cab'), Sigla ('MPT', 'MC', 'CBD')
 * ou nome completo ('Maputo', 'Nampula', 'Cabo Delgado', tolerante a acentos e caixa).
 *
 * @param provinceIdentifier - ID, sigla ou nome da província
 * @returns Lista de nomes dos distritos
 */
export function getDistrictsByProvince(provinceIdentifier: string): string[] {
  if (typeof provinceIdentifier !== 'string') {
    throw new Error(`Província inválida: ${provinceIdentifier}`);
  }

  const norm = normalizeSearchText(provinceIdentifier);
  if (!norm) {
    throw new Error(`Província inválida: ${provinceIdentifier}`);
  }

  // 1. Casos específicos para Maputo Província vs Maputo Cidade
  if (
    norm === 'maputo' ||
    norm === 'maputo provincia' ||
    norm === 'provincia de maputo' ||
    norm === 'mpp' ||
    norm === 'mpt'
  ) {
    const prov = mozambiqueProvinces.find(p => p.id === 'mpp');
    if (prov) return prov.districts.map(d => d.name);
  }

  if (
    norm === 'maputo cidade' ||
    norm === 'cidade de maputo' ||
    norm === 'maputo (cidade)' ||
    norm === 'mpc' ||
    norm === 'mc'
  ) {
    const prov = mozambiqueProvinces.find(p => p.id === 'mpc');
    if (prov) return prov.districts.map(d => d.name);
  }

  // 2. Busca exata por ID ou Sigla
  let matched = mozambiqueProvinces.find(
    p => p.id.toLowerCase() === norm || p.sigla.toLowerCase() === norm
  );

  // 3. Busca por nome normalizado (tolerante a diacríticos e parênteses)
  if (!matched) {
    matched = mozambiqueProvinces.find(p => {
      const pNorm = normalizeSearchText(p.name);
      if (pNorm === norm) return true;
      const stripped = normalizeSearchText(p.name.replace(/\s*\([^)]*\)/g, ''));
      return stripped === norm;
    });
  }

  if (!matched) {
    throw new Error(`Província inválida: ${provinceIdentifier}`);
  }

  return matched.districts.map(d => d.name);
}

/**
 * Retorna uma lista plana de todos os 161 distritos oficiais de Moçambique.
 */
export function getAllDistricts(): District[] {
  const list: District[] = [];
  for (const province of mozambiqueProvinces) {
    for (const district of province.districts) {
      list.push({
        name: district.name,
        provinceId: province.id,
        administrative_posts: district.administrative_posts,
        neighborhoods: district.neighborhoods,
      });
    }
  }
  return list;
}

// ─────────────────────────────────────────────────────────────────────────────
// SANEAMENTO E VALIDAÇÃO DE NOMES E DOCUMENTOS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Conjunto de partículas de ligação da língua portuguesa que devem permanecer em minúsculas
 * ao formatar nomes pessoais em Title Case.
 */
const LOWERCASE_PARTICLES = new Set(['de', 'da', 'do', 'dos', 'das', 'e']);

/**
 * Verifica se uma string representa um nome pessoal válido.
 * Requer ao menos 2 caracteres alfabéticos Unicode e rejeita caracteres inválidos ou símbolos isolados.
 */
export function isValidName(name: string): boolean {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (!trimmed) return false;

  // Apenas letras Unicode, espaços, apóstrofos e hífens
  if (!/^[\p{L}\s'\-]+$/u.test(trimmed)) return false;

  // Exigir pelo menos 2 caracteres alfabéticos
  const letterCount = (trimmed.match(/\p{L}/gu) || []).length;
  return letterCount >= 2;
}

/**
 * Saneia um campo de nome pessoal, convertendo para Title Case por padrão
 * ou para caixa alta completa se especificado `{ allCaps: true }`.
 * Preserva partículas de ligação em minúsculas ('de', 'da', 'do', 'dos', 'das', 'e').
 *
 * @param name - O nome a ser saneado
 * @param options.allCaps - Se verdadeiro, formata tudo em LETRAS MAIÚSCULAS
 * @returns Nome saneado
 */
export function sanitizeName(name: string, options?: { allCaps?: boolean }): string {
  if (typeof name !== 'string') return '';

  // Remove qualquer caractere que não seja letra, espaço, hífen ou apóstrofo
  const cleaned = name.replace(/[^\p{L}\s'\-]/gu, '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';

  if (options?.allCaps) {
    return cleaned.toUpperCase();
  }

  // Converte primeiro para minúsculas para corrigir entradas em caixa alta prévia
  const lower = cleaned.toLowerCase();
  const words = lower.split(' ');

  const capitalizedWords = words.map((word, index) => {
    if (!word) return '';

    // Se não for a primeira palavra e for uma partícula de ligação, mantém em minúsculas
    if (index > 0 && LOWERCASE_PARTICLES.has(word)) {
      return word;
    }

    // Capitaliza a primeira letra e letras após hífen ou apóstrofo
    return word.replace(/(^|[\s\-'])([\p{L}])/gu, (_, sep, letter) => sep + letter.toUpperCase());
  });

  return capitalizedWords.join(' ');
}

/**
 * Saneia um campo de documento puramente numérico, removendo qualquer caractere não dígito.
 */
export function sanitizeDocumentField(value: string): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\D/g, '');
}

/**
 * Saneia um campo de documento alfanumérico, removendo caracteres especiais e forçando MAIÚSCULAS.
 */
export function sanitizeAlphanumericField(value: string): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// CÓDIGOS POSTAIS (LEGADOS E NOVOS CEPS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valida se um código postal legado moçambicano de 4 dígitos existe na base histórica.
 */
export function isValidPostalCode(code: string): boolean {
  if (typeof code !== 'string') return false;
  const trimmed = code.trim();
  if (!/^[\d\s\-]+$/.test(trimmed)) return false;
  const cleaned = trimmed.replace(/\D/g, '');
  return cleaned.length === 4 && Object.prototype.hasOwnProperty.call(legacyPostalCodes, cleaned);
}

/**
 * Retorna a localidade correspondente a um código postal legado de Moçambique.
 */
export function getPostalCodeLocality(code: string): string | null {
  if (!isValidPostalCode(code)) return null;
  const cleaned = code.replace(/\D/g, '');
  return legacyPostalCodes[cleaned]?.locality ?? null;
}

/**
 * Retorna a província correspondente a um código postal legado de Moçambique.
 */
export function getPostalCodeProvince(code: string): string | null {
  if (!isValidPostalCode(code)) return null;
  const cleaned = code.replace(/\D/g, '');
  return legacyPostalCodes[cleaned]?.province ?? null;
}

/**
 * Valida o formato estrutural do Novo CEP de Moçambique (XXXX-XX).
 */
export function isValidNewCEP(cep: string): boolean {
  if (typeof cep !== 'string') return false;
  return /^\d{4}-\d{2}$/.test(cep.trim());
}

/**
 * Sugere uma lista de Novos CEPs com base no termo de busca fornecido.
 * Suporta busca por CEP novo, código postal legado ou nome da localidade/distrito.
 */
export function suggestCEPs(input: string): CEPInfo[] {
  if (typeof input !== 'string') return [];

  const cleaned = input.trim();
  const lowerCleaned = normalizeSearchText(cleaned);
  if (!lowerCleaned) return [];

  // 1. Se já for formato de novo CEP completo
  if (isValidNewCEP(cleaned)) {
    return newCEPData.filter(c => c.cep === cleaned);
  }

  // 2. Se for código legado (4 dígitos)
  if (isValidPostalCode(cleaned)) {
    const digits = cleaned.replace(/\D/g, '');
    const prefixes = legacyToNewCEPPrefix[digits];
    if (prefixes && prefixes.length > 0) {
      return newCEPData.filter(c => prefixes.some(prefix => c.cep.startsWith(prefix)));
    }
  }

  // 3. Pesquisa textual por localidade, distrito ou província
  if (lowerCleaned.length >= 2) {
    const matches = newCEPData.filter(c => {
      const loc = normalizeSearchText(c.locality);
      const dist = normalizeSearchText(c.district);
      const prov = normalizeSearchText(c.province);
      return loc.includes(lowerCleaned) || dist.includes(lowerCleaned) || prov.includes(lowerCleaned);
    });

    if (matches.length > 0) {
      return matches;
    }
  }

  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// SISTEMA BANCÁRIO DE MOÇAMBIQUE (NIB & IBAN)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Catálogo oficial dos 18 bancos comerciais e instituições reguladas pelo Banco de Moçambique.
 */
export const MOZAMBIQUE_BANKS: Record<string, BankInfo> = {
  '0001': { code: '0001', name: 'Banco Internacional de Moçambique', shortName: 'Millennium BIM' },
  '0003': { code: '0003', name: 'Standard Bank Moçambique', shortName: 'Standard Bank' },
  '0006': { code: '0006', name: 'Absa Bank Moçambique', shortName: 'Absa' },
  '0007': { code: '0007', name: 'Nedbank Moçambique', shortName: 'Nedbank' },
  '0008': { code: '0008', name: 'Banco Comercial e de Investimentos', shortName: 'BCI' },
  '0014': { code: '0014', name: 'First National Bank Moçambique', shortName: 'FNB' },
  '0016': { code: '0016', name: 'Moza Banco', shortName: 'Moza Banco' },
  '0021': { code: '0021', name: 'Access Bank Moçambique', shortName: 'Access Bank' },
  '0024': { code: '0024', name: 'Ecobank Moçambique', shortName: 'Ecobank' },
  '0025': { code: '0025', name: 'Banco Nacional de Investimento', shortName: 'BNI' },
  '0030': { code: '0030', name: 'Société Générale Moçambique', shortName: 'Société Générale' },
  '0034': { code: '0034', name: 'Moza Banco', shortName: 'Moza Banco' },
  '0038': { code: '0038', name: 'First Capital Bank Moçambique', shortName: 'First Capital Bank' },
  '0041': { code: '0041', name: 'Banco Letshego', shortName: 'Letshego' },
  '0043': { code: '0043', name: 'First Capital Bank Moçambique', shortName: 'First Capital Bank' },
  '0044': { code: '0044', name: 'MyBucks Banking Corporation', shortName: 'MyBucks' },
  '0045': { code: '0045', name: 'Banco de Desenvolvimento de Moçambique', shortName: 'BDM' },
  '0048': { code: '0048', name: 'Banco Mais', shortName: 'Banco Mais' },
  '0050': { code: '0050', name: 'Standard Chartered Bank Moçambique', shortName: 'Standard Chartered' },
  '0052': { code: '0052', name: 'Banco Big Moçambique', shortName: 'Banco Big' },
  '0056': { code: '0056', name: 'Banco Letshego', shortName: 'Letshego' },
  '0057': { code: '0057', name: 'Banco Nacional de Investimento', shortName: 'BNI' },
};

/**
 * Valida o NIB (Número de Identificação Bancária) de Moçambique.
 *
 * Estrutura do NIB moçambicano (21 dígitos):
 * - 4 dígitos: Código da instituição bancária
 * - 4 dígitos: Balcão / Agência
 * - 11 dígitos: Número de conta bancária
 * - 2 dígitos: Dígitos de controlo calculados pelo algoritmo ISO 7064 Módulo 97-10.
 */
export function isValidNIB(nib: string): boolean {
  if (typeof nib !== 'string') return false;

  const cleaned = nib.replace(/\D/g, '');
  if (cleaned.length !== 21) return false;

  const bankCode = cleaned.slice(0, 4);
  if (!Object.prototype.hasOwnProperty.call(MOZAMBIQUE_BANKS, bankCode)) {
    return false;
  }

  // Validação algorítmica ISO 7064 MOD 97-10
  // Para qualquer NIB válido: BigInt(nib) % 97n === 1n
  try {
    return BigInt(cleaned) % 97n === 1n;
  } catch {
    return false;
  }
}

/**
 * Formata um NIB moçambicano em 4 blocos padronizados.
 * Exemplo: "0001 0000 12345678901 23" ou com ponto "0001.0000.12345678901.23".
 *
 * @param nib - O NIB a formatar
 * @param separator - Separador entre os blocos (padrão: espaço ' ')
 * @returns NIB formatado
 */
export function formatNIB(nib: string, separator: '.' | ' ' = ' '): string {
  if (typeof nib !== 'string') {
    throw new Error(`NIB moçambicano inválido: ${nib}`);
  }

  const cleaned = nib.replace(/\D/g, '');
  if (!isValidNIB(cleaned)) {
    throw new Error(`NIB moçambicano inválido: ${nib}`);
  }

  const bank = cleaned.slice(0, 4);
  const branch = cleaned.slice(4, 8);
  const account = cleaned.slice(8, 19);
  const check = cleaned.slice(19, 21);

  return `${bank}${separator}${branch}${separator}${account}${separator}${check}`;
}

/**
 * Retorna os dados cadastrais da instituição bancária a partir de um NIB.
 */
export function getBankFromNIB(nib: string): BankInfo | null {
  if (typeof nib !== 'string') return null;

  const cleaned = nib.replace(/\D/g, '');
  if (cleaned.length < 4) return null;

  const bankCode = cleaned.slice(0, 4);
  return MOZAMBIQUE_BANKS[bankCode] ?? null;
}

/**
 * Alias de conveniência para paridade entre ecossistemas.
 */
export const getBankByNIB = getBankFromNIB;

/**
 * Converte um NIB válido no IBAN oficial de Moçambique.
 * Moçambique adota o padrão internacional ISO 13616: "MZ59" + 21 dígitos do NIB.
 */
export function nibToIBAN(nib: string): string {
  if (typeof nib !== 'string') {
    throw new Error(`NIB moçambicano inválido: ${nib}`);
  }

  const cleaned = nib.replace(/\D/g, '');
  if (!isValidNIB(cleaned)) {
    throw new Error(`NIB moçambicano inválido: ${nib}`);
  }

  return `MZ59${cleaned}`;
}

/**
 * Valida o IBAN oficial de Moçambique (25 caracteres: MZ59 seguido de 21 dígitos de NIB válido).
 */
export function isValidIBAN(iban: string): boolean {
  if (typeof iban !== 'string') return false;

  const cleaned = iban.replace(/[\s\-]/g, '').toUpperCase();
  if (cleaned.length !== 25) return false;
  if (!cleaned.startsWith('MZ59')) return false;

  const nibPart = cleaned.slice(4);
  return isValidNIB(nibPart);
}

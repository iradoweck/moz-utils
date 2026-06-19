/**
 * moz-utils
 *
 * Utility functions for Mozambique.
 * Validation of NUIT, BI, documents, and phone formatting.
 *
 * @license AGPL-3.0-or-later
 */

/**
 * Validates a Mozambican phone number.
 * Accepts formats: 84XXXXXXX, +258 84XXXXXXX, 258-84-XXX-XXXX, etc.
 * Valid operators: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
 */
export function isValidMozambicanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned
  return /^8[2-8]\d{7}$/.test(withoutCountryCode)
}

/**
 * Formats a Mozambican phone number to the international standard.
 * E.g.: "841234567" → "+258 84 123 4567"
 */
export function formatMozambicanPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned

  if (!isValidMozambicanPhone(withoutCountryCode)) {
    throw new Error(`Invalid phone number: ${phone}`)
  }

  const prefix = withoutCountryCode.slice(0, 2)
  const part1 = withoutCountryCode.slice(2, 5)
  const part2 = withoutCountryCode.slice(5)

  return `+258 ${prefix} ${part1} ${part2}`
}

/**
 * Identifies the operator of a Mozambican phone number.
 */
export function getMobileOperator(phone: string): 'Vodacom' | 'Tmcel' | 'Movitel' | null {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned

  if (!isValidMozambicanPhone(withoutCountryCode)) return null

  const prefix = withoutCountryCode.slice(0, 2)
  const operators: Record<string, 'Vodacom' | 'Tmcel' | 'Movitel'> = {
    '84': 'Vodacom',
    '85': 'Vodacom',
    '82': 'Tmcel',
    '83': 'Tmcel',
    '86': 'Movitel',
    '87': 'Movitel',
    '88': 'Movitel',
  }

  return operators[prefix] ?? null
}

/**
 * Identifica a carteira móvel (Mobile Wallet) associada a um número moçambicano.
 */
export function getMobileWallet(phone: string): 'M-Pesa' | 'mKesh' | 'e-Mola' | null {
  const operator = getMobileOperator(phone);
  if (!operator) return null;
  
  const wallets: Record<string, 'M-Pesa' | 'mKesh' | 'e-Mola'> = {
    'Vodacom': 'M-Pesa',
    'Tmcel': 'mKesh',
    'Movitel': 'e-Mola'
  };
  
  return wallets[operator] ?? null;
}

/**
 * Valida o NUIT (Número Único de Identificação Tributária) de Moçambique.
 * 
 * Regras da AT (Autoridade Tributária):
 * - Composed of 9 digits.
 * - Primeiro dígito: 1 a 5 (Classificação da Entidade).
 * - Nono dígito: Dígito de Controlo (Módulo 11).
 */
export function isValidNUIT(nuit: string | number): boolean {
  const cleaned = String(nuit).replace(/\D/g, '')

  if (cleaned.length !== 9) return false
  if (/^(\d)\1{8}$/.test(cleaned)) return false

  // Validação do Primeiro Dígito (1 a 9)
  if (!/^[1-9]/.test(cleaned)) return false

  // Validação do Dígito de Controlo (Módulo 11) - Algoritmo Moçambicano (Pesos: 8, 9, 4, 5, 6, 7, 8, 9)
  const weights = [8, 9, 4, 5, 6, 7, 8, 9]
  let sum = 0
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * weights[i]
  }

  const checkIdx = sum % 11
  const checkMap = "01234567891"
  
  return cleaned.charAt(8) === checkMap[checkIdx]
}

/**
 * Classifies the entity type based on the first digit of the NUIT.
 * - 1 or 2: Singular Persons
 * - 3: Equivalent Entities
 * - 4: Collective Persons
 * - 5: Public Organisms
 */
export function getNUITEntityType(nuit: string | number): string | null {
  const cleaned = String(nuit).replace(/\D/g, '')
  if (!isValidNUIT(cleaned)) return null

  const firstDigit = cleaned.charAt(0)
  const types: Record<string, string> = {
    '1': 'Pessoas Singulares',
    '2': 'Pessoas Singulares',
    '3': 'Pessoas Singulares',
    '4': 'Pessoas Colectivas',
    '5': 'Pessoas Colectivas',
    '6': 'Entidades Equiparadas',
    '7': 'Estado / Públicas',
    '8': 'Outras Entidades',
    '9': 'Entidades Estrangeiras'
  }

  return types[firstDigit] ?? null
}

/**
 * Validates the Mozambican National ID (BI).
 * Standard format: 12 digits followed by 1 letter (E.g.: 110101234567A)
 */
export function isValidBI(bi: string): boolean {
  const cleaned = bi.replace(/[\s\-]/g, '').toUpperCase()
  return /^\d{12}[A-Z]$/.test(cleaned)
}

/**
 * Validates the Mozambican DIRE (Documento de Identificação de Residente Estrangeiro).
 * Supports the modern SENAMI format (9 digits + 1 letter, e.g., 120345678A)
 * as well as legacy formats (e.g., 00008312C or 12C00008312C).
 */
export function isValidDIRE(dire: string): boolean {
  const cleaned = dire.replace(/[\s\-]/g, '').toUpperCase();
  return /^(?:\d{8}[A-Z]|\d{2}[A-Z]\d{8}[A-Z0-9]|\d{9}[A-Z])$/.test(cleaned);
}

/**
 * Validates the Mozambican Passport.
 * Official format: Exactly 2 letters followed by 7 numeric digits (E.g.: AO1234567).
 */
export function isValidPassport(passport: string): boolean {
  const cleaned = passport.replace(/[\s\-]/g, '').toUpperCase();
  return /^[A-Z]{2}\d{7}$/.test(cleaned);
}

/**
 * Validates the Mozambican Driving License (Carta de Condução).
 * Supports the modern INATRO biometric format (2 letters + 7 digits, e.g., MP1234567)
 * as well as legacy formats (e.g., M123456).
 */
export function isValidDrivingLicense(license: string): boolean {
  const cleaned = license.replace(/[\s\-]/g, '').toUpperCase();
  return /^(?:[A-Z]\d{5,7}|\d{12}[A-Z]|[A-Z]{2}\d{7})$/.test(cleaned);
}

/**
 * Formats a monetary value in Meticais following the official standard of Mozambique.
 *
 * Padrão oficial (SI + AT):
 * - Thousands separator: space ( )
 * - Decimal separator: comma (,)
 * - Symbol after the value, separated by a space
 *
 * @param value - Numeric value to format
 * @param currency - 'MT' para uso nacional (padrão) ou 'MZN' para uso internacional (ISO 4217)
 * @returns Formatted value (ex: "1 500,00 MT")
 *
 * @example
 * formatMZN(1500)           // "1 500,00 MT"
 * formatMZN(1500, 'MZN')   // "1 500,00 MZN"
 * formatMZN(0.5)            // "0,50 MT"
 */
export function formatMZN(value: number, currency: 'MT' | 'MZN' = 'MT'): string {
  // Format to standard: "1 500,00 MT"
  const formattedNumber = new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value)

  // O Intl no JS substitui às vezes o grouping separator por No-Break Space ou espaço regular.
  // Vamos assegurar que é um espaço regular para evitar problemas de comparação em alguns testes.
  const cleanFormatted = formattedNumber.replace(/\u00A0|\u202F/g, ' ')
  
  return `${cleanFormatted} ${currency}`
}

/**
 * Parses a Mozambican currency string into a raw float number for the database.
 * Handles inputs like "1.500,00 MT", "1 500,00MZN", "1,500.00", etc.
 *
 * @param value The dirty currency string
 * @returns The parsed float number, or null if invalid
 */
export function parseMZN(value: string): number | null {
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

/**
 * Generates a WhatsApp contact URL with a pre-formatted message.
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const international = cleaned.startsWith('258') ? cleaned : `258${cleaned}`
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${international}${encodedMessage}`
}

/**
 * Official list of Mozambique Provinces and their districts.
 * Fonte: Divisão administrativa oficial da República de Moçambique.
 * Inclui sigla oficial de cada província.
 */
import { mozambiqueProvinces, District } from './data/provinces.js';
export { mozambiqueProvinces, District };

/**
 * Returns the list of districts belonging to a given province.
 * @param provinceId - O identificador da província (ex: 'cab', 'npl', 'mpc')
 */
export function getDistrictsByProvince(provinceId: string): string[] {
  const province = mozambiqueProvinces.find(p => p.id === provinceId.trim().toLowerCase());
  if (!province) {
    throw new Error(`Província inválida: ${provinceId}`);
  }
  return province.districts.map(d => d.name);
}

/**
 * Returns a flat list of all 161 districts and their respective province IDs.
 */
export function getAllDistricts(): District[] {
  const list: District[] = [];
  for (const province of mozambiqueProvinces) {
    for (const district of province.districts) {
      list.push({
        name: district.name,
        provinceId: province.id,
        administrative_posts: district.administrative_posts,
        neighborhoods: district.neighborhoods
      });
    }
  }
  return list;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAME & DOCUMENT FIELD SANITIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks whether a string is a valid personal name.
 * Accepts letters (including accented), spaces, hyphens, and apostrophes.
 * Rejects digits and most special characters.
 *
 * @example
 * isValidName('Formiga Antonio') // true
 * isValidName('João O\'Brian')       // true
 * isValidName('Jean-Pierre')         // true
 * isValidName('ABC123')              // false
 */
export function isValidName(name: string): boolean {
  return /^[\p{L}\s'\-]+$/u.test(name.trim())
}

/**
 * Sanitizes a personal name field.
 *
 * By default converts to Title Case (each word starts with a capital letter).
 * Pass `{ allCaps: true }` to force ALL UPPERCASE.
 *
 * Strips digits and most special characters, keeping only letters,
 * spaces, hyphens, and apostrophes.
 *
 * @param name - The raw name string to sanitize
 * @param options.allCaps - If true, returns the name in ALL UPPERCASE
 * @returns Sanitized name string
 *
 * @example
 * sanitizeName('  formiga   antonio  ')         // 'Formiga Antonio'
 * sanitizeName('JOÃO o\'BRIAN', { allCaps: true })  // 'JOÃO O\'BRIAN'
 * sanitizeName('jean-pierre dupont')                 // 'Jean-Pierre Dupont'
 */
export function sanitizeName(name: string, options?: { allCaps?: boolean }): string {
  // Remove anything that is not a letter, space, hyphen, or apostrophe
  const cleaned = name.replace(/[^\p{L}\s'\-]/gu, '').replace(/\s+/g, ' ').trim()

  if (options?.allCaps) {
    return cleaned.toUpperCase()
  }

  // Title Case: capitalise first letter of each word (including after hyphens)
  return cleaned.replace(/(^|[\s\-])([\p{L}])/gu, (_, sep, letter) => sep + letter.toUpperCase())
}

/**
 * Sanitizes a document number field that contains only digits.
 * Strips all non-numeric characters.
 *
 * Useful for NUIT, BI number part, phone numbers before validation, etc.
 *
 * @example
 * sanitizeDocumentField('123 456 789')   // '123456789'
 * sanitizeDocumentField('123-456-789')   // '123456789'
 * sanitizeDocumentField(' 4 0 0 ')       // '400'
 */
export function sanitizeDocumentField(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Sanitizes an alphanumeric document field (digits + letters), forcing
 * all letters to UPPERCASE.
 *
 * Useful for BI (e.g. '110101234567a' → '110101234567A'),
 * passports, and other mixed-format documents.
 *
 * @example
 * sanitizeAlphanumericField('110 101 234567a')  // '110101234567A'
 * sanitizeAlphanumericField('abc-123-XYZ!')     // 'ABC123XYZ'
 */
export function sanitizeAlphanumericField(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

/**
 * Mapa de Códigos Postais Legados de Moçambique.
 */
import { legacyPostalCodes, legacyToNewCEPPrefix } from './data/postalCodes.js';
export { legacyPostalCodes, legacyToNewCEPPrefix };

/**
 * Valida se um código postal legado de Moçambique é válido.
 * Deve conter 4 dígitos numéricos pertencentes ao sistema clássico dos Correios de Moçambique.
 */
export function isValidPostalCode(code: string): boolean {
  const cleaned = code.replace(/\D/g, '')
  return cleaned in legacyPostalCodes
}

/**
 * Retorna a localidade correspondente a um código postal legado de Moçambique.
 */
export function getPostalCodeLocality(code: string): string | null {
  const cleaned = code.replace(/\D/g, '')
  return legacyPostalCodes[cleaned]?.locality ?? null
}

/**
 * Retorna a província correspondente a um código postal legado de Moçambique.
 */
export function getPostalCodeProvince(code: string): string | null {
  const cleaned = code.replace(/\D/g, '')
  return legacyPostalCodes[cleaned]?.province ?? null
}

// ─────────────────────────────────────────────────────────────────────────────
// NOVO SISTEMA DE CÓDIGO DE ENDEREÇAMENTO POSTAL (CEP)
// ─────────────────────────────────────────────────────────────────────────────

export interface CEPInfo {
  cep: string;
  province: string;
  district: string;
  locality: string; // Administrative Post or Neighborhood
}

import { newCEPData } from './cep_data.js';
export { newCEPData };

/**
 * Mapping of Legacy Codes to District prefixes in the New CEP.
 * Example: 3100 (Nampula ECP) -> '0909' (Nampula district prefix in the new system)
 */
/**
 * Valida o formato do Novo CEP (Formato: XXXX-XX)
 */
export function isValidNewCEP(cep: string): boolean {
  return /^\d{4}-\d{2}$/.test(cep.trim());
}

/**
 * Sugere uma lista de Novos CEPs baseados no input do utilizador.
 * Funcionalidade:
 * - Se o input for um código legado (ex: "3100"), retorna todos os novos CEPs equivalentes.
 * - Se for um CEP novo parcial ou total, pode sugerir (neste ensaio valida a string inteira).
 */
export function suggestCEPs(input: string): CEPInfo[] {
  const cleaned = input.trim();
  const lowerCleaned = cleaned.toLowerCase();

  // 1. Se já for um formato de novo CEP, filtramos os que batem com o input
  if (isValidNewCEP(cleaned)) {
    return newCEPData.filter(c => c.cep === cleaned);
  }

  // 2. Se for um código legado (ex: 3100), sugerimos as divisões do novo CEP
  if (isValidPostalCode(cleaned)) {
    const prefixes = legacyToNewCEPPrefix[cleaned];
    if (prefixes && prefixes.length > 0) {
      return newCEPData.filter(c => prefixes.some(prefix => c.cep.startsWith(prefix)));
    }
  }

  // 3. Pesquisa por nome da localidade (ex: "Namutequeliua")
  if (lowerCleaned.length > 2) {
    const byLocality = newCEPData.filter(c => c.locality.toLowerCase().includes(lowerCleaned));
    if (byLocality.length > 0) {
      return byLocality;
    }
  }

  // 4. Caso não encontre correspondência
  return [];
}

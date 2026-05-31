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

  // Validação do Primeiro Dígito (1 a 5)
  if (!/^[1-5]/.test(cleaned)) return false

  // Validação do Dígito de Controlo (Módulo 11)
  let sum = 0
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * (9 - i)
  }

  const remainder = sum % 11
  const expectedDigit = remainder <= 1 ? 0 : 11 - remainder

  return parseInt(cleaned.charAt(8), 10) === expectedDigit
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
    '1': 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
    '2': 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
    '3': 'Equiparada (Heranças Jacentes, Consórcios)',
    '4': 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)',
    '5': 'Público (Instituições do Estado e Ministérios)'
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
 * formatMZN(1000000)        // "1 000 000,00 MT"
 */
export function formatMZN(value: number, currency: 'MT' | 'MZN' = 'MT'): string {
  const [integerPart, decimalPart] = Math.abs(value).toFixed(2).split('.')
  const sign = value < 0 ? '-' : ''

  // Group digits in blocks of 3 from right to left, separated by a space
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return `${sign}${formattedInteger},${decimalPart} ${currency}`
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
export const mozambiqueProvinces = [
  {
    id: 'cab',
    name: 'Cabo Delgado',
    region: 'Norte',
    sigla: 'CBD',
    districts: [
      { name: 'Ancuabe', administrative_posts: ['Ancuabe', 'Metoro', 'Meza'], neighborhoods: [] },
      { name: 'Balama', administrative_posts: ['Balama', 'Chapa', 'Kuekue', 'Mavala'], neighborhoods: [] },
      { name: 'Chiúre', administrative_posts: ['Chiúre', 'Chiúre-Velho', 'Katapua', 'Mazeze', 'Namogelia', 'Manoane'], neighborhoods: [] },
      { name: 'Ibo', administrative_posts: ['Ibo', 'Quirimba'], neighborhoods: [] },
      { name: 'Macomia', administrative_posts: ['Macomia', 'Chai', 'Mucojo', 'Quiterajo'], neighborhoods: [] },
      { name: 'Mecúfi', administrative_posts: ['Mecúfi', 'Murrébuè'], neighborhoods: [] },
      { name: 'Meluco', administrative_posts: ['Meluco', 'Muaguide'], neighborhoods: [] },
      { name: 'Metuge', administrative_posts: ['Metuge', 'Mieze'], neighborhoods: [] },
      { name: 'Mocímboa da Praia', administrative_posts: ['Mocímboa da Praia', 'Diaca', 'Mbau'], neighborhoods: [] },
      { name: 'Montepuez', administrative_posts: ['Montepuez', 'Mapupulo', 'Namanhumbir', 'Nairoto', 'Napaula'], neighborhoods: [] },
      { name: 'Mueda', administrative_posts: ['Mueda', 'Chapa', 'Imbuho', 'Negomano', 'N\'gapa'], neighborhoods: [] },
      { name: 'Muidumbe', administrative_posts: ['Muidumbe', 'Chitunda', 'Miteda'], neighborhoods: [] },
      { name: 'Namuno', administrative_posts: ['Namuno', 'Machoca', 'Meloco', 'Ncumpe', 'Luli'], neighborhoods: [] },
      { name: 'Nangade', administrative_posts: ['Nangade', 'Ntamba'], neighborhoods: [] },
      { name: 'Palma', administrative_posts: ['Palma', 'Olumbe', 'Quionga'], neighborhoods: [] },
      { 
        name: 'Pemba (Cidade)', 
        administrative_posts: ['Pemba'], 
        neighborhoods: ['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue'] 
      },
      { name: 'Quissanga', administrative_posts: ['Quissanga', 'Mahate', 'Bilibiza'], neighborhoods: [] }
    ]
  },
  {
    id: 'nia',
    name: 'Niassa',
    region: 'Norte',
    sigla: 'NS',
    districts: [
      { name: 'Chimbonila', administrative_posts: ['Chimbonila', 'Meponda'], neighborhoods: [] },
      { name: 'Cuamba', administrative_posts: ['Cuamba', 'Lúrio', 'Etatara'], neighborhoods: ['Ribaue', 'Mutxora', 'Ademo', 'Aeroporto'] },
      { name: 'Lago', administrative_posts: ['Metangula', 'Cobué', 'Luninho', 'Maniamba'], neighborhoods: [] },
      { 
        name: 'Lichinga (Cidade)', 
        administrative_posts: ['Lichinga'], 
        neighborhoods: ['Central', 'Popular', 'Chimba', 'Cerâmica', 'Ngaula', 'Sanjala', 'Chiuaula'] 
      },
      { name: 'Majune', administrative_posts: ['Majune', 'Mua', 'Nairrobi'], neighborhoods: [] },
      { name: 'Mandimba', administrative_posts: ['Mandimba', 'Mitande'], neighborhoods: [] },
      { name: 'Marrupa', administrative_posts: ['Marrupa', 'Marangira', 'Nungo'], neighborhoods: [] },
      { name: 'Maúa', administrative_posts: ['Maúa', 'Maiaca'], neighborhoods: [] },
      { name: 'Mavago', administrative_posts: ['Mavago', 'M\'saize'], neighborhoods: [] },
      { name: 'Mecanhelas', administrative_posts: ['Mecanhelas', 'Chiuta'], neighborhoods: [] },
      { name: 'Mecula', administrative_posts: ['Mecula', 'Matondovela'], neighborhoods: [] },
      { name: 'Metarica', administrative_posts: ['Metarica', 'Nacuanha'], neighborhoods: [] },
      { name: 'Muembe', administrative_posts: ['Muembe', 'Chiconono'], neighborhoods: [] },
      { name: "N'gauma", administrative_posts: ['Massangulo', 'Itepela'], neighborhoods: [] },
      { name: 'Nipepe', administrative_posts: ['Nipepe', 'Muatuca'], neighborhoods: [] },
      { name: 'Sanga', administrative_posts: ['Unango', 'Malamuila', 'Matchedje'], neighborhoods: [] }
    ]
  },
  {
    id: 'npl',
    name: 'Nampula',
    region: 'Norte',
    sigla: 'NPL',
    districts: [
      { name: 'Angoche', administrative_posts: ['Angoche', 'Aube', 'Namaponda'], neighborhoods: [] },
      { name: 'Eráti', administrative_posts: ['Namapa', 'Alua', 'Nakarari'], neighborhoods: [] },
      { name: 'Ilha de Moçambique', administrative_posts: ['Ilha de Moçambique', 'Lumbo'], neighborhoods: ['Museu', 'Litine', 'Areal', 'Marangonha'] },
      { name: 'Lalaua', administrative_posts: ['Lalaua', 'Meti'], neighborhoods: [] },
      { name: 'Larde', administrative_posts: ['Larde', 'Mucuali'], neighborhoods: [] },
      { name: 'Liúpo', administrative_posts: ['Liúpo', 'Quinga'], neighborhoods: [] },
      { name: 'Malema', administrative_posts: ['Malema', 'Chinga', 'Mutuali'], neighborhoods: [] },
      { name: 'Meconta', administrative_posts: ['Meconta', 'Corrane', 'Namialo'], neighborhoods: [] },
      { name: 'Mecubúri', administrative_posts: ['Mecubúri', 'Milhana', 'Muite', 'Namina'], neighborhoods: [] },
      { name: 'Memba', administrative_posts: ['Memba', 'Chipene', 'Mazua', 'Lurio'], neighborhoods: [] },
      { name: 'Mogincual', administrative_posts: ['Mogincual', 'Quixaxe'], neighborhoods: [] },
      { name: 'Mogovolas', administrative_posts: ['Nametil', 'Calipo', 'Ilute', 'Muatua'], neighborhoods: [] },
      { name: 'Moma', administrative_posts: ['Macone', 'Chalai', 'Lunga'], neighborhoods: [] },
      { name: 'Monapo', administrative_posts: ['Monapo', 'Itoculo', 'Netia'], neighborhoods: [] },
      { name: 'Mossuril', administrative_posts: ['Mossuril', 'Lunga', 'Matibane'], neighborhoods: [] },
      { name: 'Muecate', administrative_posts: ['Muecate', 'Imala', 'Muculuone'], neighborhoods: [] },
      { name: 'Murrupula', administrative_posts: ['Murrupula', 'Chinga', 'Nihessiue'], neighborhoods: [] },
      { name: 'Nacala-a-Velha', administrative_posts: ['Nacala-a-Velha', 'Covo'], neighborhoods: [] },
      { name: 'Nacala Porto', administrative_posts: ['Nacala Porto', 'Muanona'], neighborhoods: ['Mutiva', 'Triângulo', 'Ontupaia', 'Quissanga'] },
      { 
        name: 'Nampula (Cidade)', 
        administrative_posts: ['Urbano Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri'], 
        neighborhoods: ['Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri', 'Marrere', 'Namutequeliua'] 
      },
      { name: 'Nacarôa', administrative_posts: ['Nacarôa', 'Saua-Saua'], neighborhoods: [] },
      { name: 'Rapale', administrative_posts: ['Rapale', 'Anchilo', 'Mutivaze'], neighborhoods: [] },
      { name: 'Ribáuè', administrative_posts: ['Ribáuè', 'Cunle', 'Iapala'], neighborhoods: [] }
    ]
  },
  {
    id: 'zam',
    name: 'Zambézia',
    region: 'Centro',
    sigla: 'ZMB',
    districts: [
      { name: 'Alto Molócuè', administrative_posts: ['Alto Molócuè', 'Nauela'], neighborhoods: [] },
      { name: 'Chinde', administrative_posts: ['Chinde', 'Micaune'], neighborhoods: [] },
      { name: 'Derre', administrative_posts: ['Derre', 'Guerissa'], neighborhoods: [] },
      { name: 'Gilé', administrative_posts: ['Gilé', 'Alto Ligonha'], neighborhoods: [] },
      { name: 'Gurué', administrative_posts: ['Gurué', 'Lioma', 'Nepuíte'], neighborhoods: ['Bairro Central', 'Mucuapa', 'Nacuacue'] },
      { name: 'Ile', administrative_posts: ['Ile', 'Socone'], neighborhoods: [] },
      { name: 'Inhassunge', administrative_posts: ['Mucupia', 'Gonhane'], neighborhoods: [] },
      { name: 'Luabo', administrative_posts: ['Luabo', 'Chimbazo'], neighborhoods: [] },
      { name: 'Lugela', administrative_posts: ['Lugela', 'Tacuane', 'Munhamade'], neighborhoods: [] },
      { name: 'Maganja da Costa', administrative_posts: ['Maganja da Costa', 'Baleia'], neighborhoods: [] },
      { name: 'Milange', administrative_posts: ['Milange', 'Majaua', 'Mongue'], neighborhoods: [] },
      { name: 'Mocuba', administrative_posts: ['Mocuba', 'Mualama', 'Namanjavira'], neighborhoods: ['Central', 'Aeroporto', 'Paraíso'] },
      { name: 'Mocubela', administrative_posts: ['Mocubela', 'Bajone'], neighborhoods: [] },
      { name: 'Molumbo', administrative_posts: ['Molumbo', 'Corromana'], neighborhoods: [] },
      { name: 'Mopeia', administrative_posts: ['Mopeia', 'Campo'], neighborhoods: [] },
      { name: 'Morrumbala', administrative_posts: ['Morrumbala', 'Chire', 'Megaza'], neighborhoods: [] },
      { name: 'Mulevala', administrative_posts: ['Mulevala', 'Chirimane'], neighborhoods: [] },
      { name: 'Namacurra', administrative_posts: ['Namacurra', 'Macuse'], neighborhoods: [] },
      { name: 'Namarrói', administrative_posts: ['Namarrói', 'Regone'], neighborhoods: [] },
      { name: 'Nicoadala', administrative_posts: ['Nicoadala', 'Maquival'], neighborhoods: [] },
      { name: 'Pebane', administrative_posts: ['Pebane', 'Mulela', 'Naburi'], neighborhoods: [] },
      { 
        name: 'Quelimane (Cidade)', 
        administrative_posts: ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3', 'Urbano nº 4'], 
        neighborhoods: ['Central', 'Cementório', 'Inhassunge', 'Icidua', 'Chingo', 'Matacuane'] 
      }
    ]
  },
  {
    id: 'tet',
    name: 'Tete',
    region: 'Centro',
    sigla: 'TT',
    districts: [
      { name: 'Angónia', administrative_posts: ['Ulongue', 'Domue'], neighborhoods: [] },
      { name: 'Cahora-Bassa', administrative_posts: ['Songo', 'Chitima', 'Muxeza'], neighborhoods: [] },
      { name: 'Changara', administrative_posts: ['Luenha', 'Chioco', 'Mavago'], neighborhoods: [] },
      { name: 'Chifunde', administrative_posts: ['Chifunde', 'Mualadzi', 'Nsadzu'], neighborhoods: [] },
      { name: 'Chiuta', administrative_posts: ['Manje', 'Kazula'], neighborhoods: [] },
      { name: 'Dôa', administrative_posts: ['Dôa', 'Chueza'], neighborhoods: [] },
      { name: 'Macanga', administrative_posts: ['Furancungo', 'Chinde'], neighborhoods: [] },
      { name: 'Magoé', administrative_posts: ['Mpende', 'Chinthopo', 'Mukumbura'], neighborhoods: [] },
      { name: 'Marara', administrative_posts: ['Marara', 'M\'fuba'], neighborhoods: [] },
      { name: 'Marávia', administrative_posts: ['Fingoé', 'Chiputo', 'Molumbo'], neighborhoods: [] },
      { name: 'Moatize', administrative_posts: ['Moatize', 'Kambulatsitsi', 'Zóbuè'], neighborhoods: ['Bairro 25 de Setembro', 'Liberdade', 'Chithatha'] },
      { name: 'Mutarara', administrative_posts: ['Nhamayabué', 'Inhangoma'], neighborhoods: [] },
      { 
        name: 'Tete (Cidade)', 
        administrative_posts: ['Tete'], 
        neighborhoods: ['Chingo', 'Degue', 'Matundo', 'Mpadue', 'Josina Machel', 'Francisco Manyanga'] 
      },
      { name: 'Tsangano', administrative_posts: ['Tsangano', 'Ntengo-Wambuzi'], neighborhoods: [] },
      { name: 'Zumbo', administrative_posts: ['Zumbo', 'Muze', 'Zambue'], neighborhoods: [] }
    ]
  },
  {
    id: 'man',
    name: 'Manica',
    region: 'Centro',
    sigla: 'MN',
    districts: [
      { name: 'Bárue', administrative_posts: ['Catandica', 'Nhampassa', 'Chuala'], neighborhoods: [] },
      { 
        name: 'Chimoio (Cidade)', 
        administrative_posts: ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3'], 
        neighborhoods: ['Central', '7 de Setembro', 'Soalpo', 'Nandfe', 'Vila Nova', 'Cordor'] 
      },
      { name: 'Gondola', administrative_posts: ['Gondola', 'Cafumpe', 'Amatongas'], neighborhoods: [] },
      { name: 'Guro', administrative_posts: ['Guro', 'Mandie', 'Nhamassonge'], neighborhoods: [] },
      { name: 'Macate', administrative_posts: ['Macate', 'Marera'], neighborhoods: [] },
      { name: 'Machaze', administrative_posts: ['Machaze', 'Save'], neighborhoods: [] },
      { name: 'Macossa', administrative_posts: ['Macossa', 'Nhamagua'], neighborhoods: [] },
      { name: 'Manica', administrative_posts: ['Manica', 'Messica', 'Mavonde'], neighborhoods: [] },
      { name: 'Mossurize', administrative_posts: ['Espungabera', 'Dacata'], neighborhoods: [] },
      { name: 'Sussundenga', administrative_posts: ['Sussundenga', 'Dombe', 'Muhoa'], neighborhoods: [] },
      { name: 'Tambara', administrative_posts: ['Nhacolo', 'Buzua'], neighborhoods: [] },
      { name: 'Vanduzi', administrative_posts: ['Vanduzi', 'Matsinho'], neighborhoods: [] }
    ]
  },
  {
    id: 'sof',
    name: 'Sofala',
    region: 'Centro',
    sigla: 'SF',
    districts: [
      { 
        name: 'Beira (Cidade)', 
        administrative_posts: ['Central', 'Munhava', 'Manga Loot', 'Inhamizua'], 
        neighborhoods: ['Chaimite', 'Macuti', 'Ponta Gêa', 'Munhava', 'Manga', 'Vaz', 'Esturro', 'Cipangara'] 
      },
      { name: 'Búzi', administrative_posts: ['Búzi', 'Estaquinha', 'Nova Sofala'], neighborhoods: [] },
      { name: 'Caia', administrative_posts: ['Caia', 'Sena', 'Murraça'], neighborhoods: [] },
      { name: 'Chemba', administrative_posts: ['Chemba', 'Chiramba', 'Mulima'], neighborhoods: [] },
      { name: 'Cheringoma', administrative_posts: ['Inhaminga', 'Muanza'], neighborhoods: [] },
      { name: 'Chibabava', administrative_posts: ['Chibabava', 'Goonda', 'Muxúnguè'], neighborhoods: [] },
      { name: 'Dondo', administrative_posts: ['Dondo', 'Mafambisse'], neighborhoods: ['Chibuabuamua', 'Central', 'Planalto'] },
      { name: 'Gorongosa', administrative_posts: ['Gorongosa', 'Nhamadzi', 'Vanduzi'], neighborhoods: [] },
      { name: 'Machanga', administrative_posts: ['Machanga', 'Divinhe'], neighborhoods: [] },
      { name: 'Maringué', administrative_posts: ['Maringué', 'Canxixe', 'Subui'], neighborhoods: [] },
      { name: 'Marromeu', administrative_posts: ['Marromeu', 'Chupanga'], neighborhoods: [] },
      { name: 'Muanza', administrative_posts: ['Muanza', 'Galinha'], neighborhoods: [] },
      { name: 'Nhamatanda', administrative_posts: ['Nhamatanda', 'Tica'], neighborhoods: [] }
    ]
  },
  {
    id: 'inh',
    name: 'Inhambane',
    region: 'Sul',
    sigla: 'INH',
    districts: [
      { name: 'Funhalouro', administrative_posts: ['Funhalouro', 'Tome'], neighborhoods: [] },
      { name: 'Govuro', administrative_posts: ['Nova Mambone', 'Jofane'], neighborhoods: [] },
      { name: 'Homoíne', administrative_posts: ['Homoíne', 'Pembe'], neighborhoods: [] },
      { 
        name: 'Inhambane (Cidade)', 
        administrative_posts: ['Inhambane'], 
        neighborhoods: ['Balane', 'Chamane', 'Josina Machel', 'Muelé', 'Liberdade', 'Aeroporto'] 
      },
      { name: 'Inharrime', administrative_posts: ['Inharrime', 'Chambone'], neighborhoods: [] },
      { name: 'Inhassoro', administrative_posts: ['Inhassoro', 'Bazaruto'], neighborhoods: [] },
      { name: 'Jangamo', administrative_posts: ['Jangamo', 'Cumbana'], neighborhoods: [] },
      { name: 'Mabote', administrative_posts: ['Mabote', 'Zimane'], neighborhoods: [] },
      { name: 'Massinga', administrative_posts: ['Massinga', 'Chicomo'], neighborhoods: [] },
      { name: 'Maxixe (Cidade)', administrative_posts: ['Maxixe'], neighborhoods: ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi'] },
      { name: 'Morrumbene', administrative_posts: ['Morrumbene', 'Mucodoene'], neighborhoods: [] },
      { name: 'Panda', administrative_posts: ['Panda', 'Muelé'], neighborhoods: [] },
      { name: 'Vilankulo', administrative_posts: ['Vilankulo', 'Mapinhane'], neighborhoods: ['Bairro Central', 'Mucoque', 'Alto Macassa'] },
      { name: 'Zavala', administrative_posts: ['Quissico', 'Zandamela'], neighborhoods: [] }
    ]
  },
  {
    id: 'gaz',
    name: 'Gaza',
    region: 'Sul',
    sigla: 'GZ',
    districts: [
      { name: 'Bilene', administrative_posts: ['Macia', 'Bilene Macia', 'Chissano'], neighborhoods: [] },
      { name: 'Chibuto', administrative_posts: ['Chibuto', 'Chaimite', 'Changanine'], neighborhoods: [] },
      { name: 'Chicualacuala', administrative_posts: ['Chicualacuala', 'Mapai'], neighborhoods: [] },
      { name: 'Chigubo', administrative_posts: ['Chigubo', 'Ndindiza'], neighborhoods: [] },
      { name: 'Chókwè', administrative_posts: ['Chókwè', 'Lionde', 'Macarretane'], neighborhoods: [] },
      { name: 'Chonguene', administrative_posts: ['Chonguene', 'Chongoene'], neighborhoods: [] },
      { name: 'Guijá', administrative_posts: ['Canicado', 'Chivonguene'], neighborhoods: [] },
      { name: 'Limpopo', administrative_posts: ['Chicumbane', 'Zongoene'], neighborhoods: [] },
      { name: 'Mabalane', administrative_posts: ['Mabalane', 'Combomune'], neighborhoods: [] },
      { name: 'Manjacaze', administrative_posts: ['Manjacaze', 'Chidenguele'], neighborhoods: [] },
      { name: 'Mapai', administrative_posts: ['Mapai', 'Machaila'], neighborhoods: [] },
      { name: 'Massangena', administrative_posts: ['Massangena', 'Mavue'], neighborhoods: [] },
      { name: 'Massingir', administrative_posts: ['Massingir', 'Zulo'], neighborhoods: [] },
      { 
        name: 'Xai-Xai (Cidade)', 
        administrative_posts: ['Xai-Xai'], 
        neighborhoods: ['Central', 'Alto-Gaza', 'Inhamissa', 'Panjane', 'Chicumbane', 'Patrice Lumumba'] 
      }
    ]
  },
  {
    id: 'mpp',
    name: 'Maputo (Província)',
    region: 'Sul',
    sigla: 'MPT',
    districts: [
      { name: 'Boane', administrative_posts: ['Boane', 'Matola-Rio'], neighborhoods: ['Bairro Central', 'Campinho', 'Massaca'] },
      { name: 'Magude', administrative_posts: ['Magude', 'Mapulanguene', 'Motaze'], neighborhoods: [] },
      { name: 'Manhiça', administrative_posts: ['Manhiça', 'Xinavane', '3 de Fevereiro'], neighborhoods: [] },
      { name: 'Marracuene', administrative_posts: ['Marracuene', 'Machubo'], neighborhoods: ['Aliança', 'Cumbe', 'Habel Jafar'] },
      { 
        name: 'Matola (Cidade)', 
        administrative_posts: ['Matola', 'Infulene', 'Machava'], 
        neighborhoods: ['Matola Sede', 'Fomento', 'Liberdade', 'T3', 'Trevo', 'Machava Socimol', 'Cingatela'] 
      },
      { name: 'Matutuíne', administrative_posts: ['Bela Vista', 'Catembe', 'Zitundo'], neighborhoods: [] },
      { name: 'Moamba', administrative_posts: ['Moamba', 'Ressano Garcia', 'Pessene'], neighborhoods: [] },
      { name: 'Namaacha', administrative_posts: ['Namaacha', 'Changalane'], neighborhoods: [] }
    ]
  },
  {
    id: 'mpc',
    name: 'Maputo (Cidade)',
    region: 'Sul',
    sigla: 'MC',
    districts: [
      { 
        name: 'KaMpfumo', 
        administrative_posts: ['KaMpfumo'], 
        neighborhoods: ['Central A/B', 'Alto Maé A/B', 'Malhangalene A/B', 'Polana Cimento A/B/C', 'Coop', 'Sommerschield'] 
      },
      { 
        name: 'Nlhamankulu', 
        administrative_posts: ['Nlhamankulu'], 
        neighborhoods: ['Aeroporto A/B', 'Chamanculo A/B/C/D', 'Malanga', 'Xipamanine', 'Munhuana', 'Unidade 7'] 
      },
      { 
        name: 'KaMaxaquene', 
        administrative_posts: ['KaMaxaquene'], 
        neighborhoods: ['Maxaquene A/B/C/D', 'Polana Caniço A/B', 'Urbanização', 'Mafalala'] 
      },
      { 
        name: 'KaMavota', 
        administrative_posts: ['KaMavota'], 
        neighborhoods: ['Mavalane A/B', 'FPLM', 'Hulene A/B', 'Ferroviário', 'Costa do Sol', 'Polana Caniço B'] 
      },
      { 
        name: 'KaMubukwana', 
        administrative_posts: ['KaMubukwana'], 
        neighborhoods: ['Bagamoyo', 'George Dimitrov', 'Inhagoia A/B', 'Magoanine A/B/C', 'Zimpeto'] 
      },
      { 
        name: 'KaTembe', 
        administrative_posts: ['KaTembe'], 
        neighborhoods: ['Gwaza Muthini', 'Incassane', 'Inguide', 'Chali', 'Chamissava'] 
      },
      { 
        name: 'KaNyaka', 
        administrative_posts: ['KaNyaka'], 
        neighborhoods: ['Ribzene', 'Nghanyane', 'Chadwane'] 
      }
    ]
  }
]

export interface District {
  name: string;
  provinceId: string;
  administrative_posts: string[];
  neighborhoods: string[];
}

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
 * isValidName('Edmilson Muacigarro') // true
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
 * sanitizeName('  edmilson   muacigarro  ')         // 'Edmilson Muacigarro'
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
export const legacyPostalCodes: Record<string, { locality: string; province: string }> = {
  // Região Sul
  // Maputo
  '1100': { locality: 'Maputo ECP (Sede)', province: 'Maputo' },
  '1101': { locality: 'Polana', province: 'Maputo' },
  '1102': { locality: 'Sommerchild', province: 'Maputo' },
  '1103': { locality: 'Malhangalene', province: 'Maputo' },
  '1104': { locality: 'Alto-Maé', province: 'Maputo' },
  '1106': { locality: 'Bairro Central', province: 'Maputo' },
  '1107': { locality: 'Bairro do Aeroporto', province: 'Maputo' },
  '1108': { locality: 'Bairro do Mavalane', province: 'Maputo' },
  '1109': { locality: 'Bairro do Jardim', province: 'Maputo' },
  '1110': { locality: 'Bairro do Xipamanine', province: 'Maputo' },
  '1111': { locality: 'Bairro George Dimitrov', province: 'Maputo' },
  '1112': { locality: 'Machava', province: 'Maputo' },
  '1113': { locality: 'Fomento', province: 'Maputo' },
  '1114': { locality: 'Matola', province: 'Maputo' },
  '1115': { locality: 'Boane', province: 'Maputo' },
  '1116': { locality: 'Namaacha', province: 'Maputo' },
  '1117': { locality: 'Katembe', province: 'Maputo' },
  '1118': { locality: 'Bela-Vista', province: 'Maputo' },
  '1119': { locality: 'Inhaca', province: 'Maputo' },
  '1120': { locality: 'Marracuene', province: 'Maputo' },
  '1121': { locality: 'Manhiça', province: 'Maputo' },
  '1122': { locality: 'Xinavane', province: 'Maputo' },
  '1123': { locality: 'Magude', province: 'Maputo' },
  '1124': { locality: 'Moamba', province: 'Maputo' },
  '1125': { locality: 'Ressano Garcia', province: 'Maputo' },
  // Gaza
  '1200': { locality: 'Xai-Xai ECP', province: 'Gaza' },
  '1201': { locality: 'Praia de Xai-Xai', province: 'Gaza' },
  '1202': { locality: 'Macia', province: 'Gaza' },
  '1203': { locality: 'Praia de Bilene', province: 'Gaza' },
  '1204': { locality: 'Chokwé', province: 'Gaza' },
  '1205': { locality: 'Chilembene / Magoanine', province: 'Gaza' },
  '1206': { locality: 'Mabalane', province: 'Gaza' },
  '1207': { locality: 'Massingir', province: 'Gaza' },
  '1208': { locality: 'Chibuto', province: 'Gaza' },
  '1209': { locality: 'Manjacaze', province: 'Gaza' },
  '1210': { locality: 'Chidenguele', province: 'Gaza' },
  '1211': { locality: 'Chicualacuala', province: 'Gaza' },
  // Inhambane
  '1300': { locality: 'Inhambane ECP', province: 'Inhambane' },
  '1301': { locality: 'Maxixe', province: 'Inhambane' },
  '1302': { locality: 'Morrumbene', province: 'Inhambane' },
  '1303': { locality: 'Massinga', province: 'Inhambane' },
  '1304': { locality: 'Vilanculos', province: 'Inhambane' },
  '1305': { locality: 'Inhassoro', province: 'Inhambane' },
  '1306': { locality: 'Nova-Mambone', province: 'Inhambane' },
  '1307': { locality: 'Jangamo', province: 'Inhambane' },
  '1308': { locality: 'Cumbane', province: 'Inhambane' },
  '1309': { locality: 'Homoine', province: 'Inhambane' },
  '1310': { locality: 'Panda', province: 'Inhambane' },
  '1311': { locality: 'Inharrime', province: 'Inhambane' },
  '1312': { locality: 'Quissico', province: 'Inhambane' },
  '1313': { locality: 'Funhalouro', province: 'Inhambane' },
  '1314': { locality: 'Mabote', province: 'Inhambane' },

  // Região Centro
  // Sofala
  '2100': { locality: 'Beira ECP', province: 'Sofala' },
  '2101': { locality: 'Macúti', province: 'Sofala' },
  '2102': { locality: 'Beira Aeroporto', province: 'Sofala' },
  '2103': { locality: 'Manga', province: 'Sofala' },
  '2104': { locality: 'Dondo', province: 'Sofala' },
  '2105': { locality: 'Mafambisse', province: 'Sofala' },
  '2106': { locality: 'Nhamatanda', province: 'Sofala' },
  '2107': { locality: 'Buzi', province: 'Sofala' },
  '2110': { locality: 'Gorongoza', province: 'Sofala' },
  // Manica
  '2200': { locality: 'Chimoio ECP', province: 'Manica' },
  '2201': { locality: 'Catandica', province: 'Manica' },
  '2202': { locality: 'Vila de Manica', province: 'Manica' },
  '2203': { locality: 'Gondola', province: 'Manica' },
  '2204': { locality: 'Guro', province: 'Manica' },
  '2205': { locality: 'Machaze', province: 'Manica' },
  '2206': { locality: 'Macossa', province: 'Manica' },
  '2207': { locality: 'Sussundenga', province: 'Manica' },
  '2208': { locality: 'Tambara', province: 'Manica' },
  // Tete
  '2300': { locality: 'Tete ECP', province: 'Tete' },
  '2301': { locality: 'Tete Aeroporto', province: 'Tete' },
  '2302': { locality: 'Moatize', province: 'Tete' },
  '2304': { locality: 'Songo', province: 'Tete' },
  '2307': { locality: 'Mutarara', province: 'Tete' },
  '2312': { locality: 'Zumbo', province: 'Tete' },
  // Zambézia
  '2400': { locality: 'Quelimane ECP', province: 'Zambézia' },
  '2401': { locality: 'Nicoadala', province: 'Zambézia' },
  '2403': { locality: 'Mocuba', province: 'Zambézia' },
  '2405': { locality: 'Pebane', province: 'Zambézia' },
  '2407': { locality: 'Gurué', province: 'Zambézia' },
  '2412': { locality: 'Chinde', province: 'Zambézia' },

  // Região Norte
  // Nampula
  '3100': { locality: 'Nampula ECP', province: 'Nampula' },
  '3101': { locality: 'Angoche', province: 'Nampula' },
  '3102': { locality: 'Monapo', province: 'Nampula' },
  '3105': { locality: 'Ilha de Moçambique', province: 'Nampula' },
  '3108': { locality: 'Moma', province: 'Nampula' },
  '3112': { locality: 'Nacala', province: 'Nampula' },
  '3115': { locality: 'Namapa', province: 'Nampula' },
  '3119': { locality: 'Ribaue', province: 'Nampula' },
  // Cabo Delgado
  '3200': { locality: 'Pemba ECP', province: 'Cabo Delgado' },
  '3201': { locality: 'Pemba-2', province: 'Cabo Delgado' },
  '3208': { locality: 'Montepuez', province: 'Cabo Delgado' },
  '3216': { locality: 'Mueda', province: 'Cabo Delgado' },
  '3219': { locality: 'Palma', province: 'Cabo Delgado' },
  // Niassa
  '3300': { locality: 'Lichinga ECP', province: 'Niassa' },
  '3301': { locality: 'Macanhelas', province: 'Niassa' },
  '3304': { locality: 'Mandimba', province: 'Niassa' },
  '3305': { locality: 'Cuamba', province: 'Niassa' },
  '3311': { locality: 'Muembe', province: 'Niassa' }
}

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
export const legacyToNewCEPPrefix: Record<string, string[]> = {
  '1100': ["0101","0102","0103","0104","0105","0106","0107"],
  '1101': ["0101","0103"],
  '1103': ["0101"],
  '1112': ["0204"],
  '1114': ["0203","0204"],
  '1115': ["0203"],
  '1116': ["0202"],
  '1117': ["0106"],
  '1118': ["0201"],
  '1120': ["0205"],
  '1121': ["0207"],
  '1122': ["0207"],
  '1123': ["0208"],
  '1124': ["0206"],
  '1125': ["0206"],
  '1200': ["0302"],
  '1201': ["0302"],
  '1202': ["0304"],
  '1206': ["0310"],
  '1207': ["0311"],
  '1208': ["0306"],
  '1209': ["0305"],
  '1210': ["0305"],
  '1211': ["0313"],
  '1300': ["0404"],
  '1301': ["0405"],
  '1302': ["0408"],
  '1303': ["0409"],
  '1305': ["0413"],
  '1307': ["0403"],
  '1308': ["0303"],
  '1310': ["0407","0608"],
  '1311': ["0402"],
  '1312': ["0401"],
  '1313': ["0410"],
  '1314': ["0412"],
  '2100': ["0504"],
  '2103': ["0504"],
  '2104': ["0505"],
  '2105': ["0505"],
  '2106': ["0506"],
  '2200': ["0602"],
  '2201': ["0610"],
  '2203': ["0605"],
  '2204': ["0612"],
  '2205': ["0601"],
  '2206': ["0609"],
  '2207': ["0603"],
  '2208': ["0611"],
  '2300': ["0702"],
  '2302': ["0704"],
  '2304': ["0707"],
  '2307': ["0701"],
  '2312': ["0712"],
  '2400': ["0802"],
  '2401': ["0807"],
  '2403': ["0810"],
  '2405': ["0813"],
  '2412': ["0801"],
  '3100': ["0909"],
  '3101': ["0903"],
  '3102': ["0915"],
  '3105': ["0913"],
  '3108': ["0901"],
  '3112': ["0919","0920"],
  '3200': ["1005"],
  '3201': ["1005"],
  '3208': ["1011"],
  '3216': ["1015"],
  '3219': ["1016"],
  '3300': ["1111"],
  '3304': ["1104"],
  '3305': ["1101"],
  '3311': ["1114"],
};

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

/**
 * @iradoweck/moz-utils
 *
 * Funções de utilidade para Moçambique.
 * Validação de NUIT, BI, documentos, e formatação de telefones.
 *
 * @license AGPL-3.0-or-later
 */

/**
 * Valida um número de telefone moçambicano.
 * Aceita formatos: 84XXXXXXX, +258 84XXXXXXX, 258-84-XXX-XXXX, etc.
 * Operadoras válidas: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
 */
export function isValidMozambicanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned
  return /^8[2-8]\d{7}$/.test(withoutCountryCode)
}

/**
 * Formata um número de telefone moçambicano para o padrão internacional.
 * Ex: "841234567" → "+258 84 123 4567"
 */
export function formatMozambicanPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned

  if (!isValidMozambicanPhone(withoutCountryCode)) {
    throw new Error(`Número de telefone inválido: ${phone}`)
  }

  const prefix = withoutCountryCode.slice(0, 2)
  const part1 = withoutCountryCode.slice(2, 5)
  const part2 = withoutCountryCode.slice(5)

  return `+258 ${prefix} ${part1} ${part2}`
}

/**
 * Identifica a operadora de um número moçambicano.
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
 * Valida o NUIT (Número Único de Identificação Tributária) de Moçambique.
 * 
 * Regras da AT (Autoridade Tributária):
 * - Composto por 9 dígitos.
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
 * Classifica o tipo de entidade com base no primeiro dígito do NUIT.
 * - 1 ou 2: Pessoas Singulares
 * - 3: Entidades Equiparadas
 * - 4: Pessoas Colectivas
 * - 5: Organismos Públicos
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
 * Valida o Bilhete de Identidade Moçambicano.
 * Formato padrão: 12 dígitos seguidos de 1 letra (Ex: 110101234567A)
 */
export function isValidBI(bi: string): boolean {
  const cleaned = bi.replace(/[\s\-]/g, '').toUpperCase()
  return /^\d{12}[A-Z]$/.test(cleaned)
}

/**
 * Formata um valor monetário em Meticais seguindo o padrão oficial de Moçambique.
 *
 * Padrão oficial (SI + AT):
 * - Separador de milhares: espaço ( )
 * - Separador decimal: vírgula (,)
 * - Símbolo após o valor, separado por espaço
 *
 * @param value - Valor numérico a formatar
 * @param currency - 'MT' para uso nacional (padrão) ou 'MZN' para uso internacional (ISO 4217)
 * @returns Valor formatado (ex: "1 500,00 MT")
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

  // Agrupar dígitos em blocos de 3 da direita para a esquerda, separados por espaço
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return `${sign}${formattedInteger},${decimalPart} ${currency}`
}

/**
 * Gera um URL de contacto WhatsApp com mensagem pré-formatada.
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const international = cleaned.startsWith('258') ? cleaned : `258${cleaned}`
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${international}${encodedMessage}`
}

/**
 * Lista oficial das Províncias de Moçambique com os seus distritos.
 * Fonte: Divisão administrativa oficial da República de Moçambique.
 * Inclui sigla oficial de cada província.
 */
export const mozambiqueProvinces = [
  {
    id: 'cab',
    name: 'Cabo Delgado',
    region: 'Norte',
    sigla: 'CBD',
    districts: ['Ancuabe', 'Balama', 'Chiúre', 'Ibo', 'Macomia', 'Mecúfi', 'Meluco', 'Metuge', 'Mocímboa da Praia', 'Montepuez', 'Mueda', 'Muidumbe', 'Namuno', 'Nangade', 'Palma', 'Pemba (Cidade)', 'Quissanga']
  },
  {
    id: 'nia',
    name: 'Niassa',
    region: 'Norte',
    sigla: 'NS',
    districts: ['Chimbonila', 'Cuamba', 'Lago', 'Lichinga (Cidade)', 'Majune', 'Mandimba', 'Marrupa', 'Maúa', 'Mavago', 'Mecanhelas', 'Mecula', 'Metarica', 'Muembe', 'N\'gauma', 'Nipepe', 'Sanga']
  },
  {
    id: 'npl',
    name: 'Nampula',
    region: 'Norte',
    sigla: 'NPL',
    districts: ['Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', 'Larde', 'Liúpo', 'Malema', 'Meconta', 'Mecubúri', 'Memba', 'Mogincual', 'Mogovolas', 'Moma', 'Monapo', 'Mossuril', 'Muecate', 'Murrupula', 'Nacala-a-Velha', 'Nacala Porto', 'Nampula (Cidade)', 'Nacarôa', 'Rapale', 'Ribáuè']
  },
  {
    id: 'zam',
    name: 'Zambézia',
    region: 'Centro',
    sigla: 'ZMB',
    districts: ['Alto Molócuè', 'Chinde', 'Derre', 'Gilé', 'Gurué', 'Ile', 'Inhassunge', 'Luabo', 'Lugela', 'Maganja da Costa', 'Milange', 'Mocuba', 'Mocubela', 'Molumbo', 'Mopeia', 'Morrumbala', 'Mulevala', 'Namacurra', 'Namarrói', 'Nicoadala', 'Pebane', 'Quelimane (Cidade)']
  },
  {
    id: 'tet',
    name: 'Tete',
    region: 'Centro',
    sigla: 'TT',
    districts: ['Angónia', 'Cahora-Bassa', 'Changara', 'Chifunde', 'Chiuta', 'Dôa', 'Macanga', 'Magoé', 'Marara', 'Marávia', 'Moatize', 'Mutarara', 'Tete (Cidade)', 'Tsangano', 'Zumbo']
  },
  {
    id: 'man',
    name: 'Manica',
    region: 'Centro',
    sigla: 'MN',
    districts: ['Bárue', 'Chimoio (Cidade)', 'Gondola', 'Guro', 'Macate', 'Machaze', 'Macossa', 'Manica', 'Mossurize', 'Sussundenga', 'Tambara', 'Vanduzi']
  },
  {
    id: 'sof',
    name: 'Sofala',
    region: 'Centro',
    sigla: 'SF',
    districts: ['Beira (Cidade)', 'Búzi', 'Caia', 'Chemba', 'Cheringoma', 'Chibabava', 'Dondo', 'Gorongosa', 'Machanga', 'Maringué', 'Marromeu', 'Muanza', 'Nhamatanda']
  },
  {
    id: 'inh',
    name: 'Inhambane',
    region: 'Sul',
    sigla: 'INH',
    districts: ['Funhalouro', 'Govuro', 'Homoíne', 'Inhambane (Cidade)', 'Inharrime', 'Inhassoro', 'Jangamo', 'Mabote', 'Massinga', 'Maxixe (Cidade)', 'Morrumbene', 'Panda', 'Vilankulo', 'Zavala']
  },
  {
    id: 'gaz',
    name: 'Gaza',
    region: 'Sul',
    sigla: 'GZ',
    districts: ['Bilene', 'Chibuto', 'Chicualacuala', 'Chigubo', 'Chókwè', 'Chonguene', 'Guijá', 'Limpopo', 'Mabalane', 'Manjacaze', 'Mapai', 'Massangena', 'Massingir', 'Xai-Xai (Cidade)']
  },
  {
    id: 'mpp',
    name: 'Maputo (Província)',
    region: 'Sul',
    sigla: 'MPT',
    districts: ['Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola (Cidade)', 'Matutuíne', 'Moamba', 'Namaacha']
  },
  {
    id: 'mpc',
    name: 'Maputo (Cidade)',
    region: 'Sul',
    sigla: 'MC',
    districts: ['KaMpfumo', 'Nlhamankulu', 'KaMaxaquene', 'KaMavota', 'KaMubukwana', 'KaTembe', 'KaNyaka']
  }
]

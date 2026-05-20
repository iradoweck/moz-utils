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
 * Operadoras: Vodacom (84/85), Tmcel (86/87), Movitel (82/83)
 */
export function isValidMozambicanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned
  return /^8[1-9]\d{7}$/.test(withoutCountryCode)
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
 * Um NUIT válido deve ter exatamente 9 dígitos.
 * Algoritmo base: Módulo 11
 */
export function isValidNUIT(nuit: string | number): boolean {
  const cleaned = String(nuit).replace(/\D/g, '')

  // NUIT deve ter exatamente 9 dígitos
  if (cleaned.length !== 9) return false

  // NUIT não pode ser uma sequência repetida de números
  if (/^(\d)\1{8}$/.test(cleaned)) return false

  // TODO: Adicionar o cálculo exato do dígito verificador módulo 11 específico de Moçambique
  // Por enquanto, valida formato numérico de 9 dígitos.
  return true
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
 * Formata um valor monetário em Meticais (MZN).
 * Ex: 1500 → "1.500,00 MT"
 */
export function formatMZN(value: number): string {
  return `${value.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT`
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
 * Lista das Províncias de Moçambique com os seus respetivos distritos principais (parcial para exemplo).
 */
export const mozambiqueProvinces = [
  {
    id: 'mpm',
    name: 'Maputo Cidade',
    region: 'Sul',
    districts: ['KaMpfumo', 'Nlhamankulu', 'KaMaxakeni', 'KaMavota', 'KaMubukwana', 'KaTembe', 'KaNyaka']
  },
  {
    id: 'mpt',
    name: 'Maputo Província',
    region: 'Sul',
    districts: ['Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola', 'Matutuíne', 'Moamba', 'Namaacha']
  },
  {
    id: 'gza',
    name: 'Gaza',
    region: 'Sul',
    districts: ['Bilene', 'Chibuto', 'Chicualacuala', 'Chigubo', 'Chókwè', 'Guijá', 'Mabalane', 'Manjacaze', 'Massangena', 'Massingir', 'Xai-Xai']
  },
  {
    id: 'inh',
    name: 'Inhambane',
    region: 'Sul',
    districts: ['Funhalouro', 'Govuro', 'Homoíne', 'Inhambane', 'Inharrime', 'Inhassoro', 'Jangamo', 'Mabote', 'Massinga', 'Maxixe', 'Morrumbene', 'Panda', 'Vilankulo', 'Zavala']
  },
  {
    id: 'sof',
    name: 'Sofala',
    region: 'Centro',
    districts: ['Beira', 'Búzi', 'Caia', 'Chemba', 'Cheringoma', 'Chibabava', 'Dondo', 'Gorongosa', 'Machanga', 'Maringué', 'Muanza', 'Nhamatanda']
  },
  {
    id: 'man',
    name: 'Manica',
    region: 'Centro',
    districts: ['Bárue', 'Chimoio', 'Gondola', 'Guro', 'Macate', 'Machaze', 'Macossa', 'Manica', 'Mossurize', 'Sussundenga', 'Tambara', 'Vanduzi']
  },
  {
    id: 'tet',
    name: 'Tete',
    region: 'Centro',
    districts: ['Angónia', 'Cahora-Bassa', 'Changara', 'Chifunde', 'Chiúta', 'Dôa', 'Macanga', 'Magoé', 'Marávia', 'Moatize', 'Mutarara', 'Tete', 'Tsangano', 'Zumbo']
  },
  {
    id: 'zmb',
    name: 'Zambézia',
    region: 'Centro',
    districts: ['Alto Molócue', 'Chinde', 'Derre', 'Gilé', 'Gurué', 'Ile', 'Inhassunge', 'Luabo', 'Lugela', 'Maganja da Costa', 'Milange', 'Mocuba', 'Mopeia', 'Morrumbala', 'Mulevala', 'Namacurra', 'Namarroi', 'Nicoadala', 'Pebane', 'Quelimane']
  },
  {
    id: 'nam',
    name: 'Nampula',
    region: 'Norte',
    districts: ['Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', 'Larde', 'Liúpo', 'Macomia', 'Mecubúri', 'Memba', 'Mogincual', 'Mogovolas', 'Moma', 'Monapo', 'Mossuril', 'Muecate', 'Murrupula', 'Nacala-a-Velha', 'Nacala Porto', 'Nampula', 'Rapale', 'Ribáuè']
  },
  {
    id: 'cab',
    name: 'Cabo Delgado',
    region: 'Norte',
    districts: ['Ancuabe', 'Balama', 'Chiúre', 'Ibo', 'Macomia', 'Mecúfi', 'Meluco', 'Metuge', 'Mocímboa da Praia', 'Montepuez', 'Mueda', 'Muidumbe', 'Namuno', 'Nangade', 'Palma', 'Pemba', 'Quissanga']
  },
  {
    id: 'nia',
    name: 'Niassa',
    region: 'Norte',
    districts: ['Chimbonila', 'Cuamba', 'Lago', 'Lichinga', 'Majune', 'Mandimba', 'Marrupa', 'Maúa', 'Mavago', 'Mecanhelas', 'Mecula', 'Metarica', 'Muembe', 'N\'gauma', 'Nipepe', 'Sanga']
  }
]

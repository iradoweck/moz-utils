/**
 * Script de teste para validar a lógica do NUIT (Módulo 11)
 */

// Cópia local das funções para teste direto sem compilar TS
function isValidNUIT(nuit) {
  const cleaned = String(nuit).replace(/\D/g, '')
  if (cleaned.length !== 9) return false
  if (/^(\d)\1{8}$/.test(cleaned)) return false
  if (!/^[1-5]/.test(cleaned)) return false

  let sum = 0
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * (9 - i)
  }
  const remainder = sum % 11
  const expectedDigit = remainder <= 1 ? 0 : 11 - remainder
  return parseInt(cleaned.charAt(8), 10) === expectedDigit
}

function getNUITEntityType(nuit) {
  const cleaned = String(nuit).replace(/\D/g, '')
  if (!isValidNUIT(cleaned)) return null
  const firstDigit = cleaned.charAt(0)
  const types = {
    '1': 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
    '2': 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
    '3': 'Equiparada (Heranças Jacentes, Consórcios)',
    '4': 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)',
    '5': 'Público (Instituições do Estado e Ministérios)'
  }
  return types[firstDigit] || null
}

function isValidMozambicanPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned
  return /^8[2-8]\d{7}$/.test(withoutCountryCode)
}

function getMobileOperator(phone) {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  const withoutCountryCode = cleaned.startsWith('258') ? cleaned.slice(3) : cleaned
  if (!isValidMozambicanPhone(withoutCountryCode)) return null
  const prefix = withoutCountryCode.slice(0, 2)
  const operators = {
    '84': 'Vodacom', '85': 'Vodacom',
    '82': 'Tmcel', '83': 'Tmcel',
    '86': 'Movitel', '87': 'Movitel', '88': 'Movitel',
  }
  return operators[prefix] || null
}

function isValidBI(bi) {
  const cleaned = bi.replace(/[\s\-]/g, '').toUpperCase()
  return /^\d{12}[A-Z]$/.test(cleaned)
}

function formatMZN(value, currency = 'MT') {
  const [integerPart, decimalPart] = Math.abs(value).toFixed(2).split('.')
  const sign = value < 0 ? '-' : ''
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${sign}${formattedInteger},${decimalPart} ${currency}`
}

const mozambiqueProvinces = [
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
    districts: ['Chimbonila', 'Cuamba', 'Lago', 'Lichinga (Cidade)', 'Majune', 'Mandimba', 'Marrupa', 'Maúa', 'Mavago', 'Mecanhelas', 'Mecula', 'Metarica', 'Muembe', "N'gauma", 'Nipepe', 'Sanga']
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
];

function getDistrictsByProvince(provinceId) {
  const province = mozambiqueProvinces.find(p => p.id === provinceId.trim().toLowerCase());
  if (!province) {
    throw new Error(`Província inválida: ${provinceId}`);
  }
  return province.districts;
}

function getAllDistricts() {
  const list = [];
  for (const province of mozambiqueProvinces) {
    for (const district of province.districts) {
      list.push({ name: district, provinceId: province.id });
    }
  }
  return list;
}

// =============================================
// TESTES
// =============================================
let passed = 0
let failed = 0

function test(name, actual, expected) {
  if (actual === expected) {
    console.log(`  ✅ ${name}`)
    passed++
  } else {
    console.log(`  ❌ ${name} → Esperado: ${expected}, Recebido: ${actual}`)
    failed++
  }
}

// --- NUIT: Validação Módulo 11 ---
console.log('\n📋 TESTES DO NUIT (Módulo 11)')
console.log('─'.repeat(50))

// Gerar NUITs válidos manualmente pelo algoritmo
function generateValidNUIT(first8) {
  let sum = 0
  for (let i = 0; i < 8; i++) {
    sum += parseInt(first8.charAt(i), 10) * (9 - i)
  }
  const remainder = sum % 11
  const checkDigit = remainder <= 1 ? 0 : 11 - remainder
  return first8 + String(checkDigit)
}

const nuitSingular = generateValidNUIT('10000000')
const nuitSingular2 = generateValidNUIT('20000000')
const nuitEquiparada = generateValidNUIT('30000000')
const nuitColectiva = generateValidNUIT('40000000')
const nuitPublico = generateValidNUIT('50000000')

console.log(`  [Info] NUIT Singular gerado: ${nuitSingular}`)
console.log(`  [Info] NUIT Singular2 gerado: ${nuitSingular2}`)
console.log(`  [Info] NUIT Equiparada gerado: ${nuitEquiparada}`)
console.log(`  [Info] NUIT Colectiva gerado: ${nuitColectiva}`)
console.log(`  [Info] NUIT Público gerado: ${nuitPublico}`)

test('NUIT Singular válido', isValidNUIT(nuitSingular), true)
test('NUIT Singular2 válido', isValidNUIT(nuitSingular2), true)
test('NUIT Equiparada válido', isValidNUIT(nuitEquiparada), true)
test('NUIT Colectiva válido', isValidNUIT(nuitColectiva), true)
test('NUIT Público válido', isValidNUIT(nuitPublico), true)

test('NUIT que começa com 0 → inválido', isValidNUIT('012345678'), false)
test('NUIT que começa com 6 → inválido', isValidNUIT('612345678'), false)
test('NUIT que começa com 9 → inválido', isValidNUIT('912345678'), false)
test('NUIT com menos de 9 dígitos → inválido', isValidNUIT('1234'), false)
test('NUIT com mais de 9 dígitos → inválido', isValidNUIT('1234567890'), false)
test('NUIT com dígitos repetidos → inválido', isValidNUIT('111111111'), false)
test('NUIT com dígito de controlo errado', isValidNUIT(nuitSingular.slice(0, 8) + '9'), false)

// --- NUIT: Classificação de Entidade ---
console.log('\n📋 TESTES DE CLASSIFICAÇÃO DO NUIT')
console.log('─'.repeat(50))

test('Tipo 1 → Singular', getNUITEntityType(nuitSingular), 'Singular (Cidadãos nacionais/estrangeiros e ENI)')
test('Tipo 2 → Singular', getNUITEntityType(nuitSingular2), 'Singular (Cidadãos nacionais/estrangeiros e ENI)')
test('Tipo 3 → Equiparada', getNUITEntityType(nuitEquiparada), 'Equiparada (Heranças Jacentes, Consórcios)')
test('Tipo 4 → Colectiva', getNUITEntityType(nuitColectiva), 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)')
test('Tipo 5 → Público', getNUITEntityType(nuitPublico), 'Público (Instituições do Estado e Ministérios)')
test('NUIT inválido → null', getNUITEntityType('000000000'), null)

// --- Telefones ---
console.log('\n📱 TESTES DE TELEFONE')
console.log('─'.repeat(50))

test('84XXXXXXX (Vodacom) válido', isValidMozambicanPhone('841234567'), true)
test('85XXXXXXX (Vodacom) válido', isValidMozambicanPhone('851234567'), true)
test('82XXXXXXX (Tmcel) válido', isValidMozambicanPhone('821234567'), true)
test('83XXXXXXX (Tmcel) válido', isValidMozambicanPhone('831234567'), true)
test('86XXXXXXX (Movitel) válido', isValidMozambicanPhone('861234567'), true)
test('87XXXXXXX (Movitel) válido', isValidMozambicanPhone('871234567'), true)
test('88XXXXXXX (Movitel) válido', isValidMozambicanPhone('881234567'), true)

test('81XXXXXXX → inválido', isValidMozambicanPhone('811234567'), false)
test('89XXXXXXX → inválido', isValidMozambicanPhone('891234567'), false)
test('80XXXXXXX → inválido', isValidMozambicanPhone('801234567'), false)
test('91XXXXXXX → inválido', isValidMozambicanPhone('911234567'), false)

test('+258 84 123 4567 → válido', isValidMozambicanPhone('+258 84 123 4567'), true)
test('+258841234567 → válido', isValidMozambicanPhone('+258841234567'), true)
test('84 123 4567 → válido', isValidMozambicanPhone('84 123 4567'), true)

// --- Operadoras ---
console.log('\n📡 TESTES DE OPERADORAS')
console.log('─'.repeat(50))

test('84 → Vodacom', getMobileOperator('841234567'), 'Vodacom')
test('85 → Vodacom', getMobileOperator('851234567'), 'Vodacom')
test('82 → Tmcel', getMobileOperator('821234567'), 'Tmcel')
test('83 → Tmcel', getMobileOperator('831234567'), 'Tmcel')
test('86 → Movitel', getMobileOperator('861234567'), 'Movitel')
test('87 → Movitel', getMobileOperator('871234567'), 'Movitel')
test('88 → Movitel', getMobileOperator('881234567'), 'Movitel')
test('Inválido → null', getMobileOperator('911234567'), null)

// --- BI ---
console.log('\n🪪 TESTES DO BI')
console.log('─'.repeat(50))

test('BI 12 dígitos + letra → válido', isValidBI('110101234567A'), true)
test('BI com espaço → válido', isValidBI('110101234567 A'), true)
test('BI minúsculo → válido', isValidBI('110101234567a'), true)
test('BI sem letra → inválido', isValidBI('1101012345670'), false)
test('BI com 11 dígitos → inválido', isValidBI('11010123456A'), false)

// --- Formatação Monetária ---
console.log('\n💰 TESTES DE FORMATAÇÃO MONETÁRIA (Padrão AT/SI)')
console.log('─'.repeat(50))

test('1500 → "1 500,00 MT"', formatMZN(1500), '1 500,00 MT')
test('0.5 → "0,50 MT"', formatMZN(0.5), '0,50 MT')
test('1000000 → "1 000 000,00 MT"', formatMZN(1000000), '1 000 000,00 MT')
test('99.99 → "99,99 MT"', formatMZN(99.99), '99,99 MT')
test('0 → "0,00 MT"', formatMZN(0), '0,00 MT')
test('999 → "999,00 MT"', formatMZN(999), '999,00 MT')
test('1000 → "1 000,00 MT"', formatMZN(1000), '1 000,00 MT')
test('-500 → "-500,00 MT"', formatMZN(-500), '-500,00 MT')
test('-1500 → "-1 500,00 MT"', formatMZN(-1500), '-1 500,00 MT')
test('MZN: 1500 → "1 500,00 MZN"', formatMZN(1500, 'MZN'), '1 500,00 MZN')
test('MZN: 50000 → "50 000,00 MZN"', formatMZN(50000, 'MZN'), '50 000,00 MZN')

// --- Distritos ---
console.log('\n🗺️ TESTES DE DISTRITOS')
console.log('─'.repeat(50))

test('Distritos de Cabo Delgado count → 17', getDistrictsByProvince('cab').length, 17)
test('Distritos de Cabo Delgado primeiro → "Ancuabe"', getDistrictsByProvince('cab')[0], 'Ancuabe')
test('Distritos de Cabo Delgado case insensitive → 17', getDistrictsByProvince('CaB').length, 17)
test('Distritos de Maputo Cidade count → 7', getDistrictsByProvince('mpc').length, 7)

let threwError = false
try {
  getDistrictsByProvince('xyz')
} catch (e) {
  threwError = true
}
test('Província inválida lança erro', threwError, true)

const all = getAllDistricts()
test('Total de distritos de Moçambique → 161', all.length, 161)
test('Primeiro distrito retornado → "Ancuabe"', all[0].name, 'Ancuabe')
test('Primeiro distrito provinceId → "cab"', all[0].provinceId, 'cab')

// --- RESULTADO FINAL ---
console.log('\n' + '═'.repeat(50))
console.log(`📊 RESULTADO: ${passed} passaram, ${failed} falharam (Total: ${passed + failed})`)
console.log('═'.repeat(50))
if (failed === 0) {
  console.log('🎉 TODOS OS TESTES PASSARAM!')
} else {
  console.log('⚠️  Existem testes que falharam!')
}

/**
 * Script de teste para validar a biblioteca moz-utils
 */

const {
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
} = require('./ts/dist/index.js');

let passed = 0;
let failed = 0;

function test(name, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name} → Esperado: ${JSON.stringify(expected)}, Recebido: ${JSON.stringify(actual)}`);
    failed++;
  }
}

// --- NUIT: Validação Módulo 11 ---
console.log('\n📋 TESTES DO NUIT (Módulo 11)');
console.log('─'.repeat(50));

// Gerar NUITs válidos manualmente pelo algoritmo
function generateValidNUIT(first8) {
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(first8.charAt(i), 10) * (9 - i);
  }
  const remainder = sum % 11;
  const checkDigit = remainder <= 1 ? 0 : 11 - remainder;
  return first8 + String(checkDigit);
}

const nuitSingular = generateValidNUIT('10000000');
const nuitSingular2 = generateValidNUIT('20000000');
const nuitEquiparada = generateValidNUIT('30000000');
const nuitColectiva = generateValidNUIT('40000000');
const nuitPublico = generateValidNUIT('50000000');

console.log(`  [Info] NUIT Singular gerado: ${nuitSingular}`);
console.log(`  [Info] NUIT Singular2 gerado: ${nuitSingular2}`);
console.log(`  [Info] NUIT Equiparada gerado: ${nuitEquiparada}`);
console.log(`  [Info] NUIT Colectiva gerado: ${nuitColectiva}`);
console.log(`  [Info] NUIT Público gerado: ${nuitPublico}`);

test('NUIT Singular válido', isValidNUIT(nuitSingular), true);
test('NUIT Singular2 válido', isValidNUIT(nuitSingular2), true);
test('NUIT Equiparada válido', isValidNUIT(nuitEquiparada), true);
test('NUIT Colectiva válido', isValidNUIT(nuitColectiva), true);
test('NUIT Público válido', isValidNUIT(nuitPublico), true);

test('NUIT que começa com 0 → inválido', isValidNUIT('012345678'), false);
test('NUIT que começa com 6 → inválido', isValidNUIT('612345678'), false);
test('NUIT que começa com 9 → inválido', isValidNUIT('912345678'), false);
test('NUIT com menos de 9 dígitos → inválido', isValidNUIT('1234'), false);
test('NUIT com mais de 9 dígitos → inválido', isValidNUIT('1234567890'), false);
test('NUIT com dígitos repetidos → inválido', isValidNUIT('111111111'), false);
test('NUIT com dígito de controlo errado', isValidNUIT(nuitSingular.slice(0, 8) + '9'), false);

// --- NUIT: Classificação de Entidade ---
console.log('\n📋 TESTES DE CLASSIFICAÇÃO DO NUIT');
console.log('─'.repeat(50));

test('Tipo 1 → Singular', getNUITEntityType(nuitSingular), 'Singular (Cidadãos nacionais/estrangeiros e ENI)');
test('Tipo 2 → Singular', getNUITEntityType(nuitSingular2), 'Singular (Cidadãos nacionais/estrangeiros e ENI)');
test('Tipo 3 → Equiparada', getNUITEntityType(nuitEquiparada), 'Equiparada (Heranças Jacentes, Consórcios)');
test('Tipo 4 → Colectiva', getNUITEntityType(nuitColectiva), 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)');
test('Tipo 5 → Público', getNUITEntityType(nuitPublico), 'Público (Instituições do Estado e Ministérios)');
test('NUIT inválido → null', getNUITEntityType('000000000'), null);

// --- Telefones ---
console.log('\n📱 TESTES DE TELEFONE');
console.log('─'.repeat(50));

test('84XXXXXXX (Vodacom) válido', isValidMozambicanPhone('841234567'), true);
test('85XXXXXXX (Vodacom) válido', isValidMozambicanPhone('851234567'), true);
test('82XXXXXXX (Tmcel) válido', isValidMozambicanPhone('821234567'), true);
test('83XXXXXXX (Tmcel) válido', isValidMozambicanPhone('831234567'), true);
test('86XXXXXXX (Movitel) válido', isValidMozambicanPhone('861234567'), true);
test('87XXXXXXX (Movitel) válido', isValidMozambicanPhone('871234567'), true);
test('88XXXXXXX (Movitel) válido', isValidMozambicanPhone('881234567'), true);

test('81XXXXXXX → inválido', isValidMozambicanPhone('811234567'), false);
test('89XXXXXXX → inválido', isValidMozambicanPhone('891234567'), false);
test('80XXXXXXX → inválido', isValidMozambicanPhone('801234567'), false);
test('91XXXXXXX → inválido', isValidMozambicanPhone('911234567'), false);

test('+258 84 123 4567 → válido', isValidMozambicanPhone('+258 84 123 4567'), true);
test('+258841234567 → válido', isValidMozambicanPhone('+258841234567'), true);
test('84 123 4567 → válido', isValidMozambicanPhone('84 123 4567'), true);

// --- Operadoras ---
console.log('\n📡 TESTES DE OPERADORAS');
console.log('─'.repeat(50));

test('84 → Vodacom', getMobileOperator('841234567'), 'Vodacom');
test('85 → Vodacom', getMobileOperator('851234567'), 'Vodacom');
test('82 → Tmcel', getMobileOperator('821234567'), 'Tmcel');
test('83 → Tmcel', getMobileOperator('831234567'), 'Tmcel');
test('86 → Movitel', getMobileOperator('861234567'), 'Movitel');
test('87 → Movitel', getMobileOperator('871234567'), 'Movitel');
test('88 → Movitel', getMobileOperator('881234567'), 'Movitel');
test('Inválido → null', getMobileOperator('911234567'), null);

// --- BI ---
console.log('\n🪪 TESTES DO BI');
console.log('─'.repeat(50));

test('BI 12 dígitos + letra → válido', isValidBI('110101234567A'), true);
test('BI com espaço → válido', isValidBI('110101234567 A'), true);
test('BI minúsculo → válido', isValidBI('110101234567a'), true);
test('BI sem letra → inválido', isValidBI('1101012345670'), false);
test('BI com 11 dígitos → inválido', isValidBI('11010123456A'), false);

// --- Formatação Monetária ---
console.log('\n💰 TESTES DE FORMATAÇÃO MONETÁRIA (Padrão AT/SI)');
console.log('─'.repeat(50));

test('1500 → "1 500,00 MT"', formatMZN(1500), '1 500,00 MT');
test('0.5 → "0,50 MT"', formatMZN(0.5), '0,50 MT');
test('1000000 → "1 000 000,00 MT"', formatMZN(1000000), '1 000 000,00 MT');
test('99.99 → "99,99 MT"', formatMZN(99.99), '99,99 MT');
test('0 → "0,00 MT"', formatMZN(0), '0,00 MT');
test('999 → "999,00 MT"', formatMZN(999), '999,00 MT');
test('1000 → "1 000,00 MT"', formatMZN(1000), '1 000,00 MT');
test('-500 → "-500,00 MT"', formatMZN(-500), '-500,00 MT');
test('-1500 → "-1 500,00 MT"', formatMZN(-1500), '-1 500,00 MT');
test('MZN: 1500 → "1 500,00 MZN"', formatMZN(1500, 'MZN'), '1 500,00 MZN');
test('MZN: 50000 → "50 000,00 MZN"', formatMZN(50000, 'MZN'), '50 000,00 MZN');

// --- Distritos ---
console.log('\n🗺️ TESTES DE DISTRITOS');
console.log('─'.repeat(50));

test('Distritos de Cabo Delgado count → 17', getDistrictsByProvince('cab').length, 17);
test('Distritos de Cabo Delgado primeiro → "Ancuabe"', getDistrictsByProvince('cab')[0], 'Ancuabe');
test('Distritos de Cabo Delgado case insensitive → 17', getDistrictsByProvince('CaB').length, 17);
test('Distritos de Maputo Cidade count → 7', getDistrictsByProvince('mpc').length, 7);

let threwError = false;
try {
  getDistrictsByProvince('xyz');
} catch (e) {
  threwError = true;
}
test('Província inválida lança erro', threwError, true);

const all = getAllDistricts();
test('Total de distritos de Moçambique → 161', all.length, 161);
test('Primeiro distrito retornado name → "Ancuabe"', all[0].name, 'Ancuabe');
test('Primeiro distrito provinceId → "cab"', all[0].provinceId, 'cab');

// Testes para a nova estrutura de Postos Administrativos e Bairros
test('Ancuabe postos_administrativos', all[0].postos_administrativos, ['Ancuabe', 'Metoro', 'Meza']);
test('Ancuabe bairros', all[0].bairros, []);

const pemba = all.find(d => d.name === 'Pemba (Cidade)');
test('Pemba (Cidade) postos_administrativos', pemba.postos_administrativos, ['Pemba']);
test('Pemba (Cidade) bairros', pemba.bairros, ['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue']);

const majune = all.find(d => d.name === 'Majune');
test('Majune postos_administrativos (Mua corrigido)', majune.postos_administrativos, ['Majune', 'Mua', 'Nairrobi']);

const maxixe = all.find(d => d.name === 'Maxixe (Cidade)');
test('Maxixe (Cidade) bairros (Bairro Central corrigido)', maxixe.bairros, ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']);

const nampula = all.find(d => d.name === 'Nampula (Cidade)');
test('Nampula (Cidade) bairros contêm Namutequeliua', nampula.bairros.includes('Namutequeliua'), true);

// --- Código Postal ---
console.log('\n✉️ TESTES DE CÓDIGO POSTAL');
console.log('─'.repeat(50));

test('Código postal válido (1100)', isValidPostalCode('1100'), true);
test('Código postal com espaços (1101)', isValidPostalCode(' 1101 '), true);
test('Código postal com traço (1102)', isValidPostalCode('11-02'), true);
test('Código postal válido (1202)', isValidPostalCode('1202'), true);
test('Código postal válido (3311)', isValidPostalCode('3311'), true);
test('Código postal inválido (1199)', isValidPostalCode('1199'), false);
test('Código postal muito longo', isValidPostalCode('11000'), false);
test('Código postal muito curto', isValidPostalCode('110'), false);
test('Código postal não numérico', isValidPostalCode('ABCD'), false);

test('Localidade de 1100', getPostalCodeLocality('1100'), 'Maputo ECP (Sede)');
test('Localidade de 1205', getPostalCodeLocality('1205'), 'Chilembene / Magoanine');
test('Província de 1100', getPostalCodeProvince('1100'), 'Maputo');
test('Província de 2100', getPostalCodeProvince('2100'), 'Sofala');
test('Província de 3311', getPostalCodeProvince('3311'), 'Niassa');
test('Localidade de inválido', getPostalCodeLocality('9999'), null);
test('Província de inválido', getPostalCodeProvince('9999'), null);

// --- RESULTADO FINAL ---
console.log('\n' + '═'.repeat(50));
console.log(`📊 RESULTADO: ${passed} passaram, ${failed} falharam (Total: ${passed + failed})`);
console.log('═'.repeat(50));
if (failed === 0) {
  console.log('🎉 TODOS OS TESTES PASSARAM!');
} else {
  console.log('⚠️  Existem testes que falharam!');
}

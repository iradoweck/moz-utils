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
} from './dist/index.js';

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

// Gerar NUITs valids manualmente pelo algoritmo
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
const nuitEquivalent = generateValidNUIT('30000000');
const nuitCollective = generateValidNUIT('40000000');
const nuitPublico = generateValidNUIT('50000000');

console.log(`  [Info] Generated Singular NUIT: ${nuitSingular}`);
console.log(`  [Info] Generated Singular2 NUIT: ${nuitSingular2}`);
console.log(`  [Info] Generated Equivalent NUIT: ${nuitEquivalent}`);
console.log(`  [Info] Generated Collective NUIT: ${nuitCollective}`);
console.log(`  [Info] Generated Public NUIT: ${nuitPublico}`);

test('Valid Singular NUIT', isValidNUIT(nuitSingular), true);
test('Valid Singular2 NUIT', isValidNUIT(nuitSingular2), true);
test('Valid Equivalent NUIT', isValidNUIT(nuitEquivalent), true);
test('Valid Collective NUIT', isValidNUIT(nuitCollective), true);
test('Valid Public NUIT', isValidNUIT(nuitPublico), true);

test('NUIT that starts with 0 → invalid', isValidNUIT('012345678'), false);
test('NUIT that starts with 6 → invalid', isValidNUIT('612345678'), false);
test('NUIT that starts with 9 → invalid', isValidNUIT('912345678'), false);
test('NUIT with less than 9 digits → invalid', isValidNUIT('1234'), false);
test('NUIT with more than 9 digits → invalid', isValidNUIT('1234567890'), false);
test('NUIT with repeated digits → invalid', isValidNUIT('111111111'), false);
test('NUIT with wrong control digit', isValidNUIT(nuitSingular.slice(0, 8) + '9'), false);

test('84XXXXXXX (Vodacom) valid', isValidMozambicanPhone('841234567'), true);
test('85XXXXXXX (Vodacom) valid', isValidMozambicanPhone('851234567'), true);
test('82XXXXXXX (Tmcel) valid', isValidMozambicanPhone('821234567'), true);
test('83XXXXXXX (Tmcel) valid', isValidMozambicanPhone('831234567'), true);
test('86XXXXXXX (Movitel) valid', isValidMozambicanPhone('861234567'), true);
test('87XXXXXXX (Movitel) valid', isValidMozambicanPhone('871234567'), true);
test('88XXXXXXX (Movitel) valid', isValidMozambicanPhone('881234567'), true);

test('81XXXXXXX → invalid', isValidMozambicanPhone('811234567'), false);
test('89XXXXXXX → invalid', isValidMozambicanPhone('891234567'), false);
test('80XXXXXXX → invalid', isValidMozambicanPhone('801234567'), false);
test('91XXXXXXX → invalid', isValidMozambicanPhone('911234567'), false);

test('+258 84 123 4567 → valid', isValidMozambicanPhone('+258 84 123 4567'), true);
test('+258841234567 → valid', isValidMozambicanPhone('+258841234567'), true);
test('84 123 4567 → valid', isValidMozambicanPhone('84 123 4567'), true);

// --- Operadoras ---
console.log('\n📡 OPERATOR TESTS');
console.log('─'.repeat(50));

test('84 → Vodacom', getMobileOperator('841234567'), 'Vodacom');
test('85 → Vodacom', getMobileOperator('851234567'), 'Vodacom');
test('82 → Tmcel', getMobileOperator('821234567'), 'Tmcel');
test('83 → Tmcel', getMobileOperator('831234567'), 'Tmcel');
test('86 → Movitel', getMobileOperator('861234567'), 'Movitel');
test('87 → Movitel', getMobileOperator('871234567'), 'Movitel');
test('88 → Movitel', getMobileOperator('881234567'), 'Movitel');
test('Invalid → null', getMobileOperator('911234567'), null);

// --- BI ---
console.log('\n🪪 BI TESTS');
console.log('─'.repeat(50));

test('BI 12 digits + letter → valid', isValidBI('110101234567A'), true);
test('BI with space → valid', isValidBI('110101234567 A'), true);
test('Lowercase BI → valid', isValidBI('110101234567a'), true);
test('BI without letter → invalid', isValidBI('1101012345670'), false);
test('BI with 11 digits → invalid', isValidBI('11010123456A'), false);

// --- Formatação Monetária ---
console.log('\n💰 MONETARY FORMATTING TESTS (AT/SI Standard)');
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
console.log('\n🗺️ DISTRICT TESTS');
console.log('─'.repeat(50));

test('Cabo Delgado districts count → 17', getDistrictsByProvince('cab').length, 17);
test('Cabo Delgado first district → "Ancuabe"', getDistrictsByProvince('cab')[0], 'Ancuabe');
test('Cabo Delgado districts case insensitive → 17', getDistrictsByProvince('CaB').length, 17);
test('Maputo City districts count → 7', getDistrictsByProvince('mpc').length, 7);

let threwError = false;
try {
  getDistrictsByProvince('xyz');
} catch (e) {
  threwError = true;
}
test('Invalid province throws error', threwError, true);

const all = getAllDistricts();
test('Total Mozambique districts → 161', all.length, 161);
test('First returned district name → "Ancuabe"', all[0].name, 'Ancuabe');
test('First returned district provinceId → "cab"', all[0].provinceId, 'cab');

// Testes para a nova estrutura de Postos Administrativos e Bairros
test('Ancuabe administrative_posts', all[0].administrative_posts, ['Ancuabe', 'Metoro', 'Meza']);
test('Ancuabe neighborhoods', all[0].neighborhoods, []);

const pemba = all.find(d => d.name === 'Pemba (Cidade)');
test('Pemba (Cidade) administrative_posts', pemba.administrative_posts, ['Pemba']);
test('Pemba (Cidade) neighborhoods', pemba.neighborhoods, ['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue']);

const majune = all.find(d => d.name === 'Majune');
test('Majune administrative_posts (Mua fixed)', majune.administrative_posts, ['Majune', 'Mua', 'Nairrobi']);

const maxixe = all.find(d => d.name === 'Maxixe (Cidade)');
test('Maxixe (Cidade) neighborhoods (Bairro Central fixed)', maxixe.neighborhoods, ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']);

const nampula = all.find(d => d.name === 'Nampula (Cidade)');
test('Nampula (Cidade) neighborhoods contains Namutequeliua', nampula.neighborhoods.includes('Namutequeliua'), true);

// --- Código Postal ---
console.log('\n✉️ POSTAL CODE TESTS');
console.log('─'.repeat(50));

test('Código postal valid (1100)', isValidPostalCode('1100'), true);
test('Postal code with spaces (1101)', isValidPostalCode(' 1101 '), true);
test('Postal code with dash (1102)', isValidPostalCode('11-02'), true);
test('Código postal valid (1202)', isValidPostalCode('1202'), true);
test('Código postal valid (3311)', isValidPostalCode('3311'), true);
test('Código postal invalid (1199)', isValidPostalCode('1199'), false);
test('Postal code too long', isValidPostalCode('11000'), false);
test('Postal code too short', isValidPostalCode('110'), false);
test('Non-numeric postal code', isValidPostalCode('ABCD'), false);

test('Locality of 1100', getPostalCodeLocality('1100'), 'Maputo ECP (Sede)');
test('Locality of 1205', getPostalCodeLocality('1205'), 'Chilembene / Magoanine');
test('Province of 1100', getPostalCodeProvince('1100'), 'Maputo');
test('Province of 2100', getPostalCodeProvince('2100'), 'Sofala');
test('Province of 3311', getPostalCodeProvince('3311'), 'Niassa');
test('Locality of invalid', getPostalCodeLocality('9999'), null);
test('Province of invalid', getPostalCodeProvince('9999'), null);

// --- RESULT FINAL ---
console.log('\n' + '═'.repeat(50));
console.log(`📊 RESULT: ${passed} passed, ${failed} failed (Total: ${passed + failed})`);
console.log('═'.repeat(50));
if (failed === 0) {
  console.log("🎉 ALL TESTS PASSED!");
} else {
  console.log('⚠️  Existem testes que failed!');
}

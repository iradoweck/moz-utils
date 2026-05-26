<?php

require_once __DIR__ . '/src/MozUtils.php';

use Iradoweck\MozUtils\MozUtils;

$passed = 0;
$failed = 0;

function test($name, $actual, $expected) {
    global $passed, $failed;
    if (json_encode($actual) === json_encode($expected)) {
        echo "  ✅ $name\n";
        $passed++;
    } else {
        echo "  ❌ $name → Esperado: " . json_encode($expected) . ", Recebido: " . json_encode($actual) . "\n";
        $failed++;
    }
}

function generateValidNUIT($first8) {
    $sum = 0;
    for ($i = 0; $i < 8; $i++) {
        $sum += intval($first8[$i]) * (9 - $i);
    }
    $remainder = $sum % 11;
    $checkDigit = $remainder <= 1 ? 0 : 11 - $remainder;
    return $first8 . strval($checkDigit);
}

// --- NUIT: Validação Módulo 11 ---
echo "\n📋 TESTES DO NUIT (Módulo 11)\n";
echo str_repeat("─", 50) . "\n";

$nuitSingular = generateValidNUIT('10000000');
$nuitSingular2 = generateValidNUIT('20000000');
$nuitEquiparada = generateValidNUIT('30000000');
$nuitColectiva = generateValidNUIT('40000000');
$nuitPublico = generateValidNUIT('50000000');

echo "  [Info] NUIT Singular gerado: $nuitSingular\n";
echo "  [Info] NUIT Singular2 gerado: $nuitSingular2\n";
echo "  [Info] NUIT Equiparada gerado: $nuitEquiparada\n";
echo "  [Info] NUIT Colectiva gerado: $nuitColectiva\n";
echo "  [Info] NUIT Público gerado: $nuitPublico\n";

test('NUIT Singular válido', MozUtils::isValidNUIT($nuitSingular), true);
test('NUIT Singular2 válido', MozUtils::isValidNUIT($nuitSingular2), true);
test('NUIT Equiparada válido', MozUtils::isValidNUIT($nuitEquiparada), true);
test('NUIT Colectiva válido', MozUtils::isValidNUIT($nuitColectiva), true);
test('NUIT Público válido', MozUtils::isValidNUIT($nuitPublico), true);

test('NUIT que começa com 0 → inválido', MozUtils::isValidNUIT('012345678'), false);
test('NUIT que começa com 6 → inválido', MozUtils::isValidNUIT('612345678'), false);
test('NUIT que começa com 9 → inválido', MozUtils::isValidNUIT('912345678'), false);
test('NUIT com menos de 9 dígitos → inválido', MozUtils::isValidNUIT('1234'), false);
test('NUIT com mais de 9 dígitos → inválido', MozUtils::isValidNUIT('1234567890'), false);
test('NUIT com dígitos repetidos → inválido', MozUtils::isValidNUIT('111111111'), false);
test('NUIT com dígito de controlo errado', MozUtils::isValidNUIT(substr($nuitSingular, 0, 8) . '9'), false);

// --- NUIT: Classificação de Entidade ---
echo "\n📋 TESTES DE CLASSIFICAÇÃO DO NUIT\n";
echo str_repeat("─", 50) . "\n";

test('Tipo 1 → Singular', MozUtils::getNUITEntityType($nuitSingular), 'Singular (Cidadãos nacionais/estrangeiros e ENI)');
test('Tipo 2 → Singular', MozUtils::getNUITEntityType($nuitSingular2), 'Singular (Cidadãos nacionais/estrangeiros e ENI)');
test('Tipo 3 → Equiparada', MozUtils::getNUITEntityType($nuitEquiparada), 'Equiparada (Heranças Jacentes, Consórcios)');
test('Tipo 4 → Colectiva', MozUtils::getNUITEntityType($nuitColectiva), 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)');
test('Tipo 5 → Público', MozUtils::getNUITEntityType($nuitPublico), 'Público (Instituições do Estado e Ministérios)');
test('NUIT inválido → null', MozUtils::getNUITEntityType('000000000'), null);

// --- Telefones ---
echo "\n📱 TESTES DE TELEFONE\n";
echo str_repeat("─", 50) . "\n";

test('84XXXXXXX (Vodacom) válido', MozUtils::isValidMozambicanPhone('841234567'), true);
test('85XXXXXXX (Vodacom) válido', MozUtils::isValidMozambicanPhone('851234567'), true);
test('82XXXXXXX (Tmcel) válido', MozUtils::isValidMozambicanPhone('821234567'), true);
test('83XXXXXXX (Tmcel) válido', MozUtils::isValidMozambicanPhone('831234567'), true);
test('86XXXXXXX (Movitel) válido', MozUtils::isValidMozambicanPhone('861234567'), true);
test('87XXXXXXX (Movitel) válido', MozUtils::isValidMozambicanPhone('871234567'), true);
test('88XXXXXXX (Movitel) válido', MozUtils::isValidMozambicanPhone('881234567'), true);

test('81XXXXXXX → inválido', MozUtils::isValidMozambicanPhone('811234567'), false);
test('89XXXXXXX → inválido', MozUtils::isValidMozambicanPhone('891234567'), false);
test('80XXXXXXX → inválido', MozUtils::isValidMozambicanPhone('801234567'), false);
test('91XXXXXXX → inválido', MozUtils::isValidMozambicanPhone('911234567'), false);

test('+258 84 123 4567 → válido', MozUtils::isValidMozambicanPhone('+258 84 123 4567'), true);
test('+258841234567 → válido', MozUtils::isValidMozambicanPhone('+258841234567'), true);
test('84 123 4567 → válido', MozUtils::isValidMozambicanPhone('84 123 4567'), true);

// --- Operadoras ---
echo "\n📡 TESTES DE OPERADORAS\n";
echo str_repeat("─", 50) . "\n";

test('84 → Vodacom', MozUtils::getMobileOperator('841234567'), 'Vodacom');
test('85 → Vodacom', MozUtils::getMobileOperator('851234567'), 'Vodacom');
test('82 → Tmcel', MozUtils::getMobileOperator('821234567'), 'Tmcel');
test('83 → Tmcel', MozUtils::getMobileOperator('831234567'), 'Tmcel');
test('86 → Movitel', MozUtils::getMobileOperator('861234567'), 'Movitel');
test('87 → Movitel', MozUtils::getMobileOperator('871234567'), 'Movitel');
test('88 → Movitel', MozUtils::getMobileOperator('881234567'), 'Movitel');
test('Inválido → null', MozUtils::getMobileOperator('911234567'), null);

// --- BI ---
echo "\n🪪 TESTES DO BI\n";
echo str_repeat("─", 50) . "\n";

test('BI 12 dígitos + letra → válido', MozUtils::isValidBI('110101234567A'), true);
test('BI com espaço → válido', MozUtils::isValidBI('110101234567 A'), true);
test('BI minúsculo → válido', MozUtils::isValidBI('110101234567a'), true);
test('BI sem letra → inválido', MozUtils::isValidBI('1101012345670'), false);
test('BI com 11 dígitos → inválido', MozUtils::isValidBI('11010123456A'), false);

// --- Formatação Monetária ---
echo "\n💰 TESTES DE FORMATAÇÃO MONETÁRIA (Padrão AT/SI)\n";
echo str_repeat("─", 50) . "\n";

test('1500 → "1 500,00 MT"', MozUtils::formatMZN(1500), '1 500,00 MT');
test('0.5 → "0,50 MT"', MozUtils::formatMZN(0.5), '0,50 MT');
test('1000000 → "1 000 000,00 MT"', MozUtils::formatMZN(1000000), '1 000 000,00 MT');
test('99.99 → "99,99 MT"', MozUtils::formatMZN(99.99), '99,99 MT');
test('0 → "0,00 MT"', MozUtils::formatMZN(0), '0,00 MT');
test('999 → "999,00 MT"', MozUtils::formatMZN(999), '999,00 MT');
test('1000 → "1 000,00 MT"', MozUtils::formatMZN(1000), '1 000,00 MT');
test('-500 → "-500,00 MT"', MozUtils::formatMZN(-500), '-500,00 MT');
test('-1500 → "-1 500,00 MT"', MozUtils::formatMZN(-1500), '-1 500,00 MT');
test('MZN: 1500 → "1 500,00 MZN"', MozUtils::formatMZN(1500, 'MZN'), '1 500,00 MZN');
test('MZN: 50000 → "50 000,00 MZN"', MozUtils::formatMZN(50000, 'MZN'), '50 000,00 MZN');

// --- Distritos ---
echo "\n🗺️ TESTES DE DISTRITOS\n";
echo str_repeat("─", 50) . "\n";

test('Distritos de Cabo Delgado count → 17', count(MozUtils::getDistrictsByProvince('cab')), 17);
test('Distritos de Cabo Delgado primeiro → "Ancuabe"', MozUtils::getDistrictsByProvince('cab')[0], 'Ancuabe');
test('Distritos de Cabo Delgado case insensitive → 17', count(MozUtils::getDistrictsByProvince('CaB')), 17);
test('Distritos de Maputo Cidade count → 7', count(MozUtils::getDistrictsByProvince('mpc')), 7);

$threwError = false;
try {
    MozUtils::getDistrictsByProvince('xyz');
} catch (Exception $e) {
    $threwError = true;
} catch (ValueError $e) {
    $threwError = true;
}
test('Província inválida lança erro', $threwError, true);

$all = MozUtils::getAllDistricts();
test('Total de distritos de Moçambique → 161', count($all), 161);
test('Primeiro distrito retornado name → "Ancuabe"', $all[0]['name'], 'Ancuabe');
test('Primeiro distrito provinceId → "cab"', $all[0]['provinceId'], 'cab');

test('Ancuabe postos_administrativos', $all[0]['postos_administrativos'], ['Ancuabe', 'Metoro', 'Meza']);
test('Ancuabe bairros', $all[0]['bairros'], []);

$pemba = null;
foreach ($all as $d) {
    if ($d['name'] === 'Pemba (Cidade)') {
        $pemba = $d;
        break;
    }
}
test('Pemba (Cidade) postos_administrativos', $pemba['postos_administrativos'], ['Pemba']);
test('Pemba (Cidade) bairros', $pemba['bairros'], ['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue']);

$majune = null;
foreach ($all as $d) {
    if ($d['name'] === 'Majune') {
        $majune = $d;
        break;
    }
}
test('Majune postos_administrativos (Mua corrigido)', $majune['postos_administrativos'], ['Majune', 'Mua', 'Nairrobi']);

$maxixe = null;
foreach ($all as $d) {
    if ($d['name'] === 'Maxixe (Cidade)') {
        $maxixe = $d;
        break;
    }
}
test('Maxixe (Cidade) bairros (Bairro Central corrigido)', $maxixe['bairros'], ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']);

$nampula = null;
foreach ($all as $d) {
    if ($d['name'] === 'Nampula (Cidade)') {
        $nampula = $d;
        break;
    }
}
test('Nampula (Cidade) bairros contêm Namutequeliua', in_array('Namutequeliua', $nampula['bairros']), true);

// --- Código Postal ---
echo "\n✉️ TESTES DE CÓDIGO POSTAL\n";
echo str_repeat("─", 50) . "\n";

test('Código postal válido (1100)', MozUtils::isValidPostalCode('1100'), true);
test('Código postal com espaços (1101)', MozUtils::isValidPostalCode(' 1101 '), true);
test('Código postal com traço (1102)', MozUtils::isValidPostalCode('11-02'), true);
test('Código postal válido (1202)', MozUtils::isValidPostalCode('1202'), true);
test('Código postal válido (3311)', MozUtils::isValidPostalCode('3311'), true);
test('Código postal inválido (1199)', MozUtils::isValidPostalCode('1199'), false);
test('Código postal muito longo', MozUtils::isValidPostalCode('11000'), false);
test('Código postal muito curto', MozUtils::isValidPostalCode('110'), false);
test('Código postal não numérico', MozUtils::isValidPostalCode('ABCD'), false);

test('Localidade de 1100', MozUtils::getPostalCodeLocality('1100'), 'Maputo ECP (Sede)');
test('Localidade de 1205', MozUtils::getPostalCodeLocality('1205'), 'Chilembene / Magoanine');
test('Província de 1100', MozUtils::getPostalCodeProvince('1100'), 'Maputo');
test('Província de 2100', MozUtils::getPostalCodeProvince('2100'), 'Sofala');
test('Província de 3311', MozUtils::getPostalCodeProvince('3311'), 'Niassa');
test('Localidade de inválido', MozUtils::getPostalCodeLocality('9999'), null);
test('Província de inválido', MozUtils::getPostalCodeProvince('9999'), null);

// --- RESULTADO ---
echo "\n" . str_repeat("═", 50) . "\n";
echo "📊 RESULTADO: $passed passaram, $failed falharam (Total: " . ($passed + $failed) . ")\n";
echo str_repeat("═", 50) . "\n";
if ($failed === 0) {
    echo "🎉 TODOS OS TESTES PASSARAM!\n";
} else {
    echo "⚠️ Existem testes que falharam!\n";
}

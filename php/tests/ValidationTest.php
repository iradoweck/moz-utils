<?php

declare(strict_types=1);

namespace Iradoweck\MozUtils\Tests;

use PHPUnit\Framework\TestCase;
use Iradoweck\MozUtils\MozUtils;
use Iradoweck\MozUtils\Bank;

class ValidationTest extends TestCase
{
    private function generateValidNUIT(string $first8): string
    {
        $weights = [8, 9, 4, 5, 6, 7, 8, 9];
        $sum = 0;
        for ($i = 0; $i < 8; $i++) {
            $sum += intval($first8[$i]) * $weights[$i];
        }
        $remainder = $sum % 11;
        $checkMap = "01234567891";
        $checkDigit = $checkMap[$remainder];
        return $first8 . $checkDigit;
    }

    private function generateValidNIB(string $bankCode = '0001', string $branch = '0000', string $account = '12345678901'): string
    {
        $first19 = $bankCode . $branch . $account;
        $remainder = 0;
        for ($i = 0; $i < 19; $i++) {
            $remainder = ($remainder * 10 + (int)$first19[$i]) % 97;
        }
        $remainder = ($remainder * 100) % 97;
        $k = 98 - $remainder;
        return $first19 . sprintf('%02d', $k);
    }

    public function testNuitValidation(): void
    {
        $nuitSingular = $this->generateValidNUIT('10000000');
        $this->assertTrue(MozUtils::isValidNUIT($nuitSingular));
        $this->assertTrue(MozUtils::isValidNUIT($this->generateValidNUIT('20000000')));
        $this->assertTrue(MozUtils::isValidNUIT($this->generateValidNUIT('30000000')));
        $this->assertTrue(MozUtils::isValidNUIT($this->generateValidNUIT('40000000')));
        $this->assertTrue(MozUtils::isValidNUIT($this->generateValidNUIT('50000000')));
        
        $this->assertFalse(MozUtils::isValidNUIT('012345678'));
        $this->assertFalse(MozUtils::isValidNUIT('1234'));
        $this->assertFalse(MozUtils::isValidNUIT('1234567890'));
        $this->assertFalse(MozUtils::isValidNUIT('111111111'));
        $this->assertFalse(MozUtils::isValidNUIT(substr($nuitSingular, 0, 8) . '9'));
    }

    public function testNuitClassification(): void
    {
        $this->assertEquals('Pessoas Singulares', MozUtils::getNUITEntityType($this->generateValidNUIT('10000000')));
        $this->assertEquals('Pessoas Singulares', MozUtils::getNUITEntityType($this->generateValidNUIT('20000000')));
        $this->assertEquals('Pessoas Singulares', MozUtils::getNUITEntityType($this->generateValidNUIT('30000000')));
        $this->assertEquals('Pessoas Colectivas', MozUtils::getNUITEntityType($this->generateValidNUIT('40000000')));
        $this->assertEquals('Pessoas Colectivas', MozUtils::getNUITEntityType($this->generateValidNUIT('50000000')));
        $this->assertEquals('Entidades Equiparadas', MozUtils::getNUITEntityType($this->generateValidNUIT('60000000')));
        $this->assertEquals('Estado / Públicas', MozUtils::getNUITEntityType($this->generateValidNUIT('70000000')));
        $this->assertEquals('Outras Entidades', MozUtils::getNUITEntityType($this->generateValidNUIT('80000000')));
        $this->assertEquals('Entidades Estrangeiras', MozUtils::getNUITEntityType($this->generateValidNUIT('90000000')));
        $this->assertNull(MozUtils::getNUITEntityType('000000000'));
    }

    public function testPhoneValidation(): void
    {
        $this->assertTrue(MozUtils::isValidMozambicanPhone('841234567'));
        $this->assertTrue(MozUtils::isValidMozambicanPhone('851234567'));
        $this->assertTrue(MozUtils::isValidMozambicanPhone('821234567'));
        $this->assertTrue(MozUtils::isValidMozambicanPhone('831234567'));
        $this->assertTrue(MozUtils::isValidMozambicanPhone('861234567'));
        $this->assertTrue(MozUtils::isValidMozambicanPhone('871234567'));
        $this->assertTrue(MozUtils::isValidMozambicanPhone('881234567'));

        $this->assertFalse(MozUtils::isValidMozambicanPhone('811234567'));
        $this->assertFalse(MozUtils::isValidMozambicanPhone('891234567'));
        $this->assertFalse(MozUtils::isValidMozambicanPhone('801234567'));
        $this->assertFalse(MozUtils::isValidMozambicanPhone('911234567'));

        $this->assertTrue(MozUtils::isValidMozambicanPhone('+258 84 123 4567'));
        $this->assertTrue(MozUtils::isValidMozambicanPhone('+258841234567'));
        $this->assertTrue(MozUtils::isValidMozambicanPhone('84 123 4567'));
    }

    public function testOperators(): void
    {
        $this->assertEquals('Vodacom', MozUtils::getMobileOperator('841234567'));
        $this->assertEquals('Vodacom', MozUtils::getMobileOperator('851234567'));
        $this->assertEquals('Tmcel', MozUtils::getMobileOperator('821234567'));
        $this->assertEquals('Tmcel', MozUtils::getMobileOperator('831234567'));
        $this->assertEquals('Movitel', MozUtils::getMobileOperator('861234567'));
        $this->assertEquals('Movitel', MozUtils::getMobileOperator('871234567'));
        $this->assertEquals('Movitel', MozUtils::getMobileOperator('881234567'));
        $this->assertNull(MozUtils::getMobileOperator('911234567'));
    }

    public function testPhoneFormatting(): void
    {
        $this->assertEquals('+258 84 123 4567', MozUtils::formatMozambicanPhone('841234567'));
        $this->assertEquals('+258 84 123 4567', MozUtils::formatMozambicanPhone('258841234567'));
        $this->assertEquals('+258 84 123 4567', MozUtils::formatMozambicanPhone('+258 84 123 4567'));
        $this->assertEquals('+258 82 123 4567', MozUtils::formatMozambicanPhone('82-123-4567'));
    }

    public function testPhoneFormattingInvalid(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        MozUtils::formatMozambicanPhone('911234567');
    }

    public function testMobileWallets(): void
    {
        $this->assertEquals('M-Pesa', MozUtils::getMobileWallet('841234567'));
        $this->assertEquals('M-Pesa', MozUtils::getMobileWallet('851234567'));
        $this->assertEquals('mKesh', MozUtils::getMobileWallet('821234567'));
        $this->assertEquals('mKesh', MozUtils::getMobileWallet('831234567'));
        $this->assertEquals('e-Mola', MozUtils::getMobileWallet('861234567'));
        $this->assertEquals('e-Mola', MozUtils::getMobileWallet('871234567'));
        $this->assertEquals('e-Mola', MozUtils::getMobileWallet('881234567'));
        $this->assertNull(MozUtils::getMobileWallet('911234567'));
    }

    public function testBuildWhatsAppUrl(): void
    {
        $this->assertEquals('https://wa.me/258841234567', MozUtils::buildWhatsAppUrl('841234567'));
        $this->assertEquals('https://wa.me/258841234567', MozUtils::buildWhatsAppUrl('+258 84 123 4567'));
        $this->assertEquals('https://wa.me/258841234567?text=Ol%C3%A1%2C%20tudo%20bem%3F', MozUtils::buildWhatsAppUrl('841234567', 'Olá, tudo bem?'));
    }

    public function testBiValidation(): void
    {
        $this->assertTrue(MozUtils::isValidBI('110101234567A'));
        $this->assertTrue(MozUtils::isValidBI('110101234567 A'));
        $this->assertTrue(MozUtils::isValidBI('110101234567a'));
        $this->assertFalse(MozUtils::isValidBI('1101012345670'));
        $this->assertFalse(MozUtils::isValidBI('11010123456A'));
    }

    public function testCurrencyFormatting(): void
    {
        $this->assertEquals('1 500,00 MT', MozUtils::formatMZN(1500));
        $this->assertEquals('0,50 MT', MozUtils::formatMZN(0.5));
        $this->assertEquals('1 000 000,00 MT', MozUtils::formatMZN(1000000));
        $this->assertEquals('99,99 MT', MozUtils::formatMZN(99.99));
        $this->assertEquals('0,00 MT', MozUtils::formatMZN(0));
        $this->assertEquals('999,00 MT', MozUtils::formatMZN(999));
        $this->assertEquals('-500,00 MT', MozUtils::formatMZN(-500));
        $this->assertEquals('-1 500,00 MT', MozUtils::formatMZN(-1500));
        $this->assertEquals('1 500,00 MZN', MozUtils::formatMZN(1500, 'MZN'));
    }

    public function testCurrencyParsing(): void
    {
        $this->assertEquals(1500.0, MozUtils::parseMZN('1.500,00 MT'));
        $this->assertEquals(1500.0, MozUtils::parseMZN('1 500,00 MT'));
        $this->assertEquals(250000.5, MozUtils::parseMZN('250.000,50MZN'));
        $this->assertEquals(450.0, MozUtils::parseMZN('450 MT'));
        $this->assertEquals(1500.0, MozUtils::parseMZN('1,500.00'));
        $this->assertEquals(-500.0, MozUtils::parseMZN('-500,00 MT'));
        $this->assertEquals(0.0, MozUtils::parseMZN('0,00 MT'));
        $this->assertNull(MozUtils::parseMZN('invalido'));
        $this->assertNull(MozUtils::parseMZN('-'));
        $this->assertNull(MozUtils::parseMZN(''));
    }

    public function testPassportValidation(): void
    {
        $this->assertTrue(MozUtils::isValidPassport('AO1234567'));
        $this->assertTrue(MozUtils::isValidPassport('ao1234567'));
        $this->assertTrue(MozUtils::isValidPassport('AO-1234567'));
        $this->assertTrue(MozUtils::isValidPassport('AO 1234567'));
        $this->assertFalse(MozUtils::isValidPassport('A1234567'));
        $this->assertFalse(MozUtils::isValidPassport('AOO1234567'));
        $this->assertFalse(MozUtils::isValidPassport('AO123456'));
        $this->assertFalse(MozUtils::isValidPassport('121234567'));
    }

    public function testNewCepAndSuggestions(): void
    {
        $this->assertTrue(MozUtils::isValidNewCEP('3100-01'));
        $this->assertTrue(MozUtils::isValidNewCEP('0909-09'));
        $this->assertFalse(MozUtils::isValidNewCEP('3100'));
        $this->assertFalse(MozUtils::isValidNewCEP('3100-001'));
        $this->assertFalse(MozUtils::isValidNewCEP('ABCD-EF'));

        $this->assertEmpty(MozUtils::suggestCEPs(''));

        $sugLegacy = MozUtils::suggestCEPs('3100');
        $this->assertNotEmpty($sugLegacy);
        foreach ($sugLegacy as $item) {
            $this->assertStringStartsWith('0909', $item['cep']);
        }

        $sugText = MozUtils::suggestCEPs('Namutequeliua');
        $this->assertNotEmpty($sugText);
        $found = false;
        foreach ($sugText as $item) {
            if ($item['locality'] === 'Namutequeliua') {
                $found = true;
                break;
            }
        }
        $this->assertTrue($found);
    }

    public function testNameValidationAndSanitization(): void
    {
        $this->assertTrue(MozUtils::isValidName('Edmilson Muacigarro'));
        $this->assertTrue(MozUtils::isValidName("João O'Brian"));
        $this->assertTrue(MozUtils::isValidName('Jean-Pierre Dupont'));
        $this->assertTrue(MozUtils::isValidName('Maria da Silva'));
        $this->assertFalse(MozUtils::isValidName('---'));
        $this->assertFalse(MozUtils::isValidName('   '));
        $this->assertFalse(MozUtils::isValidName('123'));
        $this->assertFalse(MozUtils::isValidName('A')); // Exige pelo menos 2 caracteres alfabéticos
        $this->assertFalse(MozUtils::isValidName('A-'));

        $this->assertEquals('Edmilson Muacigarro', MozUtils::sanitizeName('  edmilson   muacigarro  '));
        $this->assertEquals('Maria da Silva e Santos', MozUtils::sanitizeName('maria da silva e santos'));
        $this->assertEquals('João de Sousa', MozUtils::sanitizeName('joão de sousa'));
        $this->assertEquals('Jean-Pierre Dupont', MozUtils::sanitizeName('jean-pierre dupont'));
        $this->assertEquals('EDMILSON MUACIGARRO', MozUtils::sanitizeName('edmilson muacigarro', true));
        $this->assertEquals('', MozUtils::sanitizeName(''));
    }

    public function testDocumentAndAlphanumericSanitization(): void
    {
        $this->assertEquals('1234567890', MozUtils::sanitizeDocumentField('123.456.789-0'));
        $this->assertEquals('258841234567', MozUtils::sanitizeDocumentField(' +258 84 123 4567 '));

        $this->assertEquals('110101234567A', MozUtils::sanitizeAlphanumericField('110 101 234567a'));
        $this->assertEquals('ABC123XYZ', MozUtils::sanitizeAlphanumericField('abc-123-xyz!'));
    }

    public function testDistricts(): void
    {
        $this->assertCount(17, MozUtils::getDistrictsByProvince('cab'));
        $this->assertEquals('Ancuabe', MozUtils::getDistrictsByProvince('cab')[0]);
        $this->assertCount(17, MozUtils::getDistrictsByProvince('CaB'));
        $this->assertCount(7, MozUtils::getDistrictsByProvince('mpc'));

        $this->expectException(\InvalidArgumentException::class);
        MozUtils::getDistrictsByProvince('xyz');
    }

    public function testFlexibleDistrictSearch(): void
    {
        $cabById = MozUtils::getDistrictsByProvince('cab');
        $this->assertCount(17, $cabById);

        // Busca por sigla
        $this->assertEquals($cabById, MozUtils::getDistrictsByProvince('CBD'));

        // Busca por nome
        $this->assertEquals($cabById, MozUtils::getDistrictsByProvince('Cabo Delgado'));

        // Nampula
        $this->assertEquals(MozUtils::getDistrictsByProvince('npl'), MozUtils::getDistrictsByProvince('Nampula'));
        $this->assertEquals(MozUtils::getDistrictsByProvince('npl'), MozUtils::getDistrictsByProvince('NPL'));

        // Zambézia (com e sem acento)
        $this->assertEquals(MozUtils::getDistrictsByProvince('Zambézia'), MozUtils::getDistrictsByProvince('Zambezia'));

        // Maputo Província por padrão
        $mpp = MozUtils::getDistrictsByProvince('mpp');
        $mpc = MozUtils::getDistrictsByProvince('mpc');
        $this->assertEquals($mpp, MozUtils::getDistrictsByProvince('Maputo'));
        $this->assertEquals($mpp, MozUtils::getDistrictsByProvince('Maputo (Província)'));
        $this->assertEquals($mpp, MozUtils::getDistrictsByProvince('Maputo Província'));
        $this->assertEquals($mpp, MozUtils::getDistrictsByProvince('MPT'));

        // Maputo Cidade
        $this->assertEquals($mpc, MozUtils::getDistrictsByProvince('Maputo (Cidade)'));
        $this->assertEquals($mpc, MozUtils::getDistrictsByProvince('Maputo Cidade'));
        $this->assertEquals($mpc, MozUtils::getDistrictsByProvince('MC'));
    }

    public function testAllDistricts(): void
    {
        $all = MozUtils::getAllDistricts();
        $this->assertCount(161, $all);
        $this->assertEquals('Ancuabe', $all[0]['name']);
        $this->assertEquals('cab', $all[0]['provinceId']);
        
        $this->assertEquals(['Ancuabe', 'Metoro', 'Meza'], $all[0]['administrative_posts']);
        $this->assertEquals([], $all[0]['neighborhoods']);
        
        $pemba = null;
        foreach ($all as $d) {
            if ($d['name'] === 'Pemba (Cidade)') {
                $pemba = $d;
                break;
            }
        }
        $this->assertNotNull($pemba);
        $this->assertEquals(['Pemba'], $pemba['administrative_posts']);
        $this->assertEquals(['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue'], $pemba['neighborhoods']);
    }

    public function testPostalCodes(): void
    {
        $this->assertTrue(MozUtils::isValidPostalCode('1100'));
        $this->assertTrue(MozUtils::isValidPostalCode(' 1101 '));
        $this->assertTrue(MozUtils::isValidPostalCode('11-02'));
        $this->assertTrue(MozUtils::isValidPostalCode('3311'));
        
        $this->assertFalse(MozUtils::isValidPostalCode('1199'));
        $this->assertFalse(MozUtils::isValidPostalCode('ABCD'));
        
        $this->assertEquals('Maputo ECP (Sede)', MozUtils::getPostalCodeLocality('1100'));
        $this->assertEquals('Maputo', MozUtils::getPostalCodeProvince('1100'));
        $this->assertNull(MozUtils::getPostalCodeLocality('9999'));
        $this->assertNull(MozUtils::getPostalCodeProvince('9999'));
    }

    public function testDireAndDrivingLicense(): void
    {
        $this->assertTrue(MozUtils::isValidDIRE('00008312C'));
        $this->assertTrue(MozUtils::isValidDIRE('12C00008312C'));
        $this->assertTrue(MozUtils::isValidDIRE('120345678A'));
        $this->assertFalse(MozUtils::isValidDIRE('0000831C'));
        $this->assertFalse(MozUtils::isValidDIRE('A0008312C'));
        
        $this->assertTrue(MozUtils::isValidDrivingLicense('M123456'));
        $this->assertTrue(MozUtils::isValidDrivingLicense('MP1234567'));
        $this->assertTrue(MozUtils::isValidDrivingLicense('m-123456'));
        $this->assertTrue(MozUtils::isValidDrivingLicense('mp-1234567'));
        $this->assertFalse(MozUtils::isValidDrivingLicense('123456'));
        $this->assertFalse(MozUtils::isValidDrivingLicense('MMM1234567'));
    }

    public function testBankingModule(): void
    {
        $this->assertCount(22, Bank::BANKS);
        $this->assertCount(22, MozUtils::BANKS);
        $this->assertArrayHasKey('0001', Bank::BANKS);
        $this->assertEquals('Millennium BIM', Bank::BANKS['0001']['short_name']);
        $this->assertEquals('Absa', Bank::BANKS['0006']['short_name']);
        $this->assertEquals('BCI', Bank::BANKS['0008']['short_name']);
        $this->assertEquals('Standard Bank', Bank::BANKS['0003']['short_name']);
        $this->assertEquals('Moza Banco', Bank::BANKS['0016']['short_name']);
        $this->assertEquals('Moza Banco', Bank::BANKS['0034']['short_name']);
        $this->assertEquals('Letshego', Bank::BANKS['0041']['short_name']);
        $this->assertEquals('Letshego', Bank::BANKS['0056']['short_name']);

        // Geração e validação de NIB válido
        $validBim = $this->generateValidNIB('0001', '0000', '12345678901');
        $validBci = $this->generateValidNIB('0008', '0123', '00001234567');
        $validSb  = $this->generateValidNIB('0003', '9999', '11112222333');

        $this->assertTrue(Bank::isValidNIB($validBim));
        $this->assertTrue(MozUtils::isValidNIB($validBim));
        $this->assertTrue(Bank::isValidNIB($validBci));
        $this->assertTrue(Bank::isValidNIB($validSb));
        $this->assertTrue(Bank::isValidNIB(" " . substr($validBim, 0, 4) . " " . substr($validBim, 4, 4) . " " . substr($validBim, 8, 11) . " " . substr($validBim, 19, 2) . " "));

        // Validação de paridade BM e SIMO (Moza 0016 e 0034, Absa 0006 e Letshego 0041/0056)
        $validMozaBM   = $this->generateValidNIB('0016', '0002', '00555666777');
        $validMozaSIMO = $this->generateValidNIB('0034', '0002', '00555666777');
        $this->assertTrue(Bank::isValidNIB($validMozaBM));
        $this->assertTrue(Bank::isValidNIB($validMozaSIMO));

        $validAbsaBM   = $this->generateValidNIB('0006', '0005', '00999888777');
        $validLetsBM   = $this->generateValidNIB('0041', '0001', '00123456789');
        $validLetsSIMO = $this->generateValidNIB('0056', '0001', '00123456789');
        $this->assertTrue(Bank::isValidNIB($validAbsaBM));
        $this->assertTrue(Bank::isValidNIB($validLetsBM));
        $this->assertTrue(Bank::isValidNIB($validLetsSIMO));

        $validFcbBM   = $this->generateValidNIB('0038', '0001', '00123456789');
        $validFcbSIMO = $this->generateValidNIB('0043', '0001', '00123456789');
        $validBniBM   = $this->generateValidNIB('0025', '0001', '00123456789');
        $validBniSIMO = $this->generateValidNIB('0057', '0001', '00123456789');
        $this->assertTrue(Bank::isValidNIB($validFcbBM));
        $this->assertTrue(Bank::isValidNIB($validFcbSIMO));
        $this->assertTrue(Bank::isValidNIB($validBniBM));
        $this->assertTrue(Bank::isValidNIB($validBniSIMO));

        // NIB inválido por tamanho ou caracteres
        $this->assertFalse(Bank::isValidNIB('0001000012345678901')); // 20 dígitos
        $this->assertFalse(Bank::isValidNIB('0001000012345678901940')); // 22 dígitos
        $this->assertFalse(Bank::isValidNIB('letras_e_digitos_12345'));

        // Banco inexistente
        $fakeBankNib = $this->generateValidNIB('9999', '0000', '12345678901');
        $this->assertFalse(Bank::isValidNIB($fakeBankNib));

        // Dígitos de controlo adulterados
        $tamperedK = substr($validBim, 19, 2) === '00' ? '01' : '00';
        $this->assertFalse(Bank::isValidNIB(substr($validBim, 0, 19) . $tamperedK));

        // Formatação
        $expectedFormat = substr($validBim, 0, 4) . '.' . substr($validBim, 4, 4) . '.' . substr($validBim, 8, 11) . '.' . substr($validBim, 19, 2);
        $this->assertEquals($expectedFormat, Bank::formatNIB($validBim));
        $this->assertEquals($expectedFormat, MozUtils::formatNIB($validBim));

        // Dados do banco
        $bankData = Bank::getBankByNIB($validBim);
        $this->assertNotNull($bankData);
        $this->assertEquals('0001', $bankData['code']);
        $this->assertEquals('Millennium BIM', $bankData['short_name']);
        $this->assertNull(Bank::getBankByNIB('999900001234567890100'));
        $this->assertNull(Bank::getBankByNIB('12'));

        // IBAN
        $iban = Bank::nibToIBAN($validBim);
        $this->assertEquals("MZ59{$validBim}", $iban);
        $this->assertEquals("MZ59{$validBim}", MozUtils::nibToIBAN($validBim));
        $this->assertTrue(Bank::isValidIBAN($iban));
        $this->assertTrue(MozUtils::isValidIBAN($iban));
        $this->assertTrue(Bank::isValidIBAN("  {$iban}  "));
        $this->assertTrue(Bank::isValidIBAN("MZ59 " . substr($validBim, 0, 4) . " " . substr($validBim, 4, 4) . " " . substr($validBim, 8, 11) . " " . substr($validBim, 19, 2)));

        // IBANs inválidos
        $this->assertFalse(Bank::isValidIBAN('PT50' . $validBim));
        $this->assertFalse(Bank::isValidIBAN('MZ59' . substr($validBim, 0, 19) . $tamperedK));
        $this->assertFalse(Bank::isValidIBAN('MZ58' . $validBim));
        $this->assertFalse(Bank::isValidIBAN('MZ591234'));
    }

    public function testBankFormatInvalidNIB(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        Bank::formatNIB('00011234');
    }

    public function testBankNibToIbanInvalidNIB(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        Bank::nibToIBAN('00011234');
    }
}

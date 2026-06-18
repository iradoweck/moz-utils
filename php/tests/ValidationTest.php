<?php

namespace Iradoweck\MozUtils\Tests;

use PHPUnit\Framework\TestCase;
use Iradoweck\MozUtils\MozUtils;

class ValidationTest extends TestCase
{
    private function generateValidNUIT($first8) {
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

    public function testNuitValidation()
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

    public function testNuitClassification()
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

    public function testPhoneValidation()
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

    public function testOperators()
    {
        $this->assertEquals('Vodacom', MozUtils::getMobileOperator('841234567'));
        $this->assertEquals('Tmcel', MozUtils::getMobileOperator('821234567'));
        $this->assertEquals('Movitel', MozUtils::getMobileOperator('861234567'));
        $this->assertNull(MozUtils::getMobileOperator('911234567'));
    }

    public function testBiValidation()
    {
        $this->assertTrue(MozUtils::isValidBI('110101234567A'));
        $this->assertTrue(MozUtils::isValidBI('110101234567 A'));
        $this->assertTrue(MozUtils::isValidBI('110101234567a'));
        $this->assertFalse(MozUtils::isValidBI('1101012345670'));
        $this->assertFalse(MozUtils::isValidBI('11010123456A'));
    }

    public function testCurrencyFormatting()
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

    public function testDistricts()
    {
        $this->assertCount(17, MozUtils::getDistrictsByProvince('cab'));
        $this->assertEquals('Ancuabe', MozUtils::getDistrictsByProvince('cab')[0]);
        $this->assertCount(17, MozUtils::getDistrictsByProvince('CaB'));
        $this->assertCount(7, MozUtils::getDistrictsByProvince('mpc'));

        $this->expectException(\InvalidArgumentException::class);
        MozUtils::getDistrictsByProvince('xyz');
    }

    public function testAllDistricts()
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

    public function testPostalCodes()
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

    public function testDireAndDrivingLicense()
    {
        $this->assertTrue(MozUtils::isValidDIRE('00008312C'));
        $this->assertTrue(MozUtils::isValidDIRE('12C00008312C'));
        $this->assertFalse(MozUtils::isValidDIRE('0000831C'));
        
        $this->assertTrue(MozUtils::isValidDrivingLicense('M123456'));
        $this->assertTrue(MozUtils::isValidDrivingLicense('MP1234567'));
        $this->assertFalse(MozUtils::isValidDrivingLicense('123456'));
    }
}

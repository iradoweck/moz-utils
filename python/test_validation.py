import unittest
from moz_utils import (
    is_valid_nuit,
    get_nuit_entity_type,
    is_valid_mozambican_phone,
    get_mobile_operator,
    is_valid_bi,
    format_mzn,
    get_districts_by_province,
    get_all_districts,
    is_valid_postal_code,
    get_postal_code_locality,
    get_postal_code_province
)

def generate_valid_nuit(first8: str) -> str:
    total_sum = 0
    for i in range(8):
        total_sum += int(first8[i]) * (9 - i)
    remainder = total_sum % 11
    check_digit = 0 if remainder <= 1 else 11 - remainder
    return first8 + str(check_digit)

class TestMozUtils(unittest.TestCase):
    def setUp(self):
        self.nuit_singular = generate_valid_nuit('10000000')
        self.nuit_singular2 = generate_valid_nuit('20000000')
        self.nuit_equiparada = generate_valid_nuit('30000000')
        self.nuit_colectiva = generate_valid_nuit('40000000')
        self.nuit_publico = generate_valid_nuit('50000000')

    def test_nuit_validation(self):
        self.assertTrue(is_valid_nuit(self.nuit_singular))
        self.assertTrue(is_valid_nuit(self.nuit_singular2))
        self.assertTrue(is_valid_nuit(self.nuit_equiparada))
        self.assertTrue(is_valid_nuit(self.nuit_colectiva))
        self.assertTrue(is_valid_nuit(self.nuit_publico))
        
        self.assertFalse(is_valid_nuit('012345678'))
        self.assertFalse(is_valid_nuit('612345678'))
        self.assertFalse(is_valid_nuit('912345678'))
        self.assertFalse(is_valid_nuit('1234'))
        self.assertFalse(is_valid_nuit('1234567890'))
        self.assertFalse(is_valid_nuit('111111111'))
        self.assertFalse(is_valid_nuit(self.nuit_singular[:-1] + '9'))

    def test_nuit_classification(self):
        self.assertEqual(get_nuit_entity_type(self.nuit_singular), 'Singular (Cidadãos nacionais/estrangeiros e ENI)')
        self.assertEqual(get_nuit_entity_type(self.nuit_singular2), 'Singular (Cidadãos nacionais/estrangeiros e ENI)')
        self.assertEqual(get_nuit_entity_type(self.nuit_equiparada), 'Equiparada (Heranças Jacentes, Consórcios)')
        self.assertEqual(get_nuit_entity_type(self.nuit_colectiva), 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)')
        self.assertEqual(get_nuit_entity_type(self.nuit_publico), 'Público (Instituições do Estado e Ministérios)')
        self.assertIsNone(get_nuit_entity_type('000000000'))

    def test_phone_validation(self):
        self.assertTrue(is_valid_mozambican_phone('841234567'))
        self.assertTrue(is_valid_mozambican_phone('851234567'))
        self.assertTrue(is_valid_mozambican_phone('821234567'))
        self.assertTrue(is_valid_mozambican_phone('831234567'))
        self.assertTrue(is_valid_mozambican_phone('861234567'))
        self.assertTrue(is_valid_mozambican_phone('871234567'))
        self.assertTrue(is_valid_mozambican_phone('881234567'))
        
        self.assertFalse(is_valid_mozambican_phone('811234567'))
        self.assertFalse(is_valid_mozambican_phone('891234567'))
        self.assertFalse(is_valid_mozambican_phone('801234567'))
        self.assertFalse(is_valid_mozambican_phone('911234567'))
        
        self.assertTrue(is_valid_mozambican_phone('+258 84 123 4567'))
        self.assertTrue(is_valid_mozambican_phone('+258841234567'))
        self.assertTrue(is_valid_mozambican_phone('84 123 4567'))

    def test_operators(self):
        self.assertEqual(get_mobile_operator('841234567'), 'Vodacom')
        self.assertEqual(get_mobile_operator('851234567'), 'Vodacom')
        self.assertEqual(get_mobile_operator('821234567'), 'Tmcel')
        self.assertEqual(get_mobile_operator('831234567'), 'Tmcel')
        self.assertEqual(get_mobile_operator('861234567'), 'Movitel')
        self.assertEqual(get_mobile_operator('871234567'), 'Movitel')
        self.assertEqual(get_mobile_operator('881234567'), 'Movitel')
        self.assertIsNone(get_mobile_operator('911234567'))

    def test_bi_validation(self):
        self.assertTrue(is_valid_bi('110101234567A'))
        self.assertTrue(is_valid_bi('110101234567 A'))
        self.assertTrue(is_valid_bi('110101234567a'))
        self.assertFalse(is_valid_bi('1101012345670'))
        self.assertFalse(is_valid_bi('11010123456A'))

    def test_currency_formatting(self):
        self.assertEqual(format_mzn(1500), '1 500,00 MT')
        self.assertEqual(format_mzn(0.5), '0,50 MT')
        self.assertEqual(format_mzn(1000000), '1 000 000,00 MT')
        self.assertEqual(format_mzn(99.99), '99,99 MT')
        self.assertEqual(format_mzn(0), '0,00 MT')
        self.assertEqual(format_mzn(999), '999,00 MT')
        self.assertEqual(format_mzn(1000), '1 000,00 MT')
        self.assertEqual(format_mzn(-500), '-500,00 MT')
        self.assertEqual(format_mzn(-1500), '-1 500,00 MT')
        self.assertEqual(format_mzn(1500, 'MZN'), '1 500,00 MZN')
        self.assertEqual(format_mzn(50000, 'MZN'), '50 000,00 MZN')

    def test_districts(self):
        self.assertEqual(len(get_districts_by_province('cab')), 17)
        self.assertEqual(get_districts_by_province('cab')[0], 'Ancuabe')
        self.assertEqual(len(get_districts_by_province('CaB')), 17)
        self.assertEqual(len(get_districts_by_province('mpc')), 7)
        
        with self.assertRaises(ValueError):
            get_districts_by_province('xyz')
            
        all_districts = get_all_districts()
        self.assertEqual(len(all_districts), 161)
        self.assertEqual(all_districts[0]['name'], 'Ancuabe')
        self.assertEqual(all_districts[0]['provinceId'], 'cab')
        
        # Test postos administrativos & neighborhoods
        self.assertEqual(all_districts[0]['administrative_posts'], ['Ancuabe', 'Metoro', 'Meza'])
        self.assertEqual(all_districts[0]['neighborhoods'], [])
        
        pemba = next(d for d in all_districts if d['name'] == 'Pemba (Cidade)')
        self.assertEqual(pemba['administrative_posts'], ['Pemba'])
        self.assertEqual(pemba['neighborhoods'], ['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue'])
        
        majune = next(d for d in all_districts if d['name'] == 'Majune')
        self.assertEqual(majune['administrative_posts'], ['Majune', 'Mua', 'Nairrobi'])
        
        maxixe = next(d for d in all_districts if d['name'] == 'Maxixe (Cidade)')
        self.assertEqual(maxixe['neighborhoods'], ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi'])
        
        nampula = next(d for d in all_districts if d['name'] == 'Nampula (Cidade)')
        self.assertIn('Namutequeliua', nampula['neighborhoods'])

    def test_postal_codes(self):
        self.assertTrue(is_valid_postal_code('1100'))
        self.assertTrue(is_valid_postal_code(' 1101 '))
        self.assertTrue(is_valid_postal_code('11-02'))
        self.assertTrue(is_valid_postal_code('1202'))
        self.assertTrue(is_valid_postal_code('3311'))
        
        self.assertFalse(is_valid_postal_code('1199'))
        self.assertFalse(is_valid_postal_code('11000'))
        self.assertFalse(is_valid_postal_code('110'))
        self.assertFalse(is_valid_postal_code('ABCD'))
        
        self.assertEqual(get_postal_code_locality('1100'), 'Maputo ECP (Sede)')
        self.assertEqual(get_postal_code_locality('1205'), 'Chilembene / Magoanine')
        self.assertEqual(get_postal_code_province('1100'), 'Maputo')
        self.assertEqual(get_postal_code_province('2100'), 'Sofala')
        self.assertEqual(get_postal_code_province('3311'), 'Niassa')
        self.assertIsNone(get_postal_code_locality('9999'))
        self.assertIsNone(get_postal_code_province('9999'))

if __name__ == '__main__':
    unittest.main()

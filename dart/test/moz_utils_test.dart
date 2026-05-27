import 'package:test/test.dart';
import 'package:moz_utils/moz_utils.dart';

String generateValidNUIT(String first8) {
  int sum = 0;
  for (int i = 0; i < 8; i++) {
    sum += int.parse(first8[i]) * (9 - i);
  }
  int remainder = sum % 11;
  int checkDigit = remainder <= 1 ? 0 : 11 - remainder;
  return '$first8$checkDigit';
}

void main() {
  group('Testes do NUIT (Módulo 11)', () {
    final nuitSingular = generateValidNUIT('10000000');
    final nuitSingular2 = generateValidNUIT('20000000');
    final nuitEquivalent = generateValidNUIT('30000000');
    final nuitCollective = generateValidNUIT('40000000');
    final nuitPublico = generateValidNUIT('50000000');

    test('Valid Singular NUIT', () {
      expect(MozUtils.isValidNUIT(nuitSingular), isTrue);
    });

    test('Valid Singular2 NUIT', () {
      expect(MozUtils.isValidNUIT(nuitSingular2), isTrue);
    });

    test('Valid Equivalent NUIT', () {
      expect(MozUtils.isValidNUIT(nuitEquivalent), isTrue);
    });

    test('Valid Collective NUIT', () {
      expect(MozUtils.isValidNUIT(nuitCollective), isTrue);
    });

    test('Valid Public NUIT', () {
      expect(MozUtils.isValidNUIT(nuitPublico), isTrue);
    });

    test('NUIT that starts with 0 → invalid', () {
      expect(MozUtils.isValidNUIT('012345678'), isFalse);
    });

    test('NUIT that starts with 6 → invalid', () {
      expect(MozUtils.isValidNUIT('612345678'), isFalse);
    });

    test('NUIT that starts with 9 → invalid', () {
      expect(MozUtils.isValidNUIT('912345678'), isFalse);
    });

    test('NUIT with less than 9 digits → invalid', () {
      expect(MozUtils.isValidNUIT('1234'), isFalse);
    });

    test('NUIT with more than 9 digits → invalid', () {
      expect(MozUtils.isValidNUIT('1234567890'), isFalse);
    });

    test('NUIT with repeated digits → invalid', () {
      expect(MozUtils.isValidNUIT('111111111'), isFalse);
    });

    test('NUIT with wrong control digit', () {
      expect(MozUtils.isValidNUIT('${nuitSingular.substring(0, 8)}9'), isFalse);
    });
  });

  group('Testes de Classificação do NUIT', () {
    final nuitSingular = generateValidNUIT('10000000');
    final nuitSingular2 = generateValidNUIT('20000000');
    final nuitEquivalent = generateValidNUIT('30000000');
    final nuitCollective = generateValidNUIT('40000000');
    final nuitPublico = generateValidNUIT('50000000');

    test('Type 1 → Singular', () {
      expect(MozUtils.getNUITEntityType(nuitSingular), equals('Singular (Cidadãos nacionais/estrangeiros e ENI)'));
    });

    test('Type 2 → Singular', () {
      expect(MozUtils.getNUITEntityType(nuitSingular2), equals('Singular (Cidadãos nacionais/estrangeiros e ENI)'));
    });

    test('Type 3 → Equivalent', () {
      expect(MozUtils.getNUITEntityType(nuitEquivalent), equals('Equiparada (Heranças Jacentes, Consórcios)'));
    });

    test('Type 4 → Collective', () {
      expect(MozUtils.getNUITEntityType(nuitCollective), equals('Colectiva (Sociedades por Quotas, SA, Lda, Associações)'));
    });

    test('Type 5 → Public', () {
      expect(MozUtils.getNUITEntityType(nuitPublico), equals('Público (Instituições do Estado e Ministérios)'));
    });

    test('NUIT invalid → null', () {
      expect(MozUtils.getNUITEntityType('000000000'), isNull);
    });
  });

  group('Testes de Telefone', () {
    test('84XXXXXXX (Vodacom) valid', () {
      expect(MozUtils.isValidMozambicanPhone('841234567'), isTrue);
    });

    test('85XXXXXXX (Vodacom) valid', () {
      expect(MozUtils.isValidMozambicanPhone('851234567'), isTrue);
    });

    test('82XXXXXXX (Tmcel) valid', () {
      expect(MozUtils.isValidMozambicanPhone('821234567'), isTrue);
    });

    test('83XXXXXXX (Tmcel) valid', () {
      expect(MozUtils.isValidMozambicanPhone('831234567'), isTrue);
    });

    test('86XXXXXXX (Movitel) valid', () {
      expect(MozUtils.isValidMozambicanPhone('861234567'), isTrue);
    });

    test('87XXXXXXX (Movitel) valid', () {
      expect(MozUtils.isValidMozambicanPhone('871234567'), isTrue);
    });

    test('88XXXXXXX (Movitel) valid', () {
      expect(MozUtils.isValidMozambicanPhone('881234567'), isTrue);
    });

    test('81XXXXXXX → invalid', () {
      expect(MozUtils.isValidMozambicanPhone('811234567'), isFalse);
    });

    test('89XXXXXXX → invalid', () {
      expect(MozUtils.isValidMozambicanPhone('891234567'), isFalse);
    });

    test('80XXXXXXX → invalid', () {
      expect(MozUtils.isValidMozambicanPhone('801234567'), isFalse);
    });

    test('91XXXXXXX → invalid', () {
      expect(MozUtils.isValidMozambicanPhone('911234567'), isFalse);
    });

    test('+258 84 123 4567 → valid', () {
      expect(MozUtils.isValidMozambicanPhone('+258 84 123 4567'), isTrue);
    });

    test('+258841234567 → valid', () {
      expect(MozUtils.isValidMozambicanPhone('+258841234567'), isTrue);
    });

    test('84 123 4567 → valid', () {
      expect(MozUtils.isValidMozambicanPhone('84 123 4567'), isTrue);
    });
  });

  group('Testes de Operadoras', () {
    test('84 → Vodacom', () {
      expect(MozUtils.getMobileOperator('841234567'), equals('Vodacom'));
    });

    test('85 → Vodacom', () {
      expect(MozUtils.getMobileOperator('851234567'), equals('Vodacom'));
    });

    test('82 → Tmcel', () {
      expect(MozUtils.getMobileOperator('821234567'), equals('Tmcel'));
    });

    test('83 → Tmcel', () {
      expect(MozUtils.getMobileOperator('831234567'), equals('Tmcel'));
    });

    test('86 → Movitel', () {
      expect(MozUtils.getMobileOperator('861234567'), equals('Movitel'));
    });

    test('87 → Movitel', () {
      expect(MozUtils.getMobileOperator('871234567'), equals('Movitel'));
    });

    test('88 → Movitel', () {
      expect(MozUtils.getMobileOperator('881234567'), equals('Movitel'));
    });

    test('Invalid → null', () {
      expect(MozUtils.getMobileOperator('911234567'), isNull);
    });
  });

  group('Testes do BI', () {
    test('BI 12 dígitos + letra → valid', () {
      expect(MozUtils.isValidBI('110101234567A'), isTrue);
    });

    test('BI with space → valid', () {
      expect(MozUtils.isValidBI('110101234567 A'), isTrue);
    });

    test('Lowercase BI → valid', () {
      expect(MozUtils.isValidBI('110101234567a'), isTrue);
    });

    test('BI without letter → invalid', () {
      expect(MozUtils.isValidBI('1101012345670'), isFalse);
    });

    test('BI with 11 digits → invalid', () {
      expect(MozUtils.isValidBI('11010123456A'), isFalse);
    });
  });

  group('Testes de Formatação Monetária', () {
    test('1500 → "1 500,00 MT"', () {
      expect(MozUtils.formatMZN(1500), equals('1 500,00 MT'));
    });

    test('0.5 → "0,50 MT"', () {
      expect(MozUtils.formatMZN(0.5), equals('0,50 MT'));
    });

    test('1000000 → "1 000 000,00 MT"', () {
      expect(MozUtils.formatMZN(1000000), equals('1 000 000,00 MT'));
    });

    test('99.99 → "99,99 MT"', () {
      expect(MozUtils.formatMZN(99.99), equals('99,99 MT'));
    });

    test('0 → "0,00 MT"', () {
      expect(MozUtils.formatMZN(0), equals('0,00 MT'));
    });

    test('999 → "999,00 MT"', () {
      expect(MozUtils.formatMZN(999), equals('999,00 MT'));
    });

    test('1000 → "1 000,00 MT"', () {
      expect(MozUtils.formatMZN(1000), equals('1 000,00 MT'));
    });

    test('-500 → "-500,00 MT"', () {
      expect(MozUtils.formatMZN(-500), equals('-500,00 MT'));
    });

    test('-1500 → "-1 500,00 MT"', () {
      expect(MozUtils.formatMZN(-1500), equals('-1 500,00 MT'));
    });

    test('MZN: 1500 → "1 500,00 MZN"', () {
      expect(MozUtils.formatMZN(1500, 'MZN'), equals('1 500,00 MZN'));
    });

    test('MZN: 50000 → "50 000,00 MZN"', () {
      expect(MozUtils.formatMZN(50000, 'MZN'), equals('50 000,00 MZN'));
    });
  });

  group('Testes de Distritos', () {
    test('Cabo Delgado districts count → 17', () {
      expect(MozUtils.getDistrictsByProvince('cab').length, equals(17));
    });

    test('Cabo Delgado first district → "Ancuabe"', () {
      expect(MozUtils.getDistrictsByProvince('cab')[0], equals('Ancuabe'));
    });

    test('Cabo Delgado districts case insensitive → 17', () {
      expect(MozUtils.getDistrictsByProvince('CaB').length, equals(17));
    });

    test('Maputo City districts count → 7', () {
      expect(MozUtils.getDistrictsByProvince('mpc').length, equals(7));
    });

    test('Invalid province throws error', () {
      expect(() => MozUtils.getDistrictsByProvince('xyz'), throwsArgumentError);
    });

    test('Total Mozambique districts → 161', () {
      final all = MozUtils.getAllDistricts();
      expect(all.length, equals(161));
    });

    test('First returned district name → "Ancuabe"', () {
      final all = MozUtils.getAllDistricts();
      expect(all[0]['name'], equals('Ancuabe'));
    });

    test('First returned district provinceId → "cab"', () {
      final all = MozUtils.getAllDistricts();
      expect(all[0]['provinceId'], equals('cab'));
    });

    test('Ancuabe administrative_posts', () {
      final all = MozUtils.getAllDistricts();
      expect(all[0]['administrative_posts'], equals(['Ancuabe', 'Metoro', 'Meza']));
    });

    test('Ancuabe neighborhoods', () {
      final all = MozUtils.getAllDistricts();
      expect(all[0]['neighborhoods'], equals(<String>[]));
    });

    test('Pemba (Cidade) administrative_posts', () {
      final all = MozUtils.getAllDistricts();
      final pemba = all.firstWhere((d) => d['name'] == 'Pemba (Cidade)');
      expect(pemba['administrative_posts'], equals(['Pemba']));
    });

    test('Pemba (Cidade) neighborhoods', () {
      final all = MozUtils.getAllDistricts();
      final pemba = all.firstWhere((d) => d['name'] == 'Pemba (Cidade)');
      expect(pemba['neighborhoods'], equals(['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue']));
    });

    test('Majune administrative_posts (Mua fixed)', () {
      final all = MozUtils.getAllDistricts();
      final majune = all.firstWhere((d) => d['name'] == 'Majune');
      expect(majune['administrative_posts'], equals(['Majune', 'Mua', 'Nairrobi']));
    });

    test('Maxixe (Cidade) neighborhoods (Bairro Central fixed)', () {
      final all = MozUtils.getAllDistricts();
      final maxixe = all.firstWhere((d) => d['name'] == 'Maxixe (Cidade)');
      expect(maxixe['neighborhoods'], equals(['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']));
    });

    test('Nampula (Cidade) neighborhoods contains Namutequeliua', () {
      final all = MozUtils.getAllDistricts();
      final nampula = all.firstWhere((d) => d['name'] == 'Nampula (Cidade)');
      final neighborhoods = nampula['neighborhoods'] as List<String>;
      expect(neighborhoods.contains('Namutequeliua'), isTrue);
    });
  });

  group('Testes de Código Postal', () {
    test('Código postal valid (1100)', () {
      expect(MozUtils.isValidPostalCode('1100'), isTrue);
    });

    test('Postal code with spaces (1101)', () {
      expect(MozUtils.isValidPostalCode(' 1101 '), isTrue);
    });

    test('Postal code with dash (1102)', () {
      expect(MozUtils.isValidPostalCode('11-02'), isTrue);
    });

    test('Código postal valid (1202)', () {
      expect(MozUtils.isValidPostalCode('1202'), isTrue);
    });

    test('Código postal valid (3311)', () {
      expect(MozUtils.isValidPostalCode('3311'), isTrue);
    });

    test('Código postal invalid (1199)', () {
      expect(MozUtils.isValidPostalCode('1199'), isFalse);
    });

    test('Postal code too long', () {
      expect(MozUtils.isValidPostalCode('11000'), isFalse);
    });

    test('Postal code too short', () {
      expect(MozUtils.isValidPostalCode('110'), isFalse);
    });

    test('Non-numeric postal code', () {
      expect(MozUtils.isValidPostalCode('ABCD'), isFalse);
    });

    test('Locality of 1100', () {
      expect(MozUtils.getPostalCodeLocality('1100'), equals('Maputo ECP (Sede)'));
    });

    test('Locality of 1205', () {
      expect(MozUtils.getPostalCodeLocality('1205'), equals('Chilembene / Magoanine'));
    });

    test('Province of 1100', () {
      expect(MozUtils.getPostalCodeProvince('1100'), equals('Maputo'));
    });

    test('Province of 2100', () {
      expect(MozUtils.getPostalCodeProvince('2100'), equals('Sofala'));
    });

    test('Province of 3311', () {
      expect(MozUtils.getPostalCodeProvince('3311'), equals('Niassa'));
    });

    test('Locality of invalid', () {
      expect(MozUtils.getPostalCodeLocality('9999'), isNull);
    });

    test('Province of invalid', () {
      expect(MozUtils.getPostalCodeProvince('9999'), isNull);
    });
  });
}

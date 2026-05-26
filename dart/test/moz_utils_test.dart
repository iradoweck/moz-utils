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
    final nuitEquiparada = generateValidNUIT('30000000');
    final nuitColectiva = generateValidNUIT('40000000');
    final nuitPublico = generateValidNUIT('50000000');

    test('NUIT Singular válido', () {
      expect(MozUtils.isValidNUIT(nuitSingular), isTrue);
    });

    test('NUIT Singular2 válido', () {
      expect(MozUtils.isValidNUIT(nuitSingular2), isTrue);
    });

    test('NUIT Equiparada válido', () {
      expect(MozUtils.isValidNUIT(nuitEquiparada), isTrue);
    });

    test('NUIT Colectiva válido', () {
      expect(MozUtils.isValidNUIT(nuitColectiva), isTrue);
    });

    test('NUIT Público válido', () {
      expect(MozUtils.isValidNUIT(nuitPublico), isTrue);
    });

    test('NUIT que começa com 0 → inválido', () {
      expect(MozUtils.isValidNUIT('012345678'), isFalse);
    });

    test('NUIT que começa com 6 → inválido', () {
      expect(MozUtils.isValidNUIT('612345678'), isFalse);
    });

    test('NUIT que começa com 9 → inválido', () {
      expect(MozUtils.isValidNUIT('912345678'), isFalse);
    });

    test('NUIT com menos de 9 dígitos → inválido', () {
      expect(MozUtils.isValidNUIT('1234'), isFalse);
    });

    test('NUIT com mais de 9 dígitos → inválido', () {
      expect(MozUtils.isValidNUIT('1234567890'), isFalse);
    });

    test('NUIT com dígitos repetidos → inválido', () {
      expect(MozUtils.isValidNUIT('111111111'), isFalse);
    });

    test('NUIT com dígito de controlo errado', () {
      expect(MozUtils.isValidNUIT('${nuitSingular.substring(0, 8)}9'), isFalse);
    });
  });

  group('Testes de Classificação do NUIT', () {
    final nuitSingular = generateValidNUIT('10000000');
    final nuitSingular2 = generateValidNUIT('20000000');
    final nuitEquiparada = generateValidNUIT('30000000');
    final nuitColectiva = generateValidNUIT('40000000');
    final nuitPublico = generateValidNUIT('50000000');

    test('Tipo 1 → Singular', () {
      expect(MozUtils.getNUITEntityType(nuitSingular), equals('Singular (Cidadãos nacionais/estrangeiros e ENI)'));
    });

    test('Tipo 2 → Singular', () {
      expect(MozUtils.getNUITEntityType(nuitSingular2), equals('Singular (Cidadãos nacionais/estrangeiros e ENI)'));
    });

    test('Tipo 3 → Equiparada', () {
      expect(MozUtils.getNUITEntityType(nuitEquiparada), equals('Equiparada (Heranças Jacentes, Consórcios)'));
    });

    test('Tipo 4 → Colectiva', () {
      expect(MozUtils.getNUITEntityType(nuitColectiva), equals('Colectiva (Sociedades por Quotas, SA, Lda, Associações)'));
    });

    test('Tipo 5 → Público', () {
      expect(MozUtils.getNUITEntityType(nuitPublico), equals('Público (Instituições do Estado e Ministérios)'));
    });

    test('NUIT inválido → null', () {
      expect(MozUtils.getNUITEntityType('000000000'), isNull);
    });
  });

  group('Testes de Telefone', () {
    test('84XXXXXXX (Vodacom) válido', () {
      expect(MozUtils.isValidMozambicanPhone('841234567'), isTrue);
    });

    test('85XXXXXXX (Vodacom) válido', () {
      expect(MozUtils.isValidMozambicanPhone('851234567'), isTrue);
    });

    test('82XXXXXXX (Tmcel) válido', () {
      expect(MozUtils.isValidMozambicanPhone('821234567'), isTrue);
    });

    test('83XXXXXXX (Tmcel) válido', () {
      expect(MozUtils.isValidMozambicanPhone('831234567'), isTrue);
    });

    test('86XXXXXXX (Movitel) válido', () {
      expect(MozUtils.isValidMozambicanPhone('861234567'), isTrue);
    });

    test('87XXXXXXX (Movitel) válido', () {
      expect(MozUtils.isValidMozambicanPhone('871234567'), isTrue);
    });

    test('88XXXXXXX (Movitel) válido', () {
      expect(MozUtils.isValidMozambicanPhone('881234567'), isTrue);
    });

    test('81XXXXXXX → inválido', () {
      expect(MozUtils.isValidMozambicanPhone('811234567'), isFalse);
    });

    test('89XXXXXXX → inválido', () {
      expect(MozUtils.isValidMozambicanPhone('891234567'), isFalse);
    });

    test('80XXXXXXX → inválido', () {
      expect(MozUtils.isValidMozambicanPhone('801234567'), isFalse);
    });

    test('91XXXXXXX → inválido', () {
      expect(MozUtils.isValidMozambicanPhone('911234567'), isFalse);
    });

    test('+258 84 123 4567 → válido', () {
      expect(MozUtils.isValidMozambicanPhone('+258 84 123 4567'), isTrue);
    });

    test('+258841234567 → válido', () {
      expect(MozUtils.isValidMozambicanPhone('+258841234567'), isTrue);
    });

    test('84 123 4567 → válido', () {
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

    test('Inválido → null', () {
      expect(MozUtils.getMobileOperator('911234567'), isNull);
    });
  });

  group('Testes do BI', () {
    test('BI 12 dígitos + letra → válido', () {
      expect(MozUtils.isValidBI('110101234567A'), isTrue);
    });

    test('BI com espaço → válido', () {
      expect(MozUtils.isValidBI('110101234567 A'), isTrue);
    });

    test('BI minúsculo → válido', () {
      expect(MozUtils.isValidBI('110101234567a'), isTrue);
    });

    test('BI sem letra → inválido', () {
      expect(MozUtils.isValidBI('1101012345670'), isFalse);
    });

    test('BI com 11 dígitos → inválido', () {
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
    test('Distritos de Cabo Delgado count → 17', () {
      expect(MozUtils.getDistrictsByProvince('cab').length, equals(17));
    });

    test('Distritos de Cabo Delgado primeiro → "Ancuabe"', () {
      expect(MozUtils.getDistrictsByProvince('cab')[0], equals('Ancuabe'));
    });

    test('Distritos de Cabo Delgado case insensitive → 17', () {
      expect(MozUtils.getDistrictsByProvince('CaB').length, equals(17));
    });

    test('Distritos de Maputo Cidade count → 7', () {
      expect(MozUtils.getDistrictsByProvince('mpc').length, equals(7));
    });

    test('Província inválida lança erro', () {
      expect(() => MozUtils.getDistrictsByProvince('xyz'), throwsArgumentError);
    });

    test('Total de distritos de Moçambique → 161', () {
      final all = MozUtils.getAllDistricts();
      expect(all.length, equals(161));
    });

    test('Primeiro distrito retornado name → "Ancuabe"', () {
      final all = MozUtils.getAllDistricts();
      expect(all[0]['name'], equals('Ancuabe'));
    });

    test('Primeiro distrito provinceId → "cab"', () {
      final all = MozUtils.getAllDistricts();
      expect(all[0]['provinceId'], equals('cab'));
    });

    test('Ancuabe postos_administrativos', () {
      final all = MozUtils.getAllDistricts();
      expect(all[0]['postos_administrativos'], equals(['Ancuabe', 'Metoro', 'Meza']));
    });

    test('Ancuabe bairros', () {
      final all = MozUtils.getAllDistricts();
      expect(all[0]['bairros'], equals(<String>[]));
    });

    test('Pemba (Cidade) postos_administrativos', () {
      final all = MozUtils.getAllDistricts();
      final pemba = all.firstWhere((d) => d['name'] == 'Pemba (Cidade)');
      expect(pemba['postos_administrativos'], equals(['Pemba']));
    });

    test('Pemba (Cidade) bairros', () {
      final all = MozUtils.getAllDistricts();
      final pemba = all.firstWhere((d) => d['name'] == 'Pemba (Cidade)');
      expect(pemba['bairros'], equals(['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue']));
    });

    test('Majune postos_administrativos (Mua corrigido)', () {
      final all = MozUtils.getAllDistricts();
      final majune = all.firstWhere((d) => d['name'] == 'Majune');
      expect(majune['postos_administrativos'], equals(['Majune', 'Mua', 'Nairrobi']));
    });

    test('Maxixe (Cidade) bairros (Bairro Central corrigido)', () {
      final all = MozUtils.getAllDistricts();
      final maxixe = all.firstWhere((d) => d['name'] == 'Maxixe (Cidade)');
      expect(maxixe['bairros'], equals(['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']));
    });

    test('Nampula (Cidade) bairros contêm Namutequeliua', () {
      final all = MozUtils.getAllDistricts();
      final nampula = all.firstWhere((d) => d['name'] == 'Nampula (Cidade)');
      final bairros = nampula['bairros'] as List<String>;
      expect(bairros.contains('Namutequeliua'), isTrue);
    });
  });

  group('Testes de Código Postal', () {
    test('Código postal válido (1100)', () {
      expect(MozUtils.isValidPostalCode('1100'), isTrue);
    });

    test('Código postal com espaços (1101)', () {
      expect(MozUtils.isValidPostalCode(' 1101 '), isTrue);
    });

    test('Código postal com traço (1102)', () {
      expect(MozUtils.isValidPostalCode('11-02'), isTrue);
    });

    test('Código postal válido (1202)', () {
      expect(MozUtils.isValidPostalCode('1202'), isTrue);
    });

    test('Código postal válido (3311)', () {
      expect(MozUtils.isValidPostalCode('3311'), isTrue);
    });

    test('Código postal inválido (1199)', () {
      expect(MozUtils.isValidPostalCode('1199'), isFalse);
    });

    test('Código postal muito longo', () {
      expect(MozUtils.isValidPostalCode('11000'), isFalse);
    });

    test('Código postal muito curto', () {
      expect(MozUtils.isValidPostalCode('110'), isFalse);
    });

    test('Código postal não numérico', () {
      expect(MozUtils.isValidPostalCode('ABCD'), isFalse);
    });

    test('Localidade de 1100', () {
      expect(MozUtils.getPostalCodeLocality('1100'), equals('Maputo ECP (Sede)'));
    });

    test('Localidade de 1205', () {
      expect(MozUtils.getPostalCodeLocality('1205'), equals('Chilembene / Magoanine'));
    });

    test('Província de 1100', () {
      expect(MozUtils.getPostalCodeProvince('1100'), equals('Maputo'));
    });

    test('Província de 2100', () {
      expect(MozUtils.getPostalCodeProvince('2100'), equals('Sofala'));
    });

    test('Província de 3311', () {
      expect(MozUtils.getPostalCodeProvince('3311'), equals('Niassa'));
    });

    test('Localidade de inválido', () {
      expect(MozUtils.getPostalCodeLocality('9999'), isNull);
    });

    test('Província de inválido', () {
      expect(MozUtils.getPostalCodeProvince('9999'), isNull);
    });
  });
}

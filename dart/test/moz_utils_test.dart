import 'package:test/test.dart';
import 'package:moz_utils/moz_utils.dart';

String generateValidNUIT(String first8) {
  final weights = [8, 9, 4, 5, 6, 7, 8, 9];
  int sum = 0;
  for (int i = 0; i < 8; i++) {
    sum += int.parse(first8[i]) * weights[i];
  }
  final remainder = sum % 11;
  final checkMap = "01234567891";
  return '$first8${checkMap[remainder]}';
}

String generateValidNIB(String bankCode, String branch, String account) {
  final first19 = bankCode.padLeft(4, '0') + branch.padLeft(4, '0') + account.padLeft(11, '0');
  final bigNum = BigInt.parse('${first19}00');
  final remainder = (bigNum % BigInt.from(97)).toInt();
  final check = 98 - remainder;
  final checkDigits = check < 10 ? '0$check' : '$check';
  return '$first19$checkDigits';
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

    test('Type 1 → Pessoas Singulares', () {
      expect(MozUtils.getNUITEntityType(nuitSingular), equals('Pessoas Singulares'));
    });

    test('Type 2 → Pessoas Singulares', () {
      expect(MozUtils.getNUITEntityType(nuitSingular2), equals('Pessoas Singulares'));
    });

    test('Type 3 → Pessoas Singulares', () {
      expect(MozUtils.getNUITEntityType(nuitEquivalent), equals('Pessoas Singulares'));
    });

    test('Type 4 → Pessoas Colectivas', () {
      expect(MozUtils.getNUITEntityType(nuitCollective), equals('Pessoas Colectivas'));
    });

    test('Type 5 → Pessoas Colectivas', () {
      expect(MozUtils.getNUITEntityType(nuitPublico), equals('Pessoas Colectivas'));
    });

    test('Type 6 → Entidades Equiparadas', () {
      expect(MozUtils.getNUITEntityType(generateValidNUIT('60000000')), equals('Entidades Equiparadas'));
    });

    test('Type 7 → Estado / Públicas', () {
      expect(MozUtils.getNUITEntityType(generateValidNUIT('70000000')), equals('Estado / Públicas'));
    });

    test('Type 8 → Outras Entidades', () {
      expect(MozUtils.getNUITEntityType(generateValidNUIT('80000000')), equals('Outras Entidades'));
    });

    test('Type 9 → Entidades Estrangeiras', () {
      expect(MozUtils.getNUITEntityType(generateValidNUIT('90000000')), equals('Entidades Estrangeiras'));
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
      expect(neighborhoods, contains('Namutequeliua'));
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

  group('Testes do DIRE', () {
    test('DIRE legado 1 → valid', () {
      expect(MozUtils.isValidDIRE('00008312C'), isTrue);
    });

    test('DIRE legado 2 → valid', () {
      expect(MozUtils.isValidDIRE('12C00008312C'), isTrue);
    });

    test('DIRE moderno → valid', () {
      expect(MozUtils.isValidDIRE('120345678A'), isTrue);
    });

    test('DIRE curto → invalid', () {
      expect(MozUtils.isValidDIRE('0000831C'), isFalse);
    });

    test('DIRE invalid', () {
      expect(MozUtils.isValidDIRE('A0008312C'), isFalse);
    });
  });

  group('Testes da Carta de Condução', () {
    test('Carta legada 1 → valid', () {
      expect(MozUtils.isValidDrivingLicense('M123456'), isTrue);
    });

    test('Carta moderna → valid', () {
      expect(MozUtils.isValidDrivingLicense('MP1234567'), isTrue);
    });

    test('Carta com traço → valid', () {
      expect(MozUtils.isValidDrivingLicense('m-123456'), isTrue);
    });

    test('Carta moderna com traço → valid', () {
      expect(MozUtils.isValidDrivingLicense('mp-1234567'), isTrue);
    });

    test('Carta sem letra → invalid', () {
      expect(MozUtils.isValidDrivingLicense('123456'), isFalse);
    });

    test('Carta com muitas letras → invalid', () {
      expect(MozUtils.isValidDrivingLicense('MMM1234567'), isFalse);
    });
  });

  group('Testes de Formatação Telefónica e WhatsApp', () {
    test('formatMozambicanPhone formato internacional padrão', () {
      expect(MozUtils.formatMozambicanPhone('841234567'), equals('+258 84 123 4567'));
      expect(MozUtils.formatMozambicanPhone('+258841234567'), equals('+258 84 123 4567'));
      expect(MozUtils.formatMozambicanPhone('82 123 4567'), equals('+258 82 123 4567'));
    });

    test('formatMozambicanPhone com número inválido lança ArgumentError', () {
      expect(() => MozUtils.formatMozambicanPhone('912345678'), throwsArgumentError);
      expect(() => MozUtils.formatMozambicanPhone('12345'), throwsArgumentError);
    });

    test('buildWhatsAppUrl gera URLs válidas', () {
      expect(MozUtils.buildWhatsAppUrl('841234567'), equals('https://wa.me/258841234567'));
      expect(MozUtils.buildWhatsAppUrl('+258841234567'), equals('https://wa.me/258841234567'));
      expect(MozUtils.buildWhatsAppUrl('841234567', 'Olá Moçambique'), contains('text=Ol%C3%A1%20Mo%C3%A7ambique'));
    });
  });

  group('Testes de Carteiras Móveis (Mobile Wallets)', () {
    test('Identificação de carteiras móveis', () {
      expect(MozUtils.getMobileWallet('841234567'), equals('M-Pesa'));
      expect(MozUtils.getMobileWallet('851234567'), equals('M-Pesa'));
      expect(MozUtils.getMobileWallet('821234567'), equals('mKesh'));
      expect(MozUtils.getMobileWallet('831234567'), equals('mKesh'));
      expect(MozUtils.getMobileWallet('861234567'), equals('e-Mola'));
      expect(MozUtils.getMobileWallet('871234567'), equals('e-Mola'));
      expect(MozUtils.getMobileWallet('881234567'), equals('e-Mola'));
      expect(MozUtils.getMobileWallet('911234567'), isNull);
    });
  });

  group('Testes do Passaporte Moçambicano', () {
    test('Passaporte válido (2 letras + 7 dígitos)', () {
      expect(MozUtils.isValidPassport('AO1234567'), isTrue);
      expect(MozUtils.isValidPassport('ao1234567'), isTrue);
      expect(MozUtils.isValidPassport('AB1234567'), isTrue);
    });

    test('Passaporte inválido', () {
      expect(MozUtils.isValidPassport('A1234567'), isFalse); // 1 letra
      expect(MozUtils.isValidPassport('AB123456'), isFalse); // 6 dígitos
      expect(MozUtils.isValidPassport('AB12345678'), isFalse); // 8 dígitos
      expect(MozUtils.isValidPassport('123456'), isFalse);
    });
  });

  group('Testes de Conversão de Moeda (parseMZN)', () {
    test('parseMZN converte valores formatados em double', () {
      expect(MozUtils.parseMZN('1 500,00 MT'), equals(1500.0));
      expect(MozUtils.parseMZN('1500'), equals(1500.0));
      expect(MozUtils.parseMZN('0,50'), equals(0.5));
      expect(MozUtils.parseMZN('1 000 000,00 MZN'), equals(1000000.0));
      expect(MozUtils.parseMZN('-500,00 MT'), equals(-500.0));
      expect(MozUtils.parseMZN(''), isNull);
      expect(MozUtils.parseMZN('-'), isNull);
    });
  });

  group('Testes de Flexibilização de Distritos por Província', () {
    test('Busca por Sigla', () {
      expect(MozUtils.getDistrictsByProvince('CBD').length, equals(17));
      expect(MozUtils.getDistrictsByProvince('MC').length, equals(7));
      expect(MozUtils.getDistrictsByProvince('MPT').length, equals(8));
      expect(MozUtils.getDistrictsByProvince('NPL').length, equals(23));
    });

    test('Busca por Nome por extenso e tolerância a acentos', () {
      expect(MozUtils.getDistrictsByProvince('Cabo Delgado').length, equals(17));
      expect(MozUtils.getDistrictsByProvince('cabo delgado').length, equals(17));
      expect(MozUtils.getDistrictsByProvince('Nampula').length, equals(23));
      expect(MozUtils.getDistrictsByProvince('Zambézia').length, equals(22));
      expect(MozUtils.getDistrictsByProvince('zambezia').length, equals(22));
      expect(MozUtils.getDistrictsByProvince('Maputo').length, equals(8));
      expect(MozUtils.getDistrictsByProvince('Maputo Província').length, equals(8));
      expect(MozUtils.getDistrictsByProvince('Maputo Cidade').length, equals(7));
      expect(MozUtils.getDistrictsByProvince('Maputo (Província)').length, equals(8));
      expect(MozUtils.getDistrictsByProvince('Maputo (Cidade)').length, equals(7));
    });

    test('Província inexistente lança ArgumentError', () {
      expect(() => MozUtils.getDistrictsByProvince('ProvinciaInexistente'), throwsArgumentError);
      expect(() => MozUtils.getDistrictsByProvince('xyz'), throwsArgumentError);
    });
  });

  group('Testes de Sanitização de Campos e Nomes', () {
    test('isValidName valida nomes pessoais', () {
      expect(MozUtils.isValidName('Edmilson Muacigarro'), isTrue);
      expect(MozUtils.isValidName("João O'Brian"), isTrue);
      expect(MozUtils.isValidName('Jean-Pierre Dupont'), isTrue);
      expect(MozUtils.isValidName('ABC123'), isFalse);
      expect(MozUtils.isValidName('---'), isFalse);
    });

    test('sanitizeName formata para Title Case ou ALL UPPERCASE', () {
      expect(MozUtils.sanitizeName('MARIA MANUELA DA SILVA E COSTA'), equals('Maria Manuela da Silva e Costa'));
      expect(MozUtils.sanitizeName('  edmilson   muacigarro  '), equals('Edmilson Muacigarro'));
      expect(MozUtils.sanitizeName('edmilson muacigarro', allCaps: true), equals('EDMILSON MUACIGARRO'));
      expect(MozUtils.sanitizeName('jean-pierre dupont'), equals('Jean-Pierre Dupont'));
      expect(MozUtils.sanitizeName('maria da silva e sousa'), equals('Maria da Silva e Sousa'));
      expect(MozUtils.sanitizeName(''), equals(''));
    });

    test('sanitizeDocumentField extrai apenas dígitos numéricos', () {
      expect(MozUtils.sanitizeDocumentField('123 456 789'), equals('123456789'));
      expect(MozUtils.sanitizeDocumentField('123-456-789'), equals('123456789'));
      expect(MozUtils.sanitizeDocumentField(' 4 0 0 '), equals('400'));
    });

    test('sanitizeAlphanumericField extrai letras e números em maiúsculas', () {
      expect(MozUtils.sanitizeAlphanumericField('110 101 234567a'), equals('110101234567A'));
      expect(MozUtils.sanitizeAlphanumericField('abc-123-XYZ!'), equals('ABC123XYZ'));
    });
  });

  group('Testes do Novo Sistema de CEP', () {
    test('isValidNewCEP valida formato XXXX-XX', () {
      expect(MozUtils.isValidNewCEP('1101-01'), isTrue);
      expect(MozUtils.isValidNewCEP('0909-01'), isTrue);
      expect(MozUtils.isValidNewCEP('110101'), isFalse);
      expect(MozUtils.isValidNewCEP('110-01'), isFalse);
    });

    test('suggestCEPs retorna divisões do novo CEP', () {
      final resultsLegacy = MozUtils.suggestCEPs('1100');
      expect(resultsLegacy, isNotEmpty);
      final resultsDirect = MozUtils.suggestCEPs('1101-01');
      expect(resultsDirect, isNotEmpty);
      final resultsLocality = MozUtils.suggestCEPs('Namutequeliua');
      expect(resultsLocality, isNotEmpty);
      expect(MozUtils.suggestCEPs(''), isEmpty);
    });
  });

  group('Testes do Módulo Bancário de Moçambique (NIB & IBAN)', () {
    test('Catálogo oficial contém 22 bancos moçambicanos unificados (BM e SIMO)', () {
      expect(MozUtils.mozambiqueBanks.length, equals(22));
      expect(MozUtils.mozambiqueBanks.any((b) => b['code'] == '0001' && b['shortName'] == 'Millennium BIM'), isTrue);
      expect(MozUtils.mozambiqueBanks.any((b) => b['code'] == '0006' && b['shortName'] == 'Absa'), isTrue);
      expect(MozUtils.mozambiqueBanks.any((b) => b['code'] == '0008' && b['shortName'] == 'BCI'), isTrue);
      expect(MozUtils.mozambiqueBanks.any((b) => b['code'] == '0003' && b['shortName'] == 'Standard Bank'), isTrue);
      expect(MozUtils.mozambiqueBanks.any((b) => b['code'] == '0016' && b['shortName'] == 'Moza Banco'), isTrue);
      expect(MozUtils.mozambiqueBanks.any((b) => b['code'] == '0034' && b['shortName'] == 'Moza Banco'), isTrue);
      expect(MozUtils.mozambiqueBanks.any((b) => b['code'] == '0041' && b['shortName'] == 'Letshego'), isTrue);
      expect(MozUtils.mozambiqueBanks.any((b) => b['code'] == '0056' && b['shortName'] == 'Letshego'), isTrue);
    });

    test('Validação de NIB autêntico com algoritmo ISO 7064 Módulo 97-10 (BM e SIMO)', () {
      final nibBim = generateValidNIB('0001', '0000', '00123456789');
      expect(nibBim.length, equals(21));
      expect(MozUtils.isValidNIB(nibBim), isTrue);

      final nibBci = generateValidNIB('0008', '0001', '00987654321');
      expect(nibBci.length, equals(21));
      expect(MozUtils.isValidNIB(nibBci), isTrue);

      // Validação de paridade: Moza Banco sob BM (0016) e SIMO (0034)
      final nibMozaBM = generateValidNIB('0016', '0002', '00555666777');
      final nibMozaSIMO = generateValidNIB('0034', '0002', '00555666777');
      expect(MozUtils.isValidNIB(nibMozaBM), isTrue);
      expect(MozUtils.isValidNIB(nibMozaSIMO), isTrue);

      // Validação de paridade: Absa (0006), Letshego (0041 e 0056)
      final nibAbsaBM = generateValidNIB('0006', '0005', '00999888777');
      final nibLetshegoBM = generateValidNIB('0041', '0001', '00123456789');
      final nibLetshegoSIMO = generateValidNIB('0056', '0001', '00123456789');
      expect(MozUtils.isValidNIB(nibAbsaBM), isTrue);
      expect(MozUtils.isValidNIB(nibLetshegoBM), isTrue);
      expect(MozUtils.isValidNIB(nibLetshegoSIMO), isTrue);

      // Validação de paridade: First Capital Bank (0038 e 0043), BNI (0025 e 0057)
      final nibFcbBM = generateValidNIB('0038', '0001', '00123456789');
      final nibFcbSIMO = generateValidNIB('0043', '0001', '00123456789');
      final nibBniBM = generateValidNIB('0025', '0001', '00123456789');
      final nibBniSIMO = generateValidNIB('0057', '0001', '00123456789');
      expect(MozUtils.isValidNIB(nibFcbBM), isTrue);
      expect(MozUtils.isValidNIB(nibFcbSIMO), isTrue);
      expect(MozUtils.isValidNIB(nibBniBM), isTrue);
      expect(MozUtils.isValidNIB(nibBniSIMO), isTrue);

      // Com pontuação ou espaços
      expect(MozUtils.isValidNIB('0001 0000 00123456789 ${nibBim.substring(19)}'), isTrue);
    });

    test('NIB inválido por código de banco inexistente ou checksum corrompido', () {
      final nibBancoInexistente = generateValidNIB('9999', '0000', '00123456789');
      expect(MozUtils.isValidNIB(nibBancoInexistente), isFalse);

      final nibBim = generateValidNIB('0001', '0000', '00123456789');
      final nibCorrompido = nibBim.substring(0, 20) + (nibBim.endsWith('0') ? '1' : '0');
      expect(MozUtils.isValidNIB(nibCorrompido), isFalse);

      expect(MozUtils.isValidNIB('1234'), isFalse);
      expect(MozUtils.isValidNIB('0001000000123456789'), isFalse); // 19 dígitos
    });

    test('formatNIB formata em 4 blocos padronizados ou lança ArgumentError', () {
      final nibBim = generateValidNIB('0001', '0000', '00123456789');
      final formatted = MozUtils.formatNIB(nibBim);
      expect(formatted.split(' ').length, equals(4));
      expect(formatted.startsWith('0001 0000 '), isTrue);

      expect(() => MozUtils.formatNIB('000000000000000000000'), throwsArgumentError);
    });

    test('getBankByNIB retorna informações bancárias completas', () {
      final nibBim = generateValidNIB('0001', '0000', '00123456789');
      final bankInfo = MozUtils.getBankByNIB(nibBim);
      expect(bankInfo, isNotNull);
      expect(bankInfo!['code'], equals('0001'));
      expect(bankInfo['shortName'], equals('Millennium BIM'));

      expect(MozUtils.getBankByNIB('999900000000000000000'), isNull);
      expect(MozUtils.getBankByNIB('123'), isNull);
    });

    test('nibToIBAN e isValidIBAN moçambicano', () {
      final nibBim = generateValidNIB('0001', '0000', '00123456789');
      final iban = MozUtils.nibToIBAN(nibBim);
      expect(iban, equals('MZ59$nibBim'));
      expect(iban.length, equals(25));
      expect(MozUtils.isValidIBAN(iban), isTrue);
      expect(MozUtils.isValidIBAN('MZ59 $nibBim'), isTrue);

      // Inválidos
      expect(MozUtils.isValidIBAN('PT50$nibBim'), isFalse);
      expect(MozUtils.isValidIBAN('MZ591234'), isFalse);
      expect(() => MozUtils.nibToIBAN('000000000000000000000'), throwsArgumentError);
    });
  });
}

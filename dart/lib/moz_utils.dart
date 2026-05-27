/// moz_utils
///
/// Utility functions for Mozambique.
/// Validation of NUIT, BI, documents, and phone formatting.
library moz_utils;

/// Classe utilitária contendo funções estáticas para validação e formatação
/// de dados comuns no contexto moçambicano (como NUIT, BI, números de telefone,
/// moeda MZN, códigos postais legados e divisões geográficas).
import 'src/cep_data.dart';

class MozUtils {
  // Construtor privado para evitar instanciação direta.
  MozUtils._();

  /// Validates a Mozambican phone number.
  /// Valid operators: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
  static bool isValidMozambicanPhone(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final withoutCountryCode = cleaned.startsWith('258') ? cleaned.substring(3) : cleaned;
    return RegExp(r'^8[2-8]\d{7}$').hasMatch(withoutCountryCode);
  }

  /// Formats a Mozambican phone number to the international standard.
  static String formatMozambicanPhone(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final withoutCountryCode = cleaned.startsWith('258') ? cleaned.substring(3) : cleaned;

    if (!isValidMozambicanPhone(withoutCountryCode)) {
      throw ArgumentError('Invalid phone number: $phone');
    }

    final prefix = withoutCountryCode.substring(0, 2);
    final part1 = withoutCountryCode.substring(2, 5);
    final part2 = withoutCountryCode.substring(5);

    return '+258 $prefix $part1 $part2';
  }

  /// Identifies the operator of a Mozambican phone number.
  static String? getMobileOperator(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final withoutCountryCode = cleaned.startsWith('258') ? cleaned.substring(3) : cleaned;

    if (!isValidMozambicanPhone(withoutCountryCode)) return null;

    final prefix = withoutCountryCode.substring(0, 2);
    const operators = {
      '84': 'Vodacom',
      '85': 'Vodacom',
      '82': 'Tmcel',
      '83': 'Tmcel',
      '86': 'Movitel',
      '87': 'Movitel',
      '88': 'Movitel',
    };

    return operators[prefix];
  }

  /// Valida o NUIT (Número Único de Identificação Tributária) de Moçambique.
  /// 
  /// Regras da AT:
  /// - 9 dígitos
  /// - Primeiro dígito: 1 a 5
  /// - Nono dígito: Módulo 11
  static bool isValidNUIT(dynamic nuit) {
    final cleaned = nuit.toString().replaceAll(RegExp(r'\D'), '');

    if (cleaned.length != 9) return false;
    if (RegExp(r'^(\d)\1{8}$').hasMatch(cleaned)) return false;
    if (!RegExp(r'^[1-5]').hasMatch(cleaned)) return false;

    int sum = 0;
    for (int i = 0; i < 8; i++) {
      sum += int.parse(cleaned[i]) * (9 - i);
    }

    int remainder = sum % 11;
    int expectedDigit = remainder <= 1 ? 0 : 11 - remainder;

    return int.parse(cleaned[8]) == expectedDigit;
  }

  /// Classifies the entity type based on the first digit of the NUIT.
  static String? getNUITEntityType(dynamic nuit) {
    final cleaned = nuit.toString().replaceAll(RegExp(r'\D'), '');
    if (!isValidNUIT(cleaned)) return null;

    final firstDigit = cleaned[0];
    const types = {
      '1': 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
      '2': 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
      '3': 'Equiparada (Heranças Jacentes, Consórcios)',
      '4': 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)',
      '5': 'Público (Instituições do Estado e Ministérios)'
    };

    return types[firstDigit];
  }

  /// Validates the Mozambican National ID (BI).
  static bool isValidBI(String bi) {
    final cleaned = bi.replaceAll(RegExp(r'[\s\-]'), '').toUpperCase();
    return RegExp(r'^\d{12}[A-Z]$').hasMatch(cleaned);
  }

  /// Formats a monetary value in Meticais following the official standard of Mozambique.
  ///
  /// Padrão oficial (SI + AT):
  /// - Thousands separator: space
  /// - Decimal separator: comma
  /// - Symbol after the value, separated by a space
  ///
  /// [currency] pode ser 'MT' (nacional) ou 'MZN' (ISO 4217).
  static String formatMZN(double value, [String currency = 'MT']) {
    final sign = value < 0 ? '-' : '';
    final absolute = value.abs();
    final parts = absolute.toStringAsFixed(2).split('.');
    final integerPart = parts[0];
    final decimalPart = parts[1];

    // Agrupar dígitos em blocos de 3 da direita para a esquerda
    final buffer = StringBuffer();
    for (int i = 0; i < integerPart.length; i++) {
      if (i > 0 && (integerPart.length - i) % 3 == 0) {
        buffer.write(' ');
      }
      buffer.write(integerPart[i]);
    }

    return '$sign${buffer.toString()},$decimalPart $currency';
  }

  /// Generates a WhatsApp contact URL with a pre-formatted message.
  static String buildWhatsAppUrl(String phone, [String message = '']) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final international = cleaned.startsWith('258') ? cleaned : '258$cleaned';
    
    final encodedMessage = message.isNotEmpty ? '?text=${Uri.encodeComponent(message)}' : '';
    return 'https://wa.me/$international$encodedMessage';
  }

  /// Official list of Mozambique Provinces and their districts.
  /// Fonte: Divisão administrativa oficial da República de Moçambique.
  static List<Map<String, dynamic>> getMozambiqueProvinces() {
    return [
        {
            'id': 'cab',
            'name': 'Cabo Delgado',
            'region': 'Norte',
            'sigla': 'CBD',
            'districts': [
                {
                    'name': 'Ancuabe',
                    'administrative_posts': ['Ancuabe', 'Metoro', 'Meza'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Balama',
                    'administrative_posts': ['Balama', 'Chapa', 'Kuekue', 'Mavala'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chiúre',
                    'administrative_posts': ['Chiúre', 'Chiúre-Velho', 'Katapua', 'Mazeze', 'Namogelia', 'Manoane'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Ibo',
                    'administrative_posts': ['Ibo', 'Quirimba'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Macomia',
                    'administrative_posts': ['Macomia', 'Chai', 'Mucojo', 'Quiterajo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mecúfi',
                    'administrative_posts': ['Mecúfi', 'Murrébuè'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Meluco',
                    'administrative_posts': ['Meluco', 'Muaguide'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Metuge',
                    'administrative_posts': ['Metuge', 'Mieze'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mocímboa da Praia',
                    'administrative_posts': ['Mocímboa da Praia', 'Diaca', 'Mbau'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Montepuez',
                    'administrative_posts': ['Montepuez', 'Mapupulo', 'Namanhumbir', 'Nairoto', 'Napaula'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mueda',
                    'administrative_posts': ['Mueda', 'Chapa', 'Imbuho', 'Negomano', 'N\'gapa'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Muidumbe',
                    'administrative_posts': ['Muidumbe', 'Chitunda', 'Miteda'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Namuno',
                    'administrative_posts': ['Namuno', 'Machoca', 'Meloco', 'Ncumpe', 'Luli'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Nangade',
                    'administrative_posts': ['Nangade', 'Ntamba'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Palma',
                    'administrative_posts': ['Palma', 'Olumbe', 'Quionga'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Pemba (Cidade)',
                    'administrative_posts': ['Pemba'],
                    'neighborhoods': [
                        'Paquitequete',
                        'Natite',
                        'Cariacó',
                        'Alto Gingone',
                        'Insubria',
                        'Muxara',
                        'Maringanha',
                        'Chibuébue'
                    ]
                },
                {
                    'name': 'Quissanga',
                    'administrative_posts': ['Quissanga', 'Mahate', 'Bilibiza'],
                    'neighborhoods': <String>[]
                }
            ]
        },
        {
            'id': 'nia',
            'name': 'Niassa',
            'region': 'Norte',
            'sigla': 'NS',
            'districts': [
                {
                    'name': 'Chimbonila',
                    'administrative_posts': ['Chimbonila', 'Meponda'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Cuamba',
                    'administrative_posts': ['Cuamba', 'Lúrio', 'Etatara'],
                    'neighborhoods': ['Ribaue', 'Mutxora', 'Ademo', 'Aeroporto']
                },
                {
                    'name': 'Lago',
                    'administrative_posts': ['Metangula', 'Cobué', 'Luninho', 'Maniamba'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Lichinga (Cidade)',
                    'administrative_posts': ['Lichinga'],
                    'neighborhoods': ['Central', 'Popular', 'Chimba', 'Cerâmica', 'Ngaula', 'Sanjala', 'Chiuaula']
                },
                {
                    'name': 'Majune',
                    'administrative_posts': ['Majune', 'Mua', 'Nairrobi'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mandimba',
                    'administrative_posts': ['Mandimba', 'Mitande'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Marrupa',
                    'administrative_posts': ['Marrupa', 'Marangira', 'Nungo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Maúa',
                    'administrative_posts': ['Maúa', 'Maiaca'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mavago',
                    'administrative_posts': ['Mavago', 'M\'saize'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mecanhelas',
                    'administrative_posts': ['Mecanhelas', 'Chiuta'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mecula',
                    'administrative_posts': ['Mecula', 'Matondovela'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Metarica',
                    'administrative_posts': ['Metarica', 'Nacuanha'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Muembe',
                    'administrative_posts': ['Muembe', 'Chiconono'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'N\'gauma',
                    'administrative_posts': ['Massangulo', 'Itepela'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Nipepe',
                    'administrative_posts': ['Nipepe', 'Muatuca'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Sanga',
                    'administrative_posts': ['Unango', 'Malamuila', 'Matchedje'],
                    'neighborhoods': <String>[]
                }
            ]
        },
        {
            'id': 'npl',
            'name': 'Nampula',
            'region': 'Norte',
            'sigla': 'NPL',
            'districts': [
                {
                    'name': 'Angoche',
                    'administrative_posts': ['Angoche', 'Aube', 'Namaponda'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Eráti',
                    'administrative_posts': ['Namapa', 'Alua', 'Nakarari'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Ilha de Moçambique',
                    'administrative_posts': ['Ilha de Moçambique', 'Lumbo'],
                    'neighborhoods': ['Museu', 'Litine', 'Areal', 'Marangonha']
                },
                {
                    'name': 'Lalaua',
                    'administrative_posts': ['Lalaua', 'Meti'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Larde',
                    'administrative_posts': ['Larde', 'Mucuali'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Liúpo',
                    'administrative_posts': ['Liúpo', 'Quinga'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Malema',
                    'administrative_posts': ['Malema', 'Chinga', 'Mutuali'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Meconta',
                    'administrative_posts': ['Meconta', 'Corrane', 'Namialo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mecubúri',
                    'administrative_posts': ['Mecubúri', 'Milhana', 'Muite', 'Namina'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Memba',
                    'administrative_posts': ['Memba', 'Chipene', 'Mazua', 'Lurio'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mogincual',
                    'administrative_posts': ['Mogincual', 'Quixaxe'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mogovolas',
                    'administrative_posts': ['Nametil', 'Calipo', 'Ilute', 'Muatua'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Moma',
                    'administrative_posts': ['Macone', 'Chalai', 'Lunga'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Monapo',
                    'administrative_posts': ['Monapo', 'Itoculo', 'Netia'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mossuril',
                    'administrative_posts': ['Mossuril', 'Lunga', 'Matibane'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Muecate',
                    'administrative_posts': ['Muecate', 'Imala', 'Muculuone'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Murrupula',
                    'administrative_posts': ['Murrupula', 'Chinga', 'Nihessiue'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Nacala-a-Velha',
                    'administrative_posts': ['Nacala-a-Velha', 'Covo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Nacala Porto',
                    'administrative_posts': ['Nacala Porto', 'Muanona'],
                    'neighborhoods': ['Mutiva', 'Triângulo', 'Ontupaia', 'Quissanga']
                },
                {
                    'name': 'Nampula (Cidade)',
                    'administrative_posts': ['Urbano Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri'],
                    'neighborhoods': ['Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri', 'Marrere', 'Namutequeliua']
                },
                {
                    'name': 'Nacarôa',
                    'administrative_posts': ['Nacarôa', 'Saua-Saua'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Rapale',
                    'administrative_posts': ['Rapale', 'Anchilo', 'Mutivaze'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Ribáuè',
                    'administrative_posts': ['Ribáuè', 'Cunle', 'Iapala'],
                    'neighborhoods': <String>[]
                }
            ]
        },
        {
            'id': 'zam',
            'name': 'Zambézia',
            'region': 'Centro',
            'sigla': 'ZMB',
            'districts': [
                {
                    'name': 'Alto Molócuè',
                    'administrative_posts': ['Alto Molócuè', 'Nauela'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chinde',
                    'administrative_posts': ['Chinde', 'Micaune'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Derre',
                    'administrative_posts': ['Derre', 'Guerissa'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Gilé',
                    'administrative_posts': ['Gilé', 'Alto Ligonha'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Gurué',
                    'administrative_posts': ['Gurué', 'Lioma', 'Nepuíte'],
                    'neighborhoods': ['Bairro Central', 'Mucuapa', 'Nacuacue']
                },
                {
                    'name': 'Ile',
                    'administrative_posts': ['Ile', 'Socone'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Inhassunge',
                    'administrative_posts': ['Mucupia', 'Gonhane'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Luabo',
                    'administrative_posts': ['Luabo', 'Chimbazo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Lugela',
                    'administrative_posts': ['Lugela', 'Tacuane', 'Munhamade'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Maganja da Costa',
                    'administrative_posts': ['Maganja da Costa', 'Baleia'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Milange',
                    'administrative_posts': ['Milange', 'Majaua', 'Mongue'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mocuba',
                    'administrative_posts': ['Mocuba', 'Mualama', 'Namanjavira'],
                    'neighborhoods': ['Central', 'Aeroporto', 'Paraíso']
                },
                {
                    'name': 'Mocubela',
                    'administrative_posts': ['Mocubela', 'Bajone'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Molumbo',
                    'administrative_posts': ['Molumbo', 'Corromana'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mopeia',
                    'administrative_posts': ['Mopeia', 'Campo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Morrumbala',
                    'administrative_posts': ['Morrumbala', 'Chire', 'Megaza'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mulevala',
                    'administrative_posts': ['Mulevala', 'Chirimane'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Namacurra',
                    'administrative_posts': ['Namacurra', 'Macuse'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Namarrói',
                    'administrative_posts': ['Namarrói', 'Regone'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Nicoadala',
                    'administrative_posts': ['Nicoadala', 'Maquival'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Pebane',
                    'administrative_posts': ['Pebane', 'Mulela', 'Naburi'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Quelimane (Cidade)',
                    'administrative_posts': ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3', 'Urbano nº 4'],
                    'neighborhoods': ['Central', 'Cementório', 'Inhassunge', 'Icidua', 'Chingo', 'Matacuane']
                }
            ]
        },
        {
            'id': 'tet',
            'name': 'Tete',
            'region': 'Centro',
            'sigla': 'TT',
            'districts': [
                {
                    'name': 'Angónia',
                    'administrative_posts': ['Ulongue', 'Domue'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Cahora-Bassa',
                    'administrative_posts': ['Songo', 'Chitima', 'Muxeza'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Changara',
                    'administrative_posts': ['Luenha', 'Chioco', 'Mavago'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chifunde',
                    'administrative_posts': ['Chifunde', 'Mualadzi', 'Nsadzu'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chiuta',
                    'administrative_posts': ['Manje', 'Kazula'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Dôa',
                    'administrative_posts': ['Dôa', 'Chueza'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Macanga',
                    'administrative_posts': ['Furancungo', 'Chinde'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Magoé',
                    'administrative_posts': ['Mpende', 'Chinthopo', 'Mukumbura'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Marara',
                    'administrative_posts': ['Marara', 'M\'fuba'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Marávia',
                    'administrative_posts': ['Fingoé', 'Chiputo', 'Molumbo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Moatize',
                    'administrative_posts': ['Moatize', 'Kambulatsitsi', 'Zóbuè'],
                    'neighborhoods': ['Bairro 25 de Setembro', 'Liberdade', 'Chithatha']
                },
                {
                    'name': 'Mutarara',
                    'administrative_posts': ['Nhamayabué', 'Inhangoma'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Tete (Cidade)',
                    'administrative_posts': ['Tete'],
                    'neighborhoods': ['Chingo', 'Degue', 'Matundo', 'Mpadue', 'Josina Machel', 'Francisco Manyanga']
                },
                {
                    'name': 'Tsangano',
                    'administrative_posts': ['Tsangano', 'Ntengo-Wambuzi'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Zumbo',
                    'administrative_posts': ['Zumbo', 'Muze', 'Zambue'],
                    'neighborhoods': <String>[]
                }
            ]
        },
        {
            'id': 'man',
            'name': 'Manica',
            'region': 'Centro',
            'sigla': 'MN',
            'districts': [
                {
                    'name': 'Bárue',
                    'administrative_posts': ['Catandica', 'Nhampassa', 'Chuala'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chimoio (Cidade)',
                    'administrative_posts': ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3'],
                    'neighborhoods': ['Central', '7 de Setembro', 'Soalpo', 'Nandfe', 'Vila Nova', 'Cordor']
                },
                {
                    'name': 'Gondola',
                    'administrative_posts': ['Gondola', 'Cafumpe', 'Amatongas'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Guro',
                    'administrative_posts': ['Guro', 'Mandie', 'Nhamassonge'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Macate',
                    'administrative_posts': ['Macate', 'Marera'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Machaze',
                    'administrative_posts': ['Machaze', 'Save'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Macossa',
                    'administrative_posts': ['Macossa', 'Nhamagua'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Manica',
                    'administrative_posts': ['Manica', 'Messica', 'Mavonde'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mossurize',
                    'administrative_posts': ['Espungabera', 'Dacata'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Sussundenga',
                    'administrative_posts': ['Sussundenga', 'Dombe', 'Muhoa'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Tambara',
                    'administrative_posts': ['Nhacolo', 'Buzua'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Vanduzi',
                    'administrative_posts': ['Vanduzi', 'Matsinho'],
                    'neighborhoods': <String>[]
                }
            ]
        },
        {
            'id': 'sof',
            'name': 'Sofala',
            'region': 'Centro',
            'sigla': 'SF',
            'districts': [
                {
                    'name': 'Beira (Cidade)',
                    'administrative_posts': ['Central', 'Munhava', 'Manga Loot', 'Inhamizua'],
                    'neighborhoods': ['Chaimite', 'Macuti', 'Ponta Gêa', 'Munhava', 'Manga', 'Vaz', 'Esturro', 'Cipangara']
                },
                {
                    'name': 'Búzi',
                    'administrative_posts': ['Búzi', 'Estaquinha', 'Nova Sofala'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Caia',
                    'administrative_posts': ['Caia', 'Sena', 'Murraça'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chemba',
                    'administrative_posts': ['Chemba', 'Chiramba', 'Mulima'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Cheringoma',
                    'administrative_posts': ['Inhaminga', 'Muanza'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chibabava',
                    'administrative_posts': ['Chibabava', 'Goonda', 'Muxúnguè'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Dondo',
                    'administrative_posts': ['Dondo', 'Mafambisse'],
                    'neighborhoods': ['Chibuabuamua', 'Central', 'Planalto']
                },
                {
                    'name': 'Gorongosa',
                    'administrative_posts': ['Gorongosa', 'Nhamadzi', 'Vanduzi'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Machanga',
                    'administrative_posts': ['Machanga', 'Divinhe'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Maringué',
                    'administrative_posts': ['Maringué', 'Canxixe', 'Subui'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Marromeu',
                    'administrative_posts': ['Marromeu', 'Chupanga'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Muanza',
                    'administrative_posts': ['Muanza', 'Galinha'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Nhamatanda',
                    'administrative_posts': ['Nhamatanda', 'Tica'],
                    'neighborhoods': <String>[]
                }
            ]
        },
        {
            'id': 'inh',
            'name': 'Inhambane',
            'region': 'Sul',
            'sigla': 'INH',
            'districts': [
                {
                    'name': 'Funhalouro',
                    'administrative_posts': ['Funhalouro', 'Tome'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Govuro',
                    'administrative_posts': ['Nova Mambone', 'Jofane'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Homoíne',
                    'administrative_posts': ['Homoíne', 'Pembe'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Inhambane (Cidade)',
                    'administrative_posts': ['Inhambane'],
                    'neighborhoods': ['Balane', 'Chamane', 'Josina Machel', 'Muelé', 'Liberdade', 'Aeroporto']
                },
                {
                    'name': 'Inharrime',
                    'administrative_posts': ['Inharrime', 'Chambone'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Inhassoro',
                    'administrative_posts': ['Inhassoro', 'Bazaruto'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Jangamo',
                    'administrative_posts': ['Jangamo', 'Cumbana'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mabote',
                    'administrative_posts': ['Mabote', 'Zimane'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Massinga',
                    'administrative_posts': ['Massinga', 'Chicomo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Maxixe (Cidade)',
                    'administrative_posts': ['Maxixe'],
                    'neighborhoods': ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']
                },
                {
                    'name': 'Morrumbene',
                    'administrative_posts': ['Morrumbene', 'Mucodoene'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Panda',
                    'administrative_posts': ['Panda', 'Muelé'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Vilankulo',
                    'administrative_posts': ['Vilankulo', 'Mapinhane'],
                    'neighborhoods': ['Bairro Central', 'Mucoque', 'Alto Macassa']
                },
                {
                    'name': 'Zavala',
                    'administrative_posts': ['Quissico', 'Zandamela'],
                    'neighborhoods': <String>[]
                }
            ]
        },
        {
            'id': 'gaz',
            'name': 'Gaza',
            'region': 'Sul',
            'sigla': 'GZ',
            'districts': [
                {
                    'name': 'Bilene',
                    'administrative_posts': ['Macia', 'Bilene Macia', 'Chissano'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chibuto',
                    'administrative_posts': ['Chibuto', 'Chaimite', 'Changanine'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chicualacuala',
                    'administrative_posts': ['Chicualacuala', 'Mapai'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chigubo',
                    'administrative_posts': ['Chigubo', 'Ndindiza'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chókwè',
                    'administrative_posts': ['Chókwè', 'Lionde', 'Macarretane'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Chonguene',
                    'administrative_posts': ['Chonguene', 'Chongoene'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Guijá',
                    'administrative_posts': ['Canicado', 'Chivonguene'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Limpopo',
                    'administrative_posts': ['Chicumbane', 'Zongoene'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mabalane',
                    'administrative_posts': ['Mabalane', 'Combomune'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Manjacaze',
                    'administrative_posts': ['Manjacaze', 'Chidenguele'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Mapai',
                    'administrative_posts': ['Mapai', 'Machaila'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Massangena',
                    'administrative_posts': ['Massangena', 'Mavue'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Massingir',
                    'administrative_posts': ['Massingir', 'Zulo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Xai-Xai (Cidade)',
                    'administrative_posts': ['Xai-Xai'],
                    'neighborhoods': ['Central', 'Alto-Gaza', 'Inhamissa', 'Panjane', 'Chicumbane', 'Patrice Lumumba']
                }
            ]
        },
        {
            'id': 'mpp',
            'name': 'Maputo (Província)',
            'region': 'Sul',
            'sigla': 'MPT',
            'districts': [
                {
                    'name': 'Boane',
                    'administrative_posts': ['Boane', 'Matola-Rio'],
                    'neighborhoods': ['Bairro Central', 'Campinho', 'Massaca']
                },
                {
                    'name': 'Magude',
                    'administrative_posts': ['Magude', 'Mapulanguene', 'Motaze'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Manhiça',
                    'administrative_posts': ['Manhiça', 'Xinavane', '3 de Fevereiro'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Marracuene',
                    'administrative_posts': ['Marracuene', 'Machubo'],
                    'neighborhoods': ['Aliança', 'Cumbe', 'Habel Jafar']
                },
                {
                    'name': 'Matola (Cidade)',
                    'administrative_posts': ['Matola', 'Infulene', 'Machava'],
                    'neighborhoods': ['Matola Sede', 'Fomento', 'Liberdade', 'T3', 'Trevo', 'Machava Socimol', 'Cingatela']
                },
                {
                    'name': 'Matutuíne',
                    'administrative_posts': ['Bela Vista', 'Catembe', 'Zitundo'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Moamba',
                    'administrative_posts': ['Moamba', 'Ressano Garcia', 'Pessene'],
                    'neighborhoods': <String>[]
                },
                {
                    'name': 'Namaacha',
                    'administrative_posts': ['Namaacha', 'Changalane'],
                    'neighborhoods': <String>[]
                }
            ]
        },
        {
            'id': 'mpc',
            'name': 'Maputo (Cidade)',
            'region': 'Sul',
            'sigla': 'MC',
            'districts': [
                {
                    'name': 'KaMpfumo',
                    'administrative_posts': ['KaMpfumo'],
                    'neighborhoods': [
                        'Central A/B',
                        'Alto Maé A/B',
                        'Malhangalene A/B',
                        'Polana Cimento A/B/C',
                        'Coop',
                        'Sommerschield'
                    ]
                },
                {
                    'name': 'Nlhamankulu',
                    'administrative_posts': ['Nlhamankulu'],
                    'neighborhoods': ['Aeroporto A/B', 'Chamanculo A/B/C/D', 'Malanga', 'Xipamanine', 'Munhuana', 'Unidade 7']
                },
                {
                    'name': 'KaMaxaquene',
                    'administrative_posts': ['KaMaxaquene'],
                    'neighborhoods': ['Maxaquene A/B/C/D', 'Polana Caniço A/B', 'Urbanização', 'Mafalala']
                },
                {
                    'name': 'KaMavota',
                    'administrative_posts': ['KaMavota'],
                    'neighborhoods': ['Mavalane A/B', 'FPLM', 'Hulene A/B', 'Ferroviário', 'Costa do Sol', 'Polana Caniço B']
                },
                {
                    'name': 'KaMubukwana',
                    'administrative_posts': ['KaMubukwana'],
                    'neighborhoods': ['Bagamoyo', 'George Dimitrov', 'Inhagoia A/B', 'Magoanine A/B/C', 'Zimpeto']
                },
                {
                    'name': 'KaTembe',
                    'administrative_posts': ['KaTembe'],
                    'neighborhoods': ['Gwaza Muthini', 'Incassane', 'Inguide', 'Chali', 'Chamissava']
                },
                {
                    'name': 'KaNyaka',
                    'administrative_posts': ['KaNyaka'],
                    'neighborhoods': ['Ribzene', 'Nghanyane', 'Chadwane']
                }
            ]
        }
    ];
  }

  /// Returns the list of districts belonging to a given province.
  static List<String> getDistrictsByProvince(String provinceId) {
    final cleanId = provinceId.trim().toLowerCase();
    for (final province in getMozambiqueProvinces()) {
      if (province['id'] == cleanId) {
        final districts = province['districts'] as List;
        return districts.map((d) => (d as Map)['name'] as String).toList();
      }
    }
    throw ArgumentError('Província inválida: $provinceId');
  }

  /// Returns a flat list of all 161 districts and their respective province IDs.
  static List<Map<String, dynamic>> getAllDistricts() {
    final list = <Map<String, dynamic>>[];
    for (final province in getMozambiqueProvinces()) {
      final pId = province['id'] as String;
      final districts = province['districts'] as List;
      for (final district in districts) {
        final dMap = district as Map<String, dynamic>;
        list.add({
          'name': dMap['name'] as String,
          'provinceId': pId,
          'administrative_posts': List<String>.from(dMap['administrative_posts'] as List),
          'neighborhoods': List<String>.from(dMap['neighborhoods'] as List),
        });
      }
    }
    return list;
  }

  /// Mapa de Códigos Postais Legados de Moçambique.
  static const Map<String, Map<String, String>> legacyPostalCodes = {
    // Região Sul
    // Maputo
    '1100': {'locality': 'Maputo ECP (Sede)', 'province': 'Maputo'},
    '1101': {'locality': 'Polana', 'province': 'Maputo'},
    '1102': {'locality': 'Sommerchild', 'province': 'Maputo'},
    '1103': {'locality': 'Malhangalene', 'province': 'Maputo'},
    '1104': {'locality': 'Alto-Maé', 'province': 'Maputo'},
    '1106': {'locality': 'Bairro Central', 'province': 'Maputo'},
    '1107': {'locality': 'Bairro do Aeroporto', 'province': 'Maputo'},
    '1108': {'locality': 'Bairro do Mavalane', 'province': 'Maputo'},
    '1109': {'locality': 'Bairro do Jardim', 'province': 'Maputo'},
    '1110': {'locality': 'Bairro do Xipamanine', 'province': 'Maputo'},
    '1111': {'locality': 'Bairro George Dimitrov', 'province': 'Maputo'},
    '1112': {'locality': 'Machava', 'province': 'Maputo'},
    '1113': {'locality': 'Fomento', 'province': 'Maputo'},
    '1114': {'locality': 'Matola', 'province': 'Maputo'},
    '1115': {'locality': 'Boane', 'province': 'Maputo'},
    '1116': {'locality': 'Namaacha', 'province': 'Maputo'},
    '1117': {'locality': 'Katembe', 'province': 'Maputo'},
    '1118': {'locality': 'Bela-Vista', 'province': 'Maputo'},
    '1119': {'locality': 'Inhaca', 'province': 'Maputo'},
    '1120': {'locality': 'Marracuene', 'province': 'Maputo'},
    '1121': {'locality': 'Manhiça', 'province': 'Maputo'},
    '1122': {'locality': 'Xinavane', 'province': 'Maputo'},
    '1123': {'locality': 'Magude', 'province': 'Maputo'},
    '1124': {'locality': 'Moamba', 'province': 'Maputo'},
    '1125': {'locality': 'Ressano Garcia', 'province': 'Maputo'},
    // Gaza
    '1200': {'locality': 'Xai-Xai ECP', 'province': 'Gaza'},
    '1201': {'locality': 'Praia de Xai-Xai', 'province': 'Gaza'},
    '1202': {'locality': 'Macia', 'province': 'Gaza'},
    '1203': {'locality': 'Praia de Bilene', 'province': 'Gaza'},
    '1204': {'locality': 'Chokwé', 'province': 'Gaza'},
    '1205': {'locality': 'Chilembene / Magoanine', 'province': 'Gaza'},
    '1206': {'locality': 'Mabalane', 'province': 'Gaza'},
    '1207': {'locality': 'Massingir', 'province': 'Gaza'},
    '1208': {'locality': 'Chibuto', 'province': 'Gaza'},
    '1209': {'locality': 'Manjacaze', 'province': 'Gaza'},
    '1210': {'locality': 'Chidenguele', 'province': 'Gaza'},
    '1211': {'locality': 'Chicualacuala', 'province': 'Gaza'},
    // Inhambane
    '1300': {'locality': 'Inhambane ECP', 'province': 'Inhambane'},
    '1301': {'locality': 'Maxixe', 'province': 'Inhambane'},
    '1302': {'locality': 'Morrumbene', 'province': 'Inhambane'},
    '1303': {'locality': 'Massinga', 'province': 'Inhambane'},
    '1304': {'locality': 'Vilanculos', 'province:': 'Inhambane'},
    '1305': {'locality': 'Inhassoro', 'province': 'Inhambane'},
    '1306': {'locality': 'Nova-Mambone', 'province': 'Inhambane'},
    '1307': {'locality': 'Jangamo', 'province': 'Inhambane'},
    '1308': {'locality': 'Cumbane', 'province': 'Inhambane'},
    '1309': {'locality': 'Homoine', 'province': 'Inhambane'},
    '1310': {'locality': 'Panda', 'province': 'Inhambane'},
    '1311': {'locality': 'Inharrime', 'province': 'Inhambane'},
    '1312': {'locality': 'Quissico', 'province': 'Inhambane'},
    '1313': {'locality': 'Funhalouro', 'province': 'Inhambane'},
    '1314': {'locality': 'Mabote', 'province': 'Inhambane'},

    // Região Centro
    // Sofala
    '2100': {'locality': 'Beira ECP', 'province': 'Sofala'},
    '2101': {'locality': 'Macúti', 'province': 'Sofala'},
    '2102': {'locality': 'Beira Aeroporto', 'province': 'Sofala'},
    '2103': {'locality': 'Manga', 'province': 'Sofala'},
    '2104': {'locality': 'Dondo', 'province': 'Sofala'},
    '2105': {'locality': 'Mafambisse', 'province': 'Sofala'},
    '2106': {'locality': 'Nhamatanda', 'province': 'Sofala'},
    '2107': {'locality': 'Buzi', 'province': 'Sofala'},
    '2110': {'locality': 'Gorongoza', 'province': 'Sofala'},
    // Manica
    '2200': {'locality': 'Chimoio ECP', 'province': 'Manica'},
    '2201': {'locality': 'Catandica', 'province': 'Manica'},
    '2202': {'locality': 'Vila de Manica', 'province': 'Manica'},
    '2203': {'locality': 'Gondola', 'province': 'Manica'},
    '2204': {'locality': 'Guro', 'province': 'Manica'},
    '2205': {'locality': 'Machaze', 'province': 'Manica'},
    '2206': {'locality': 'Macossa', 'province': 'Manica'},
    '2207': {'locality': 'Sussundenga', 'province': 'Manica'},
    '2208': {'locality': 'Tambara', 'province': 'Manica'},
    // Tete
    '2300': {'locality': 'Tete ECP', 'province': 'Tete'},
    '2301': {'locality': 'Tete Aeroporto', 'province': 'Tete'},
    '2302': {'locality': 'Moatize', 'province': 'Tete'},
    '2304': {'locality': 'Songo', 'province': 'Tete'},
    '2307': {'locality': 'Mutarara', 'province': 'Tete'},
    '2312': {'locality': 'Zumbo', 'province': 'Tete'},
    // Zambézia
    '2400': {'locality': 'Quelimane ECP', 'province': 'Zambézia'},
    '2401': {'locality': 'Nicoadala', 'province': 'Zambézia'},
    '2403': {'locality': 'Mocuba', 'province': 'Zambézia'},
    '2405': {'locality': 'Pebane', 'province': 'Zambézia'},
    '2407': {'locality': 'Gurué', 'province': 'Zambézia'},
    '2412': {'locality': 'Chinde', 'province': 'Zambézia'},

    // Região Norte
    // Nampula
    '3100': {'locality': 'Nampula ECP', 'province': 'Nampula'},
    '3101': {'locality': 'Angoche', 'province': 'Nampula'},
    '3102': {'locality': 'Monapo', 'province': 'Nampula'},
    '3105': {'locality': 'Ilha de Moçambique', 'province': 'Nampula'},
    '3108': {'locality': 'Moma', 'province': 'Nampula'},
    '3112': {'locality': 'Nacala', 'province': 'Nampula'},
    '3115': {'locality': 'Namapa', 'province': 'Nampula'},
    '3119': {'locality': 'Ribaue', 'province': 'Nampula'},
    // Cabo Delgado
    '3200': {'locality': 'Pemba ECP', 'province': 'Cabo Delgado'},
    '3201': {'locality': 'Pemba-2', 'province': 'Cabo Delgado'},
    '3208': {'locality': 'Montepuez', 'province': 'Cabo Delgado'},
    '3216': {'locality': 'Mueda', 'province': 'Cabo Delgado'},
    '3219': {'locality': 'Palma', 'province': 'Cabo Delgado'},
    // Niassa
    '3300': {'locality': 'Lichinga ECP', 'province': 'Niassa'},
    '3301': {'locality': 'Macanhelas', 'province': 'Niassa'},
    '3304': {'locality': 'Mandimba', 'province': 'Niassa'},
    '3305': {'locality': 'Cuamba', 'province': 'Niassa'},
    '3311': {'locality': 'Muembe', 'province': 'Niassa'}
  };

  /// Valida se um código postal legado de Moçambique é válido.
  /// Deve conter 4 dígitos numéricos pertencentes ao sistema clássico dos Correios de Moçambique.
  static bool isValidPostalCode(String code) {
    final cleaned = code.replaceAll(RegExp(r'\D'), '');
    return legacyPostalCodes.containsKey(cleaned);
  }

  /// Retorna a localidade correspondente a um código postal legado de Moçambique.
  static String? getPostalCodeLocality(String code) {
    final cleaned = code.replaceAll(RegExp(r'\D'), '');
    return legacyPostalCodes[cleaned]?['locality'];
  }

  /// Retorna a província correspondente a um código postal legado de Moçambique.
  static String? getPostalCodeProvince(String code) {
    final cleaned = code.replaceAll(RegExp(r'\D'), '');
    // Handle the typo in Vilankulos key if present, though we should make sure province is always written exactly
    return legacyPostalCodes[cleaned]?['province'] ?? legacyPostalCodes[cleaned]?['province:'];
  }

// ─────────────────────────────────────────────────────────────────────────────
// NAME & DOCUMENT FIELD SANITIZATION
// ─────────────────────────────────────────────────────────────────────────────

/// Checks whether a string is a valid personal name.
/// Accepts Unicode letters, spaces, hyphens, and apostrophes.
///
/// ```dart
/// isValidName('Edmilson Muacigarro') // true
/// isValidName('Jean-Pierre')         // true
/// isValidName('ABC123')              // false
/// ```
static bool isValidName(String name) {
  final trimmed = name.trim();
  if (trimmed.isEmpty) return false;
  return RegExp(r"^[\p{L}\s'\-]+$", unicode: true).hasMatch(trimmed);
}

/// Sanitizes a personal name field.
///
/// By default converts to Title Case (each word capitalised).
/// Set [allCaps] to `true` to force ALL UPPERCASE.
/// Strips digits and most special characters.
///
/// ```dart
/// sanitizeName('  edmilson   muacigarro  ')        // 'Edmilson Muacigarro'
/// sanitizeName('JOÃO', allCaps: true)              // 'JOÃO'
/// sanitizeName('jean-pierre dupont')               // 'Jean-Pierre Dupont'
/// ```
static String sanitizeName(String name, {bool allCaps = false}) {
  // Remove anything that is not a letter, space, hyphen, or apostrophe
  final cleaned = name
      .replaceAll(RegExp(r"[^\p{L}\s'\-]", unicode: true), '')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();

  if (allCaps) return cleaned.toUpperCase();

  // Title Case: capitalise after start, space, or hyphen
  final buffer = StringBuffer();
  bool capitaliseNext = true;
  for (final char in cleaned.split('')) {
    if (char == ' ' || char == '-') {
      buffer.write(char);
      capitaliseNext = true;
    } else if (capitaliseNext) {
      buffer.write(char.toUpperCase());
      capitaliseNext = false;
    } else {
      buffer.write(char);
    }
  }
  return buffer.toString();
}

/// Sanitizes a document number field that contains only digits.
/// Strips all non-numeric characters.
///
/// ```dart
/// sanitizeDocumentField('123 456 789')  // '123456789'
/// sanitizeDocumentField('123-456-789')  // '123456789'
/// ```
static String sanitizeDocumentField(String value) {
  return value.replaceAll(RegExp(r'\D'), '');
}

/// Sanitizes an alphanumeric document field (digits + letters),
/// forcing all letters to UPPERCASE.
///
/// Useful for BI, passports, and other mixed-format documents.
///
/// ```dart
/// sanitizeAlphanumericField('110 101 234567a')  // '110101234567A'
/// sanitizeAlphanumericField('abc-123-XYZ!')     // 'ABC123XYZ'
/// ```
static String sanitizeAlphanumericField(String value) {
  return value.replaceAll(RegExp(r'[^A-Za-z0-9]'), '').toUpperCase();
}


  /// Identifica a carteira móvel (Mobile Wallet) associada a um número moçambicano.
  static String? getMobileWallet(String phone) {
    final operatorName = getMobileOperator(phone);
    if (operatorName == null) return null;
    
    final wallets = {
      'Vodacom': 'M-Pesa',
      'Tmcel': 'mKesh',
      'Movitel': 'e-Mola'
    };
    
    return wallets[operatorName];
  }

  /// Valida o DIRE (Documento de Identificação de Residente Estrangeiro) de Moçambique.
  /// Formato: Exatamente 8 dígitos seguidos de uma única letra.
  static bool isValidDIRE(String dire) {
    final cleaned = dire.replaceAll(RegExp(r'[\s\-]'), '').toUpperCase();
    return RegExp(r'^\d{8}[A-Z]$').hasMatch(cleaned);
  }

  /// Validates the Mozambican Passport.
  /// Formato: Exatamente 2 letras seguidas de 7 dígitos numéricos.
  static bool isValidPassport(String passport) {
    final cleaned = passport.replaceAll(RegExp(r'[\s\-]'), '').toUpperCase();
    return RegExp(r'^[A-Z]{2}\d{7}$').hasMatch(cleaned);
  }

  /// Validates the Mozambican Driving License.
  /// Formato: 1 letra seguida de 5 a 7 dígitos numéricos.
  static bool isValidDrivingLicense(String license) {
    final cleaned = license.replaceAll(RegExp(r'[\s\-]'), '').toUpperCase();
    return RegExp(r'^[A-Z]\d{5,7}$').hasMatch(cleaned);
  }

  /// Valida o formato do Novo CEP (Formato: XXXX-XX)
  static bool isValidNewCEP(String cep) {
    return RegExp(r'^\d{4}-\d{2}$').hasMatch(cep.trim());
  }

  /// Sugere Novos Códigos de Endereçamento Postal (CEP) baseados numa entrada.
  static List<Map<String, String>> suggestCEPs(String input) {
    final cleaned = input.trim();
    if (cleaned.isEmpty) return [];

    final isDigits = int.tryParse(cleaned.replaceAll('-', '')) != null;
    List<String> searchPrefixes = [];

    if (isDigits && cleaned.length == 4 && legacyToNewCEPPrefix.containsKey(cleaned)) {
      searchPrefixes = legacyToNewCEPPrefix[cleaned]!;
    }

    final results = <Map<String, String>>[];
    final cleanedLower = cleaned.toLowerCase();

    for (final item in newCEPData) {
      if (searchPrefixes.isNotEmpty) {
        bool matchesPrefix = false;
        for (final prefix in searchPrefixes) {
          if (item['cep']!.startsWith(prefix)) {
            matchesPrefix = true;
            break;
          }
        }
        if (matchesPrefix) results.add(item);
      } else {
        if (item['cep']!.toLowerCase().contains(cleanedLower) ||
            item['province']!.toLowerCase().contains(cleanedLower) ||
            item['district']!.toLowerCase().contains(cleanedLower) ||
            item['locality']!.toLowerCase().contains(cleanedLower)) {
          results.add(item);
        }
      }
    }
    return results;
  }
}
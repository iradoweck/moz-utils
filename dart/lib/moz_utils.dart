/// moz_utils
///
/// Funções de utilidade para Moçambique.
/// Validação de NUIT, BI, documentos, e formatação de telefones.
library moz_utils;

class MozUtils {
  /// Valida um número de telefone moçambicano.
  /// Operadoras válidas: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
  static bool isValidMozambicanPhone(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final withoutCountryCode = cleaned.startsWith('258') ? cleaned.substring(3) : cleaned;
    return RegExp(r'^8[2-8]\d{7}$').hasMatch(withoutCountryCode);
  }

  /// Formata um número de telefone moçambicano para o padrão internacional.
  static String formatMozambicanPhone(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final withoutCountryCode = cleaned.startsWith('258') ? cleaned.substring(3) : cleaned;

    if (!isValidMozambicanPhone(withoutCountryCode)) {
      throw ArgumentError('Número de telefone inválido: $phone');
    }

    final prefix = withoutCountryCode.substring(0, 2);
    final part1 = withoutCountryCode.substring(2, 5);
    final part2 = withoutCountryCode.substring(5);

    return '+258 $prefix $part1 $part2';
  }

  /// Identifica a operadora de um número moçambicano.
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

  /// Classifica o tipo de entidade com base no primeiro dígito do NUIT.
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

  /// Valida o Bilhete de Identidade Moçambicano.
  static bool isValidBI(String bi) {
    final cleaned = bi.replaceAll(RegExp(r'[\s\-]'), '').toUpperCase();
    return RegExp(r'^\d{12}[A-Z]$').hasMatch(cleaned);
  }

  /// Formata um valor monetário em Meticais seguindo o padrão oficial de Moçambique.
  ///
  /// Padrão oficial (SI + AT):
  /// - Separador de milhares: espaço
  /// - Separador decimal: vírgula
  /// - Símbolo após o valor, separado por espaço
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

  /// Gera um URL de contacto WhatsApp com mensagem pré-formatada.
  static String buildWhatsAppUrl(String phone, [String message = '']) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final international = cleaned.startsWith('258') ? cleaned : '258$cleaned';
    
    final encodedMessage = message.isNotEmpty ? '?text=${Uri.encodeComponent(message)}' : '';
    return 'https://wa.me/$international$encodedMessage';
  }

  /// Lista oficial das Províncias de Moçambique com os seus distritos.
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
                    'postos_administrativos': ['Ancuabe', 'Metoro', 'Meza'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Balama',
                    'postos_administrativos': ['Balama', 'Chapa', 'Kuekue', 'Mavala'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chiúre',
                    'postos_administrativos': ['Chiúre', 'Chiúre-Velho', 'Katapua', 'Mazeze', 'Namogelia', 'Manoane'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Ibo',
                    'postos_administrativos': ['Ibo', 'Quirimba'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Macomia',
                    'postos_administrativos': ['Macomia', 'Chai', 'Mucojo', 'Quiterajo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mecúfi',
                    'postos_administrativos': ['Mecúfi', 'Murrébuè'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Meluco',
                    'postos_administrativos': ['Meluco', 'Muaguide'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Metuge',
                    'postos_administrativos': ['Metuge', 'Mieze'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mocímboa da Praia',
                    'postos_administrativos': ['Mocímboa da Praia', 'Diaca', 'Mbau'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Montepuez',
                    'postos_administrativos': ['Montepuez', 'Mapupulo', 'Namanhumbir', 'Nairoto', 'Napaula'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mueda',
                    'postos_administrativos': ['Mueda', 'Chapa', 'Imbuho', 'Negomano', 'N\'gapa'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Muidumbe',
                    'postos_administrativos': ['Muidumbe', 'Chitunda', 'Miteda'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Namuno',
                    'postos_administrativos': ['Namuno', 'Machoca', 'Meloco', 'Ncumpe', 'Luli'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Nangade',
                    'postos_administrativos': ['Nangade', 'Ntamba'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Palma',
                    'postos_administrativos': ['Palma', 'Olumbe', 'Quionga'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Pemba (Cidade)',
                    'postos_administrativos': ['Pemba'],
                    'bairros': [
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
                    'postos_administrativos': ['Quissanga', 'Mahate', 'Bilibiza'],
                    'bairros': <String>[]
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
                    'postos_administrativos': ['Chimbonila', 'Meponda'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Cuamba',
                    'postos_administrativos': ['Cuamba', 'Lúrio', 'Etatara'],
                    'bairros': ['Ribaue', 'Mutxora', 'Ademo', 'Aeroporto']
                },
                {
                    'name': 'Lago',
                    'postos_administrativos': ['Metangula', 'Cobué', 'Luninho', 'Maniamba'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Lichinga (Cidade)',
                    'postos_administrativos': ['Lichinga'],
                    'bairros': ['Central', 'Popular', 'Chimba', 'Cerâmica', 'Ngaula', 'Sanjala', 'Chiuaula']
                },
                {
                    'name': 'Majune',
                    'postos_administrativos': ['Majune', 'Mua', 'Nairrobi'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mandimba',
                    'postos_administrativos': ['Mandimba', 'Mitande'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Marrupa',
                    'postos_administrativos': ['Marrupa', 'Marangira', 'Nungo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Maúa',
                    'postos_administrativos': ['Maúa', 'Maiaca'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mavago',
                    'postos_administrativos': ['Mavago', 'M\'saize'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mecanhelas',
                    'postos_administrativos': ['Mecanhelas', 'Chiuta'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mecula',
                    'postos_administrativos': ['Mecula', 'Matondovela'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Metarica',
                    'postos_administrativos': ['Metarica', 'Nacuanha'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Muembe',
                    'postos_administrativos': ['Muembe', 'Chiconono'],
                    'bairros': <String>[]
                },
                {
                    'name': 'N\'gauma',
                    'postos_administrativos': ['Massangulo', 'Itepela'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Nipepe',
                    'postos_administrativos': ['Nipepe', 'Muatuca'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Sanga',
                    'postos_administrativos': ['Unango', 'Malamuila', 'Matchedje'],
                    'bairros': <String>[]
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
                    'postos_administrativos': ['Angoche', 'Aube', 'Namaponda'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Eráti',
                    'postos_administrativos': ['Namapa', 'Alua', 'Nakarari'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Ilha de Moçambique',
                    'postos_administrativos': ['Ilha de Moçambique', 'Lumbo'],
                    'bairros': ['Museu', 'Litine', 'Areal', 'Marangonha']
                },
                {
                    'name': 'Lalaua',
                    'postos_administrativos': ['Lalaua', 'Meti'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Larde',
                    'postos_administrativos': ['Larde', 'Mucuali'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Liúpo',
                    'postos_administrativos': ['Liúpo', 'Quinga'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Malema',
                    'postos_administrativos': ['Malema', 'Chinga', 'Mutuali'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Meconta',
                    'postos_administrativos': ['Meconta', 'Corrane', 'Namialo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mecubúri',
                    'postos_administrativos': ['Mecubúri', 'Milhana', 'Muite', 'Namina'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Memba',
                    'postos_administrativos': ['Memba', 'Chipene', 'Mazua', 'Lurio'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mogincual',
                    'postos_administrativos': ['Mogincual', 'Quixaxe'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mogovolas',
                    'postos_administrativos': ['Nametil', 'Calipo', 'Ilute', 'Muatua'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Moma',
                    'postos_administrativos': ['Macone', 'Chalai', 'Lunga'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Monapo',
                    'postos_administrativos': ['Monapo', 'Itoculo', 'Netia'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mossuril',
                    'postos_administrativos': ['Mossuril', 'Lunga', 'Matibane'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Muecate',
                    'postos_administrativos': ['Muecate', 'Imala', 'Muculuone'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Murrupula',
                    'postos_administrativos': ['Murrupula', 'Chinga', 'Nihessiue'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Nacala-a-Velha',
                    'postos_administrativos': ['Nacala-a-Velha', 'Covo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Nacala Porto',
                    'postos_administrativos': ['Nacala Porto', 'Muanona'],
                    'bairros': ['Mutiva', 'Triângulo', 'Ontupaia', 'Quissanga']
                },
                {
                    'name': 'Nampula (Cidade)',
                    'postos_administrativos': ['Urbano Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri'],
                    'bairros': ['Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri', 'Marrere', 'Namutequeliua']
                },
                {
                    'name': 'Nacarôa',
                    'postos_administrativos': ['Nacarôa', 'Saua-Saua'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Rapale',
                    'postos_administrativos': ['Rapale', 'Anchilo', 'Mutivaze'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Ribáuè',
                    'postos_administrativos': ['Ribáuè', 'Cunle', 'Iapala'],
                    'bairros': <String>[]
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
                    'postos_administrativos': ['Alto Molócuè', 'Nauela'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chinde',
                    'postos_administrativos': ['Chinde', 'Micaune'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Derre',
                    'postos_administrativos': ['Derre', 'Guerissa'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Gilé',
                    'postos_administrativos': ['Gilé', 'Alto Ligonha'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Gurué',
                    'postos_administrativos': ['Gurué', 'Lioma', 'Nepuíte'],
                    'bairros': ['Bairro Central', 'Mucuapa', 'Nacuacue']
                },
                {
                    'name': 'Ile',
                    'postos_administrativos': ['Ile', 'Socone'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Inhassunge',
                    'postos_administrativos': ['Mucupia', 'Gonhane'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Luabo',
                    'postos_administrativos': ['Luabo', 'Chimbazo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Lugela',
                    'postos_administrativos': ['Lugela', 'Tacuane', 'Munhamade'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Maganja da Costa',
                    'postos_administrativos': ['Maganja da Costa', 'Baleia'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Milange',
                    'postos_administrativos': ['Milange', 'Majaua', 'Mongue'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mocuba',
                    'postos_administrativos': ['Mocuba', 'Mualama', 'Namanjavira'],
                    'bairros': ['Central', 'Aeroporto', 'Paraíso']
                },
                {
                    'name': 'Mocubela',
                    'postos_administrativos': ['Mocubela', 'Bajone'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Molumbo',
                    'postos_administrativos': ['Molumbo', 'Corromana'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mopeia',
                    'postos_administrativos': ['Mopeia', 'Campo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Morrumbala',
                    'postos_administrativos': ['Morrumbala', 'Chire', 'Megaza'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mulevala',
                    'postos_administrativos': ['Mulevala', 'Chirimane'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Namacurra',
                    'postos_administrativos': ['Namacurra', 'Macuse'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Namarrói',
                    'postos_administrativos': ['Namarrói', 'Regone'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Nicoadala',
                    'postos_administrativos': ['Nicoadala', 'Maquival'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Pebane',
                    'postos_administrativos': ['Pebane', 'Mulela', 'Naburi'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Quelimane (Cidade)',
                    'postos_administrativos': ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3', 'Urbano nº 4'],
                    'bairros': ['Central', 'Cementório', 'Inhassunge', 'Icidua', 'Chingo', 'Matacuane']
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
                    'postos_administrativos': ['Ulongue', 'Domue'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Cahora-Bassa',
                    'postos_administrativos': ['Songo', 'Chitima', 'Muxeza'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Changara',
                    'postos_administrativos': ['Luenha', 'Chioco', 'Mavago'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chifunde',
                    'postos_administrativos': ['Chifunde', 'Mualadzi', 'Nsadzu'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chiuta',
                    'postos_administrativos': ['Manje', 'Kazula'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Dôa',
                    'postos_administrativos': ['Dôa', 'Chueza'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Macanga',
                    'postos_administrativos': ['Furancungo', 'Chinde'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Magoé',
                    'postos_administrativos': ['Mpende', 'Chinthopo', 'Mukumbura'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Marara',
                    'postos_administrativos': ['Marara', 'M\'fuba'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Marávia',
                    'postos_administrativos': ['Fingoé', 'Chiputo', 'Molumbo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Moatize',
                    'postos_administrativos': ['Moatize', 'Kambulatsitsi', 'Zóbuè'],
                    'bairros': ['Bairro 25 de Setembro', 'Liberdade', 'Chithatha']
                },
                {
                    'name': 'Mutarara',
                    'postos_administrativos': ['Nhamayabué', 'Inhangoma'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Tete (Cidade)',
                    'postos_administrativos': ['Tete'],
                    'bairros': ['Chingo', 'Degue', 'Matundo', 'Mpadue', 'Josina Machel', 'Francisco Manyanga']
                },
                {
                    'name': 'Tsangano',
                    'postos_administrativos': ['Tsangano', 'Ntengo-Wambuzi'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Zumbo',
                    'postos_administrativos': ['Zumbo', 'Muze', 'Zambue'],
                    'bairros': <String>[]
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
                    'postos_administrativos': ['Catandica', 'Nhampassa', 'Chuala'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chimoio (Cidade)',
                    'postos_administrativos': ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3'],
                    'bairros': ['Central', '7 de Setembro', 'Soalpo', 'Nandfe', 'Vila Nova', 'Cordor']
                },
                {
                    'name': 'Gondola',
                    'postos_administrativos': ['Gondola', 'Cafumpe', 'Amatongas'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Guro',
                    'postos_administrativos': ['Guro', 'Mandie', 'Nhamassonge'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Macate',
                    'postos_administrativos': ['Macate', 'Marera'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Machaze',
                    'postos_administrativos': ['Machaze', 'Save'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Macossa',
                    'postos_administrativos': ['Macossa', 'Nhamagua'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Manica',
                    'postos_administrativos': ['Manica', 'Messica', 'Mavonde'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mossurize',
                    'postos_administrativos': ['Espungabera', 'Dacata'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Sussundenga',
                    'postos_administrativos': ['Sussundenga', 'Dombe', 'Muhoa'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Tambara',
                    'postos_administrativos': ['Nhacolo', 'Buzua'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Vanduzi',
                    'postos_administrativos': ['Vanduzi', 'Matsinho'],
                    'bairros': <String>[]
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
                    'postos_administrativos': ['Central', 'Munhava', 'Manga Loot', 'Inhamizua'],
                    'bairros': ['Chaimite', 'Macuti', 'Ponta Gêa', 'Munhava', 'Manga', 'Vaz', 'Esturro', 'Cipangara']
                },
                {
                    'name': 'Búzi',
                    'postos_administrativos': ['Búzi', 'Estaquinha', 'Nova Sofala'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Caia',
                    'postos_administrativos': ['Caia', 'Sena', 'Murraça'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chemba',
                    'postos_administrativos': ['Chemba', 'Chiramba', 'Mulima'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Cheringoma',
                    'postos_administrativos': ['Inhaminga', 'Muanza'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chibabava',
                    'postos_administrativos': ['Chibabava', 'Goonda', 'Muxúnguè'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Dondo',
                    'postos_administrativos': ['Dondo', 'Mafambisse'],
                    'bairros': ['Chibuabuamua', 'Central', 'Planalto']
                },
                {
                    'name': 'Gorongosa',
                    'postos_administrativos': ['Gorongosa', 'Nhamadzi', 'Vanduzi'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Machanga',
                    'postos_administrativos': ['Machanga', 'Divinhe'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Maringué',
                    'postos_administrativos': ['Maringué', 'Canxixe', 'Subui'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Marromeu',
                    'postos_administrativos': ['Marromeu', 'Chupanga'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Muanza',
                    'postos_administrativos': ['Muanza', 'Galinha'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Nhamatanda',
                    'postos_administrativos': ['Nhamatanda', 'Tica'],
                    'bairros': <String>[]
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
                    'postos_administrativos': ['Funhalouro', 'Tome'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Govuro',
                    'postos_administrativos': ['Nova Mambone', 'Jofane'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Homoíne',
                    'postos_administrativos': ['Homoíne', 'Pembe'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Inhambane (Cidade)',
                    'postos_administrativos': ['Inhambane'],
                    'bairros': ['Balane', 'Chamane', 'Josina Machel', 'Muelé', 'Liberdade', 'Aeroporto']
                },
                {
                    'name': 'Inharrime',
                    'postos_administrativos': ['Inharrime', 'Chambone'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Inhassoro',
                    'postos_administrativos': ['Inhassoro', 'Bazaruto'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Jangamo',
                    'postos_administrativos': ['Jangamo', 'Cumbana'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mabote',
                    'postos_administrativos': ['Mabote', 'Zimane'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Massinga',
                    'postos_administrativos': ['Massinga', 'Chicomo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Maxixe (Cidade)',
                    'postos_administrativos': ['Maxixe'],
                    'bairros': ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']
                },
                {
                    'name': 'Morrumbene',
                    'postos_administrativos': ['Morrumbene', 'Mucodoene'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Panda',
                    'postos_administrativos': ['Panda', 'Muelé'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Vilankulo',
                    'postos_administrativos': ['Vilankulo', 'Mapinhane'],
                    'bairros': ['Bairro Central', 'Mucoque', 'Alto Macassa']
                },
                {
                    'name': 'Zavala',
                    'postos_administrativos': ['Quissico', 'Zandamela'],
                    'bairros': <String>[]
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
                    'postos_administrativos': ['Macia', 'Bilene Macia', 'Chissano'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chibuto',
                    'postos_administrativos': ['Chibuto', 'Chaimite', 'Changanine'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chicualacuala',
                    'postos_administrativos': ['Chicualacuala', 'Mapai'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chigubo',
                    'postos_administrativos': ['Chigubo', 'Ndindiza'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chókwè',
                    'postos_administrativos': ['Chókwè', 'Lionde', 'Macarretane'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Chonguene',
                    'postos_administrativos': ['Chonguene', 'Chongoene'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Guijá',
                    'postos_administrativos': ['Canicado', 'Chivonguene'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Limpopo',
                    'postos_administrativos': ['Chicumbane', 'Zongoene'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mabalane',
                    'postos_administrativos': ['Mabalane', 'Combomune'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Manjacaze',
                    'postos_administrativos': ['Manjacaze', 'Chidenguele'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Mapai',
                    'postos_administrativos': ['Mapai', 'Machaila'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Massangena',
                    'postos_administrativos': ['Massangena', 'Mavue'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Massingir',
                    'postos_administrativos': ['Massingir', 'Zulo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Xai-Xai (Cidade)',
                    'postos_administrativos': ['Xai-Xai'],
                    'bairros': ['Central', 'Alto-Gaza', 'Inhamissa', 'Panjane', 'Chicumbane', 'Patrice Lumumba']
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
                    'postos_administrativos': ['Boane', 'Matola-Rio'],
                    'bairros': ['Bairro Central', 'Campinho', 'Massaca']
                },
                {
                    'name': 'Magude',
                    'postos_administrativos': ['Magude', 'Mapulanguene', 'Motaze'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Manhiça',
                    'postos_administrativos': ['Manhiça', 'Xinavane', '3 de Fevereiro'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Marracuene',
                    'postos_administrativos': ['Marracuene', 'Machubo'],
                    'bairros': ['Aliança', 'Cumbe', 'Habel Jafar']
                },
                {
                    'name': 'Matola (Cidade)',
                    'postos_administrativos': ['Matola', 'Infulene', 'Machava'],
                    'bairros': ['Matola Sede', 'Fomento', 'Liberdade', 'T3', 'Trevo', 'Machava Socimol', 'Cingatela']
                },
                {
                    'name': 'Matutuíne',
                    'postos_administrativos': ['Bela Vista', 'Catembe', 'Zitundo'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Moamba',
                    'postos_administrativos': ['Moamba', 'Ressano Garcia', 'Pessene'],
                    'bairros': <String>[]
                },
                {
                    'name': 'Namaacha',
                    'postos_administrativos': ['Namaacha', 'Changalane'],
                    'bairros': <String>[]
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
                    'postos_administrativos': ['KaMpfumo'],
                    'bairros': [
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
                    'postos_administrativos': ['Nlhamankulu'],
                    'bairros': ['Aeroporto A/B', 'Chamanculo A/B/C/D', 'Malanga', 'Xipamanine', 'Munhuana', 'Unidade 7']
                },
                {
                    'name': 'KaMaxaquene',
                    'postos_administrativos': ['KaMaxaquene'],
                    'bairros': ['Maxaquene A/B/C/D', 'Polana Caniço A/B', 'Urbanização', 'Mafalala']
                },
                {
                    'name': 'KaMavota',
                    'postos_administrativos': ['KaMavota'],
                    'bairros': ['Mavalane A/B', 'FPLM', 'Hulene A/B', 'Ferroviário', 'Costa do Sol', 'Polana Caniço B']
                },
                {
                    'name': 'KaMubukwana',
                    'postos_administrativos': ['KaMubukwana'],
                    'bairros': ['Bagamoyo', 'George Dimitrov', 'Inhagoia A/B', 'Magoanine A/B/C', 'Zimpeto']
                },
                {
                    'name': 'KaTembe',
                    'postos_administrativos': ['KaTembe'],
                    'bairros': ['Gwaza Muthini', 'Incassane', 'Inguide', 'Chali', 'Chamissava']
                },
                {
                    'name': 'KaNyaka',
                    'postos_administrativos': ['KaNyaka'],
                    'bairros': ['Ribzene', 'Nghanyane', 'Chadwane']
                }
            ]
        }
    ];
  }

  /// Retorna a lista de distritos pertencentes a uma determinada província.
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

  /// Retorna uma lista plana com todos os 161 distritos e respetivos IDs de província.
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
          'postos_administrativos': List<String>.from(dMap['postos_administrativos'] as List),
          'bairros': List<String>.from(dMap['bairros'] as List),
        });
      }
    }
    return list;
  }
}


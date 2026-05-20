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
      {'id': 'cab', 'name': 'Cabo Delgado', 'region': 'Norte', 'sigla': 'CBD', 'districts': ['Ancuabe', 'Balama', 'Chiúre', 'Ibo', 'Macomia', 'Mecúfi', 'Meluco', 'Metuge', 'Mocímboa da Praia', 'Montepuez', 'Mueda', 'Muidumbe', 'Namuno', 'Nangade', 'Palma', 'Pemba (Cidade)', 'Quissanga']},
      {'id': 'nia', 'name': 'Niassa', 'region': 'Norte', 'sigla': 'NS', 'districts': ['Chimbonila', 'Cuamba', 'Lago', 'Lichinga (Cidade)', 'Majune', 'Mandimba', 'Marrupa', 'Maúa', 'Mavago', 'Mecanhelas', 'Mecula', 'Metarica', 'Muembe', 'N\'gauma', 'Nipepe', 'Sanga']},
      {'id': 'npl', 'name': 'Nampula', 'region': 'Norte', 'sigla': 'NPL', 'districts': ['Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', 'Larde', 'Liúpo', 'Malema', 'Meconta', 'Mecubúri', 'Memba', 'Mogincual', 'Mogovolas', 'Moma', 'Monapo', 'Mossuril', 'Muecate', 'Murrupula', 'Nacala-a-Velha', 'Nacala Porto', 'Nampula (Cidade)', 'Nacarôa', 'Rapale', 'Ribáuè']},
      {'id': 'zam', 'name': 'Zambézia', 'region': 'Centro', 'sigla': 'ZMB', 'districts': ['Alto Molócuè', 'Chinde', 'Derre', 'Gilé', 'Gurué', 'Ile', 'Inhassunge', 'Luabo', 'Lugela', 'Maganja da Costa', 'Milange', 'Mocuba', 'Mocubela', 'Molumbo', 'Mopeia', 'Morrumbala', 'Mulevala', 'Namacurra', 'Namarrói', 'Nicoadala', 'Pebane', 'Quelimane (Cidade)']},
      {'id': 'tet', 'name': 'Tete', 'region': 'Centro', 'sigla': 'TT', 'districts': ['Angónia', 'Cahora-Bassa', 'Changara', 'Chifunde', 'Chiuta', 'Dôa', 'Macanga', 'Magoé', 'Marara', 'Marávia', 'Moatize', 'Mutarara', 'Tete (Cidade)', 'Tsangano', 'Zumbo']},
      {'id': 'man', 'name': 'Manica', 'region': 'Centro', 'sigla': 'MN', 'districts': ['Bárue', 'Chimoio (Cidade)', 'Gondola', 'Guro', 'Macate', 'Machaze', 'Macossa', 'Manica', 'Mossurize', 'Sussundenga', 'Tambara', 'Vanduzi']},
      {'id': 'sof', 'name': 'Sofala', 'region': 'Centro', 'sigla': 'SF', 'districts': ['Beira (Cidade)', 'Búzi', 'Caia', 'Chemba', 'Cheringoma', 'Chibabava', 'Dondo', 'Gorongosa', 'Machanga', 'Maringué', 'Marromeu', 'Muanza', 'Nhamatanda']},
      {'id': 'inh', 'name': 'Inhambane', 'region': 'Sul', 'sigla': 'INH', 'districts': ['Funhalouro', 'Govuro', 'Homoíne', 'Inhambane (Cidade)', 'Inharrime', 'Inhassoro', 'Jangamo', 'Mabote', 'Massinga', 'Maxixe (Cidade)', 'Morrumbene', 'Panda', 'Vilankulo', 'Zavala']},
      {'id': 'gaz', 'name': 'Gaza', 'region': 'Sul', 'sigla': 'GZ', 'districts': ['Bilene', 'Chibuto', 'Chicualacuala', 'Chigubo', 'Chókwè', 'Chonguene', 'Guijá', 'Limpopo', 'Mabalane', 'Manjacaze', 'Mapai', 'Massangena', 'Massingir', 'Xai-Xai (Cidade)']},
      {'id': 'mpp', 'name': 'Maputo (Província)', 'region': 'Sul', 'sigla': 'MPT', 'districts': ['Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola (Cidade)', 'Matutuíne', 'Moamba', 'Namaacha']},
      {'id': 'mpc', 'name': 'Maputo (Cidade)', 'region': 'Sul', 'sigla': 'MC', 'districts': ['KaMpfumo', 'Nlhamankulu', 'KaMaxaquene', 'KaMavota', 'KaMubukwana', 'KaTembe', 'KaNyaka']}
    ];
  }
}

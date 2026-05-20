/// moz_utils
///
/// Funções de utilidade para Moçambique.
/// Validação de NUIT, BI, documentos, e formatação de telefones.
library moz_utils;

class MozUtils {
  /// Valida um número de telefone moçambicano.
  static bool isValidMozambicanPhone(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final withoutCountryCode = cleaned.startsWith('258') ? cleaned.substring(3) : cleaned;
    return RegExp(r'^8[1-9]\d{7}$').hasMatch(withoutCountryCode);
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
  static bool isValidNUIT(dynamic nuit) {
    final cleaned = nuit.toString().replaceAll(RegExp(r'\D'), '');

    if (cleaned.length != 9) return false;

    if (RegExp(r'^(\d)\1{8}$').hasMatch(cleaned)) return false;

    return true;
  }

  /// Valida o Bilhete de Identidade Moçambicano.
  static bool isValidBI(String bi) {
    final cleaned = bi.replaceAll(RegExp(r'[\s\-]'), '').toUpperCase();
    return RegExp(r'^\d{12}[A-Z]$').hasMatch(cleaned);
  }

  /// Formata um valor monetário em Meticais (MZN).
  static String formatMZN(double value) {
    return '${value.toStringAsFixed(2).replaceAll('.', ',')} MT';
  }

  /// Gera um URL de contacto WhatsApp com mensagem pré-formatada.
  static String buildWhatsAppUrl(String phone, [String message = '']) {
    final cleaned = phone.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    final international = cleaned.startsWith('258') ? cleaned : '258$cleaned';
    
    final encodedMessage = message.isNotEmpty ? '?text=${Uri.encodeComponent(message)}' : '';
    return 'https://wa.me/$international$encodedMessage';
  }

  /// Lista das Províncias de Moçambique.
  static List<Map<String, dynamic>> getMozambiqueProvinces() {
    return [
      {
        'id': 'mpm',
        'name': 'Maputo Cidade',
        'region': 'Sul',
        'districts': ['KaMpfumo', 'Nlhamankulu', 'KaMaxakeni', 'KaMavota', 'KaMubukwana', 'KaTembe', 'KaNyaka']
      },
      {
        'id': 'mpt',
        'name': 'Maputo Província',
        'region': 'Sul',
        'districts': ['Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola', 'Matutuíne', 'Moamba', 'Namaacha']
      },
      // ... omitting the rest to save space
    ];
  }
}

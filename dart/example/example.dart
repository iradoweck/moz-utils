import 'package:moz_utils/moz_utils.dart';

void main() {
  print('--- Validando Documentos Moçambicanos ---');
  print('NUIT 123456789 é válido? ${MozUtils.isValidNUIT('123456789')}');
  print('BI 110101234567A é válido? ${MozUtils.isValidBI('110101234567A')}');

  print('\n--- Telefones e WhatsApp ---');
  print('Telefone 841234567 é válido? ${MozUtils.isValidMozambicanPhone('841234567')}');
  print('Formatado: ${MozUtils.formatMozambicanPhone('841234567')}');
  print('Operadora: ${MozUtils.getMobileOperator('841234567')}');
  print('WhatsApp URL: ${MozUtils.buildWhatsAppUrl('841234567', 'Olá!')}');

  print('\n--- Moeda (MZN) ---');
  print('Formatação de 1500.50: ${MozUtils.formatMZN(1500.50)}');

  print('\n--- Códigos Postais Legados ---');
  print('Código postal 1100 é válido? ${MozUtils.isValidPostalCode('1100')}');
  print('Localidade do 1100: ${MozUtils.getPostalCodeLocality('1100')}');
  print('Província do 1100: ${MozUtils.getPostalCodeProvince('1100')}');
}

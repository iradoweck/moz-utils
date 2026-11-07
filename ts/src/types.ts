/**
 * moz-utils - Type Definitions
 *
 * Contratos de tipos públicos para o ecossistema TypeScript do moz-utils.
 * Desacoplamento para evitar dependências circulares.
 *
 * @license Apache-2.0
 */

/**
 * Representa os dados de um Código de Endereçamento Postal (CEP).
 */
export interface CEPInfo {
  cep: string;
  province: string;
  district: string;
  locality: string;
}

/**
 * Representa um distrito de Moçambique.
 */
export interface District {
  name: string;
  provinceId: string;
  administrative_posts: string[];
  neighborhoods: string[];
}

/**
 * Representa uma província moçambicana.
 */
export interface Province {
  id: string;
  name: string;
  region: string;
  sigla: string;
  districts: Array<{
    name: string;
    administrative_posts: string[];
    neighborhoods: string[];
  }>;
}

/**
 * Operadoras de telefonia móvel autorizadas em Moçambique.
 */
export type MobileOperator = 'Vodacom' | 'Tmcel' | 'Movitel';

/**
 * Carteiras móveis (Mobile Wallets) em operação em Moçambique.
 */
export type MobileWallet = 'M-Pesa' | 'mKesh' | 'e-Mola';

/**
 * Classificação oficial da entidade pelo primeiro dígito do NUIT (AT Moçambique).
 */
export type NUITEntityType =
  | 'Pessoas Singulares'
  | 'Pessoas Colectivas'
  | 'Entidades Equiparadas'
  | 'Estado / Públicas'
  | 'Outras Entidades'
  | 'Entidades Estrangeiras';

/**
 * Dados cadastrais de uma instituição bancária comercial regulada pelo Banco de Moçambique.
 */
export interface BankInfo {
  code: string;
  name: string;
  shortName: string;
}

/**
 * Opções para formatação de números telefónicos moçambicanos.
 */
export interface PhoneFormatOptions {
  /**
   * Formato de saída:
   * - 'international': Padrão com espaços (+258 84 123 4567)
   * - 'e164': Padrão E.164 compacto (+258841234567)
   * - 'national': Formato nacional sem código de país (84 123 4567)
   * - 'dashed': Formato nacional com hífen (84-123-4567)
   */
  format?: 'international' | 'e164' | 'national' | 'dashed';
}

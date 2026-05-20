<?php

namespace Iradoweck\MozUtils;

/**
 * MozUtils
 * 
 * Funções de utilidade para Moçambique.
 * Validação de NUIT, BI, documentos, e formatação de telefones.
 */
class MozUtils
{
    /**
     * Valida um número de telefone moçambicano.
     * Operadoras válidas: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
     */
    public static function isValidMozambicanPhone(string $phone): bool
    {
        $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
        $withoutCountryCode = str_starts_with($cleaned, '258') ? substr($cleaned, 3) : $cleaned;
        return preg_match('/^8[2-8]\d{7}$/', $withoutCountryCode) === 1;
    }

    /**
     * Formata um número de telefone moçambicano para o padrão internacional.
     */
    public static function formatMozambicanPhone(string $phone): string
    {
        $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
        $withoutCountryCode = str_starts_with($cleaned, '258') ? substr($cleaned, 3) : $cleaned;

        if (!self::isValidMozambicanPhone($withoutCountryCode)) {
            throw new \InvalidArgumentException("Número de telefone inválido: {$phone}");
        }

        $prefix = substr($withoutCountryCode, 0, 2);
        $part1 = substr($withoutCountryCode, 2, 3);
        $part2 = substr($withoutCountryCode, 5);

        return "+258 {$prefix} {$part1} {$part2}";
    }

    /**
     * Identifica a operadora de um número moçambicano.
     */
    public static function getMobileOperator(string $phone): ?string
    {
        $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
        $withoutCountryCode = str_starts_with($cleaned, '258') ? substr($cleaned, 3) : $cleaned;

        if (!self::isValidMozambicanPhone($withoutCountryCode)) {
            return null;
        }

        $prefix = substr($withoutCountryCode, 0, 2);
        $operators = [
            '84' => 'Vodacom',
            '85' => 'Vodacom',
            '82' => 'Tmcel',
            '83' => 'Tmcel',
            '86' => 'Movitel',
            '87' => 'Movitel',
            '88' => 'Movitel',
        ];

        return $operators[$prefix] ?? null;
    }

    /**
     * Valida o NUIT (Número Único de Identificação Tributária) de Moçambique.
     * 
     * Regras da AT:
     * - 9 dígitos
     * - Primeiro dígito: 1 a 5
     * - Nono dígito: Módulo 11
     */
    public static function isValidNUIT(string|int $nuit): bool
    {
        $cleaned = preg_replace('/\D/', '', (string)$nuit);

        if (strlen($cleaned) !== 9) return false;
        if (preg_match('/^(\d)\1{8}$/', $cleaned)) return false;
        if (!preg_match('/^[1-5]/', $cleaned)) return false;

        $sum = 0;
        for ($i = 0; $i < 8; $i++) {
            $sum += ((int)$cleaned[$i]) * (9 - $i);
        }

        $remainder = $sum % 11;
        $expectedDigit = $remainder <= 1 ? 0 : 11 - $remainder;

        return ((int)$cleaned[8]) === $expectedDigit;
    }

    /**
     * Classifica o tipo de entidade com base no primeiro dígito do NUIT.
     */
    public static function getNUITEntityType(string|int $nuit): ?string
    {
        $cleaned = preg_replace('/\D/', '', (string)$nuit);
        if (!self::isValidNUIT($cleaned)) return null;

        $firstDigit = $cleaned[0];
        $types = [
            '1' => 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
            '2' => 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
            '3' => 'Equiparada (Heranças Jacentes, Consórcios)',
            '4' => 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)',
            '5' => 'Público (Instituições do Estado e Ministérios)'
        ];

        return $types[$firstDigit] ?? null;
    }

    /**
     * Valida o Bilhete de Identidade Moçambicano.
     */
    public static function isValidBI(string $bi): bool
    {
        $cleaned = strtoupper(preg_replace('/[\s\-]/', '', $bi));
        return preg_match('/^\d{12}[A-Z]$/', $cleaned) === 1;
    }

    /**
     * Formata um valor monetário em Meticais seguindo o padrão oficial de Moçambique.
     *
     * Padrão oficial (SI + AT):
     * - Separador de milhares: espaço
     * - Separador decimal: vírgula
     * - Símbolo após o valor, separado por espaço
     *
     * @param float $value Valor numérico
     * @param string $currency 'MT' (nacional) ou 'MZN' (ISO 4217)
     * @return string Ex: "1 500,00 MT"
     */
    public static function formatMZN(float $value, string $currency = 'MT'): string
    {
        $sign = $value < 0 ? '-' : '';
        $absolute = abs($value);

        // number_format: 2 decimais, vírgula decimal, espaço nos milhares
        $formatted = number_format($absolute, 2, ',', ' ');

        return "{$sign}{$formatted} {$currency}";
    }

    /**
     * Gera um URL de contacto WhatsApp com mensagem pré-formatada.
     */
    public static function buildWhatsAppUrl(string $phone, string $message = ''): string
    {
        $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
        $international = str_starts_with($cleaned, '258') ? $cleaned : "258{$cleaned}";
        
        $encodedMessage = $message !== '' ? '?text=' . rawurlencode($message) : '';
        return "https://wa.me/{$international}{$encodedMessage}";
    }

    /**
     * Lista oficial das Províncias de Moçambique com os seus distritos.
     * Fonte: Divisão administrativa oficial da República de Moçambique.
     */
    public static function getMozambiqueProvinces(): array
    {
        return [
            [
                'id' => 'cab',
                'name' => 'Cabo Delgado',
                'region' => 'Norte',
                'sigla' => 'CBD',
                'districts' => ['Ancuabe', 'Balama', 'Chiúre', 'Ibo', 'Macomia', 'Mecúfi', 'Meluco', 'Metuge', 'Mocímboa da Praia', 'Montepuez', 'Mueda', 'Muidumbe', 'Namuno', 'Nangade', 'Palma', 'Pemba (Cidade)', 'Quissanga']
            ],
            [
                'id' => 'nia',
                'name' => 'Niassa',
                'region' => 'Norte',
                'sigla' => 'NS',
                'districts' => ['Chimbonila', 'Cuamba', 'Lago', 'Lichinga (Cidade)', 'Majune', 'Mandimba', 'Marrupa', 'Maúa', 'Mavago', 'Mecanhelas', 'Mecula', 'Metarica', 'Muembe', 'N\'gauma', 'Nipepe', 'Sanga']
            ],
            [
                'id' => 'npl',
                'name' => 'Nampula',
                'region' => 'Norte',
                'sigla' => 'NPL',
                'districts' => ['Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', 'Larde', 'Liúpo', 'Malema', 'Meconta', 'Mecubúri', 'Memba', 'Mogincual', 'Mogovolas', 'Moma', 'Monapo', 'Mossuril', 'Muecate', 'Murrupula', 'Nacala-a-Velha', 'Nacala Porto', 'Nampula (Cidade)', 'Nacarôa', 'Rapale', 'Ribáuè']
            ],
            [
                'id' => 'zam',
                'name' => 'Zambézia',
                'region' => 'Centro',
                'sigla' => 'ZMB',
                'districts' => ['Alto Molócuè', 'Chinde', 'Derre', 'Gilé', 'Gurué', 'Ile', 'Inhassunge', 'Luabo', 'Lugela', 'Maganja da Costa', 'Milange', 'Mocuba', 'Mocubela', 'Molumbo', 'Mopeia', 'Morrumbala', 'Mulevala', 'Namacurra', 'Namarrói', 'Nicoadala', 'Pebane', 'Quelimane (Cidade)']
            ],
            [
                'id' => 'tet',
                'name' => 'Tete',
                'region' => 'Centro',
                'sigla' => 'TT',
                'districts' => ['Angónia', 'Cahora-Bassa', 'Changara', 'Chifunde', 'Chiuta', 'Dôa', 'Macanga', 'Magoé', 'Marara', 'Marávia', 'Moatize', 'Mutarara', 'Tete (Cidade)', 'Tsangano', 'Zumbo']
            ],
            [
                'id' => 'man',
                'name' => 'Manica',
                'region' => 'Centro',
                'sigla' => 'MN',
                'districts' => ['Bárue', 'Chimoio (Cidade)', 'Gondola', 'Guro', 'Macate', 'Machaze', 'Macossa', 'Manica', 'Mossurize', 'Sussundenga', 'Tambara', 'Vanduzi']
            ],
            [
                'id' => 'sof',
                'name' => 'Sofala',
                'region' => 'Centro',
                'sigla' => 'SF',
                'districts' => ['Beira (Cidade)', 'Búzi', 'Caia', 'Chemba', 'Cheringoma', 'Chibabava', 'Dondo', 'Gorongosa', 'Machanga', 'Maringué', 'Marromeu', 'Muanza', 'Nhamatanda']
            ],
            [
                'id' => 'inh',
                'name' => 'Inhambane',
                'region' => 'Sul',
                'sigla' => 'INH',
                'districts' => ['Funhalouro', 'Govuro', 'Homoíne', 'Inhambane (Cidade)', 'Inharrime', 'Inhassoro', 'Jangamo', 'Mabote', 'Massinga', 'Maxixe (Cidade)', 'Morrumbene', 'Panda', 'Vilankulo', 'Zavala']
            ],
            [
                'id' => 'gaz',
                'name' => 'Gaza',
                'region' => 'Sul',
                'sigla' => 'GZ',
                'districts' => ['Bilene', 'Chibuto', 'Chicualacuala', 'Chigubo', 'Chókwè', 'Chonguene', 'Guijá', 'Limpopo', 'Mabalane', 'Manjacaze', 'Mapai', 'Massangena', 'Massingir', 'Xai-Xai (Cidade)']
            ],
            [
                'id' => 'mpp',
                'name' => 'Maputo (Província)',
                'region' => 'Sul',
                'sigla' => 'MPT',
                'districts' => ['Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola (Cidade)', 'Matutuíne', 'Moamba', 'Namaacha']
            ],
            [
                'id' => 'mpc',
                'name' => 'Maputo (Cidade)',
                'region' => 'Sul',
                'sigla' => 'MC',
                'districts' => ['KaMpfumo', 'Nlhamankulu', 'KaMaxaquene', 'KaMavota', 'KaMubukwana', 'KaTembe', 'KaNyaka']
            ]
        ];
    }
}

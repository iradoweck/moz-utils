<?php

declare(strict_types=1);

namespace Iradoweck\MozUtils;

/**
 * MozUtils
 * 
 * Utility functions for Mozambique.
 * Validation of NUIT, BI, documents, phone formatting, and banking.
 */
class MozUtils
{
    /**
     * Catálogo oficial dos 18 bancos comerciais registados no Banco de Moçambique.
     */
    public const array BANKS = Bank::BANKS;

    /**
     * Validates a Mozambican phone number.
     * Valid operators: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
     */
    public static function isValidMozambicanPhone(string $phone): bool
    {
        $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
        $withoutCountryCode = str_starts_with($cleaned, '258') ? substr($cleaned, 3) : $cleaned;
        return preg_match('/^8[2-8]\d{7}$/', $withoutCountryCode) === 1;
    }

    /**
     * Formats a Mozambican phone number to the international standard.
     */
    public static function formatMozambicanPhone(string $phone): string
    {
        $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
        $withoutCountryCode = str_starts_with($cleaned, '258') ? substr($cleaned, 3) : $cleaned;

        if (!self::isValidMozambicanPhone($withoutCountryCode)) {
            throw new \InvalidArgumentException("Invalid phone number: {$phone}");
        }

        $prefix = substr($withoutCountryCode, 0, 2);
        $part1 = substr($withoutCountryCode, 2, 3);
        $part2 = substr($withoutCountryCode, 5);

        return "+258 {$prefix} {$part1} {$part2}";
    }

    /**
     * Identifies the operator of a Mozambican phone number.
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
        if (!preg_match('/^[1-9]/', $cleaned)) return false;

        $weights = [8, 9, 4, 5, 6, 7, 8, 9];
        $sum = 0;
        for ($i = 0; $i < 8; $i++) {
            $sum += ((int)$cleaned[$i]) * $weights[$i];
        }

        $checkIdx = $sum % 11;
        $expectedDigit = (int)("01234567891"[$checkIdx]);

        return ((int)$cleaned[8]) === $expectedDigit;
    }

    /**
     * Classifies the entity type based on the first digit of the NUIT.
     */
    public static function getNUITEntityType(string|int $nuit): ?string
    {
        $cleaned = preg_replace('/\D/', '', (string)$nuit);
        if (!self::isValidNUIT($cleaned)) return null;

        $firstDigit = $cleaned[0];
        $types = [
            '1' => 'Pessoas Singulares',
            '2' => 'Pessoas Singulares',
            '3' => 'Pessoas Singulares',
            '4' => 'Pessoas Colectivas',
            '5' => 'Pessoas Colectivas',
            '6' => 'Entidades Equiparadas',
            '7' => 'Estado / Públicas',
            '8' => 'Outras Entidades',
            '9' => 'Entidades Estrangeiras'
        ];

        return $types[$firstDigit] ?? null;
    }

    /**
     * Validates the Mozambican National ID (BI).
     */
    public static function isValidBI(string $bi): bool
    {
        $cleaned = strtoupper(preg_replace('/[\s\-]/', '', $bi));
        return preg_match('/^\d{12}[A-Z]$/', $cleaned) === 1;
    }

    /**
     * Formats a monetary value in Meticais following the official standard of Mozambique.
     *
     * Padrão oficial (SI + AT):
     * - Thousands separator: space
     * - Decimal separator: comma
     * - Symbol after the value, separated by a space
     *
     * @param float|int $value Valor numérico
     * @param string $currency 'MT' (nacional) ou 'MZN' (ISO 4217)
     * @return string E.g.: "1 500,00 MT"
     */
    public static function formatMZN(float|int $value, string $currency = 'MT'): string
    {
        $sign = $value < 0 ? '-' : '';
        $absolute = abs($value);

        // number_format: 2 decimais, vírgula decimal, espaço nos milhares
        $formatted = number_format($absolute, 2, ',', ' ');

        return "{$sign}{$formatted} {$currency}";
    }

    /**
     * Parses a formatted MZN string back into a float.
     */
    public static function parseMZN(string $value): ?float
    {
        $clean = preg_replace('/[^\d.,\-]/', '', $value);
        if ($clean === '' || $clean === '-') return null;

        $lastComma = strrpos($clean, ',');
        $lastDot = strrpos($clean, '.');

        if ($lastComma !== false && $lastDot !== false) {
            if ($lastComma > $lastDot) {
                $clean = str_replace(',', '.', str_replace('.', '', $clean));
            } else {
                $clean = str_replace(',', '', $clean);
            }
        } elseif ($lastComma !== false) {
            $parts = explode(',', $clean);
            if (count($parts) === 2 && strlen($parts[1]) !== 3) {
                $clean = str_replace(',', '.', $clean);
            } else {
                $clean = str_replace(',', '', $clean);
            }
        } elseif ($lastDot !== false) {
            $parts = explode('.', $clean);
            if (count($parts) === 2 && strlen($parts[1]) === 3) {
                $clean = str_replace('.', '', $clean);
            } elseif (count($parts) > 2) {
                $clean = str_replace('.', '', $clean);
            }
        }

        return (float)$clean;
    }

    /**
     * Generates a WhatsApp contact URL with a pre-formatted message.
     */
    public static function buildWhatsAppUrl(string $phone, string $message = ''): string
    {
        $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
        $international = str_starts_with($cleaned, '258') ? $cleaned : "258{$cleaned}";
        
        $encodedMessage = $message !== '' ? '?text=' . rawurlencode($message) : '';
        return "https://wa.me/{$international}{$encodedMessage}";
    }

    /**
     * Official list of Mozambique Provinces and their districts.
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
                'districts' => [
                    [
                        'name' => 'Ancuabe',
                        'administrative_posts' => ['Ancuabe', 'Metoro', 'Meza'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Balama',
                        'administrative_posts' => ['Balama', 'Chapa', 'Kuekue', 'Mavala'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chiúre',
                        'administrative_posts' => ['Chiúre', 'Chiúre-Velho', 'Katapua', 'Mazeze', 'Namogelia', 'Manoane'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Ibo',
                        'administrative_posts' => ['Ibo', 'Quirimba'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Macomia',
                        'administrative_posts' => ['Macomia', 'Chai', 'Mucojo', 'Quiterajo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mecúfi',
                        'administrative_posts' => ['Mecúfi', 'Murrébuè'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Meluco',
                        'administrative_posts' => ['Meluco', 'Muaguide'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Metuge',
                        'administrative_posts' => ['Metuge', 'Mieze'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mocímboa da Praia',
                        'administrative_posts' => ['Mocímboa da Praia', 'Diaca', 'Mbau'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Montepuez',
                        'administrative_posts' => ['Montepuez', 'Mapupulo', 'Namanhumbir', 'Nairoto', 'Napaula'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mueda',
                        'administrative_posts' => ['Mueda', 'Chapa', 'Imbuho', 'Negomano', 'N\'gapa'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Muidumbe',
                        'administrative_posts' => ['Muidumbe', 'Chitunda', 'Miteda'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Namuno',
                        'administrative_posts' => ['Namuno', 'Machoca', 'Meloco', 'Ncumpe', 'Luli'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Nangade',
                        'administrative_posts' => ['Nangade', 'Ntamba'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Palma',
                        'administrative_posts' => ['Palma', 'Olumbe', 'Quionga'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Pemba (Cidade)',
                        'administrative_posts' => ['Pemba'],
                        'neighborhoods' => [
                            'Paquitequete',
                            'Natite',
                            'Cariacó',
                            'Alto Gingone',
                            'Insubria',
                            'Muxara',
                            'Maringanha',
                            'Chibuébue'
                        ]
                    ],
                    [
                        'name' => 'Quissanga',
                        'administrative_posts' => ['Quissanga', 'Mahate', 'Bilibiza'],
                        'neighborhoods' => []
                    ]
                ]
            ],
            [
                'id' => 'nia',
                'name' => 'Niassa',
                'region' => 'Norte',
                'sigla' => 'NS',
                'districts' => [
                    [
                        'name' => 'Chimbonila',
                        'administrative_posts' => ['Chimbonila', 'Meponda'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Cuamba',
                        'administrative_posts' => ['Cuamba', 'Lúrio', 'Etatara'],
                        'neighborhoods' => ['Ribaue', 'Mutxora', 'Ademo', 'Aeroporto']
                    ],
                    [
                        'name' => 'Lago',
                        'administrative_posts' => ['Metangula', 'Cobué', 'Luninho', 'Maniamba'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Lichinga (Cidade)',
                        'administrative_posts' => ['Lichinga'],
                        'neighborhoods' => ['Central', 'Popular', 'Chimba', 'Cerâmica', 'Ngaula', 'Sanjala', 'Chiuaula']
                    ],
                    [
                        'name' => 'Majune',
                        'administrative_posts' => ['Majune', 'Mua', 'Nairrobi'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mandimba',
                        'administrative_posts' => ['Mandimba', 'Mitande'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Marrupa',
                        'administrative_posts' => ['Marrupa', 'Marangira', 'Nungo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Maúa',
                        'administrative_posts' => ['Maúa', 'Maiaca'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mavago',
                        'administrative_posts' => ['Mavago', 'M\'saize'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mecanhelas',
                        'administrative_posts' => ['Mecanhelas', 'Chiuta'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mecula',
                        'administrative_posts' => ['Mecula', 'Matondovela'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Metarica',
                        'administrative_posts' => ['Metarica', 'Nacuanha'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Muembe',
                        'administrative_posts' => ['Muembe', 'Chiconono'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'N\'gauma',
                        'administrative_posts' => ['Massangulo', 'Itepela'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Nipepe',
                        'administrative_posts' => ['Nipepe', 'Muatuca'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Sanga',
                        'administrative_posts' => ['Unango', 'Malamuila', 'Matchedje'],
                        'neighborhoods' => []
                    ]
                ]
            ],
            [
                'id' => 'npl',
                'name' => 'Nampula',
                'region' => 'Norte',
                'sigla' => 'NPL',
                'districts' => [
                    [
                        'name' => 'Angoche',
                        'administrative_posts' => ['Angoche', 'Aube', 'Namaponda'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Eráti',
                        'administrative_posts' => ['Namapa', 'Alua', 'Nakarari'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Ilha de Moçambique',
                        'administrative_posts' => ['Ilha de Moçambique', 'Lumbo'],
                        'neighborhoods' => ['Museu', 'Litine', 'Areal', 'Marangonha']
                    ],
                    [
                        'name' => 'Lalaua',
                        'administrative_posts' => ['Lalaua', 'Meti'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Larde',
                        'administrative_posts' => ['Larde', 'Mucuali'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Liúpo',
                        'administrative_posts' => ['Liúpo', 'Quinga'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Malema',
                        'administrative_posts' => ['Malema', 'Chinga', 'Mutuali'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Meconta',
                        'administrative_posts' => ['Meconta', 'Corrane', 'Namialo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mecubúri',
                        'administrative_posts' => ['Mecubúri', 'Milhana', 'Muite', 'Namina'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Memba',
                        'administrative_posts' => ['Memba', 'Chipene', 'Mazua', 'Lurio'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mogincual',
                        'administrative_posts' => ['Mogincual', 'Quixaxe'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mogovolas',
                        'administrative_posts' => ['Nametil', 'Calipo', 'Ilute', 'Muatua'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Moma',
                        'administrative_posts' => ['Macone', 'Chalai', 'Lunga'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Monapo',
                        'administrative_posts' => ['Monapo', 'Itoculo', 'Netia'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mossuril',
                        'administrative_posts' => ['Mossuril', 'Lunga', 'Matibane'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Muecate',
                        'administrative_posts' => ['Muecate', 'Imala', 'Muculuone'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Murrupula',
                        'administrative_posts' => ['Murrupula', 'Chinga', 'Nihessiue'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Nacala-a-Velha',
                        'administrative_posts' => ['Nacala-a-Velha', 'Covo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Nacala Porto',
                        'administrative_posts' => ['Nacala Porto', 'Muanona'],
                        'neighborhoods' => ['Mutiva', 'Triângulo', 'Ontupaia', 'Quissanga']
                    ],
                    [
                        'name' => 'Nampula (Cidade)',
                        'administrative_posts' => ['Urbano Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri'],
                        'neighborhoods' => ['Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri', 'Marrere', 'Namutequeliua']
                    ],
                    [
                        'name' => 'Nacarôa',
                        'administrative_posts' => ['Nacarôa', 'Saua-Saua'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Rapale',
                        'administrative_posts' => ['Rapale', 'Anchilo', 'Mutivaze'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Ribáuè',
                        'administrative_posts' => ['Ribáuè', 'Cunle', 'Iapala'],
                        'neighborhoods' => []
                    ]
                ]
            ],
            [
                'id' => 'zam',
                'name' => 'Zambézia',
                'region' => 'Centro',
                'sigla' => 'ZMB',
                'districts' => [
                    [
                        'name' => 'Alto Molócuè',
                        'administrative_posts' => ['Alto Molócuè', 'Nauela'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chinde',
                        'administrative_posts' => ['Chinde', 'Micaune'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Derre',
                        'administrative_posts' => ['Derre', 'Guerissa'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Gilé',
                        'administrative_posts' => ['Gilé', 'Alto Ligonha'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Gurué',
                        'administrative_posts' => ['Gurué', 'Lioma', 'Nepuíte'],
                        'neighborhoods' => ['Bairro Central', 'Mucuapa', 'Nacuacue']
                    ],
                    [
                        'name' => 'Ile',
                        'administrative_posts' => ['Ile', 'Socone'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Inhassunge',
                        'administrative_posts' => ['Mucupia', 'Gonhane'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Luabo',
                        'administrative_posts' => ['Luabo', 'Chimbazo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Lugela',
                        'administrative_posts' => ['Lugela', 'Tacuane', 'Munhamade'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Maganja da Costa',
                        'administrative_posts' => ['Maganja da Costa', 'Baleia'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Milange',
                        'administrative_posts' => ['Milange', 'Majaua', 'Mongue'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mocuba',
                        'administrative_posts' => ['Mocuba', 'Mualama', 'Namanjavira'],
                        'neighborhoods' => ['Central', 'Aeroporto', 'Paraíso']
                    ],
                    [
                        'name' => 'Mocubela',
                        'administrative_posts' => ['Mocubela', 'Bajone'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Molumbo',
                        'administrative_posts' => ['Molumbo', 'Corromana'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mopeia',
                        'administrative_posts' => ['Mopeia', 'Campo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Morrumbala',
                        'administrative_posts' => ['Morrumbala', 'Chire', 'Megaza'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mulevala',
                        'administrative_posts' => ['Mulevala', 'Chirimane'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Namacurra',
                        'administrative_posts' => ['Namacurra', 'Macuse'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Namarrói',
                        'administrative_posts' => ['Namarrói', 'Regone'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Nicoadala',
                        'administrative_posts' => ['Nicoadala', 'Maquival'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Pebane',
                        'administrative_posts' => ['Pebane', 'Mulela', 'Naburi'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Quelimane (Cidade)',
                        'administrative_posts' => ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3', 'Urbano nº 4'],
                        'neighborhoods' => ['Central', 'Cementório', 'Inhassunge', 'Icidua', 'Chingo', 'Matacuane']
                    ]
                ]
            ],
            [
                'id' => 'tet',
                'name' => 'Tete',
                'region' => 'Centro',
                'sigla' => 'TT',
                'districts' => [
                    [
                        'name' => 'Angónia',
                        'administrative_posts' => ['Ulongue', 'Domue'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Cahora-Bassa',
                        'administrative_posts' => ['Songo', 'Chitima', 'Muxeza'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Changara',
                        'administrative_posts' => ['Luenha', 'Chioco', 'Mavago'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chifunde',
                        'administrative_posts' => ['Chifunde', 'Mualadzi', 'Nsadzu'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chiuta',
                        'administrative_posts' => ['Manje', 'Kazula'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Dôa',
                        'administrative_posts' => ['Dôa', 'Chueza'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Macanga',
                        'administrative_posts' => ['Furancungo', 'Chinde'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Magoé',
                        'administrative_posts' => ['Mpende', 'Chinthopo', 'Mukumbura'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Marara',
                        'administrative_posts' => ['Marara', 'M\'fuba'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Marávia',
                        'administrative_posts' => ['Fingoé', 'Chiputo', 'Molumbo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Moatize',
                        'administrative_posts' => ['Moatize', 'Kambulatsitsi', 'Zóbuè'],
                        'neighborhoods' => ['Bairro 25 de Setembro', 'Liberdade', 'Chithatha']
                    ],
                    [
                        'name' => 'Mutarara',
                        'administrative_posts' => ['Nhamayabué', 'Inhangoma'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Tete (Cidade)',
                        'administrative_posts' => ['Tete'],
                        'neighborhoods' => ['Chingo', 'Degue', 'Matundo', 'Mpadue', 'Josina Machel', 'Francisco Manyanga']
                    ],
                    [
                        'name' => 'Tsangano',
                        'administrative_posts' => ['Tsangano', 'Ntengo-Wambuzi'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Zumbo',
                        'administrative_posts' => ['Zumbo', 'Muze', 'Zambue'],
                        'neighborhoods' => []
                    ]
                ]
            ],
            [
                'id' => 'man',
                'name' => 'Manica',
                'region' => 'Centro',
                'sigla' => 'MN',
                'districts' => [
                    [
                        'name' => 'Bárue',
                        'administrative_posts' => ['Catandica', 'Nhampassa', 'Chuala'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chimoio (Cidade)',
                        'administrative_posts' => ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3'],
                        'neighborhoods' => ['Central', '7 de Setembro', 'Soalpo', 'Nandfe', 'Vila Nova', 'Cordor']
                    ],
                    [
                        'name' => 'Gondola',
                        'administrative_posts' => ['Gondola', 'Cafumpe', 'Amatongas'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Guro',
                        'administrative_posts' => ['Guro', 'Mandie', 'Nhamassonge'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Macate',
                        'administrative_posts' => ['Macate', 'Marera'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Machaze',
                        'administrative_posts' => ['Machaze', 'Save'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Macossa',
                        'administrative_posts' => ['Macossa', 'Nhamagua'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Manica',
                        'administrative_posts' => ['Manica', 'Messica', 'Mavonde'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mossurize',
                        'administrative_posts' => ['Espungabera', 'Dacata'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Sussundenga',
                        'administrative_posts' => ['Sussundenga', 'Dombe', 'Muhoa'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Tambara',
                        'administrative_posts' => ['Nhacolo', 'Buzua'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Vanduzi',
                        'administrative_posts' => ['Vanduzi', 'Matsinho'],
                        'neighborhoods' => []
                    ]
                ]
            ],
            [
                'id' => 'sof',
                'name' => 'Sofala',
                'region' => 'Centro',
                'sigla' => 'SF',
                'districts' => [
                    [
                        'name' => 'Beira (Cidade)',
                        'administrative_posts' => ['Central', 'Munhava', 'Manga Loot', 'Inhamizua'],
                        'neighborhoods' => ['Chaimite', 'Macuti', 'Ponta Gêa', 'Munhava', 'Manga', 'Vaz', 'Esturro', 'Cipangara']
                    ],
                    [
                        'name' => 'Búzi',
                        'administrative_posts' => ['Búzi', 'Estaquinha', 'Nova Sofala'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Caia',
                        'administrative_posts' => ['Caia', 'Sena', 'Murraça'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chemba',
                        'administrative_posts' => ['Chemba', 'Chiramba', 'Mulima'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Cheringoma',
                        'administrative_posts' => ['Inhaminga', 'Muanza'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chibabava',
                        'administrative_posts' => ['Chibabava', 'Goonda', 'Muxúnguè'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Dondo',
                        'administrative_posts' => ['Dondo', 'Mafambisse'],
                        'neighborhoods' => ['Chibuabuamua', 'Central', 'Planalto']
                    ],
                    [
                        'name' => 'Gorongosa',
                        'administrative_posts' => ['Gorongosa', 'Nhamadzi', 'Vanduzi'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Machanga',
                        'administrative_posts' => ['Machanga', 'Divinhe'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Maringué',
                        'administrative_posts' => ['Maringué', 'Canxixe', 'Subui'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Marromeu',
                        'administrative_posts' => ['Marromeu', 'Chupanga'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Muanza',
                        'administrative_posts' => ['Muanza', 'Galinha'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Nhamatanda',
                        'administrative_posts' => ['Nhamatanda', 'Tica'],
                        'neighborhoods' => []
                    ]
                ]
            ],
            [
                'id' => 'inh',
                'name' => 'Inhambane',
                'region' => 'Sul',
                'sigla' => 'INH',
                'districts' => [
                    [
                        'name' => 'Funhalouro',
                        'administrative_posts' => ['Funhalouro', 'Tome'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Govuro',
                        'administrative_posts' => ['Nova Mambone', 'Jofane'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Homoíne',
                        'administrative_posts' => ['Homoíne', 'Pembe'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Inhambane (Cidade)',
                        'administrative_posts' => ['Inhambane'],
                        'neighborhoods' => ['Balane', 'Chamane', 'Josina Machel', 'Muelé', 'Liberdade', 'Aeroporto']
                    ],
                    [
                        'name' => 'Inharrime',
                        'administrative_posts' => ['Inharrime', 'Chambone'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Inhassoro',
                        'administrative_posts' => ['Inhassoro', 'Bazaruto'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Jangamo',
                        'administrative_posts' => ['Jangamo', 'Cumbana'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mabote',
                        'administrative_posts' => ['Mabote', 'Zimane'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Massinga',
                        'administrative_posts' => ['Massinga', 'Chicomo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Maxixe (Cidade)',
                        'administrative_posts' => ['Maxixe'],
                        'neighborhoods' => ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']
                    ],
                    [
                        'name' => 'Morrumbene',
                        'administrative_posts' => ['Morrumbene', 'Mucodoene'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Panda',
                        'administrative_posts' => ['Panda', 'Muelé'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Vilankulo',
                        'administrative_posts' => ['Vilankulo', 'Mapinhane'],
                        'neighborhoods' => ['Bairro Central', 'Mucoque', 'Alto Macassa']
                    ],
                    [
                        'name' => 'Zavala',
                        'administrative_posts' => ['Quissico', 'Zandamela'],
                        'neighborhoods' => []
                    ]
                ]
            ],
            [
                'id' => 'gaz',
                'name' => 'Gaza',
                'region' => 'Sul',
                'sigla' => 'GZ',
                'districts' => [
                    [
                        'name' => 'Bilene',
                        'administrative_posts' => ['Macia', 'Bilene Macia', 'Chissano'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chibuto',
                        'administrative_posts' => ['Chibuto', 'Chaimite', 'Changanine'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chicualacuala',
                        'administrative_posts' => ['Chicualacuala', 'Mapai'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chigubo',
                        'administrative_posts' => ['Chigubo', 'Ndindiza'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chókwè',
                        'administrative_posts' => ['Chókwè', 'Lionde', 'Macarretane'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Chonguene',
                        'administrative_posts' => ['Chonguene', 'Chongoene'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Guijá',
                        'administrative_posts' => ['Canicado', 'Chivonguene'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Limpopo',
                        'administrative_posts' => ['Chicumbane', 'Zongoene'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mabalane',
                        'administrative_posts' => ['Mabalane', 'Combomune'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Manjacaze',
                        'administrative_posts' => ['Manjacaze', 'Chidenguele'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Mapai',
                        'administrative_posts' => ['Mapai', 'Machaila'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Massangena',
                        'administrative_posts' => ['Massangena', 'Mavue'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Massingir',
                        'administrative_posts' => ['Massingir', 'Zulo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Xai-Xai (Cidade)',
                        'administrative_posts' => ['Xai-Xai'],
                        'neighborhoods' => ['Central', 'Alto-Gaza', 'Inhamissa', 'Panjane', 'Chicumbane', 'Patrice Lumumba']
                    ]
                ]
            ],
            [
                'id' => 'mpp',
                'name' => 'Maputo (Província)',
                'region' => 'Sul',
                'sigla' => 'MPT',
                'districts' => [
                    [
                        'name' => 'Boane',
                        'administrative_posts' => ['Boane', 'Matola-Rio'],
                        'neighborhoods' => ['Bairro Central', 'Campinho', 'Massaca']
                    ],
                    [
                        'name' => 'Magude',
                        'administrative_posts' => ['Magude', 'Mapulanguene', 'Motaze'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Manhiça',
                        'administrative_posts' => ['Manhiça', 'Xinavane', '3 de Fevereiro'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Marracuene',
                        'administrative_posts' => ['Marracuene', 'Machubo'],
                        'neighborhoods' => ['Aliança', 'Cumbe', 'Habel Jafar']
                    ],
                    [
                        'name' => 'Matola (Cidade)',
                        'administrative_posts' => ['Matola', 'Infulene', 'Machava'],
                        'neighborhoods' => ['Matola Sede', 'Fomento', 'Liberdade', 'T3', 'Trevo', 'Machava Socimol', 'Cingatela']
                    ],
                    [
                        'name' => 'Matutuíne',
                        'administrative_posts' => ['Bela Vista', 'Catembe', 'Zitundo'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Moamba',
                        'administrative_posts' => ['Moamba', 'Ressano Garcia', 'Pessene'],
                        'neighborhoods' => []
                    ],
                    [
                        'name' => 'Namaacha',
                        'administrative_posts' => ['Namaacha', 'Changalane'],
                        'neighborhoods' => []
                    ]
                ]
            ],
            [
                'id' => 'mpc',
                'name' => 'Maputo (Cidade)',
                'region' => 'Sul',
                'sigla' => 'MC',
                'districts' => [
                    [
                        'name' => 'KaMpfumo',
                        'administrative_posts' => ['KaMpfumo'],
                        'neighborhoods' => [
                            'Central A/B',
                            'Alto Maé A/B',
                            'Malhangalene A/B',
                            'Polana Cimento A/B/C',
                            'Coop',
                            'Sommerschield'
                        ]
                    ],
                    [
                        'name' => 'Nlhamankulu',
                        'administrative_posts' => ['Nlhamankulu'],
                        'neighborhoods' => ['Aeroporto A/B', 'Chamanculo A/B/C/D', 'Malanga', 'Xipamanine', 'Munhuana', 'Unidade 7']
                    ],
                    [
                        'name' => 'KaMaxaquene',
                        'administrative_posts' => ['KaMaxaquene'],
                        'neighborhoods' => ['Maxaquene A/B/C/D', 'Polana Caniço A/B', 'Urbanização', 'Mafalala']
                    ],
                    [
                        'name' => 'KaMavota',
                        'administrative_posts' => ['KaMavota'],
                        'neighborhoods' => ['Mavalane A/B', 'FPLM', 'Hulene A/B', 'Ferroviário', 'Costa do Sol', 'Polana Caniço B']
                    ],
                    [
                        'name' => 'KaMubukwana',
                        'administrative_posts' => ['KaMubukwana'],
                        'neighborhoods' => ['Bagamoyo', 'George Dimitrov', 'Inhagoia A/B', 'Magoanine A/B/C', 'Zimpeto']
                    ],
                    [
                        'name' => 'KaTembe',
                        'administrative_posts' => ['KaTembe'],
                        'neighborhoods' => ['Gwaza Muthini', 'Incassane', 'Inguide', 'Chali', 'Chamissava']
                    ],
                    [
                        'name' => 'KaNyaka',
                        'administrative_posts' => ['KaNyaka'],
                        'neighborhoods' => ['Ribzene', 'Nghanyane', 'Chadwane']
                    ]
                ]
            ]
        ];
    }

    /**
     * Retorna a lista de nomes dos distritos pertencentes a uma província.
     * Aceita ID ('mpp', 'mpc', 'cab'), sigla ('CBD', 'MPT', 'MC') ou nome ('Maputo', 'Cabo Delgado', 'Nampula').
     *
     * @param string $provinceIdentifier
     * @return array
     * @throws \InvalidArgumentException Se a província não for encontrada.
     */
    public static function getDistrictsByProvince(string $provinceIdentifier): array
    {
        $raw = trim($provinceIdentifier);
        $clean = mb_strtolower($raw, 'UTF-8');

        $normalize = function (string $text): string {
            $accents = [
                'á' => 'a', 'à' => 'a', 'â' => 'a', 'ã' => 'a',
                'é' => 'e', 'ê' => 'e',
                'í' => 'i',
                'ó' => 'o', 'ô' => 'o', 'õ' => 'o',
                'ú' => 'u',
                'ç' => 'c',
            ];
            $lower = mb_strtolower(trim($text), 'UTF-8');
            $cleanText = strtr($lower, $accents);
            return trim(str_replace(['(', ')'], '', $cleanText));
        };

        $norm = $normalize($raw);

        // Caso especial Maputo genérico -> assume Maputo Província por padrão
        if ($norm === 'maputo') {
            foreach (self::getMozambiqueProvinces() as $province) {
                if ($province['id'] === 'mpp') {
                    return array_column($province['districts'], 'name');
                }
            }
        }

        foreach (self::getMozambiqueProvinces() as $province) {
            $pId = strtolower($province['id']);
            $pSigla = strtolower($province['sigla']);
            $pNorm = $normalize($province['name']);

            if (
                $clean === $pId ||
                $clean === $pSigla ||
                $norm === $pNorm ||
                $norm === $normalize(str_replace(['(Província)', '(Cidade)'], '', $province['name']))
            ) {
                return array_column($province['districts'], 'name');
            }
        }

        throw new \InvalidArgumentException("Província inválida: {$provinceIdentifier}");
    }

    /**
     * Returns a flat list of all 161 districts and their respective province IDs.
     */
    public static function getAllDistricts(): array
    {
        $list = [];
        foreach (self::getMozambiqueProvinces() as $province) {
            foreach ($province['districts'] as $district) {
                $list[] = [
                    'name' => $district['name'],
                    'provinceId' => $province['id'],
                    'administrative_posts' => $district['administrative_posts'],
                    'neighborhoods' => $district['neighborhoods']
                ];
            }
        }
        return $list;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // NAME & DOCUMENT FIELD SANITIZATION
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Checks whether a string is a valid personal name.
     * Accepts letters (including accented), spaces, hyphens, and apostrophes.
     *
     * @param string $name
     * @return bool
     */
    public static function isValidName(string $name): bool
    {
        $trimmed = trim($name);
        if ($trimmed === '') return false;
        // Exige pelo menos 2 caracteres alfabéticos
        preg_match_all('/\p{L}/u', $trimmed, $matches);
        if (count($matches[0] ?? []) < 2) {
            return false;
        }
        return (bool) preg_match('/^[\p{L}\s\'\-]+$/u', $trimmed);
    }

    /**
     * Sanitizes a personal name field.
     *
     * By default converts to Title Case preserving lowercase prepositions (de, da, do, dos, das, e).
     * Pass $allCaps = true to force UPPERCASE.
     * Strips digits and most special characters.
     *
     * @param string $name
     * @param bool   $allCaps
     * @return string
     *
     * @example MozUtils::sanitizeName('edmilson muacigarro')       // 'Edmilson Muacigarro'
     * @example MozUtils::sanitizeName('JOÃO', true)               // 'JOÃO'
     * @example MozUtils::sanitizeName('jean-pierre dupont')       // 'Jean-Pierre Dupont'
     * @example MozUtils::sanitizeName('maria da silva e santos')  // 'Maria da Silva e Santos'
     */
    public static function sanitizeName(string $name, bool $allCaps = false): string
    {
        // Keep only letters, spaces, hyphens, apostrophes
        $cleaned = preg_replace('/[^\p{L}\s\'\-]/u', '', $name);
        $cleaned = trim((string)preg_replace('/\s+/', ' ', (string)$cleaned));
        if ($cleaned === '') {
            return '';
        }

        if ($allCaps) {
            return mb_strtoupper($cleaned, 'UTF-8');
        }

        $particles = ['de', 'da', 'do', 'dos', 'das', 'e'];
        $words = explode(' ', $cleaned);
        $formattedWords = [];

        foreach ($words as $wIdx => $word) {
            $subparts = explode('-', $word);
            $formattedSubparts = [];
            foreach ($subparts as $sIdx => $part) {
                $lower = mb_strtolower($part, 'UTF-8');
                if (in_array($lower, $particles, true) && ($wIdx > 0 || $sIdx > 0)) {
                    $formattedSubparts[] = $lower;
                } else {
                    $formattedSubparts[] = mb_convert_case($lower, MB_CASE_TITLE, 'UTF-8');
                }
            }
            $formattedWords[] = implode('-', $formattedSubparts);
        }

        return implode(' ', $formattedWords);
    }

    /**
     * Sanitizes a document number field that contains only digits.
     * Strips all non-numeric characters.
     *
     * @param string $value
     * @return string
     *
     * @example MozUtils::sanitizeDocumentField('123 456 789')  // '123456789'
     */
    public static function sanitizeDocumentField(string $value): string
    {
        return preg_replace('/\D/', '', $value);
    }

    /**
     * Sanitizes an alphanumeric document field, forcing letters to UPPERCASE.
     * Useful for BI, passports, and other mixed-format documents.
     *
     * @param string $value
     * @return string
     *
     * @example MozUtils::sanitizeAlphanumericField('110 101 234567a')  // '110101234567A'
     */
    public static function sanitizeAlphanumericField(string $value): string
    {
        return strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $value));
    }

    /**
     * Valida se um código postal legado de Moçambique é válido.
     * Deve conter 4 dígitos numéricos pertencentes ao sistema clássico dos Correios de Moçambique.
     */
    public static function isValidPostalCode(string $code): bool
    {
        $cleaned = preg_replace('/\D/', '', $code);
        return array_key_exists($cleaned, CepData::$legacyPostalCodes);
    }

    /**
     * Retorna a localidade correspondente a um código postal legado de Moçambique.
     */
    public static function getPostalCodeLocality(string $code): ?string
    {
        $cleaned = preg_replace('/\D/', '', $code);
        return CepData::$legacyPostalCodes[$cleaned]['locality'] ?? null;
    }

    /**
     * Retorna a província correspondente a um código postal legado de Moçambique.
     */
    public static function getPostalCodeProvince(string $code): ?string
    {
        $cleaned = preg_replace('/\D/', '', $code);
        return CepData::$legacyPostalCodes[$cleaned]['province'] ?? null;
    }


    /**
     * Identifica a carteira móvel (Mobile Wallet) associada a um número moçambicano.
     */
    public static function getMobileWallet(string $phone): ?string
    {
        $operator = self::getMobileOperator($phone);
        if (!$operator) return null;
        
        $wallets = [
            'Vodacom' => 'M-Pesa',
            'Tmcel' => 'mKesh',
            'Movitel' => 'e-Mola'
        ];
        
        return $wallets[$operator] ?? null;
    }

    /**
     * Validates the Mozambican DIRE (Documento de Identificação de Residente Estrangeiro).
     * Supports the modern SENAMI format (9 digits + 1 letter, e.g., 120345678A)
     * as well as legacy formats (e.g., 00008312C or 12C00008312C).
     */
    public static function isValidDIRE(string $dire): bool
    {
        $cleaned = strtoupper(preg_replace('/[\s\-]/', '', $dire));
        return (bool) preg_match('/^(?:\d{8}[A-Z]|\d{2}[A-Z]\d{8}[A-Z0-9]|\d{9}[A-Z])$/', $cleaned);
    }

    /**
     * Validates the Mozambican Passport.
     * Official format: Exactly 2 letters followed by 7 numeric digits (E.g.: AO1234567).
     */
    public static function isValidPassport(string $passport): bool
    {
        $cleaned = strtoupper(preg_replace('/[\s\-]/', '', $passport));
        return (bool) preg_match('/^[A-Z]{2}\d{7}$/', $cleaned);
    }

    /**
     * Validates the Mozambican Driving License (Carta de Condução).
     * Supports the modern INATRO biometric format (2 letters + 7 digits, e.g., MP1234567)
     * as well as legacy formats (e.g., M123456).
     */
    public static function isValidDrivingLicense(string $license): bool
    {
        $cleaned = strtoupper(preg_replace('/[\s\-]/', '', $license));
        return (bool) preg_match('/^(?:[A-Z]\d{5,7}|\d{12}[A-Z]|[A-Z]{2}\d{7})$/', $cleaned);
    }

    /**
     * Valida o formato do Novo CEP (Formato: XXXX-XX)
     */
    public static function isValidNewCEP(string $cep): bool
    {
        return (bool) preg_match('/^\d{4}-\d{2}$/', trim($cep));
    }

    /**
     * Sugere Novos Códigos de Endereçamento Postal (CEP) baseados numa entrada.
     */
    public static function suggestCEPs(string $input): array
    {
        $cleaned = trim($input);
        if ($cleaned === '') return [];

        $isDigits = ctype_digit(str_replace('-', '', $cleaned));
        $searchPrefixes = [];

        if ($isDigits && strlen($cleaned) === 4 && isset(CepData::$legacyToNewCEPPrefix[$cleaned])) {
            $searchPrefixes = CepData::$legacyToNewCEPPrefix[$cleaned];
        }

        $results = [];
        $cleanedLower = mb_strtolower($cleaned, 'UTF-8');

        foreach (CepData::$newCEPData as $item) {
            if (!empty($searchPrefixes)) {
                foreach ($searchPrefixes as $prefix) {
                    if (str_starts_with($item['cep'], $prefix)) {
                        $results[] = $item;
                        break;
                    }
                }
            } else {
                if (
                    str_contains(mb_strtolower($item['cep'], 'UTF-8'), $cleanedLower) ||
                    str_contains(mb_strtolower($item['province'], 'UTF-8'), $cleanedLower) ||
                    str_contains(mb_strtolower($item['district'], 'UTF-8'), $cleanedLower) ||
                    str_contains(mb_strtolower($item['locality'], 'UTF-8'), $cleanedLower)
                ) {
                    $results[] = $item;
                }
            }
        }
        return $results;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MÓDULO BANCÁRIO (NIB & IBAN)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Valida o Número de Identificação Bancária (NIB) de Moçambique (21 dígitos, Módulo 97 ISO 7064).
     */
    public static function isValidNIB(string $nib): bool
    {
        return Bank::isValidNIB($nib);
    }

    /**
     * Formata o NIB moçambicano no padrão BBBB.AAAA.CCCCCCCCCCC.KK.
     *
     * @throws \InvalidArgumentException Se o NIB for inválido.
     */
    public static function formatNIB(string $nib): string
    {
        return Bank::formatNIB($nib);
    }

    /**
     * Retorna os dados do banco associado ao NIB, ou null se não encontrado.
     */
    public static function getBankByNIB(string $nib): ?array
    {
        return Bank::getBankByNIB($nib);
    }

    /**
     * Converte um NIB moçambicano válido em IBAN (MZ59 + 21 dígitos).
     *
     * @throws \InvalidArgumentException Se o NIB for inválido.
     */
    public static function nibToIBAN(string $nib): string
    {
        return Bank::nibToIBAN($nib);
    }

    /**
     * Valida um IBAN de Moçambique (25 caracteres: prefixo MZ59 seguido de NIB válido).
     */
    public static function isValidIBAN(string $iban): bool
    {
        return Bank::isValidIBAN($iban);
    }
}
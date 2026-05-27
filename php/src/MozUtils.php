<?php

namespace Iradoweck\MozUtils;

/**
 * MozUtils
 * 
 * Utility functions for Mozambique.
 * Validation of NUIT, BI, documents, and phone formatting.
 */
class MozUtils
{
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
     * Classifies the entity type based on the first digit of the NUIT.
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
     * @param float $value Valor numérico
     * @param string $currency 'MT' (nacional) ou 'MZN' (ISO 4217)
     * @return string E.g.: "1 500,00 MT"
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
     * Returns the list of districts belonging to a given province.
     */
    public static function getDistrictsByProvince(string $provinceId): array
    {
        $provinceIdClean = trim(strtolower($provinceId));
        foreach (self::getMozambiqueProvinces() as $province) {
            if ($province['id'] === $provinceIdClean) {
                $names = [];
                foreach ($province['districts'] as $district) {
                    $names[] = $district['name'];
                }
                return $names;
            }
        }
        throw new \InvalidArgumentException("Província inválida: {$provinceId}");
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
        return (bool) preg_match('/^[\p{L}\s\'\-]+$/u', $trimmed);
    }

    /**
     * Sanitizes a personal name field.
     *
     * By default converts to Title Case. Pass $allCaps = true to force UPPERCASE.
     * Strips digits and most special characters.
     *
     * @param string $name
     * @param bool   $allCaps
     * @return string
     *
     * @example MozUtils::sanitizeName('edmilson muacigarro')       // 'Edmilson Muacigarro'
     * @example MozUtils::sanitizeName('JOÃO', true)               // 'JOÃO'
     * @example MozUtils::sanitizeName('jean-pierre dupont')       // 'Jean-Pierre Dupont'
     */
    public static function sanitizeName(string $name, bool $allCaps = false): string
    {
        // Keep only letters, spaces, hyphens, apostrophes
        $cleaned = preg_replace('/[^\p{L}\s\'\-]/u', '', $name);
        $cleaned = trim(preg_replace('/\s+/', ' ', $cleaned));

        if ($allCaps) {
            return mb_strtoupper($cleaned, 'UTF-8');
        }

        // Title Case using mb_convert_case
        return mb_convert_case($cleaned, MB_CASE_TITLE, 'UTF-8');
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
     * Mapa de Códigos Postais Legados de Moçambique.
     */
    private static array $legacyPostalCodes = [
        // Região Sul
        // Maputo
        '1100' => ['locality' => 'Maputo ECP (Sede)', 'province' => 'Maputo'],
        '1101' => ['locality' => 'Polana', 'province' => 'Maputo'],
        '1102' => ['locality' => 'Sommerchild', 'province' => 'Maputo'],
        '1103' => ['locality' => 'Malhangalene', 'province' => 'Maputo'],
        '1104' => ['locality' => 'Alto-Maé', 'province' => 'Maputo'],
        '1106' => ['locality' => 'Bairro Central', 'province' => 'Maputo'],
        '1107' => ['locality' => 'Bairro do Aeroporto', 'province' => 'Maputo'],
        '1108' => ['locality' => 'Bairro do Mavalane', 'province' => 'Maputo'],
        '1109' => ['locality' => 'Bairro do Jardim', 'province' => 'Maputo'],
        '1110' => ['locality' => 'Bairro do Xipamanine', 'province' => 'Maputo'],
        '1111' => ['locality' => 'Bairro George Dimitrov', 'province' => 'Maputo'],
        '1112' => ['locality' => 'Machava', 'province' => 'Maputo'],
        '1113' => ['locality' => 'Fomento', 'province' => 'Maputo'],
        '1114' => ['locality' => 'Matola', 'province' => 'Maputo'],
        '1115' => ['locality' => 'Boane', 'province' => 'Maputo'],
        '1116' => ['locality' => 'Namaacha', 'province' => 'Maputo'],
        '1117' => ['locality' => 'Katembe', 'province' => 'Maputo'],
        '1118' => ['locality' => 'Bela-Vista', 'province' => 'Maputo'],
        '1119' => ['locality' => 'Inhaca', 'province' => 'Maputo'],
        '1120' => ['locality' => 'Marracuene', 'province' => 'Maputo'],
        '1121' => ['locality' => 'Manhiça', 'province' => 'Maputo'],
        '1122' => ['locality' => 'Xinavane', 'province' => 'Maputo'],
        '1123' => ['locality' => 'Magude', 'province' => 'Maputo'],
        '1124' => ['locality' => 'Moamba', 'province' => 'Maputo'],
        '1125' => ['locality' => 'Ressano Garcia', 'province' => 'Maputo'],
        // Gaza
        '1200' => ['locality' => 'Xai-Xai ECP', 'province' => 'Gaza'],
        '1201' => ['locality' => 'Praia de Xai-Xai', 'province' => 'Gaza'],
        '1202' => ['locality' => 'Macia', 'province' => 'Gaza'],
        '1203' => ['locality' => 'Praia de Bilene', 'province' => 'Gaza'],
        '1204' => ['locality' => 'Chokwé', 'province' => 'Gaza'],
        '1205' => ['locality' => 'Chilembene / Magoanine', 'province' => 'Gaza'],
        '1206' => ['locality' => 'Mabalane', 'province' => 'Gaza'],
        '1207' => ['locality' => 'Massingir', 'province' => 'Gaza'],
        '1208' => ['locality' => 'Chibuto', 'province' => 'Gaza'],
        '1209' => ['locality' => 'Manjacaze', 'province' => 'Gaza'],
        '1210' => ['locality' => 'Chidenguele', 'province' => 'Gaza'],
        '1211' => ['locality' => 'Chicualacuala', 'province' => 'Gaza'],
        // Inhambane
        '1300' => ['locality' => 'Inhambane ECP', 'province' => 'Inhambane'],
        '1301' => ['locality' => 'Maxixe', 'province' => 'Inhambane'],
        '1302' => ['locality' => 'Morrumbene', 'province' => 'Inhambane'],
        '1303' => ['locality' => 'Massinga', 'province' => 'Inhambane'],
        '1304' => ['locality' => 'Vilanculos', 'province' => 'Inhambane'],
        '1305' => ['locality' => 'Inhassoro', 'province' => 'Inhambane'],
        '1306' => ['locality' => 'Nova-Mambone', 'province' => 'Inhambane'],
        '1307' => ['locality' => 'Jangamo', 'province' => 'Inhambane'],
        '1308' => ['locality' => 'Cumbane', 'province' => 'Inhambane'],
        '1309' => ['locality' => 'Homoine', 'province' => 'Inhambane'],
        '1310' => ['locality' => 'Panda', 'province' => 'Inhambane'],
        '1311' => ['locality' => 'Inharrime', 'province' => 'Inhambane'],
        '1312' => ['locality' => 'Quissico', 'province' => 'Inhambane'],
        '1313' => ['locality' => 'Funhalouro', 'province' => 'Inhambane'],
        '1314' => ['locality' => 'Mabote', 'province' => 'Inhambane'],

        // Região Centro
        // Sofala
        '2100' => ['locality' => 'Beira ECP', 'province' => 'Sofala'],
        '2101' => ['locality' => 'Macúti', 'province' => 'Sofala'],
        '2102' => ['locality' => 'Beira Aeroporto', 'province' => 'Sofala'],
        '2103' => ['locality' => 'Manga', 'province' => 'Sofala'],
        '2104' => ['locality' => 'Dondo', 'province' => 'Sofala'],
        '2105' => ['locality' => 'Mafambisse', 'province' => 'Sofala'],
        '2106' => ['locality' => 'Nhamatanda', 'province' => 'Sofala'],
        '2107' => ['locality' => 'Buzi', 'province' => 'Sofala'],
        '2110' => ['locality' => 'Gorongoza', 'province' => 'Sofala'],
        // Manica
        '2200' => ['locality' => 'Chimoio ECP', 'province' => 'Manica'],
        '2201' => ['locality' => 'Catandica', 'province' => 'Manica'],
        '2202' => ['locality' => 'Vila de Manica', 'province' => 'Manica'],
        '2203' => ['locality' => 'Gondola', 'province' => 'Manica'],
        '2204' => ['locality' => 'Guro', 'province' => 'Manica'],
        '2205' => ['locality' => 'Machaze', 'province' => 'Manica'],
        '2206' => ['locality' => 'Macossa', 'province' => 'Manica'],
        '2207' => ['locality' => 'Sussundenga', 'province' => 'Manica'],
        '2208' => ['locality' => 'Tambara', 'province' => 'Manica'],
        // Tete
        '2300' => ['locality' => 'Tete ECP', 'province' => 'Tete'],
        '2301' => ['locality' => 'Tete Aeroporto', 'province' => 'Tete'],
        '2302' => ['locality' => 'Moatize', 'province' => 'Tete'],
        '2304' => ['locality' => 'Songo', 'province' => 'Tete'],
        '2307' => ['locality' => 'Mutarara', 'province' => 'Tete'],
        '2312' => ['locality' => 'Zumbo', 'province' => 'Tete'],
        // Zambézia
        '2400' => ['locality' => 'Quelimane ECP', 'province' => 'Zambézia'],
        '2401' => ['locality' => 'Nicoadala', 'province' => 'Zambézia'],
        '2403' => ['locality' => 'Mocuba', 'province' => 'Zambézia'],
        '2405' => ['locality' => 'Pebane', 'province' => 'Zambézia'],
        '2407' => ['locality' => 'Gurué', 'province' => 'Zambézia'],
        '2412' => ['locality' => 'Chinde', 'province' => 'Zambézia'],

        // Região Norte
        // Nampula
        '3100' => ['locality' => 'Nampula ECP', 'province' => 'Nampula'],
        '3101' => ['locality' => 'Angoche', 'province' => 'Nampula'],
        '3102' => ['locality' => 'Monapo', 'province' => 'Nampula'],
        '3105' => ['locality' => 'Ilha de Moçambique', 'province' => 'Nampula'],
        '3108' => ['locality' => 'Moma', 'province' => 'Nampula'],
        '3112' => ['locality' => 'Nacala', 'province' => 'Nampula'],
        '3115' => ['locality' => 'Namapa', 'province' => 'Nampula'],
        '3119' => ['locality' => 'Ribaue', 'province' => 'Nampula'],
        // Cabo Delgado
        '3200' => ['locality' => 'Pemba ECP', 'province' => 'Cabo Delgado'],
        '3201' => ['locality' => 'Pemba-2', 'province' => 'Cabo Delgado'],
        '3208' => ['locality' => 'Montepuez', 'province' => 'Cabo Delgado'],
        '3216' => ['locality' => 'Mueda', 'province' => 'Cabo Delgado'],
        '3219' => ['locality' => 'Palma', 'province' => 'Cabo Delgado'],
        // Niassa
        '3300' => ['locality' => 'Lichinga ECP', 'province' => 'Niassa'],
        '3301' => ['locality' => 'Macanhelas', 'province' => 'Niassa'],
        '3304' => ['locality' => 'Mandimba', 'province' => 'Niassa'],
        '3305' => ['locality' => 'Cuamba', 'province' => 'Niassa'],
        '3311' => ['locality' => 'Muembe', 'province' => 'Niassa']
    ];

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
     * Valida o DIRE (Documento de Identificação de Residente Estrangeiro) de Moçambique.
     * Formato: Exatamente 8 dígitos seguidos de uma única letra.
     */
    public static function isValidDIRE(string $dire): bool
    {
        $cleaned = strtoupper(preg_replace('/[\s\-]/', '', $dire));
        return (bool) preg_match('/^\d{8}[A-Z]$/', $cleaned);
    }

    /**
     * Validates the Mozambican Passport.
     * Formato: Exatamente 2 letras seguidas de 7 dígitos numéricos.
     */
    public static function isValidPassport(string $passport): bool
    {
        $cleaned = strtoupper(preg_replace('/[\s\-]/', '', $passport));
        return (bool) preg_match('/^[A-Z]{2}\d{7}$/', $cleaned);
    }

    /**
     * Validates the Mozambican Driving License.
     * Formato: 1 letra seguida de 5 a 7 dígitos numéricos.
     */
    public static function isValidDrivingLicense(string $license): bool
    {
        $cleaned = strtoupper(preg_replace('/[\s\-]/', '', $license));
        return (bool) preg_match('/^[A-Z]\d{5,7}$/', $cleaned);
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
        $cleanedLower = strtolower($cleaned);

        foreach (CepData::$newCEPData as $item) {
            if (!empty($searchPrefixes)) {
                foreach ($searchPrefixes as $prefix) {
                    if (strpos($item['cep'], $prefix) === 0) {
                        $results[] = $item;
                        break;
                    }
                }
            } else {
                if (
                    strpos(strtolower($item['cep']), $cleanedLower) !== false ||
                    strpos(strtolower($item['province']), $cleanedLower) !== false ||
                    strpos(strtolower($item['district']), $cleanedLower) !== false ||
                    strpos(strtolower($item['locality']), $cleanedLower) !== false
                ) {
                    $results[] = $item;
                }
            }
        }
        return $results;
    }
}
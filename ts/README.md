# moz-utils (TypeScript) 🇲🇿

A biblioteca definitiva, offline-first, sem dependências externas (zero-dependency) e de alta performance para o ecossistema de software desenvolvido em ou para **Moçambique**.

[![npm](https://img.shields.io/badge/npm-v0.4.0-00ff88?logo=npm)](https://www.npmjs.com/package/moz-utils)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)
[![CI](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml)
[![Website](https://img.shields.io/badge/Docs-Website-blue)](https://iradoweck.github.io/moz-utils/)

> **Autor:** Edmilson Muacigarro ([@iradoweck](https://github.com/iradoweck))  
> **Documentação Oficial:** [iradoweck.github.io/moz-utils](https://iradoweck.github.io/moz-utils/)  
> **Repositório GitHub:** [iradoweck/moz-utils](https://github.com/iradoweck/moz-utils)  
> **Versão do Pacote:** `v0.4.0`

---

## 🌍 Visão Geral

Desenvolver sistemas de missão crítica em Moçambique impõe desafios recorrentes de conformidade fiscal, bancária e cadastral que frequentemente exigiam reinventar a roda:
- 🔎 **O NUIT é matematicamente autêntico?** A Autoridade Tributária de Moçambique (AT) adota uma matriz com pesos específicos no Módulo 11. Um único dígito incorreto paralisa submissões e faturamento fiscal.
- 🏦 **Validação de NIB e Roteamento Bancário:** Transações financeiras, e-commerce, salários e conciliações exigem validar o Número de Identificação Bancária (21 dígitos, Módulo 97 - ISO 7064) e identificar imediatamente o banco comercial regulado pelo Banco de Moçambique.
- 📱 **Operadoras e Carteiras Móveis:** Prefixos de telecomunicações atribuídos pelo INCM definem se um contacto transaciona via **M-Pesa** (Vodacom), **e-Mola** (Movitel) ou **mKesh** (Tmcel).
- 🗺️ **Novo Código de Endereçamento Postal (CEP):** O novo sistema postal moçambicano (`XXXX-XX`) substitui os antigos códigos de 4 dígitos. Esta biblioteca traz a primeira base de dados estática completa e offline com 555 novos CEPs oficiais.
- 🪪 **Documentos de Identidade Nacionais:** Padrões estritos para Bilhete de Identidade (B.I.), DIRE (SENAMI), Passaporte e Carta de Condução (INATRO).
- 🧹 **Saneamento e Normalização de Dados:** Conversão padronizada de nomes em Title Case respeitando partículas da língua portuguesa (`de`, `da`, `do`, `dos`, `das`, `e`) e saneamento de documentos.

O `moz-utils` resolve todas estas necessidades de ponta a ponta com **zero dependências externas em tempo de execução**, algoritmos executados **100% offline** e garantia estrita de privacidade (nenhum dado de utilizador sai do seu servidor).

---

## 💻 Requisitos de Sistema e Compatibilidade

Este pacote é compilado nativamente como **ES Module (ESM)** puro:
- **Node.js**: `>= 24.0.0`
- **TypeScript**: `>= 6.0` (para compilação ou desenvolvimento)
- **Compatibilidade**: Navegadores Web modernos (ESM nativo), Edge Runtimes (Cloudflare Workers, Vercel Edge, Deno, Bun) e ambientes de backend Node.js.

> **Nota para Projetos Node.js:**  
> Certifique-se de que o seu `package.json` possui o campo `"type": "module"`, ou utilize bundlers modernos (Vite, Next.js, Rollup, esbuild, Webpack 5) com `"moduleResolution": "Node16"` ou `"Bundler"` no seu `tsconfig.json`.

---

## 📦 Instalação

Adicione ao seu projeto através do seu gestor de pacotes preferido:

```bash
# npm
npm install moz-utils

# pnpm
pnpm add moz-utils

# yarn
yarn add moz-utils

# bun
bun add moz-utils
```

---

## 🚀 Guia Completo de Métodos e APIs

### 1. 📱 Telecomunicações e Carteiras Móveis

Validação, extração de operadoras, identificação de carteiras móveis e formatação avançada de números moçambicanos (`+258`).

```typescript
import { 
  isValidMozambicanPhone, 
  formatMozambicanPhone, 
  getMobileOperator, 
  getMobileWallet, 
  buildWhatsAppUrl 
} from 'moz-utils';

// 1. Validação de Contactos Telefónicos
console.log(isValidMozambicanPhone("841234567"));          // true (Vodacom)
console.log(isValidMozambicanPhone("+258 82 123 4567"));    // true (Tmcel)
console.log(isValidMozambicanPhone("861234567"));          // true (Movitel)
console.log(isValidMozambicanPhone("811234567"));          // false (Prefixo inexistente)

// 2. Identificação da Operadora Móvel
console.log(getMobileOperator("841234567")); // "Vodacom"
console.log(getMobileOperator("821234567")); // "Tmcel"
console.log(getMobileOperator("871234567")); // "Movitel"

// 3. Roteamento Inteligente de Carteira Móvel (Mobile Wallet)
console.log(getMobileWallet("841234567"));   // "M-Pesa"
console.log(getMobileWallet("821234567"));   // "mKesh"
console.log(getMobileWallet("861234567"));   // "e-Mola"

// 4. Formatação Flexível (PhoneFormatOptions)
// Padrão Internacional (com espaços)
console.log(formatMozambicanPhone("84 123 4567")); 
// "+258 84 123 4567"

// Padrão E.164 compacto (ideal para gateways de SMS e telecomunicações)
console.log(formatMozambicanPhone("841234567", { format: 'e164' })); 
// "+258841234567"

// Padrão Nacional
console.log(formatMozambicanPhone("841234567", { format: 'national' })); 
// "84 123 4567"

// Padrão com Hífens
console.log(formatMozambicanPhone("841234567", { format: 'dashed' })); 
// "84-123-4567"

// 5. Geração de URLs de Contacto WhatsApp
const whatsappLink = buildWhatsAppUrl("841234567", "Olá, gostaria de solicitar uma cotação.");
console.log(whatsappLink);
// "https://wa.me/258841234567?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o."
```

#### ⚙️ Engenharia Reversa: Mapeamento de Prefixos do INCM
As operadoras de telecomunicações operam blocos de numeração autorizados pelo Instituto Nacional das Comunicações de Moçambique (INCM):
- **Vodacom Moçambique**: Prefixos `84` e `85` (Gateway padrão: **M-Pesa**).
- **Tmcel (Moçambique Telecom)**: Prefixos `82` e `83` (Gateway padrão: **mKesh**).
- **Movitel**: Prefixos `86`, `87` e `88` (Gateway padrão: **e-Mola**).

---

### 2. 🏦 Sistema Bancário de Moçambique: NIB & IBAN (Novo em v0.4.0)

Módulo financeiro de alto rendimento para validação de contas, pagamentos, salários e conciliações bancárias.

#### Estrutura do NIB Moçambicano (21 dígitos)
O NIB de Moçambique é rigorosamente constituído por:
1. **4 dígitos**: Código da instituição bancária (conforme compensação SIMO / Banco de Moçambique).
2. **4 dígitos**: Código do balcão ou agência bancária.
3. **11 dígitos**: Número da conta bancária (com preenchimento de zeros à esquerda).
4. **2 dígitos**: Dígitos de controlo verificados pelo algoritmo **ISO 7064 Módulo 97-10** (`BigInt(nib) % 97n === 1n`).

```typescript
import { 
  isValidNIB, 
  formatNIB, 
  getBankFromNIB, 
  getBankByNIB, 
  nibToIBAN, 
  isValidIBAN, 
  MOZAMBIQUE_BANKS 
} from 'moz-utils';

// Exemplo com NIB válido do Millennium BIM (0001)
const bimNIB = "000100001234567890194";

// 1. Validação Algorítmica ISO 7064 Módulo 97-10
console.log(isValidNIB(bimNIB)); // true
console.log(isValidNIB("000100001234567890100")); // false (Dígitos de controlo inválidos)
console.log(isValidNIB("999900001234567890194")); // false (Código de banco inexistente)

// 2. Formatação Padronizada de NIB
console.log(formatNIB(bimNIB)); 
// "0001 0000 12345678901 94"

// Formatação com ponto (utilizada em extratos bancários)
console.log(formatNIB(bimNIB, '.')); 
// "0001.0000.12345678901.94"

// 3. Identificação do Banco Emissor
const bankInfo = getBankFromNIB(bimNIB);
console.log(bankInfo);
// {
//   code: "0001",
//   name: "Banco Internacional de Moçambique",
//   shortName: "Millennium BIM"
// }

// 4. Conversão para IBAN Oficial de Moçambique (ISO 13616: "MZ59" + 21 dígitos)
const iban = nibToIBAN(bimNIB);
console.log(iban); // "MZ59000100001234567890194"

// 5. Validação de IBAN
console.log(isValidIBAN(iban)); // true
console.log(isValidIBAN("MZ59000100001234567890100")); // false
```

#### Catálogo Oficial dos 18 Bancos Comerciais (Banco de Moçambique)

A constante pública `MOZAMBIQUE_BANKS` contém o mapeamento de todos os códigos de compensação bancária:

| Código | Instituição Financeira Oficial | Nome Comercial / Sigla |
| :---: | :--- | :--- |
| `0001` | Banco Internacional de Moçambique | Millennium BIM |
| `0003` | Standard Bank Moçambique | Standard Bank |
| `0006` | Absa Bank Moçambique | Absa |
| `0007` | Nedbank Moçambique | Nedbank |
| `0008` | Banco Comercial e de Investimentos | BCI |
| `0014` | First National Bank Moçambique | FNB |
| `0016` / `0034` | Moza Banco | Moza Banco |
| `0021` | Access Bank Moçambique | Access Bank |
| `0024` | Ecobank Moçambique | Ecobank |
| `0025` / `0057` | Banco Nacional de Investimento | BNI |
| `0030` | Société Générale Moçambique | Société Générale |
| `0038` / `0043` | First Capital Bank Moçambique | First Capital Bank |
| `0041` / `0056` | Banco Letshego | Letshego |
| `0044` | MyBucks Banking Corporation | MyBucks |
| `0045` | Banco de Desenvolvimento de Moçambique | BDM |
| `0048` | Banco Mais | Banco Mais |
| `0050` | Standard Chartered Bank Moçambique | Standard Chartered |
| `0052` | Banco Big Moçambique | Banco Big |

---

### 3. 🪪 Identificação Civil e Fiscal

Validação de documentos emitidos pelo Estado Moçambicano, com foco no algoritmo oficial do NUIT e documentos civis.

```typescript
import { 
  isValidNUIT, 
  formatNUIT, 
  getNUITEntityType, 
  isValidBI, 
  isValidPassport, 
  isValidDIRE, 
  isValidDrivingLicense 
} from 'moz-utils';

// 1. NUIT (Número Único de Identificação Tributária)
console.log(isValidNUIT("401626638")); // true
console.log(isValidNUIT("123456789")); // false

// Formatação do NUIT (Padrão 3 blocos: XXX XXX XXX)
console.log(formatNUIT("401626638")); // "401 626 638"

// Classificação da Natureza da Entidade pelo NUIT
console.log(getNUITEntityType("401626638")); // "Pessoas Colectivas"
console.log(getNUITEntityType("100000001")); // "Pessoas Singulares"
console.log(getNUITEntityType("700000006")); // "Estado / Públicas"

// 2. Bilhete de Identidade (B.I.) Moçambicano (12 dígitos numéricos + 1 letra maiúscula)
console.log(isValidBI("110101234567A")); // true
console.log(isValidBI("1101012345671")); // false (Falta letra final)

// 3. Documento de Identificação de Residente Estrangeiro (DIRE - SENAMI)
console.log(isValidDIRE("00008312C"));    // true
console.log(isValidDIRE("120345678A"));   // true

// 4. Passaporte da República de Moçambique (2 letras + 7 dígitos)
console.log(isValidPassport("AO1234567")); // true
console.log(isValidPassport("123456789")); // false

// 5. Carta de Condução (INATRO)
console.log(isValidDrivingLicense("MP1234567")); // true
```

#### ⚙️ Tabela de Classificação de Entidades pelo NUIT (Autoridade Tributária)
O primeiro dígito do NUIT define oficialmente a sua natureza fiscal:
- **`1`, `2`, `3`**: Pessoas Singulares (Indivíduos, trabalhadores por conta de outrem ou por conta própria).
- **`4`, `5`**: Pessoas Colectivas (Sociedades por Quotas, Sociedades Anónimas, Lda).
- **`6`**: Entidades Equiparadas (Associações, Fundações, Cooperativas).
- **`7`**: Estado / Instituições e Empresas Públicas.
- **`8`**: Outras Entidades (Representações Diplomáticas, ONGs).
- **`9`**: Entidades Estrangeiras / Não Residentes com operações no país.

---

### 4. 💰 Valores Monetários (MZN / Metical)

Formatação e conversão precisa para a moeda oficial de Moçambique, de acordo com o padrão nacional e internacional (ISO 4217).

```typescript
import { formatMZN, parseMZN } from 'moz-utils';

// Formatação oficial (espaço como separador de milhar, vírgula para decimais)
console.log(formatMZN(1500));        // "1 500,00 MT"
console.log(formatMZN(2500000.75));  // "2 500 000,75 MT"

// Formato com código internacional ISO
console.log(formatMZN(1500, 'MZN')); // "1 500,00 MZN"

// Conversão e saneamento de valores para persistência em Banco de Dados
console.log(parseMZN("1.500,00 MT"));   // 1500
console.log(parseMZN("2 500 000,50MZN")); // 2500000.5
console.log(parseMZN("Invalid Value"));  // null
```

---

### 5. 🗺️ Divisão Territorial: Províncias e Distritos

Base geográfica embutida contendo as 11 províncias e todos os 161 distritos oficiais de Moçambique.

```typescript
import { 
  mozambiqueProvinces, 
  getDistrictsByProvince, 
  getAllDistricts 
} from 'moz-utils';

// 1. Busca Flexível de Distritos por ID, Sigla ou Nome da Província
// Aceita "Maputo", "Nampula", "Cabo Delgado", "Zambézia", IDs ("mpp", "npl") e Siglas ("MPT", "NPL")
const maputoDistricts = getDistrictsByProvince("Maputo");
console.log(maputoDistricts);
// ["Boane", "Magude", "Manhiça", "Marracuene", "Matutuíne", "Moamba", "Namaacha"]

const nampulaDistricts = getDistrictsByProvince("NPL");
console.log(nampulaDistricts.slice(0, 4));
// ["Angoche", "Eráti", "Ilha de Moçambique", "Lalaua"]

// 2. Distritos da Cidade de Maputo (Distritos Municipais / KaMpfumo)
const maputoCityDistricts = getDistrictsByProvince("Maputo Cidade");
console.log(maputoCityDistricts);
// ["KaMpfumo", "KaNhlamankulu", "KaMaxaquene", "KaMavota", "KaMubukwana", "KaTembe", "KaNyaka"]

// 3. Obtenção de todos os 161 distritos nacionais
const allDistricts = getAllDistricts();
console.log(allDistricts.length); // 161
```

---

### 6. 🧹 Saneamento e Normalização de Dados

Utilitários de higienização de strings para formulários cadastrais, evitando dados truncados ou inconsistentes.

```typescript
import { 
  isValidName, 
  sanitizeName, 
  sanitizeDocumentField, 
  sanitizeAlphanumericField 
} from 'moz-utils';

// 1. Validação de Nomes Próprios (Requer pelo menos 2 caracteres alfabéticos)
console.log(isValidName("Edmilson Muacigarro")); // true
console.log(isValidName("---"));                // false (Rejeita caracteres não alfabéticos isolados)

// 2. Normalização para Title Case com Partículas em Minúsculas
console.log(sanitizeName("EDMILSON DE JESUS MUACIGARRO")); 
// "Edmilson de Jesus Muacigarro"

console.log(sanitizeName("maria da conceição dos santos")); 
// "Maria da Conceição dos Santos"

// Opção para forçar Caixa Alta completa
console.log(sanitizeName("edmilson muacigarro", { allCaps: true })); 
// "EDMILSON MUACIGARRO"

// 3. Saneamento de Campos Numéricos de Documentos
console.log(sanitizeDocumentField("401.626.638")); // "401626638"

// 4. Saneamento de Campos Alfanuméricos
console.log(sanitizeAlphanumericField("110101234567-a")); // "110101234567A"
```

---

### 7. 📬 Códigos Postais e Novo CEP Moçambicano

Suporte duplo ao sistema postal legado (4 dígitos) e ao **Novo CEP de Moçambique** (`XXXX-XX`).

```typescript
import { 
  isValidNewCEP, 
  suggestCEPs, 
  isValidPostalCode, 
  getPostalCodeLocality, 
  getPostalCodeProvince 
} from 'moz-utils';

// 1. Validação Estrutural do Novo CEP (XXXX-XX)
console.log(isValidNewCEP("0909-09")); // true
console.log(isValidNewCEP("1100"));    // false

// 2. Motor de Sugestão e Autocomplete de CEPs (Base Oficial de 555 Registos)
// Pesquisa pelo bairro Namutequeliua (Nampula)
const suggestions = suggestCEPs("namutequeliua");
console.log(suggestions[0]);
// {
//   cep: "0909-09",
//   province: "Nampula",
//   district: "Nampula",
//   locality: "Namutequeliua"
// }

// Resolução inteligente a partir de código legado
const nampulaCEPs = suggestCEPs("3100");
console.log(`Encontrados ${nampulaCEPs.length} novos CEPs correspondentes.`);

// 3. Códigos Postais Históricos (Legados)
console.log(isValidPostalCode("1100"));              // true
console.log(getPostalCodeLocality("1100"));          // "Maputo Cidade"
console.log(getPostalCodeProvince("1100"));          // "Maputo Cidade"
```

---

## 🛠️ Guias Práticos de Integração para Produção

### Guia 1: Integração com Zod (Next.js App Router & Formulários React)

Validação de esquemas com mensagens de erro contextualizadas para o mercado moçambicano:

```typescript
// schemas/customer.ts
import { z } from 'zod';
import { 
  isValidNUIT, 
  isValidBI, 
  isValidMozambicanPhone, 
  formatMozambicanPhone,
  isValidNIB,
  parseMZN 
} from 'moz-utils';

export const customerRegistrationSchema = z.object({
  fullName: z.string().min(3, 'O nome completo deve conter no mínimo 3 caracteres.'),

  nuit: z.string().refine(
    (val) => isValidNUIT(val), 
    { message: 'NUIT inválido conforme o algoritmo Módulo 11 da Autoridade Tributária.' }
  ),

  bi: z.string().refine(
    (val) => isValidBI(val), 
    { message: 'Bilhete de Identidade inválido (deve conter 12 dígitos e 1 letra maiúscula).' }
  ),

  phone: z.string()
    .refine((val) => isValidMozambicanPhone(val), { 
      message: 'Número de telefone móvel inválido em Moçambique (Vodacom, Tmcel ou Movitel).' 
    })
    .transform((val) => formatMozambicanPhone(val, { format: 'e164' })),

  nib: z.string().refine(
    (val) => isValidNIB(val), 
    { message: 'NIB inválido conforme o algoritmo bancário ISO 7064 Módulo 97-10.' }
  ),

  declaredIncome: z.string().transform((val, ctx) => {
    const parsed = parseMZN(val);
    if (parsed === null) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: 'Valor em Meticais inválido (exemplo válido: 25.000,00 MT).' 
      });
      return z.NEVER;
    }
    return parsed;
  }),
});

export type CustomerRegistrationInput = z.infer<typeof customerRegistrationSchema>;
```

---

### Guia 2: Endpoint de Pagamento Móvel (M-Pesa / e-Mola / mKesh) em Express.js

Roteamento automático do gateway de pagamento com base no prefixo do número de telefone:

```typescript
// server.ts
import express, { Request, Response } from 'express';
import { 
  isValidMozambicanPhone, 
  formatMozambicanPhone, 
  getMobileOperator, 
  getMobileWallet 
} from 'moz-utils';

const app = express();
app.use(express.json());

interface PaymentRequestBody {
  phone: string;
  amount: number;
  reference: string;
}

app.post('/api/v1/payments/c2b', async (req: Request<{}, {}, PaymentRequestBody>, res: Response) => {
  const { phone, amount, reference } = req.body;

  // 1. Validação defensiva do contacto móvel
  if (!isValidMozambicanPhone(phone)) {
    return res.status(400).json({
      success: false,
      errorCode: 'INVALID_MOZ_PHONE',
      message: 'O contacto informado não é um número móvel válido em Moçambique.',
    });
  }

  // 2. Extração da operadora e carteira de destino
  const operator = getMobileOperator(phone)!;
  const wallet = getMobileWallet(phone)!;
  const formattedPhone = formatMozambicanPhone(phone, { format: 'e164' });

  try {
    // 3. Roteamento dinâmico para o provedor apropriado
    switch (wallet) {
      case 'M-Pesa':
        // Invocar SDK / API oficial da Vodacom M-Pesa
        console.log(`[Vodacom API] Iniciando cobrança C2B M-Pesa para ${formattedPhone} no valor de ${amount} MT`);
        break;

      case 'e-Mola':
        // Invocar Gateway da Movitel e-Mola
        console.log(`[Movitel API] Iniciando cobrança e-Mola para ${formattedPhone} no valor de ${amount} MT`);
        break;

      case 'mKesh':
        // Invocar Gateway da Tmcel mKesh
        console.log(`[Tmcel API] Iniciando cobrança mKesh para ${formattedPhone} no valor de ${amount} MT`);
        break;
    }

    return res.status(200).json({
      success: true,
      transactionId: `TX-${Date.now()}`,
      routedWallet: wallet,
      operator: operator,
      destinationPhone: formattedPhone,
      amountInMZN: amount,
      reference: reference,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Falha na comunicação com o gateway financeiro.',
    });
  }
});

app.listen(3000, () => console.log('Servidor de pagamentos iniciado na porta 3000'));
```

---

### Guia 3: DTO e Validation Pipe Customizado no NestJS

Garantia de integridade com validação de NUIT e B.I. antes de atingir os controllers:

```typescript
// pipes/nuit-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidNUIT, sanitizeDocumentField } from 'moz-utils';

@Injectable()
export class NuitValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('O NUIT é um parâmetro obrigatório.');
    }

    const cleanNUIT = sanitizeDocumentField(value);
    if (!isValidNUIT(cleanNUIT)) {
      throw new BadRequestException(
        `O NUIT '${value}' é matematicamente inválido pelo algoritmo Módulo 11 da Autoridade Tributária.`
      );
    }

    return cleanNUIT;
  }
}

// controllers/taxpayers.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { getNUITEntityType } from 'moz-utils';
import { NuitValidationPipe } from '../pipes/nuit-validation.pipe';

@Controller('taxpayers')
export class TaxpayersController {
  @Get(':nuit')
  getTaxpayerDetails(@Param('nuit', NuitValidationPipe) validNuit: string) {
    const entityType = getNUITEntityType(validNuit);

    return {
      nuit: validNuit,
      classification: entityType,
      isVerified: true,
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

### Guia 4: Componente React com Select Encadeado de Províncias e Distritos

Interface de utilizador interativa e fluida para seleção territorial de Moçambique:

```tsx
// components/MozambiqueAddressSelector.tsx
import React, { useState } from 'react';
import { mozambiqueProvinces, getDistrictsByProvince } from 'moz-utils';

export function MozambiqueAddressSelector() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [districtsList, setDistrictsList] = useState<string[]>([]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvinceId(provinceId);
    setSelectedDistrict('');

    if (provinceId) {
      // getDistrictsByProvince aceita ID ('mpp', 'npl'), Sigla ('MPT', 'NPL') ou Nome
      const districts = getDistrictsByProvince(provinceId);
      setDistrictsList(districts);
    } else {
      setDistrictsList([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <label htmlFor="province-select" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
          Província:
        </label>
        <select
          id="province-select"
          value={selectedProvinceId}
          onChange={handleProvinceChange}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Selecione uma província...</option>
          {mozambiqueProvinces.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.name} ({prov.sigla})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="district-select" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
          Distrito:
        </label>
        <select
          id="district-select"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedProvinceId}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">
            {selectedProvinceId ? 'Selecione o distrito...' : 'Primeiro selecione a província'}
          </option>
          {districtsList.map((districtName) => (
            <option key={districtName} value={districtName}>
              {districtName}
            </option>
          ))}
        </select>
      </div>

      {selectedDistrict && (
        <p style={{ color: '#047857', fontSize: '0.875rem' }}>
          Localização selecionada: <strong>{selectedDistrict}</strong>, {selectedProvinceId.toUpperCase()}.
        </p>
      )}
    </div>
  );
}
```

---

## ❓ Perguntas Frequentes & Resolução de Problemas (Troubleshooting)

### O NUIT do utilizador falhou a validação, mas ele garante que é autêntico.
A validação do NUIT no `moz-utils` segue a fórmula matemática exata e oficial da Autoridade Tributária de Moçambique (Módulo 11 com pesos `[8, 9, 4, 5, 6, 7, 8, 9]`). Se um NUIT for rejeitado, ele possui erro de digitação ou foi gerado de forma irregular. Sistemas que aceitem NUITs matematicamente inválidos enfrentarão rejeição em APIs de faturamento e no portal e-Tributação.

### Como diferenciar Maputo Província de Maputo Cidade?
A biblioteca diferencia perfeitamente os dois territórios administrativos:
- **Maputo Província**: ID `'mpp'`, Sigla `'MPT'` (Distritos: Matola, Boane, Marracuene, etc.).
- **Maputo Cidade**: ID `'mpc'`, Sigla `'MC'` (Distritos Municipais: KaMpfumo, KaMaxaquene, etc.).
Ao chamar `getDistrictsByProvince("Maputo")`, o padrão retorna os distritos da Província; para a capital utilize `"Maputo Cidade"` ou o ID `'mpc'`.

### Qual o CEP oficial do bairro Namutequeliua em Nampula?
No novo catálogo postal de Moçambique implementado no `moz-utils`, o CEP oficial e homologado de Namutequeliua é **`0909-09`**.

---

## 📄 Licença

Distribuído sob a licença **Apache License 2.0**. Consulte o arquivo [LICENSE](https://github.com/iradoweck/moz-utils/blob/main/LICENSE) para mais detalhes.

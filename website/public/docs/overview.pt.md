# moz-utils

A biblioteca open-source definitiva para software construído em ou para **Moçambique**.

[![npm](https://img.shields.io/npm/v/moz-utils?label=npm&color=00ff88&logo=npm)](https://www.npmjs.com/package/moz-utils)
[![PyPI](https://img.shields.io/pypi/v/moz-utils?label=PyPI&color=3776ab&logo=pypi&logoColor=white)](https://pypi.org/project/moz-utils/)
[![Packagist](https://img.shields.io/packagist/v/iradoweck/moz-utils?label=Packagist&color=F28D1A&logo=packagist&logoColor=white)](https://packagist.org/packages/iradoweck/moz-utils)
[![pub.dev](https://img.shields.io/pub/v/moz_utils?label=pub.dev&color=0175C2&logo=dart&logoColor=white)](https://pub.dev/packages/moz_utils)
[![JitPack](https://img.shields.io/badge/JitPack-0.4.0-B07219?logo=gradle&logoColor=white)](https://jitpack.io/#iradoweck/moz-utils)
[![Licença: Apache 2.0](https://img.shields.io/badge/Licen%C3%A7a-Apache%202.0-blue.svg)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)

---

## Porquê usar o moz-utils?

Quando se desenvolve aplicações para Moçambique, os programadores resolvem constantemente os mesmos problemas do zero:

- 🔎 **Este NUIT é válido?** — A Autoridade Tributária (AT) usa o Módulo 11. Um dígito errado e a verificação falha silenciosamente.
- 📱 **Este número é da Vodacom, Tmcel ou Movitel?** — As regras dos prefixos são específicas de cada operadora e não estão documentadas publicamente.
- 🗺️ **Qual é o novo CEP de Namutequeliua, Nampula?** — O novo sistema de 6 dígitos ainda tem pouca adoção. Construímos a primeira base de dados offline para ele.
- 🪪 **Este BI / DIRE / Passaporte é válido?** — Cada tipo de documento tem o seu formato estrito.

O `moz-utils` resolve tudo isto **pronto a usar**, com **zero dependências em runtime**, **algoritmos offline-first** e **sem enviar dados para lado nenhum**.

---

## Navegação Rápida

| Secção | Descrição |
|---|---|
| 📦 [Instalação](installation) | Instalar via npm, pip, composer, pub.dev ou gradle |
| 📱 [Telefones & Mobile](phones) | Validar números, detectar operadoras, construir links WhatsApp |
| 🪪 [Documentos de Identidade](documents) | Validar NUIT, BI, DIRE, Passaporte, Carta de Condução |
| 💰 [Moeda (MZN)](currency) | Formatar Meticais conforme o padrão oficial |
| 🗺️ [Geografia & Distritos](geography) | Consultar todas as províncias, distritos e postos administrativos |
| 📬 [Códigos Postais (CEP)](postal) | Validar códigos legados e o novo CEP de 6 dígitos |

---

## Referência Completa das Funções

| Função | Categoria | Descrição | TS | PY | PHP | Dart | Kotlin |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| `isValidMozambicanPhone` | Telefones | Valida um número moçambicano (82 a 88) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `formatMozambicanPhone` | Telefones | Formata para o padrão internacional `+258 XX XXX XXXX` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getMobileOperator` | Telefones | Retorna `Vodacom`, `Tmcel` ou `Movitel` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getMobileWallet` | Telefones | Retorna `M-Pesa`, `mKesh` ou `e-Mola` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `buildWhatsAppUrl` | Telefones | Gera um link `wa.me` com mensagem pré-preenchida opcional | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidNIB` | Bancos | Valida o NIB (21 dígitos sob ISO 7064 Mod 97-10) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `formatNIB` | Bancos | Formata o NIB com separadores oficiais | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getBankFromNIB` | Bancos | Identifica o banco emissor entre os 22 bancos regulados | ✅ | ✅ | ✅ | ✅ | ✅ |
| `nibToIBAN` | Bancos | Converte NIB para IBAN Moçambicano (`MZ59...`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidNUIT` | Documentos | Valida o NUIT usando o algoritmo Módulo 11 da AT | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getNUITEntityType` | Documentos | Retorna o tipo de entidade pelo primeiro dígito do NUIT | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidBI` | Documentos | Valida o BI moçambicano (12 dígitos + 1 letra com controlo) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidDIRE` | Documentos | Valida o DIRE (8 dígitos + 1 letra) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidPassport` | Documentos | Valida o Passaporte moçambicano (2 letras + 7 dígitos) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidDrivingLicense` | Documentos | Valida a Carta de Condução (1 letra + 5-7 dígitos) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `formatMZN` | Moeda | Formata um número como Meticais (`1 500,00 MT`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `parseMZN` | Moeda | Converte strings com símbolos monetários para número flutuante | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mozambiqueProvinces` | Geografia | Base de dados offline das 11 províncias e distritos | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getDistrictsByProvince` | Geografia | Retorna os distritos de uma dada província | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getAllDistricts` | Geografia | Retorna todos os 161 distritos num array plano | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidName` | Saneamento | Valida um nome pessoal (letras, espaços, hífens, apóstrofes) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sanitizeName` | Saneamento | Limpa e converte um nome para Title Case ou MAIÚSCULAS | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sanitizeDocumentField` | Saneamento | Remove todos os caracteres não numéricos de um campo | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sanitizeAlphanumericField` | Saneamento | Remove caracteres especiais e força MAIÚSCULAS | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidPostalCode` | Postal | Valida um código postal legado de 4 dígitos | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getPostalCodeLocality` | Postal | Retorna a localidade de um código legado | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getPostalCodeProvince` | Postal | Retorna a província de um código legado | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidNewCEP` | Postal | Valida o novo formato CEP de 6 dígitos (`XXXX-XX`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `suggestCEPs` | Postal | Pesquisa na base de dados offline de CEPs por nome de localidade | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 Casos de Uso Reais em Produção

### 1. Checkout de E-commerce com Roteamento Automático de Pagamento Móvel
Ao solicitar o número de telefone de um cliente para pagamento via carteira móvel, o sistema detecta se deve iniciar uma requisição para a API do **M-Pesa**, **e-Mola** ou **mKesh**:

```ts
import { isValidMozambicanPhone, getMobileWallet } from 'moz-utils';

function initiateCheckout(phone: string, amount: number) {
  if (!isValidMozambicanPhone(phone)) {
    throw new Error('Número de telefone inválido para Moçambique.');
  }

  const wallet = getMobileWallet(phone);
  console.log(`Roteando cobrança de ${amount} MT via ${wallet}...`);

  switch (wallet) {
    case 'M-Pesa':
      // Chamada à API Vodacom M-Pesa C2B
      break;
    case 'e-Mola':
      // Chamada à API Movitel e-Mola (prefixos 86, 87 e 88)
      break;
    case 'mKesh':
      // Chamada à API Tmcel mKesh
      break;
  }
}
```

### 2. Validação Cadastral & Emissão de Factura Eletrónica (NUIT / BI)
Impeça cadastros com identificadores tributários fictícios antes de gravar no banco de dados:

```ts
import { isValidNUIT, getNUITEntityType, isValidBI } from 'moz-utils';

function validateCustomerRegistration(payload: { nuit?: string; bi?: string }) {
  if (payload.nuit && !isValidNUIT(payload.nuit)) {
    return { valid: false, message: 'NUIT inválido pelo Módulo 11 da AT.' };
  }

  const entityType = payload.nuit ? getNUITEntityType(payload.nuit) : null;
  // entityType: "Pessoa Singular" | "Pessoa Colectiva" | "Outro"

  if (payload.bi && !isValidBI(payload.bi)) {
    return { valid: false, message: 'Número de Bilhete de Identidade inválido.' };
  }

  return { valid: true, entityType };
}
```

### 3. Validação de Ficheiro de Salários e Transferências Bancárias (NIB & IBAN)
Elimine falhas de compensação no SIMO Rede validando o Módulo 97-10 antes do envio do lote:

```ts
import { isValidNIB, getBankFromNIB, nibToIBAN } from 'moz-utils';

function processSalaryTransfer(accountNIB: string) {
  if (!isValidNIB(accountNIB)) {
    throw new Error('NIB inválido. Verifique o código do banco e os dígitos de controlo.');
  }

  const bank = getBankFromNIB(accountNIB);
  const iban = nibToIBAN(accountNIB);

  return {
    bankName: bank?.name,
    bankCode: bank?.code,
    iban: iban, // Ex: MZ59000100000000000003345
    status: 'READY_FOR_CLEARING'
  };
}
```

---

## Ecossistema Poliglota

Esta biblioteca foi construída de raiz para suportar execução nativa em:

- **TypeScript / Node.js** — via `npm install moz-utils`
- **Python** — via `pip install moz-utils`
- **PHP** — via `composer require iradoweck/moz-utils`
- **Dart / Flutter** — via `flutter pub add moz_utils`
- **Kotlin / Java** — via JitPack + Gradle

### Privacidade em Primeiro Lugar

Todos os algoritmos de validação são completamente **offline**. Não rastreamos consultas nem enviamos dados para APIs externas.

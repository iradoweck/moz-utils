# Resolução de Problemas (Troubleshooting)

Este guia cobre os problemas técnicos e regras de negócio mais comuns que os desenvolvedores encontram ao integrar o `moz-utils`.

## O meu NUIT falha na validação, mas o utilizador diz que é real!
**Problema:** A função `isValidNUIT()` retorna `false` para um NUIT que o cliente jura ser o dele.
**Causa Matemática:** O NUIT em Moçambique não é apenas uma sequência de 9 números; o último número é um **Dígito de Controlo** gerado através de um algoritmo Módulo 11 (aplicado com pesos específicos de 8 a 9 definidos pela AT). Se um dígito estiver errado, a equação falha.
**Solução:** Peça ao utilizador para verificar o cartão. O `moz-utils` não aceita exceções ao cálculo matemático (conforme o Decreto n. 28/2012). Se o sistema permitir NUITs inválidos, a sua empresa poderá ter problemas na integração de relatórios com o e-Tributação.

## Conflitos de Módulo no TypeScript (ESM)
**Problema:** `Error: require() of ES Module moz-utils is not supported.` ou `Cannot find module 'moz-utils'`.
**Causa:** A biblioteca TypeScript foi compilada modernamente apenas para **ES Modules (`import`)** e não suporta o antigo CommonJS (`require`).
**Solução:** 
1. Use `import { isValidBI } from 'moz-utils';`
2. Adicione `"type": "module"` no seu `package.json`.
3. Certifique-se que o seu `tsconfig.json` usa `"moduleResolution": "Node16"` ou `"Bundler"`.

## Nomes Retornam Nulos na Base de Dados (Sanitize)
**Problema:** `sanitizeName("12345")` está a retornar vazio.
**Causa:** A função `sanitizeName()` limpa agressivamente carateres matemáticos e números, pois um nome humano não contém dígitos. Se o input só tiver números, o resultado limpo será vazio.
**Solução:** Execute sempre a validação `isValidName()` **antes** de gravar ou higienizar a string.

## Código Postal (CEP) não Encontrado
**Problema:** Tento pesquisar a localidade do CEP `1100` e retorna nulo, ou tento validar `0101-01` e falha.
**Causa:** Moçambique está num período de transição dos Códigos Postais. O legado (4 dígitos, ex: 1100 - Maputo) é coberto pela função `isValidPostalCode()`. O novo modelo de 6 dígitos geo-referenciado (ex: 0101-01) é validado pela função `isValidNewCEP()`.
**Solução:** Certifique-se que está a invocar a função correta dependendo se o seu formulário pede "Código Postal" (antigo) ou "Novo CEP".

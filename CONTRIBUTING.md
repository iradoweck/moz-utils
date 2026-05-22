# 🤝 Guia de Contribuição - Moz-Utils

Obrigado pelo seu interesse em contribuir para o `moz-utils`! Este projeto foi feito para apoiar a comunidade de programadores em Moçambique e a sua ajuda é fundamental para expandi-lo e mantê-lo atualizado.

---

## 📐 Diretrizes de Design e Portabilidade

O `moz-utils` tem como premissa ser **consistente**. Isto significa que independentemente de o programador estar a usar TypeScript, Python, PHP, Dart ou Kotlin, as funções devem comportar-se exatamente da mesma forma e produzir as mesmas saídas para as mesmas entradas.

### Regras Gerais:
1. **Nomenclatura de Funções:** Siga as convenções idiomáticas da linguagem, mas mantendo a semântica:
   * Ex: `isValidNUIT` (TypeScript) ➔ `is_valid_nuit` (Python/Ruby) ➔ `isValidNUIT` (Dart/Kotlin/PHP).
2. **Sem Placeholders:** Todas as funções devem ser totalmente implementadas com testes de validação correspondentes.
3. **Ausência de Dependências Externas:** Mantenha os pacotes o mais leves possível, utilizando apenas recursos nativos da linguagem (ex: expressões regulares e manipulação de strings nativas).

---

## 🧮 Regras de Validação Oficial

### 1. Algoritmo do NUIT (Módulo 11)
Para implementar a validação de NUIT numa nova linguagem, use a seguinte lógica matemática:

1. **Limpeza da Entrada:** Remova quaisquer caracteres que não sejam dígitos numéricos. O NUIT deve ter exatamente **9 dígitos**.
2. **Entidades Repetidas:** Se a string conter 9 dígitos repetidos (ex: `111111111`, `999999999`), deve ser considerada **inválida**.
3. **Primeiro Dígito (Entidade):** Deve começar obrigatoriamente por um número entre **1 e 5** inclusive.
4. **Cálculo da Soma Ponderada ($S$):**
   Multiplique cada um dos primeiros 8 dígitos por um peso decrescente de **9 a 2** e some os resultados:
   
   $$S = \sum_{i=1}^{8} D_i \times (10 - i)$$
   
   Ou seja:
   $$S = (D_1 \times 9) + (D_2 \times 8) + (D_3 \times 7) + (D_4 \times 6) + (D_5 \times 5) + (D_6 \times 4) + (D_7 \times 3) + (D_8 \times 2)$$

5. **Cálculo do Resto ($R$):**
   $$R = S \pmod{11}$$

6. **Definição do Dígito Verificador Esperado ($DV$):**
   * Se $R \le 1$, então $DV = 0$.
   * Se $R > 1$, então $DV = 11 - R$.

7. **Validação Final:** O NUIT é válido se e somente se o 9º dígito for igual ao $DV$.

---

### 2. Validação e Prefixo de Telemóveis
Os números móveis de Moçambique possuem 9 dígitos. O DDI do país é `258`.
Se o número começar com `258`, desconsidere esse prefixo para fins de validação dos dígitos internos.
Apenas as seguintes operadoras e prefixos (2 primeiros dígitos) são válidos:

| Operadora | Prefixos Aceites |
| :--- | :--- |
| **Vodacom** | `84`, `85` |
| **Tmcel** | `82`, `83` |
| **Movitel** | `86`, `87`, `88` |

---

### 3. Padrão de Formatação Monetária (Meticais)
* O valor absoluto deve ser formatado com **2 casas decimais**, usando a vírgula (`,`) como separador decimal.
* Os milhares devem ser separados por um **único espaço em branco** (` `).
* Se o valor for negativo, o sinal de menos (`-`) deve preceder o valor numérico.
* A moeda (`MT` por padrão, ou `MZN` se especificado) é anexada ao fim do valor, separada por um espaço.
* *Exemplo:* `-1500` ➔ `-1 500,00 MT`.

---

## 🧪 Como Correr os Testes Globais

Para validar se as suas alterações ou um novo porte não quebram o ecossistema TypeScript/JavaScript, execute os testes utilizando o Node.js:

1. Vá para a raiz do projeto.
2. Certifique-se de que o TypeScript da pasta `/ts` está compilado (gere o build primeiro).
3. Execute o comando:
   ```bash
   node test-validation.js
   ```

Se todas as validações passarem, verá a mensagem:
`🎉 TODOS OS TESTES PASSARAM!`

---

## 🚀 Como Submeter as suas Alterações?

1. Faça um Fork do repositório.
2. Crie uma branch para a sua funcionalidade/correção (ex: `git checkout -b feature/novo-porte-rust`).
3. Adicione o seu código respeitando os padrões de formatação e convenções.
4. Se adicionou uma nova linguagem, não se esqueça de:
   * Criar a pasta correspondente (ex: `/rust`).
   * Adicionar um ficheiro `README.md` nessa pasta explicando a instalação e o uso básico na respetiva linguagem.
   * Adicionar a linha respetiva na tabela de ecossistemas do `README.md` principal da raiz.
5. Crie um Pull Request detalhado direcionado para a branch `devlab` (ramo de desenvolvimento e integração) com a descrição das suas alterações. Evite submeter Pull Requests diretamente para a branch `main` (ramo de produção e código estável).


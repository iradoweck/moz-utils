const fs = require('fs');
const path = require('path');

const chunk = `
---

## 🧮 O Algoritmo NUIT (A Verdadeira Fórmula Moçambicana)

Ao contrário do NIF de Portugal (que usa multiplicadores de 9 a 2), a Autoridade Tributária de Moçambique utiliza a seguinte matriz de pesos para calcular o Módulo 11 do NUIT.

**A Fórmula e os Pesos Oficiais:**
\`\`\`text
NUIT a Validar: 401626638

Posição:   1   2   3   4   5   6   7   8
Dígitos:   4   0   1   6   2   6   6   3
Pesos:     8   9   4   5   6   7   8   9
           |   |   |   |   |   |   |   |
Mult:     32 + 0 + 4 +30 +12 +42 +48 +27 = 195 (Soma)

Cálculo do Módulo 11:
1. Resto = Soma % 11
   195 % 11 = 8
2. O "Resto" é o Índice (Posição 0 a 10) na string de controlo "01234567891".
3. A 8ª posição de "01234567891" é '8'.
4. Como o 9º dígito do NUIT (Dígito de Controlo) é '8', o NUIT é Válido!
\`\`\`
`;

const readmes = [
  'ts/README.md',
  'php/README.md',
  'python/README.md',
  'dart/README.md',
  'kotlin/README.md'
];

for (const rm of readmes) {
  const p = path.join(__dirname, rm);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Check if it's already added to avoid duplicates if run multiple times
    if (!content.includes('## 🧮 O Algoritmo NUIT')) {
      // Find where to insert. We can insert it right before "## 🤝 Contribution"
      const insertIdx = content.indexOf('## 🤝 Contribution');
      if (insertIdx !== -1) {
        content = content.slice(0, insertIdx) + chunk + '\n' + content.slice(insertIdx);
      } else {
        // Just append to the end
        content += '\n' + chunk;
      }
      fs.writeFileSync(p, content, 'utf8');
      console.log('Updated ' + rm);
    }
  }
}

const fs = require('fs');
const path = require('path');

const NEW_VERSION = process.argv[2];

if (!NEW_VERSION) {
  console.error("Erro: Nova versão não fornecida. Uso: node semantic_sync.js <version>");
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');

const files = [
  { path: 'ts/package.json', regex: /"version":\s*"[^"]+"/g, replacement: `"version": "${NEW_VERSION}"` },
  { path: 'python/pyproject.toml', regex: /version\s*=\s*"[^"]+"/g, replacement: `version = "${NEW_VERSION}"` },
  { path: 'php/composer.json', regex: /"version":\s*"[^"]+"/g, replacement: `"version": "${NEW_VERSION}"` },
  { path: 'dart/pubspec.yaml', regex: /^version:\s*[^\s]+/gm, replacement: `version: ${NEW_VERSION}` },
  { path: 'kotlin/build.gradle.kts', regex: /version\s*=\s*"[^"]+"/g, replacement: `version = "${NEW_VERSION}"` },
  // Para READMEs, vamos assumir que substituímos vX.X.X, mas sem saber o OLD_VERSION fica complicado usar regex geral sem apanhar lixo.
  // Como estamos em mono-repo com Node, o package.json de TS será o single source of truth no bump anterior.
  // Como simplificação, não vamos alterar os READMEs via script, ou usamos a versão lida do package.json antes do update.
];

// Ler a versão antiga do package.json para os READMEs
let oldVersion = '';
try {
  const pkgContent = fs.readFileSync(path.join(rootDir, 'ts/package.json'), 'utf8');
  const match = pkgContent.match(/"version":\s*"([^"]+)"/);
  if (match) {
    oldVersion = match[1];
  }
} catch (e) {}

if (oldVersion) {
  files.push({ path: 'README.md', regex: new RegExp(`v${oldVersion.replace(/\./g, '\\.')}`, 'g'), replacement: `v${NEW_VERSION}` });
  files.push({ path: 'kotlin/README.md', regex: new RegExp(`v${oldVersion.replace(/\./g, '\\.')}`, 'g'), replacement: `v${NEW_VERSION}` });
}

let changedFiles = 0;

for (const file of files) {
  const fullPath = path.join(rootDir, file.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (file.regex.test(content)) {
      content = content.replace(file.regex, file.replacement);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Atualizado ${file.path} para a versão ${NEW_VERSION}`);
      changedFiles++;
    } else {
      console.log(`⚠️ Nenhuma correspondência em ${file.path}`);
    }
  } else {
    console.log(`❌ Ficheiro não encontrado: ${file.path}`);
  }
}

console.log(`\n🎉 Total de ficheiros atualizados: ${changedFiles}`);

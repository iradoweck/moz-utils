const fs = require('fs');
const path = require('path');

// 1. Bump versions
const filesToUpdate = [
  { path: 'ts/package.json', regex: /"version": "0\.3\.6"/, replace: '"version": "0.3.7"' },
  { path: 'python/pyproject.toml', regex: /version = "0\.3\.6"/, replace: 'version = "0.3.7"' },
  { path: 'php/composer.json', regex: /"version": "0\.3\.6"/, replace: '"version": "0.3.7"' },
  { path: 'dart/pubspec.yaml', regex: /version: 0\.3\.6/, replace: 'version: 0.3.7' },
  { path: 'kotlin/build.gradle.kts', regex: /version = "0\.3\.6"/, replace: 'version = "0.3.7"' },
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(file.regex, file.replace);
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file.path} to 0.3.7`);
  }
});

// 2. Update Changelogs
const date = new Date().toISOString().split('T')[0];

const subChangelog037 = `## [0.3.7] - ${date}

### Added
- **Name Sanitization:** Added \`isValidName\` and \`sanitizeName\` to safely validate and clean personal names.
- **Document Sanitization:** Added \`sanitizeDocumentField\` and \`sanitizeAlphanumericField\`.
- **Financial Normalization:** Implemented \`parseMZN\` to cleanly extract numeric values from dirty formatted strings (e.g. "1.500,00 MT" -> 1500.00).

### Changed
- **NUIT Categories (Decree 28/2012):** Aligned NUIT prefixes completely with the Mozambican Tax Authority. NUITs starting with digits 1 through 9 are now correctly accepted and classified (e.g., \`Pessoas Singulares\`, \`Pessoas Colectivas\`, \`Entidades Equiparadas\`, \`Estado / Públicas\`, etc.).

`;

const stacks = ['dart', 'python', 'php', 'ts', 'kotlin'];
stacks.forEach(stack => {
  const clPath = path.join(__dirname, stack, 'CHANGELOG.md');
  if (fs.existsSync(clPath)) {
    let content = fs.readFileSync(clPath, 'utf8');
    content = content.replace(/(## \[0\.3\.6\])/, subChangelog037 + '$1');
    fs.writeFileSync(clPath, content);
  }
});

const rootChangelog037 = `## 0.3.7

> **Feature Update — Strict NUIT Tax Compliance & Name Sanitization**

### Added
- **Personal Name Validation:** Exposed \`isValidName\` and \`sanitizeName\` across all languages.
- **Document Extractors:** Exposed \`sanitizeDocumentField\` and \`sanitizeAlphanumericField\`.
- **Financial Tooling:** Added \`parseMZN\` to parse "dirty" Metical strings into raw database numbers.

### Changed
- **NUIT AT Decree Compliance:** Implemented exact entity prefix classifications per Decree n. 28/2012. NUITs starting with any digit from 1 to 9 are fully supported and cleanly mapped to "Pessoas Singulares", "Estado / Públicas", etc.

---

`;

const rootPath = path.join(__dirname, 'CHANGELOG.md');
if (fs.existsSync(rootPath)) {
  let content = fs.readFileSync(rootPath, 'utf8');
  content = content.replace(/(## 0\.3\.6)/, rootChangelog037 + '$1');
  fs.writeFileSync(rootPath, content);
  console.log('Updated Root CHANGELOG.md');
}

console.log('Done!');

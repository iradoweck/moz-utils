const fs = require('fs');
const path = require('path');

const OLD_VERSION = '0.3.4';
const NEW_VERSION = '0.3.5';

const files = [
  { path: 'ts/package.json', regex: new RegExp(`"version": "${OLD_VERSION}"`, 'g'), replacement: `"version": "${NEW_VERSION}"` },
  { path: 'python/pyproject.toml', regex: new RegExp(`version = "${OLD_VERSION}"`, 'g'), replacement: `version = "${NEW_VERSION}"` },
  { path: 'php/composer.json', regex: new RegExp(`"version": "${OLD_VERSION}"`, 'g'), replacement: `"version": "${NEW_VERSION}"` },
  { path: 'dart/pubspec.yaml', regex: new RegExp(`version: ${OLD_VERSION}`, 'g'), replacement: `version: ${NEW_VERSION}` },
  { path: 'kotlin/build.gradle.kts', regex: new RegExp(`version = "${OLD_VERSION}"`, 'g'), replacement: `version = "${NEW_VERSION}"` },
  { path: 'README.md', regex: new RegExp(`v${OLD_VERSION}`, 'g'), replacement: `v${NEW_VERSION}` },
  { path: 'CHANGELOG.md', regex: new RegExp(`## 0.3.4`, 'g'), replacement: `## 0.3.5\n\n> **Patch version — Fix CI NUIT Tests**\n\n- **Tests:** Fixed \`generateValidNUIT\` test helper to use the new weights so CI passes.\n\n---\n\n## 0.3.4` }
];

let changedFiles = 0;

for (const file of files) {
  const fullPath = path.join(__dirname, file.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (file.regex.test(content)) {
      content = content.replace(file.regex, file.replacement);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${file.path}`);
      changedFiles++;
    }
  }
}
console.log(`Total files updated: ${changedFiles}`);

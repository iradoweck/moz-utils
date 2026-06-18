const fs = require('fs');
const path = require('path');

const OLD_VERSION = '0.3.3';
const NEW_VERSION = '0.3.4';

const files = [
  { path: 'ts/package.json', regex: new RegExp(`"version": "${OLD_VERSION}"`, 'g'), replacement: `"version": "${NEW_VERSION}"` },
  { path: 'python/pyproject.toml', regex: new RegExp(`version = "${OLD_VERSION}"`, 'g'), replacement: `version = "${NEW_VERSION}"` },
  { path: 'php/composer.json', regex: new RegExp(`"version": "${OLD_VERSION}"`, 'g'), replacement: `"version": "${NEW_VERSION}"` },
  { path: 'dart/pubspec.yaml', regex: new RegExp(`version: ${OLD_VERSION}`, 'g'), replacement: `version: ${NEW_VERSION}` },
  { path: 'kotlin/build.gradle.kts', regex: new RegExp(`version = "${OLD_VERSION}"`, 'g'), replacement: `version = "${NEW_VERSION}"` },
  { path: 'README.md', regex: new RegExp(`v${OLD_VERSION}`, 'g'), replacement: `v${NEW_VERSION}` },
  { path: 'kotlin/README.md', regex: new RegExp(`v${OLD_VERSION}`, 'g'), replacement: `v${NEW_VERSION}` }
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
    } else {
      console.log(`No match in ${file.path} (Maybe already updated?)`);
    }
  } else {
    console.log(`File not found: ${file.path}`);
  }
}

console.log(`Total files updated: ${changedFiles}`);

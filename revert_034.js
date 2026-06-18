const fs = require('fs');
const path = require('path');

const OLD_VERSION = '0.3.5';
const NEW_VERSION = '0.3.4';

const files = [
  { path: 'ts/package.json', regex: new RegExp(`"version": "${OLD_VERSION}"`, 'g'), replacement: `"version": "${NEW_VERSION}"` },
  { path: 'python/pyproject.toml', regex: new RegExp(`version = "${OLD_VERSION}"`, 'g'), replacement: `version = "${NEW_VERSION}"` },
  { path: 'php/composer.json', regex: new RegExp(`"version": "${OLD_VERSION}"`, 'g'), replacement: `"version": "${NEW_VERSION}"` },
  { path: 'dart/pubspec.yaml', regex: new RegExp(`version: ${OLD_VERSION}`, 'g'), replacement: `version: ${NEW_VERSION}` },
  { path: 'kotlin/build.gradle.kts', regex: new RegExp(`version = "${OLD_VERSION}"`, 'g'), replacement: `version = "${NEW_VERSION}"` }
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(file.regex, file.replacement);
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file.path} to ${NEW_VERSION}`);
  } else {
    console.log(`File not found: ${file.path}`);
  }
});

import fs from 'fs';
import path from 'path';

// Usage: node scripts/bump.mjs [patch|minor|major]
// Example: node scripts/bump.mjs patch

const args = process.argv.slice(2);
const bumpType = args[0] ? args[0].toLowerCase() : 'patch';

const config = {
  ts: { file: 'ts/package.json', regex: /("version":\s*")(\d+)\.(\d+)\.(\d+)(")/ },
  php: { file: 'php/composer.json', regex: /("version":\s*")(\d+)\.(\d+)\.(\d+)(")/ },
  python: { file: 'python/pyproject.toml', regex: /(version\s*=\s*")(\d+)\.(\d+)\.(\d+)(")/ },
  dart: { file: 'dart/pubspec.yaml', regex: /^(version:\s*)(\d+)\.(\d+)\.(\d+)/m },
  kotlin: { file: 'kotlin/build.gradle.kts', regex: /(version\s*=\s*")(\d+)\.(\d+)\.(\d+)(")/ }
};

// We read from TS to determine current version
const tsFilePath = path.resolve(process.cwd(), config.ts.file);
let content;
try {
  content = fs.readFileSync(tsFilePath, 'utf-8');
} catch (error) {
  console.error(`File not found: ${tsFilePath}`);
  process.exit(1);
}

const match = content.match(config.ts.regex);
if (!match) {
  console.error(`Could not find version string in ${tsFilePath}`);
  process.exit(1);
}

let majorStr = match[2];
let minorStr = match[3];
let patchStr = match[4];

let major = parseInt(majorStr, 10);
let minor = parseInt(minorStr, 10);
let patch = parseInt(patchStr, 10);

if (bumpType === 'patch') {
  patch += 1;
  if (patch > 9) { // Base 10 Law
    patch = 0;
    minor += 1;
    if (minor > 9) {
      minor = 0;
      major += 1;
    }
  }
} else if (bumpType === 'minor') {
  minor += 1;
  patch = 0;
  if (minor > 9) {
    minor = 0;
    major += 1;
  }
} else if (bumpType === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else {
  console.error(`Unknown bump type: ${bumpType}`);
  process.exit(1);
}

const newVersion = `${major}.${minor}.${patch}`;

console.log(`\n🚀 Enforcing Absolute Parity: Bumping all ecosystem stacks to ${newVersion}...\n`);

for (const [stack, details] of Object.entries(config)) {
  const filePath = path.resolve(process.cwd(), details.file);
  try {
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // We match the whole regex, extract prefix and suffix
    const fileMatch = fileContent.match(details.regex);
    if (!fileMatch) {
      console.error(`Failed to bump ${stack}: Version string not found in ${details.file}`);
      continue;
    }
    
    // We dynamically reconstruct to preserve the original spacing/syntax
    const newString = `${fileMatch[1]}${newVersion}${fileMatch[5] || ''}`;
    fileContent = fileContent.replace(details.regex, newString);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`✅ [${stack.toUpperCase()}] Synced to ${newVersion}`);
  } catch (err) {
    console.error(`❌ [${stack.toUpperCase()}] Failed to sync:`, err.message);
  }
}

console.log(`\n======================================================`);
console.log(`🔔 BUMP COMPLETE: The ecosystem is now on v${newVersion}`);
console.log(`======================================================`);

if (bumpType === 'minor' || bumpType === 'major') {
  console.log(`\n⚠️ ENTERPRISE RELEASE CYCLE ALERT ⚠️`);
  console.log(`You just executed a ${bumpType.toUpperCase()} bump.`);
  console.log(`This implies the birth of a new Stable version and forces the previous line to become an LTS!`);
  console.log(`ACTION REQUIRED: Please update the 'Enterprise Release Cycle' table in README.md to reflect the new EOL / LTS lifespans.`);
}
console.log(`\nDon't forget to add your release notes to CHANGELOG.md!\n`);

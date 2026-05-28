import fs from 'fs';
import path from 'path';

// Usage: node scripts/bump.js <stack> <bump_type>
// Example: node scripts/bump.js ts patch
// Example: node scripts/bump.js global minor

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: node bump.js <stack> [patch|minor|major]");
  console.error("Stacks: ts, website, python, dart, kotlin, global");
  process.exit(1);
}

const stack = args[0].toLowerCase();
const bumpType = args[1] ? args[1].toLowerCase() : 'patch';

const config = {
  ts: { file: 'ts/package.json', regex: /("version":\s*")(\d+)\.(\d+)\.(\d+)(")/ },
  website: { file: 'website/package.json', regex: /("version":\s*")(\d+)\.(\d+)\.(\d+)(")/ },
  python: { file: 'python/setup.py', regex: /(version=")(\d+)\.(\d+)\.(\d+)(")/ },
  dart: { file: 'dart/pubspec.yaml', regex: /^(version:\s*)(\d+)\.(\d+)\.(\d+)/m },
  kotlin: { file: 'kotlin/build.gradle.kts', regex: /(version\s*=\s*")(\d+)\.(\d+)\.(\d+)(")/ },
  global: { file: 'CHANGELOG.md', regex: /^(##\s*)(\d+)\.(\d+)\.(\d+)/m } // Reading highest version
};

if (!config[stack]) {
  console.error(`Unknown stack: ${stack}`);
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), config[stack].file);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');
const match = content.match(config[stack].regex);

if (!match) {
  console.error(`Could not find version string in ${filePath}`);
  process.exit(1);
}

let [, prefix, majorStr, minorStr, patchStr, suffix] = match;
suffix = suffix || '';

let major = parseInt(majorStr, 10);
let minor = parseInt(minorStr, 10);
let patch = parseInt(patchStr, 10);

if (bumpType === 'patch') {
  patch += 1;
  if (patch >= 10) {
    patch = 0;
    minor += 1;
    if (minor >= 10) {
      minor = 0;
      major += 1;
    }
  }
} else if (bumpType === 'minor') {
  minor += 1;
  patch = 0;
  if (minor >= 10) {
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

if (stack === 'global') {
  // For global, we don't just replace the first match, we want to prepend a new section or update it if needed.
  // Actually, for global, it might be better to just notify the user what the new version is,
  // since adding a changelog entry is manual. 
  console.log(`Global version should be bumped to ${newVersion}`);
  console.log(`Please create a new entry in CHANGELOG.md: ## ${newVersion}`);
} else {
  const newString = `${prefix}${newVersion}${suffix}`;
  content = content.replace(config[stack].regex, newString);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Bumped ${stack} to ${newVersion} in ${config[stack].file}`);
}

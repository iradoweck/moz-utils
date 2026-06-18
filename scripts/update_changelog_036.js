const fs = require('fs');
const path = require('path');

const changelog036 = `## [0.3.6] - 2026-06-03

### Fixed
- **Registries Conflict:** Bumped version to 0.3.6 to resolve immutable publish rejections on NPM and Pub.dev caused by previous tags.
- **Kotlin Tests:** Fixed Kotlin \`generateValidNUIT\` test helper to use the true weights (\`8, 9, 4, 5, 6, 7, 8, 9\`) so CI passes correctly on all 5 stacks.

`;

const stacks = ['dart', 'python', 'php', 'ts', 'kotlin'];

// Update sub changelogs
stacks.forEach(stack => {
  const clPath = path.join(__dirname, stack, 'CHANGELOG.md');
  if (fs.existsSync(clPath)) {
    let content = fs.readFileSync(clPath, 'utf8');
    content = content.replace(/(## \[0\.3\.4\])/, changelog036 + '$1');
    fs.writeFileSync(clPath, content);
  }
});

// Update root changelog
const rootPath = path.join(__dirname, 'CHANGELOG.md');
if (fs.existsSync(rootPath)) {
  let content = fs.readFileSync(rootPath, 'utf8');
  
  const rootNote = `## 0.3.6

> **Patch version — Kotlin Test Fixes & Registries Integrity**

### Fixes
- **Kotlin Tests:** Fixed Kotlin \`generateValidNUIT\` test helper to use the true NUIT weights so CI passes for JVM.
- **Registries:** Version bumped to bypass NPM/Pub.dev immutable publish restrictions.

---

`;
  
  content = content.replace(/(## 0\.3\.4)/, rootNote + '$1');
  fs.writeFileSync(rootPath, content);
}

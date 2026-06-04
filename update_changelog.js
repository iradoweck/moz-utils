const fs = require('fs');
const path = require('path');

const changelog034 = `## [0.3.4] - 2026-06-03

### Changed
- **NUIT Algorithm Correction:** Discovered and implemented the true Mozambican NUIT algorithm (weights \`8, 9, 4, 5, 6, 7, 8, 9\` instead of standard Modulo 11). Fixed across all 5 languages. Validates real-world corporate and individual NUITs perfectly.
- **Financial Parser:** Added the \`parseMZN\` function to clean and parse "dirty" string inputs (e.g., \`"1.500,00 MT"\`, \`"1 500,00MZN"\`, \`"1,500.00"\`) directly into raw database floats across all ecosystems.
- **Tests (Dart & Python):** Fixed test suites to use the new NUIT algorithm and fixed the mock generator. 
- **Website (Simulators):** The interactive money simulator now processes values through \`parseMZN\`. NUIT Simulator is fully functional with the new mathematical weights.
- **E2E Testing:** Added Playwright E2E tests for the simulators.
- **CodeQL Security:** Excluded node_modules from scans to resolve false positive alerts.

`;

const stacks = ['dart', 'python', 'php', 'ts', 'kotlin'];

// Update sub changelogs
stacks.forEach(stack => {
  const clPath = path.join(__dirname, stack, 'CHANGELOG.md');
  if (fs.existsSync(clPath)) {
    let content = fs.readFileSync(clPath, 'utf8');
    // Remove old 0.3.4 or 0.3.5 if they exist
    content = content.replace(/## \[0\.3\.[45]\].*?(?=## \[0\.3\.[32]\])/gs, '');
    // Insert new 0.3.4
    content = content.replace(/(## \[0\.3\.3\])/, changelog034 + '$1');
    fs.writeFileSync(clPath, content);
  }
});

// Update root changelog
const rootPath = path.join(__dirname, 'CHANGELOG.md');
if (fs.existsSync(rootPath)) {
  let content = fs.readFileSync(rootPath, 'utf8');
  // Remove existing 0.3.5 and 0.3.4 sections
  content = content.replace(/## 0\.3\.5.*?---/gs, '');
  content = content.replace(/## 0\.3\.4.*?---/gs, '');
  
  const rootNote = `## 0.3.4

> **Patch version — The True NUIT Algorithm, Fixes & Currency Parser**

### Core Logic & Mathematical Fixes
- **NUIT Algorithm Correction:** Discovered and implemented the true Mozambican NUIT algorithm (weights \`8, 9, 4, 5, 6, 7, 8, 9\` instead of standard Modulo 11). Fixed across all 5 languages. Validates real-world corporate and individual NUITs perfectly.
- **Financial Parser:** Added the \`parseMZN\` function to clean and parse "dirty" string inputs (e.g., \`"1.500,00 MT"\`, \`"1 500,00MZN"\`, \`"1,500.00"\`) directly into raw database floats across all ecosystems.

### Tests & CI
- **Tests:** Fixed \`generateValidNUIT\` test helper to use the new weights so CI passes for Dart and Python.
- **E2E:** Added Playwright E2E tests for the Vite website and Simulators.
- **Security:** Resolved CodeQL false positive warnings by ignoring node_modules.

### Simulators & Website
- **Money Simulator:** The interactive money simulator now processes values through \`parseMZN\` to prove its resilience before formatting to UI standards.
- **NUIT Simulator:** Fully functional with the new mathematical weights.

---

`;
  
  content = content.replace(/(## 0\.3\.3)/, rootNote + '$1');
  fs.writeFileSync(rootPath, content);
}

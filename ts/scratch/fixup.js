const fs = require('fs');
const path = require('path');

// Fix documentation
const docPath = String.raw`d:\ZEDECKLAB\ZedecksProjects\nhonguista\packages\moz-utils\docs\postal_codes_mocambique.md`;
let docContent = fs.readFileSync(docPath, 'utf8');
// Remove the weird appended header if it exists
docContent = docContent.replace(/\n# Códigos Postais de Moçambique\n\n> \*\*Desenvolvido por Contribuidores Open Source & suportado por Edmilson Muacigarro\*\*/g, '');
// Add the correct header at the top
docContent = docContent.replace('# Códigos Postais de Moçambique', '# Códigos Postais de Moçambique\n\n> **Desenvolvido por Contribuidores Open Source & suportado por Edmilson Muacigarro**');
// Write back
fs.writeFileSync(docPath, docContent, 'utf8');

// Fix emulator.ts
const emulatorSrc = String.raw`d:\ZEDECKLAB\ZedecksProjects\nhonguista\packages\moz-utils\ts\emulator.ts`;
const emulatorDest = String.raw`d:\ZEDECKLAB\ZedecksProjects\nhonguista\packages\moz-utils\emulator.ts`;
let emulatorContent = fs.readFileSync(emulatorSrc, 'utf8');
// Replace Zedeck's IT with Edmilson Muacigarro
emulatorContent = emulatorContent.replace(/suportado por Zedeck's IT/g, 'suportado por Edmilson Muacigarro');
// Update imports from './src/index' to './ts/src/index'
emulatorContent = emulatorContent.replace(/from '\.\/src\/index'/g, "from './ts/src/index'");
// Write to new location
fs.writeFileSync(emulatorDest, emulatorContent, 'utf8');
// Delete old file
fs.unlinkSync(emulatorSrc);

console.log('Fixes applied successfully!');

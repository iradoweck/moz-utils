const fs = require('fs');
const path = require('path');

const srcFile = String.raw`C:\Users\zedeckmuacy\.gemini\antigravity-ide\brain\ca23226c-7404-42ba-b8c5-dd7ce2dfb2e9\mozambique_cep_system.md`;
const destFile = String.raw`d:\ZEDECKLAB\ZedecksProjects\nhonguista\packages\moz-utils\docs\postal_codes_mocambique.md`;

try {
  const content = fs.readFileSync(srcFile, 'utf8');
  fs.appendFileSync(destFile, '\n\n' + content, 'utf8');
  console.log('Successfully appended mozambique_cep_system.md to postal_codes_mocambique.md');
} catch (error) {
  console.error('Error appending file:', error);
  process.exit(1);
}

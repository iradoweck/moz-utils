import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'exported_data.json'), 'utf8'));

// Generate Python
let pyCode = `"""\nDados do Código de Endereçamento Postal (CEP) de Moçambique.\nGerado automaticamente.\n"""\n\n`;
pyCode += `LEGACY_POSTAL_CODES = ${JSON.stringify(data.legacyPostalCodes, null, 4)}\n\n`;
pyCode += `LEGACY_TO_NEW_CEP_PREFIX = ${JSON.stringify(data.legacyToNewCEPPrefix, null, 4)}\n\n`;
pyCode += `NEW_CEP_DATA = ${JSON.stringify(data.newCEPData, null, 4)}\n`;
fs.writeFileSync(path.join(__dirname, '../../python/moz_utils/cep_data.py'), pyCode);

// Generate PHP
const phpDir = path.join(__dirname, '../../php/src');
if (!fs.existsSync(phpDir)) fs.mkdirSync(phpDir, { recursive: true });
let phpCode = `<?php\n\nnamespace MozUtils;\n\nclass CepData\n{\n`;
phpCode += `    public static $legacyPostalCodes = ${JSON.stringify(data.legacyPostalCodes, null, 4).replace(/{/g, '[').replace(/}/g, ']')};\n\n`;
phpCode += `    public static $legacyToNewCEPPrefix = ${JSON.stringify(data.legacyToNewCEPPrefix, null, 4).replace(/{/g, '[').replace(/}/g, ']')};\n\n`;
phpCode += `    public static $newCEPData = ${JSON.stringify(data.newCEPData, null, 4).replace(/{/g, '[').replace(/}/g, ']')};\n`;
phpCode += `}\n`;
fs.writeFileSync(path.join(__dirname, '../../php/src/CepData.php'), phpCode);

// Generate Dart
const dartDir = path.join(__dirname, '../../dart/lib/src');
if (!fs.existsSync(dartDir)) fs.mkdirSync(dartDir, { recursive: true });
let dartCode = `/// Dados do Código de Endereçamento Postal (CEP) de Moçambique.\n/// Gerado automaticamente.\n\n`;
dartCode += `const Map<String, Map<String, String>> legacyPostalCodes = ${JSON.stringify(data.legacyPostalCodes, null, 2)};\n\n`;
dartCode += `const Map<String, List<String>> legacyToNewCEPPrefix = ${JSON.stringify(data.legacyToNewCEPPrefix, null, 2)};\n\n`;
dartCode += `const List<Map<String, String>> newCEPData = ${JSON.stringify(data.newCEPData, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '../../dart/lib/src/cep_data.dart'), dartCode);

// Generate Kotlin
const ktDir = path.join(__dirname, '../../kotlin/src/main/kotlin/com/edmilsonmuacigarro/mozutils');
if (!fs.existsSync(ktDir)) fs.mkdirSync(ktDir, { recursive: true });
let ktCode = `package com.edmilsonmuacigarro.mozutils\n\n`;
ktCode += `object CepData {\n`;

// Kotlin requires more specific typing for Maps
ktCode += `    val legacyPostalCodes: Map<String, Map<String, String>> = mapOf(\n`;
for (const [k, v] of Object.entries(data.legacyPostalCodes)) {
    ktCode += `        "${k}" to mapOf("locality" to "${(v as any).locality}", "province" to "${(v as any).province}", "administrative_posts" to "${(v as any).administrative_posts}", "neighborhoods" to "${(v as any).neighborhoods}"),\n`;
}
ktCode += `    )\n\n`;

ktCode += `    val legacyToNewCEPPrefix: Map<String, List<String>> = mapOf(\n`;
for (const [k, v] of Object.entries(data.legacyToNewCEPPrefix)) {
    ktCode += `        "${k}" to listOf(${(v as string[]).map(x => `"${x}"`).join(', ')}),\n`;
}
ktCode += `    )\n\n`;

ktCode += `    val newCEPData: List<Map<String, String>> = listOf(\n`;
for (const item of data.newCEPData as any[]) {
    ktCode += `        mapOf("cep" to "${item.cep}", "province" to "${item.province}", "district" to "${item.district}", "locality" to "${item.locality}", "administrative_posts" to "${item.administrative_posts}", "neighborhoods" to "${item.neighborhoods}"),\n`;
}
ktCode += `    )\n}\n`;
fs.writeFileSync(path.join(__dirname, '../../kotlin/src/main/kotlin/com/edmilsonmuacigarro/mozutils/CepData.kt'), ktCode);

console.log('Successfully generated cep_data files for all stacks!');

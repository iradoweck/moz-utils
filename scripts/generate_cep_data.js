const fs = require('fs');
const path = require('path');

const rawDataPath = String.raw`C:\Users\zedeckmuacy\.gemini\antigravity-ide\brain\ca23226c-7404-42ba-b8c5-dd7ce2dfb2e9\scratch\raw_data.txt`;
const outPath = path.join(__dirname, 'src', 'cep_data.ts');

const rawData = fs.readFileSync(rawDataPath, 'utf8');
const lines = rawData.split('\n');

const cepEntries = [];
let current_province = '';
let current_district = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (line.includes("Província") && line.includes("(Prefixo")) {
        current_province = line.replace(/[🔴🟢🟡🔵🟣🟠]/g, '').replace(/\(Prefixo.*\)/, '').trim();
        current_district = '';
    } else if (line.match(/^\d+\.\s*Distrito Municipal/)) {
        current_province = "Cidade de Maputo";
        current_district = line.replace(/^\d+\.\s*/, '').trim();
    } else if (line.includes(" — ") || line.includes(" - ")) {
        let parts = line.split("—");
        if (parts.length !== 2) parts = line.split("-");
        if (parts.length >= 2) {
            let place = parts[0].trim();
            let cep = parts[parts.length - 1].trim();
            
            if (!/^\d{4}-\d{2}$/.test(cep)) {
                 if (current_province) {
                     current_district = line.trim();
                 }
                 continue;
            }
            
            // Fix some weird split cases
            if (place === "Central (Sede)" && cep === "01") cep = "0909-02"; // Fix if broken
            
            cepEntries.push({
                cep: cep,
                province: current_province,
                district: current_district,
                locality: place
            });
        }
    } else {
        if (current_province) {
            current_district = line;
        }
    }
}

// Add manually specified Nampula CEPs
const manualCeps = [
    { cep: '0909-07', province: 'Província de Nampula', district: 'Nampula', locality: 'Muhala' },
    { cep: '0909-08', province: 'Província de Nampula', district: 'Nampula', locality: 'Carrupeia' },
    { cep: '0909-09', province: 'Província de Nampula', district: 'Nampula', locality: 'Namutequeliua' },
    { cep: '0909-10', province: 'Província de Nampula', district: 'Nampula', locality: 'Muahivire' }
];

// Combine and filter any potential duplicates, then sort
const allCeps = [...cepEntries, ...manualCeps];
const uniqueCeps = [];
const seen = new Set();
for (const entry of allCeps) {
    if (!seen.has(entry.cep)) {
        seen.add(entry.cep);
        // Fix up province names (remove "Província de " or " da " if it helps consistency, but keep it standard)
        let prov = entry.province.replace(/Província\s+(da|de)\s+/gi, '').trim();
        uniqueCeps.push({
            cep: entry.cep,
            province: prov,
            district: entry.district,
            locality: entry.locality
        });
    }
}

uniqueCeps.sort((a, b) => a.cep.localeCompare(b.cep));

const outputTs = `import { CEPInfo } from './index';

/**
 * Base de dados completa dos Novos Códigos de Endereçamento Postal (CEP).
 * Total de registos: ${uniqueCeps.length}
 */
export const newCEPData: CEPInfo[] = ${JSON.stringify(uniqueCeps, null, 2)};
`;

fs.writeFileSync(outPath, outputTs, 'utf8');
console.log('Gerado ficheiro src/cep_data.ts com ' + uniqueCeps.length + ' registos.');

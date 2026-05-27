const fs = require('fs');

// We will read index.ts to get the legacy codes
const indexPath = String.raw`d:\ZEDECKLAB\ZedecksProjects\nhonguista\packages\moz-utils\ts\src\index.ts`;
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Also read cep_data.ts
const cepDataPath = String.raw`d:\ZEDECKLAB\ZedecksProjects\nhonguista\packages\moz-utils\ts\src\cep_data.ts`;
const cepDataContent = fs.readFileSync(cepDataPath, 'utf8');

// Extract legacyPostalCodes block
const legacyMatch = indexContent.match(/export const legacyPostalCodes: Record<string, { locality: string; province: string }> = {([\s\S]*?)};/);
if (!legacyMatch) throw new Error("Could not find legacyPostalCodes");

const legacyEntries = [];
const lines = legacyMatch[1].split('\n');
for (const line of lines) {
    const m = line.match(/'(\d{4})':\s*{\s*locality:\s*'([^']+)'/);
    if (m) {
        legacyEntries.push({ code: m[1], locality: m[2] });
    }
}

// Extract newCEPData
const cepDataMatch = cepDataContent.match(/export const newCEPData: CEPInfo\[\] = (\[[\s\S]*?\]);/);
if (!cepDataMatch) throw new Error("Could not find newCEPData");
const newCEPs = JSON.parse(cepDataMatch[1]);

// Map districts to their prefixes
const districtPrefixes = {}; // e.g. "Matola": Set("0204")
for (const c of newCEPs) {
    const prefix = c.cep.split('-')[0];
    if (!districtPrefixes[c.district]) {
        districtPrefixes[c.district] = new Set();
    }
    districtPrefixes[c.district].add(prefix);
    
    // Also map localities just in case
    if (!districtPrefixes[c.locality]) {
        districtPrefixes[c.locality] = new Set();
    }
    districtPrefixes[c.locality].add(prefix);
}

// Map legacy codes to prefixes
const mapping = {};
for (const leg of legacyEntries) {
    let loc = leg.locality.replace(' ECP', '').replace(' (Sede)', '').trim();
    if (loc === 'Maputo') {
        mapping[leg.code] = ['0101', '0102', '0103', '0104', '0105', '0106', '0107'];
        continue;
    }
    
    // Exact match in district
    let found = false;
    for (const d of Object.keys(districtPrefixes)) {
        if (d.toLowerCase() === loc.toLowerCase() || d.toLowerCase().includes(loc.toLowerCase())) {
            if (!mapping[leg.code]) mapping[leg.code] = new Set();
            for (const p of districtPrefixes[d]) {
                mapping[leg.code].add(p);
            }
            found = true;
        }
    }
    
    if (mapping[leg.code]) {
        mapping[leg.code] = Array.from(mapping[leg.code]).sort();
    }
}

// Manual overrides for those that might fail auto-match
mapping['3100'] = ['0909'];
mapping['3200'] = ['1005'];
mapping['3201'] = ['1005'];
mapping['2100'] = ['0504']; // Beira
mapping['2200'] = ['0602']; // Chimoio
mapping['2300'] = ['0702']; // Tete
mapping['2400'] = ['0802']; // Quelimane
mapping['3300'] = ['1111']; // Lichinga
mapping['1200'] = ['0302']; // Xai-Xai
mapping['1300'] = ['0404']; // Inhambane

let output = "export const legacyToNewCEPPrefix: Record<string, string[]> = {\n";
for (const code of Object.keys(mapping).sort()) {
    if (mapping[code] && mapping[code].length > 0) {
        output += `  '${code}': ${JSON.stringify(mapping[code])},\n`;
    }
}
output += "};";

fs.writeFileSync(String.raw`d:\ZEDECKLAB\ZedecksProjects\nhonguista\packages\moz-utils\ts\scratch\generated_mapping.ts`, output);
console.log("Mapping generated successfully.");

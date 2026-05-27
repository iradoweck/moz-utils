import { suggestCEPs } from './src/index';

console.log('--- Testando Mapeamento Amplo de Códigos Legados ---');

const testCodes = ['1100', '1200', '2100', '2400', '3300'];

testCodes.forEach(code => {
    const suggestions = suggestCEPs(code);
    console.log(`\nInput: "${code}" -> Encontradas ${suggestions.length} sugestões no novo CEP.`);
    // Imprimir as primeiras 3 sugestões para não encher a tela
    suggestions.slice(0, 3).forEach(s => {
        console.log(`  -> [${s.cep}] ${s.locality}, ${s.district}, ${s.province}`);
    });
    if (suggestions.length > 3) {
        console.log(`  ... e mais ${suggestions.length - 3} resultados.`);
    }
});

import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function clearScreen() {
    console.clear();
    console.log('===============================================================');
    console.log('         CENTRAL DE TESTES ABSTRATA - MOZ-UTILS');
    console.log('   (Validação Universal da Lógica Matemática - Agnóstica de Stack)');
    console.log(' Desenvolvido por Contribuidores Open Source & suportado por Formiga Antonio');
    console.log('===============================================================\n');
}

function showMenu() {
    clearScreen();
    console.log('Escolha uma opção para testar a Lógica Matemática e Regex Pura:');
    console.log('1. Testar Lógica de Telefone (Prefixos & M-Pesa/e-Mola/mKesh)');
    console.log('2. Testar Lógica do NUIT (Módulo 11 Base 10)');
    console.log('3. Testar Regras do Bilhete de Identidade (BI)');
    console.log('4. Testar Regras do DIRE');
    console.log('5. Testar Regras do Passaporte');
    console.log('6. Testar Regras da Carta de Condução');
    console.log('0. Sair\n');

    rl.question('Opção: ', (answer: string) => {
        switch (answer.trim()) {
            case '1': handlePhone(); break;
            case '2': handleNUIT(); break;
            case '3': handleBI(); break;
            case '4': handleDIRE(); break;
            case '5': handlePassport(); break;
            case '6': handleDrivingLicense(); break;
            case '0': 
                console.log('\nA sair da Central de Testes. Obrigado!');
                rl.close(); 
                break;
            default:
                console.log('\n❌ Opção Inválida.');
                promptContinue();
                break;
        }
    });
}

function promptContinue() {
    rl.question('\nPressione ENTER para voltar ao menu...', () => {
        showMenu();
    });
}

function handlePhone() {
    console.log('\n--- LÓGICA: TELEFONE MOÇAMBICANO ---');
    console.log('Regra: Regex ^(?:\\+258|00258|258)?(?:8[2-8]\\d{7}|2\\d{7})$');
    rl.question('Digite o número de telefone: ', (input: string) => {
        const cleaned = input.replace(/\s+/g, '');
        const match = cleaned.match(/^(?:\+258|00258|258)?(8[2-8]\d{7}|2\d{7})$/);
        
        if (match) {
            const rawNumber = match[1];
            console.log(`\n✅ Lógica Aceite! Número Puro: ${rawNumber}`);
            const prefix = rawNumber.substring(0, 2);
            if (['84', '85'].includes(prefix)) {
                console.log(`📡 Operadora: Vodacom (M-Pesa)`);
            } else if (['82', '83'].includes(prefix)) {
                console.log(`📡 Operadora: Tmcel (mKesh)`);
            } else if (['86', '87', '88'].includes(prefix)) {
                console.log(`📡 Operadora: Movitel (e-Mola)`);
            } else {
                console.log(`📡 Operadora: Linha Fixa / Desconhecido`);
            }
        } else {
            console.log('\n❌ Lógica Rejeitada. Não cumpre os padrões universais de telefonia de Moçambique.');
        }
        promptContinue();
    });
}

function handleNUIT() {
    console.log('\n--- LÓGICA: NUIT (MÓDULO 11) ---');
    console.log('Regra: 9 dígitos numéricos, Check Digit = 11 - (Soma(Pesos * Dígitos) % 11)');
    rl.question('Digite o NUIT (9 dígitos): ', (input: string) => {
        const nuit = input.replace(/\s+/g, '');
        if (!/^\d{9}$/.test(nuit)) {
            console.log('\n❌ Rejeitado: O formato exige exatamente 9 dígitos.');
            return promptContinue();
        }

        const weights = [8, 9, 4, 5, 6, 7, 8, 9];
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += parseInt(nuit[i]) * weights[i];
        }

        const rem = sum % 11;
        const checkDigit = rem === 0 || rem === 1 ? 0 : 11 - rem;

        if (checkDigit === parseInt(nuit[8])) {
            console.log(`\n✅ Lógica Aceite! O Check Digit ${checkDigit} corresponde ao algoritmo Módulo 11.`);
            const firstDigit = nuit[0];
            let type = 'Individual/Singular';
            if (['5', '6'].includes(firstDigit)) type = 'Empresa/Entidade Pública';
            else if (['7'].includes(firstDigit)) type = 'Entidade Não Lucrativa/Estrangeira';
            console.log(`🏢 Tipo de Entidade (baseado no primeiro dígito): ${type}`);
        } else {
            console.log(`\n❌ Lógica Rejeitada! O Check Digit devia ser ${checkDigit}, mas é ${nuit[8]}.`);
        }
        promptContinue();
    });
}

function handleBI() {
    console.log('\n--- LÓGICA: BI ---');
    console.log('Regra: Exatamente 12 dígitos seguidos por 1 letra (A-Z)');
    rl.question('Digite o BI: ', (input: string) => {
        const bi = input.replace(/\s+/g, '').toUpperCase();
        if (/^\d{12}[A-Z]$/.test(bi)) {
            console.log(`\n✅ Lógica Aceite! Formato universal válido para BI Moçambicano.`);
        } else {
            console.log('\n❌ Lógica Rejeitada! Padrão não reconhecido.');
        }
        promptContinue();
    });
}

function handleDIRE() {
    console.log('\n--- LÓGICA: DIRE ---');
    console.log('Regra: 8 dígitos alfanuméricos seguidos por 1 letra (A-Z) OU Padrão semelhante.');
    rl.question('Digite o DIRE: ', (input: string) => {
        const dire = input.replace(/\s+/g, '').toUpperCase();
        if (/^[0-9A-Z]{8}[A-Z]$/.test(dire)) {
            console.log(`\n✅ Lógica Aceite! Formato universal válido para DIRE.`);
        } else {
            console.log('\n❌ Lógica Rejeitada! Padrão não reconhecido.');
        }
        promptContinue();
    });
}

function handlePassport() {
    console.log('\n--- LÓGICA: PASSAPORTE ---');
    console.log('Regra: 2 letras seguidas por 7 dígitos (ex: AO1234567)');
    rl.question('Digite o Passaporte: ', (input: string) => {
        const pass = input.replace(/\s+/g, '').toUpperCase();
        if (/^[A-Z]{2}\d{7}$/.test(pass)) {
            console.log(`\n✅ Lógica Aceite! Formato universal válido para Passaporte.`);
        } else {
            console.log('\n❌ Lógica Rejeitada! Padrão não reconhecido.');
        }
        promptContinue();
    });
}

function handleDrivingLicense() {
    console.log('\n--- LÓGICA: CARTA DE CONDUÇÃO ---');
    console.log('Regra: Prefixo da Província + 5 a 7 dígitos (ex: MP123456)');
    rl.question('Digite a Carta de Condução: ', (input: string) => {
        const cnd = input.replace(/\s+/g, '').toUpperCase();
        if (/^[A-Z]{1,3}\d{5,7}$/.test(cnd)) {
            console.log(`\n✅ Lógica Aceite! Formato universal válido para Carta de Condução.`);
        } else {
            console.log('\n❌ Lógica Rejeitada! Padrão não reconhecido.');
        }
        promptContinue();
    });
}

// Iniciar
showMenu();

import * as readline from 'readline';
import { 
    isValidMozambicanPhone, formatMozambicanPhone, getMobileOperator,
    isValidNUIT, getNUITEntityType,
    isValidBI, isValidDIRE, isValidPassport, isValidDrivingLicense,
    isValidNewCEP, suggestCEPs
} from './ts/src/index';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function clearScreen() {
    console.clear();
    console.log('===============================================================');
    console.log('                 EMULADOR MOZ-UTILS (CLI)');
    console.log(' Desenvolvido por Contribuidores Open Source & suportado por Edmilson Muacigarro');
    console.log('===============================================================\n');
}

function showMenu() {
    clearScreen();
    console.log('Escolha uma opção para simular a validação em produção:');
    console.log('1. Validar Telefone (M-Pesa, e-Mola, mKesh)');
    console.log('2. Validar NUIT');
    console.log('3. Validar Bilhete de Identidade (BI)');
    console.log('4. Validate DIRE');
    console.log('5. Validar Passaporte');
    console.log('6. Validar Carta de Condução');
    console.log('7. Validar / Sugerir Códigos Postais (CEP)');
    console.log('0. Sair\n');

    rl.question('Opção: ', (answer: string) => {
        switch (answer.trim()) {
            case '1': handlePhone(); break;
            case '2': handleNUIT(); break;
            case '3': handleBI(); break;
            case '4': handleDIRE(); break;
            case '5': handlePassport(); break;
            case '6': handleDrivingLicense(); break;
            case '7': handleCEP(); break;
            case '0': 
                console.log('\nA sair do emulador. Obrigado!');
                rl.close(); 
                break;
            default:
                console.log('\n❌ Invalid option.');
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
    rl.question('\nDigite o número de telefone (ex: 841234567 ou +258 84...): ', (input: string) => {
        if (isValidMozambicanPhone(input)) {
            const operator = getMobileOperator(input);
            console.log(`\n✅ Número Valid!`);
            console.log(`📡 Operator detetada: ${operator}`);
            console.log(`📞 Formato Internacional: ${formatMozambicanPhone(input)}`);
            if (operator === 'Vodacom') console.log(`💼 Suporta M-Pesa: Sim`);
            else if (operator === 'Tmcel') console.log(`💼 Suporta mKesh: Sim`);
            else if (operator === 'Movitel') console.log(`💼 Suporta e-Mola: Sim`);
        } else {
            console.log('\n❌ Número Invalid!');
        }
        promptContinue();
    });
}

function handleNUIT() {
    rl.question('\nDigite o NUIT (9 dígitos): ', (input: string) => {
        if (isValidNUIT(input)) {
            const type = getNUITEntityType(input);
            console.log(`\n✅ NUIT Valid! (Passou no Módulo 11)`);
            console.log(`🏢 Entity Type: ${type}`);
        } else {
            console.log('\n❌ NUIT Invalid!');
        }
        promptContinue();
    });
}

function handleBI() {
    rl.question('\nDigite o BI (12 dígitos e 1 letra): ', (input: string) => {
        if (isValidBI(input)) {
            console.log(`\n✅ BI Valid!`);
        } else {
            console.log('\n❌ BI Invalid!');
        }
        promptContinue();
    });
}

function handleDIRE() {
    rl.question('\nDigite o DIRE (8 dígitos e 1 letra): ', (input: string) => {
        if (isValidDIRE(input)) {
            console.log(`\n✅ DIRE Valid!`);
        } else {
            console.log('\n❌ DIRE Invalid!');
        }
        promptContinue();
    });
}

function handlePassport() {
    rl.question('\nDigite o Passaporte (2 letras e 7 dígitos): ', (input: string) => {
        if (isValidPassport(input)) {
            console.log(`\n✅ Passaporte Valid!`);
        } else {
            console.log('\n❌ Passaporte Invalid!');
        }
        promptContinue();
    });
}

function handleDrivingLicense() {
    rl.question('\nDigite a Carta de Condução (1 letra província + 5 a 7 dígitos): ', (input: string) => {
        if (isValidDrivingLicense(input)) {
            console.log(`\n✅ Carta de Condução Válida!`);
        } else {
            console.log('\n❌ Carta de Condução Inválida!');
        }
        promptContinue();
    });
}

function handleCEP() {
    rl.question('\nDigite um Código Postal Legado (ex: 3100) ou Novo CEP (ex: 0909-09): ', (input: string) => {
        if (isValidNewCEP(input)) {
            console.log(`\n✅ O formato é de um Novo CEP válido.`);
            const direct = suggestCEPs(input);
            if (direct.length > 0) {
                console.log(`📍 Localidade: ${direct[0].locality}, ${direct[0].district}, ${direct[0].province}`);
            } else {
                console.log(`⚠️ Mas não foi encontrado na base de dados.`);
            }
        } else {
            const suggestions = suggestCEPs(input);
            if (suggestions.length > 0) {
                console.log(`\n✅ Foi detetado o Código Legado '${input}'.`);
                console.log(`Simulação de Popup para o Utilizador Escolher o seu Bairro/Posto:`);
                suggestions.forEach((s, idx) => {
                    console.log(`  [${idx + 1}] ${s.cep} - ${s.locality}, ${s.district} (${s.province})`);
                });
            } else {
                console.log('\n❌ Formato ou Código Postal Invalid/Não Encontrado.');
            }
        }
        promptContinue();
    });
}

// Iniciar
showMenu();

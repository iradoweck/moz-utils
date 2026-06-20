import * as readline from 'readline';
import { 
    isValidMozambicanPhone, 
    getMobileOperator, 
    isValidNUIT, 
    getNUITEntityType, 
    isValidBI, 
    isValidDIRE, 
    isValidPassport, 
    isValidDrivingLicense 
} from './ts/src/index.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function clearScreen() {
    console.clear();
    console.log('===============================================================');
    console.log('         CENTRAL DE TESTES ABSTRATA - MOZ-UTILS');
    console.log('   (Validação Universal usando a core library moz-utils)');
    console.log(' Desenvolvido e suportado por Zedecks IT & Comunidade');
    console.log('===============================================================\n');
}

function showMenu() {
    clearScreen();
    console.log('Escolha uma opção para testar a Biblioteca Core (moz-utils):');
    console.log('1. Testar Validação de Telefone (Prefixos & Operadoras)');
    console.log('2. Testar Validação do NUIT (Módulo 11 da AT)');
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
    console.log('\n--- TESTE NA BIBLIOTECA: TELEFONE MOÇAMBICANO ---');
    rl.question('Digite o número de telefone: ', (input: string) => {
        const cleaned = input.trim();
        if (isValidMozambicanPhone(cleaned)) {
            const operator = getMobileOperator(cleaned);
            console.log(`\n✅ Aceite! A biblioteca validou o número: ${cleaned}`);
            console.log(`📡 Operadora detetada: ${operator || 'Desconhecida'}`);
        } else {
            console.log('\n❌ Rejeitado! A biblioteca moz-utils não reconhece como um número válido em Moçambique.');
        }
        promptContinue();
    });
}

function handleNUIT() {
    console.log('\n--- TESTE NA BIBLIOTECA: NUIT ---');
    rl.question('Digite o NUIT: ', (input: string) => {
        const cleaned = input.trim();
        if (isValidNUIT(cleaned)) {
            const type = getNUITEntityType(cleaned);
            console.log(`\n✅ Aceite! NUIT validado pela biblioteca moz-utils.`);
            console.log(`🏢 Tipo de Entidade: ${type || 'Desconhecido'}`);
        } else {
            console.log('\n❌ Rejeitado! NUIT inválido (o dígito de controlo Módulo 11 falhou ou o formato está incorreto).');
        }
        promptContinue();
    });
}

function handleBI() {
    console.log('\n--- TESTE NA BIBLIOTECA: BI ---');
    rl.question('Digite o BI: ', (input: string) => {
        const cleaned = input.trim();
        if (isValidBI(cleaned)) {
            console.log(`\n✅ Aceite! BI estruturalmente válido segundo a biblioteca.`);
        } else {
            console.log('\n❌ Rejeitado! BI não reconhecido pela biblioteca.');
        }
        promptContinue();
    });
}

function handleDIRE() {
    console.log('\n--- TESTE NA BIBLIOTECA: DIRE ---');
    rl.question('Digite o DIRE: ', (input: string) => {
        const cleaned = input.trim();
        if (isValidDIRE(cleaned)) {
            console.log(`\n✅ Aceite! DIRE válido segundo a biblioteca.`);
        } else {
            console.log('\n❌ Rejeitado! DIRE não reconhecido pela biblioteca.');
        }
        promptContinue();
    });
}

function handlePassport() {
    console.log('\n--- TESTE NA BIBLIOTECA: PASSAPORTE ---');
    rl.question('Digite o Passaporte: ', (input: string) => {
        const cleaned = input.trim();
        if (isValidPassport(cleaned)) {
            console.log(`\n✅ Aceite! Passaporte válido segundo a biblioteca.`);
        } else {
            console.log('\n❌ Rejeitado! Passaporte não reconhecido pela biblioteca.');
        }
        promptContinue();
    });
}

function handleDrivingLicense() {
    console.log('\n--- TESTE NA BIBLIOTECA: CARTA DE CONDUÇÃO ---');
    rl.question('Digite a Carta de Condução: ', (input: string) => {
        const cleaned = input.trim();
        if (isValidDrivingLicense(cleaned)) {
            console.log(`\n✅ Aceite! Carta de Condução válida segundo a biblioteca.`);
        } else {
            console.log('\n❌ Rejeitado! Carta de Condução não reconhecida pela biblioteca.');
        }
        promptContinue();
    });
}

// Iniciar
showMenu();

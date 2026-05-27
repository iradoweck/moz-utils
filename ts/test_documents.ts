import { isValidDIRE, isValidPassport, isValidDrivingLicense } from './src/index';

console.log('--- Testando DIRE ---');
// Válidos
console.log('00008312C (válido):', isValidDIRE('00008312C'));
console.log(' 00008312-c  (com espaços, hífen e minúscula - válido):', isValidDIRE(' 00008312-c  '));
// Inválidos
console.log('0000831C (dígitos insuficientes - inválido):', isValidDIRE('0000831C'));
console.log('000083123C (dígitos a mais - inválido):', isValidDIRE('000083123C'));
console.log('A0008312C (letra no início - inválido):', isValidDIRE('A0008312C'));

console.log('\n--- Testando Passaporte ---');
// Válidos
console.log('AO1234567 (válido):', isValidPassport('AO1234567'));
console.log('ao-1234567 (hífen e minúsculas - válido):', isValidPassport('ao-1234567'));
// Inválidos
console.log('A12345678 (uma letra e muitos dígitos - inválido):', isValidPassport('A12345678'));
console.log('AOO123456 (três letras - inválido):', isValidPassport('AOO123456'));
console.log('AO123456 (seis dígitos - inválido):', isValidPassport('AO123456'));

console.log('\n--- Testando Carta de Condução ---');
// Válidos
console.log('M12345 (1 letra, 5 dígitos - válido):', isValidDrivingLicense('M12345'));
console.log('M123456 (1 letra, 6 dígitos - válido):', isValidDrivingLicense('M123456'));
console.log('M1234567 (1 letra, 7 dígitos - válido):', isValidDrivingLicense('M1234567'));
console.log('m-123456 (hífen e minúscula - válido):', isValidDrivingLicense('m-123456'));
// Inválidos
console.log('123456 (sem letra - inválido):', isValidDrivingLicense('123456'));
console.log('M1234 (4 dígitos - inválido):', isValidDrivingLicense('M1234'));
console.log('M12345678 (8 dígitos - inválido):', isValidDrivingLicense('M12345678'));
console.log('MM123456 (duas letras - inválido):', isValidDrivingLicense('MM123456'));

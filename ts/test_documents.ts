import { isValidDIRE, isValidPassport, isValidDrivingLicense } from './src/index';

console.log('--- Testando DIRE ---');
// Válidos
console.log('00008312C (valid):', isValidDIRE('00008312C'));
console.log(' 00008312-c  (com espaços, hífen e minúscula - valid):', isValidDIRE(' 00008312-c  '));
// Invalids
console.log('0000831C (dígitos insuficientes - invalid):', isValidDIRE('0000831C'));
console.log('000083123C (dígitos a mais - invalid):', isValidDIRE('000083123C'));
console.log('A0008312C (letra no início - invalid):', isValidDIRE('A0008312C'));

console.log('\n--- Testando Passaporte ---');
// Válidos
console.log('AO1234567 (valid):', isValidPassport('AO1234567'));
console.log('ao-1234567 (hífen e minúsculas - valid):', isValidPassport('ao-1234567'));
// Invalids
console.log('A12345678 (uma letra e muitos dígitos - invalid):', isValidPassport('A12345678'));
console.log('AOO123456 (três letras - invalid):', isValidPassport('AOO123456'));
console.log('AO123456 (seis dígitos - invalid):', isValidPassport('AO123456'));

console.log('\n--- Testando Carta de Condução ---');
// Válidos
console.log('M12345 (1 letra, 5 dígitos - valid):', isValidDrivingLicense('M12345'));
console.log('M123456 (1 letra, 6 dígitos - valid):', isValidDrivingLicense('M123456'));
console.log('M1234567 (1 letra, 7 dígitos - valid):', isValidDrivingLicense('M1234567'));
console.log('m-123456 (hífen e minúscula - valid):', isValidDrivingLicense('m-123456'));
// Invalids
console.log('123456 (sem letra - invalid):', isValidDrivingLicense('123456'));
console.log('M1234 (4 dígitos - invalid):', isValidDrivingLicense('M1234'));
console.log('M12345678 (8 dígitos - invalid):', isValidDrivingLicense('M12345678'));
console.log('MM123456 (duas letras - invalid):', isValidDrivingLicense('MM123456'));

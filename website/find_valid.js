import { 
  isValidNUIT, isValidBI, isValidDIRE, isValidPassport, isValidDrivingLicense, 
  isValidPostalCode, isValidNewCEP, isValidMozambicanPhone
} from 'moz-utils'; 

// Find valid NUIT
let validNuit = '';
for(let i = 400000000; i < 400001000; i++) {
  if (isValidNUIT(i.toString())) {
    validNuit = i.toString();
    break;
  }
}

// New CEP
const testCeps = ['1100-01', '1100-02', '1100-00', '1100', '0909-09', '1100-123', '110000'];
let validNewCEP = testCeps.find(c => isValidNewCEP(c)) || 'none';

console.log({
  validNuit,
  validBI: isValidBI('110100000000B') ? '110100000000B' : '110100000000A',
  validDIRE: isValidDIRE('120345678A') ? '120345678A' : '01Z23456', 
  validPassport: isValidPassport('AO1234567') ? 'AO1234567' : 'AA123456',
  validLicense: isValidDrivingLicense('MP1234567') ? 'MP1234567' : '12345678',
  validPostal: isValidPostalCode('3100') ? '3100' : '1100',
  validNewCEP
});

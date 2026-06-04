const digits = [4, 0, 1, 6, 2, 6, 6, 3];
const target = 8;

// Try all combinations of weights from 2..9 or 1..9
let found = false;

// Common weight patterns:
const patterns = [
  [9,8,7,6,5,4,3,2], // Standard NIF
  [2,3,4,5,6,7,8,9], // Reverse NIF
  [3,2,7,6,5,4,3,2], // CNPJ style
  [1,2,3,4,5,6,7,8], 
  [8,7,6,5,4,3,2,1],
  [2,1,2,1,2,1,2,1], // Luhn ?
];

for (const w of patterns) {
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * w[i];
  }
  let rem11 = sum % 11;
  let exp11 = rem11 <= 1 ? 0 : 11 - rem11;
  
  let rem10 = sum % 10;
  let exp10 = rem10 === 0 ? 0 : 10 - rem10;
  
  if (exp11 === target) console.log("Match Mod 11:", w, "Sum:", sum, "Rem:", rem11);
  if (exp10 === target) console.log("Match Mod 10:", w, "Sum:", sum, "Rem:", rem10);
}

// Luhn Algorithm (Mod 10)
let sumLuhn = 0;
for (let i = 0; i < 8; i++) {
  let val = digits[7 - i];
  if (i % 2 === 0) {
    val *= 2;
    if (val > 9) val -= 9;
  }
  sumLuhn += val;
}
let luhnExp = (10 - (sumLuhn % 10)) % 10;
if (luhnExp === target) console.log("Match Luhn");
else console.log("Luhn expected:", luhnExp);

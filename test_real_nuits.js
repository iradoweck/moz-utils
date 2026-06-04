const nuits = [
  "401 629 564",
  "700 129 225",
  "300 080 367",
  "156490180",
  "300 225 721",
  "119 413 494",
  "402 107 741",
  "401 813 551",
  "401626638" // the first one
];

const weights = [8, 9, 4, 5, 6, 7, 8, 9];
const checkMap = "01234567891";

console.log("Testing new NUIT algorithm on real NUITs:");
console.log("---------------------------------------");

let allPassed = true;

for (let rawNuit of nuits) {
  const nuit = rawNuit.replace(/\s/g, '');
  const digits = nuit.substring(0, 8).split('').map(Number);
  const actualCheck = nuit[8];
  
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * weights[i];
  }
  const checkIdx = sum % 11;
  const expectedCheck = checkMap[checkIdx];
  
  const passed = actualCheck === expectedCheck;
  if (!passed) allPassed = false;
  
  console.log(`${nuit}: Expected=${expectedCheck}, Actual=${actualCheck} => ${passed ? 'PASS ✅' : 'FAIL ❌'} (Sum=${sum}, Mod11=${checkIdx})`);
}

console.log("---------------------------------------");
console.log(allPassed ? "ALL REAL NUITS PASSED!" : "SOME NUITS FAILED!");

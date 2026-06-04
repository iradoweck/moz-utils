const nuit = "401626638";
const digits = nuit.substring(0, 8).split('').map(Number);
const checkDigit = Number(nuit[8]);

// Test 1: Standard weights (9 to 2) left-to-right
{
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += digits[i] * (9 - i);
  let rem = sum % 11;
  let exp = rem <= 1 ? 0 : 11 - rem;
  console.log("Test 1 (9 to 2):", exp);
}

// Test 2: Standard weights (2 to 9) left-to-right
{
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += digits[i] * (2 + i);
  let rem = sum % 11;
  let exp = rem <= 1 ? 0 : 11 - rem;
  console.log("Test 2 (2 to 9):", exp);
}

// Test 3: Standard weights (2 to 9) right-to-left
{
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += digits[7 - i] * (2 + i);
  let rem = sum % 11;
  let exp = rem <= 1 ? 0 : 11 - rem;
  console.log("Test 3 (RtoL 2 to 9):", exp);
}

// Test 4: Another Modulo 11 (Portuguese NIF style) weights 9 to 2 left-to-right
// Wait, Portuguese NIF is 9 digits, weights 9 to 2 for the first 8 digits.
// That is exactly Test 1.

// What if remainder is used directly?
{
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += digits[i] * (9 - i);
  let rem = sum % 11;
  console.log("Test 4 (rem):", rem);
}

// Let's print the actual math:
console.log("Digits:", digits);

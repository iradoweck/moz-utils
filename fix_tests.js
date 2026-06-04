const fs = require('fs');
const path = require('path');

// 1. TypeScript
const tsFile = path.join(__dirname, 'ts/test-validation.js');
let tsContent = fs.readFileSync(tsFile, 'utf8');
tsContent = tsContent.replace(/function generateValidNUIT\(first8\) {[\s\S]*?return first8 \+ String\(checkDigit\);\n}/, 
`function generateValidNUIT(first8) {
  const weights = [8, 9, 4, 5, 6, 7, 8, 9];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(first8.charAt(i), 10) * weights[i];
  }
  const remainder = sum % 11;
  const checkMap = "01234567891";
  return first8 + checkMap.charAt(remainder);
}`);
fs.writeFileSync(tsFile, tsContent, 'utf8');

// 2. Python
const pyFile = path.join(__dirname, 'python/test_validation.py');
let pyContent = fs.readFileSync(pyFile, 'utf8');
pyContent = pyContent.replace(/def generate_valid_nuit\(first8: str\) -> str:[\s\S]*?return first8 \+ str\(check_digit\)/,
`def generate_valid_nuit(first8: str) -> str:
    weights = [8, 9, 4, 5, 6, 7, 8, 9]
    s = sum(int(first8[i]) * weights[i] for i in range(8))
    remainder = s % 11
    check_map = "01234567891"
    return first8 + check_map[remainder]`);
fs.writeFileSync(pyFile, pyContent, 'utf8');

// 3. PHP
const phpFile = path.join(__dirname, 'php/test-validation.php');
let phpContent = fs.readFileSync(phpFile, 'utf8');
phpContent = phpContent.replace(/function generateValidNUIT\(\$first8\) {[\s\S]*?return \$first8 \. \$checkDigit;\n}/,
`function generateValidNUIT($first8) {
    $weights = [8, 9, 4, 5, 6, 7, 8, 9];
    $sum = 0;
    for ($i = 0; $i < 8; $i++) {
        $sum += (int)$first8[$i] * $weights[$i];
    }
    $remainder = $sum % 11;
    $checkMap = "01234567891";
    return $first8 . $checkMap[$remainder];
}`);
fs.writeFileSync(phpFile, phpContent, 'utf8');

// 4. Dart
const dartFile = path.join(__dirname, 'dart/test/moz_utils_test.dart');
let dartContent = fs.readFileSync(dartFile, 'utf8');
dartContent = dartContent.replace(/String generateValidNUIT\(String first8\) {[\s\S]*?return first8 \+ checkDigit\.toString\(\);\n}/,
`String generateValidNUIT(String first8) {
  final weights = [8, 9, 4, 5, 6, 7, 8, 9];
  int sum = 0;
  for (int i = 0; i < 8; i++) {
    sum += int.parse(first8[i]) * weights[i];
  }
  final remainder = sum % 11;
  final checkMap = "01234567891";
  return first8 + checkMap[remainder];
}`);
fs.writeFileSync(dartFile, dartContent, 'utf8');

// 5. Kotlin
const ktFile = path.join(__dirname, 'kotlin/src/test/kotlin/com/edmilsonmuacigarro/mozutils/MozUtilsTest.kt');
let ktContent = fs.readFileSync(ktFile, 'utf8');
ktContent = ktContent.replace(/private fun generateValidNUIT\(first8: String\): String {[\s\S]*?return first8 \+ checkDigit\.toString\(\)\n    }/,
`private fun generateValidNUIT(first8: String): String {
        val weights = intArrayOf(8, 9, 4, 5, 6, 7, 8, 9)
        var sum = 0
        for (i in 0..7) {
            sum += first8[i].toString().toInt() * weights[i]
        }
        val remainder = sum % 11
        val checkMap = "01234567891"
        return first8 + checkMap[remainder]
    }`);
fs.writeFileSync(ktFile, ktContent, 'utf8');

console.log('Fixed all generateValidNUIT functions.');

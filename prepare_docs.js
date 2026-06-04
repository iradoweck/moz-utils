const fs = require('fs');
const path = require('path');

const updateReadme = (langPath, newContent) => {
  const fullPath = path.join(__dirname, langPath, 'README.md');
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Replace section 1 and everything up to section 2. We need to be careful.
    // It's safer to just replace from "### 1. " up to the next "### 2. " or "### 3. "
    // Actually, I can use a generic regex for the first section and inject section 1, 2, 3 and shift telephony to 4.
    content = content.replace(/### 1\. Documents and Citizen Identity[\s\S]*?### 2\. Financial Ecosystem and Telecommunications/, newContent);
    fs.writeFileSync(fullPath, content);
    console.log('Updated ' + langPath + ' README');
  }
};

const pythonDocs = `### 1. Identity & Documents

\`\`\`python
from moz_utils import (
    is_valid_bi,
    is_valid_nuit,
    get_nuit_entity_type,
    is_valid_dire,
    is_valid_passport,
    is_valid_driving_license
)

# National ID (12 digits + 1 letter)
is_valid_bi("110101234567A")  # True

# NUIT - Unique Tax Identification Number (Per AT Decree n. 28/2012)
is_valid_nuit("401626638")    # True
get_nuit_entity_type("400000006")  # "Pessoas Colectivas"
get_nuit_entity_type("100000008")  # "Pessoas Singulares"

# DIRE - Foreign Resident Identification Document
is_valid_dire("00008312C")    # True

# Passport and Driving License
is_valid_passport("AO1234567")       # True
is_valid_driving_license("M123456")   # True
\`\`\`

---

### 2. Name & String Sanitization

Clean up dirty user input from forms before saving to your database:

\`\`\`python
from moz_utils import (
    is_valid_name,
    sanitize_name,
    sanitize_document_field,
    sanitize_alphanumeric_field
)

is_valid_name("Edmilson O'Brian-Muacigarro") # True
is_valid_name("Edmilson 123")                # False

sanitize_name("  EDMILSON  muacigarro ")    # "Edmilson Muacigarro"
sanitize_name("João", all_caps=True)        # "JOÃO"

sanitize_document_field("123 456-789")       # "123456789"
sanitize_alphanumeric_field("110 101 a")     # "110101A"
\`\`\`

---

### 3. Financial Toolkit (Metical)

\`\`\`python
from moz_utils import format_mzn, parse_mzn

# Format database floats into official AT formats
format_mzn(1500)          # "1 500,00 MT"
format_mzn(50000, "MZN")  # "50 000,00 MZN"

# Parse dirty strings back into database floats
parse_mzn("1.500,00 MT")  # 1500.00
parse_mzn("1 500,00MZN")  # 1500.00
\`\`\`

---

### 4. Financial Ecosystem and Telecommunications`;

const phpDocs = `### 1. Identity & Documents

\`\`\`php
use Zedeck\\MozUtils\\MozUtils;

// National ID (12 digits + 1 letter)
MozUtils::isValidBI('110101234567A');  // true

// NUIT - Unique Tax Identification Number (Per AT Decree n. 28/2012)
MozUtils::isValidNUIT('401626638');    // true
MozUtils::getNUITEntityType('400000006');  // "Pessoas Colectivas"
MozUtils::getNUITEntityType('100000008');  // "Pessoas Singulares"

// DIRE - Foreign Resident Identification Document
MozUtils::isValidDIRE('00008312C');    // true

// Passport and Driving License
MozUtils::isValidPassport('AO1234567');       // true
MozUtils::isValidDrivingLicense('M123456');   // true
\`\`\`

---

### 2. Name & String Sanitization

Clean up dirty user input from forms before saving to your database:

\`\`\`php
use Zedeck\\MozUtils\\MozUtils;

MozUtils::isValidName("Edmilson O'Brian-Muacigarro"); // true
MozUtils::isValidName("Edmilson 123");                // false

MozUtils::sanitizeName("  EDMILSON  muacigarro ");    // "Edmilson Muacigarro"
MozUtils::sanitizeName("João", true);                 // "JOÃO"

MozUtils::sanitizeDocumentField("123 456-789");       // "123456789"
MozUtils::sanitizeAlphanumericField("110 101 a");     // "110101A"
\`\`\`

---

### 3. Financial Toolkit (Metical)

\`\`\`php
use Zedeck\\MozUtils\\MozUtils;

// Format database floats into official AT formats
MozUtils::formatMZN(1500);          // "1 500,00 MT"
MozUtils::formatMZN(50000, 'MZN');  // "50 000,00 MZN"

// Parse dirty strings back into database floats
MozUtils::parseMZN("1.500,00 MT");  // 1500.00
MozUtils::parseMZN("1 500,00MZN");  // 1500.00
\`\`\`

---

### 4. Financial Ecosystem and Telecommunications`;

const dartDocs = `### 1. Identity & Documents

\`\`\`dart
import 'package:moz_utils/moz_utils.dart';

// National ID (12 digits + 1 letter)
MozUtils.isValidBI('110101234567A');  // true

// NUIT - Unique Tax Identification Number (Per AT Decree n. 28/2012)
MozUtils.isValidNUIT('401626638');    // true
MozUtils.getNUITEntityType('400000006');  // "Pessoas Colectivas"
MozUtils.getNUITEntityType('100000008');  // "Pessoas Singulares"

// DIRE - Foreign Resident Identification Document
MozUtils.isValidDIRE('00008312C');    // true

// Passport and Driving License
MozUtils.isValidPassport('AO1234567');       // true
MozUtils.isValidDrivingLicense('M123456');   // true
\`\`\`

---

### 2. Name & String Sanitization

Clean up dirty user input from forms before saving to your database:

\`\`\`dart
import 'package:moz_utils/moz_utils.dart';

MozUtils.isValidName("Edmilson O'Brian-Muacigarro"); // true
MozUtils.isValidName("Edmilson 123");                // false

MozUtils.sanitizeName("  EDMILSON  muacigarro ");    // "Edmilson Muacigarro"
MozUtils.sanitizeName("João", allCaps: true);        // "JOÃO"

MozUtils.sanitizeDocumentField("123 456-789");       // "123456789"
MozUtils.sanitizeAlphanumericField("110 101 a");     // "110101A"
\`\`\`

---

### 3. Financial Toolkit (Metical)

\`\`\`dart
import 'package:moz_utils/moz_utils.dart';

// Format database floats into official AT formats
MozUtils.formatMZN(1500);          // "1 500,00 MT"
MozUtils.formatMZN(50000, 'MZN');  // "50 000,00 MZN"

// Parse dirty strings back into database floats
MozUtils.parseMZN("1.500,00 MT");  // 1500.00
MozUtils.parseMZN("1 500,00MZN");  // 1500.00
\`\`\`

---

### 4. Financial Ecosystem and Telecommunications`;

const kotlinDocs = `### 1. Identity & Documents

\`\`\`kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

// National ID (12 digits + 1 letter)
MozUtils.isValidBI("110101234567A")  // true

// NUIT - Unique Tax Identification Number (Per AT Decree n. 28/2012)
MozUtils.isValidNUIT("401626638")    // true
MozUtils.getNUITEntityType("400000006")  // "Pessoas Colectivas"
MozUtils.getNUITEntityType("100000008")  // "Pessoas Singulares"

// DIRE - Foreign Resident Identification Document
MozUtils.isValidDIRE("00008312C")    // true

// Passport and Driving License
MozUtils.isValidPassport("AO1234567")       // true
MozUtils.isValidDrivingLicense("M123456")   // true
\`\`\`

---

### 2. Name & String Sanitization

Clean up dirty user input from forms before saving to your database:

\`\`\`kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

MozUtils.isValidName("Edmilson O'Brian-Muacigarro") // true
MozUtils.isValidName("Edmilson 123")                // false

MozUtils.sanitizeName("  EDMILSON  muacigarro ")    // "Edmilson Muacigarro"
MozUtils.sanitizeName("João", allCaps = true)       // "JOÃO"

MozUtils.sanitizeDocumentField("123 456-789")       // "123456789"
MozUtils.sanitizeAlphanumericField("110 101 a")     // "110101A"
\`\`\`

---

### 3. Financial Toolkit (Metical)

\`\`\`kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

// Format database floats into official AT formats
MozUtils.formatMZN(1500.0)          // "1 500,00 MT"
MozUtils.formatMZN(50000.0, "MZN")  // "50 000,00 MZN"

// Parse dirty strings back into database floats
MozUtils.parseMZN("1.500,00 MT")  // 1500.0
MozUtils.parseMZN("1 500,00MZN")  // 1500.0
\`\`\`

---

### 4. Financial Ecosystem and Telecommunications`;


updateReadme('python', pythonDocs);
updateReadme('php', phpDocs);
updateReadme('dart', dartDocs);
updateReadme('kotlin', kotlinDocs);


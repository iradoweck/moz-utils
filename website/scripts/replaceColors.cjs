const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const replacements = [
  { rx: /'rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.[2345]\s*\)'/g, to: "'var(--overlay-3)'" },
  { rx: /"rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.[2345]\s*\)"/g, to: '"var(--overlay-3)"' },
  { rx: /'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.0[235]\s*\)'/g, to: "'var(--overlay-1)'" },
  { rx: /'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.0[68]\s*\)'/g, to: "'var(--overlay-hover)'" },
  { rx: /'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.1\s*\)'/g, to: "'var(--overlay-2)'" },
  
  { rx: /'rgba\(\s*0\s*,\s*255\s*,\s*(136|170)\s*,\s*0\.(05|1|15)\s*\)'/g, to: "'var(--success-bg)'" },
  { rx: /'rgba\(\s*255\s*,\s*51\s*,\s*102\s*,\s*0\.(15|2)\s*\)'/g, to: "'var(--error-bg)'" },
  { rx: /'rgba\(\s*255\s*,\s*215\s*,\s*0\s*,\s*0\.2\s*\)'/g, to: "'var(--warning-bg)'" },
  { rx: /'#ff3366'/g, to: "'var(--error-text)'" },
  { rx: /'rgba\(\s*10\s*,\s*10\s*,\s*10\s*,\s*0\.[89]\s*\)'/g, to: "'var(--nav-bg)'" },
  { rx: /'white'/g, to: "'var(--text-primary)'" },
  { rx: /'#fff'/g, to: "'var(--text-primary)'" },
  { rx: /'#e2e8f0'/g, to: "'var(--text-primary)'" }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const rep of replacements) {
        if (content.match(rep.rx)) {
          content = content.replace(rep.rx, rep.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + f);
      }
    }
  }
}

processDir(srcDir);

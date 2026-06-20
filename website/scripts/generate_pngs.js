import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log("Starting PNG generation...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const files = [
    { name: 'logo.svg' },
    { name: 'logo-full-dark.svg' },
    { name: 'logo-full-light.svg' }
  ];
  
  // Ensure directory exists
  if (!fs.existsSync('./public/logos')) {
    fs.mkdirSync('./public/logos');
  }

  for (const file of files) {
    const svgContent = fs.readFileSync(path.resolve('./public/', file.name), 'utf-8');
    
    // Write copy to /public/logos/ for the user to download easily
    fs.writeFileSync(path.resolve('./public/logos/', file.name), svgContent);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><style>body { margin: 0; background: transparent; }</style></head>
      <body>${svgContent}</body>
      </html>
    `;
    await page.setContent(html);
    const element = await page.$('svg');
    if (element) {
      await element.screenshot({ 
        path: path.resolve('./public/logos/', file.name.replace('.svg', '.png')), 
        omitBackground: true 
      });
      console.log(`Generated ${file.name.replace('.svg', '.png')}`);
    }
  }
  
  await browser.close();
  console.log("Done.");
})();

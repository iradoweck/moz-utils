import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), '../public/docs');

const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(DOCS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to find sequences of ### Language \n ```lang ... ``` 
  // We want to group them together.
  
  // Actually, since there are only a few files, we can just replace them manually or write a robust parser.
  // The structure is:
  // ### TypeScript
  // ```ts...```
  // ### Python
  // ```python...```
  // ...
  
  // We'll look for blocks that start with "### TypeScript" and end after the last kotlin code block.
  // Wait, some might only have TS and Python.
  
  // Let's use a regex that matches ### Language \n ```...```
  const blockRegex = /###\s+([A-Za-z0-9_]+(?:\s*\/\s*[A-Za-z0-9_.]+)?)\r?\n```([a-z]+)\r?\n([\s\S]*?)\r?\n```/g;
  
  let match;
  let newContent = content;
  
  // We need to group contiguous matches.
  const blocks = [];
  while ((match = blockRegex.exec(content)) !== null) {
      blocks.push({
          full: match[0],
          title: match[1],
          lang: match[2],
          code: match[3],
          index: match.index,
          length: match[0].length
      });
  }
  
  if (blocks.length === 0) continue;
  
  // Group contiguous blocks
  const groups = [];
  let currentGroup = [blocks[0]];
  for (let i = 1; i < blocks.length; i++) {
      const prev = blocks[i - 1];
      const curr = blocks[i];
      // Check if they are separated only by whitespace/newlines
      const between = content.substring(prev.index + prev.length, curr.index);
      if (between.trim() === '') {
          currentGroup.push(curr);
      } else {
          groups.push(currentGroup);
          currentGroup = [curr];
      }
  }
  groups.push(currentGroup);
  
  // Replace each group in the content
  // We must do this from end to start to not mess up indices
  for (let i = groups.length - 1; i >= 0; i--) {
      const group = groups[i];
      if (group.length < 2) continue; // Only group if 2 or more languages
      
      const labels = group.map(g => g.title).join(',');
      
      let html = `<div className="code-tabs" data-labels="${labels}">\n\n`;
      for (const item of group) {
          html += `\`\`\`${item.lang}\n${item.code}\n\`\`\`\n\n`;
      }
      html += `</div>`;
      
      const startIndex = group[0].index;
      const endIndex = group[group.length - 1].index + group[group.length - 1].length;
      
      newContent = newContent.substring(0, startIndex) + html + newContent.substring(endIndex);
  }
  
  fs.writeFileSync(filePath, newContent);
  console.log(`Refactored tabs in ${file}`);
}

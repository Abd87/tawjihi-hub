const fs = require('fs');
const files = [
  'frontend/app/[locale]/blog/[slug]/page.tsx',
  'frontend/app/[locale]/blog/page.tsx',
  'frontend/app/[locale]/btec-guide/[specialty]/page.tsx',
  'frontend/app/[locale]/calculator/page.tsx',
  'frontend/app/[locale]/dashboard/mistakes/page.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\s*<Navbar[^>]*\/>/g, '');
    content = content.replace(/import Navbar from '.*?';\r?\n/g, '');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  } else {
    console.log('File not found', file);
  }
}

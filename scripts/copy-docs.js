import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');

try {
  if (fs.existsSync(distDir)) {
    // 1. Create .nojekyll in dist to prevent GitHub Pages from ignoring files
    fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

    // 2. Duplicate index.html to 404.html to support SPA routing on GitHub Pages
    const indexHtml = path.join(distDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
      fs.copyFileSync(indexHtml, path.join(distDir, '404.html'));
    }

    // 3. Sync to docs directory
    if (fs.existsSync(docsDir)) {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
    fs.cpSync(distDir, docsDir, { recursive: true });
    console.log('✓ Successfully synced build to docs/ directory for GitHub Pages');
    console.log('✓ Created .nojekyll and 404.html for seamless GitHub Pages routing');
  }
} catch (error) {
  console.error('Error copying dist to docs:', error);
}

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Convenience preview from the production build, with no external asset requests.
// Deploy dist/ for production; this file is for reviewing locally by double-clicking.
const root = fileURLToPath(new URL('../', import.meta.url));
let html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const script = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/);
const style = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
if (!script || !style) throw new Error('Build assets not found. Run npm run build first.');

const javascript = await readFile(path.join(root, 'dist', script[1]), 'utf8');
const stylesheet = await readFile(path.join(root, 'dist', style[1]), 'utf8');
html = html.replace(
  script[0],
  () => `<script type="module">${javascript.replace(/<\/script/gi, '<\\/script')}</script>`,
);
html = html.replace(style[0], () => `<style>${stylesheet}</style>`);
html = html.replace(/<link[^>]*rel="icon"[^>]*>/, '');
await writeFile(path.join(root, 'preview.html'), html);
console.log('Preview generated: preview.html');

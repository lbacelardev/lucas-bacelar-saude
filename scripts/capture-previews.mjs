import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { createServer } from 'vite';

// A temporary local server keeps capture independent of any running preview.
const server = await createServer({ server: { host: '127.0.0.1', port: 4187, strictPort: true } });
await server.listen();
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route('**/*', (route) => {
    const { hostname } = new URL(route.request().url());
    return ['127.0.0.1', 'localhost'].includes(hostname) ? route.continue() : route.abort();
  });
  await mkdir('docs/images', { recursive: true });
  for (const [name, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4187');
    await page.getByRole('heading', { level: 1 }).waitFor();
    await page.evaluate(() => globalThis.document.fonts.ready);
    await page.screenshot({ path: `docs/images/${name}-top.png` });
    await page.screenshot({ path: `docs/images/${name}.png`, fullPage: true });
  }
} finally {
  await browser?.close();
  await server.close();
}

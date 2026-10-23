// Requires Playwright. Optional environment variables:
// PLAYWRIGHT_MODULE: absolute module path; CHROMIUM_EXECUTABLE: installed browser.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

(async () => {
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'assets', 'social');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    for (const lang of ['en', 'it']) {
      const url = pathToFileURL(path.join(__dirname, 'social-preview.html'));
      url.searchParams.set('lang', lang);
      await page.goto(url.href);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => image.decode()));
      });
      await page.screenshot({ path: path.join(out, `movelory-${lang}.png`) });
      console.log(`Rendered assets/social/movelory-${lang}.png (1200 × 630)`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

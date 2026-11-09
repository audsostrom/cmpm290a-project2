/**
 * Hi-fi mocks for the report: A and B, Home tray and Stories viewer, at 3x iPhone resolution.
 * Usage: pnpm mocks   (writes mocks/*.png)
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { createServer } from 'vite';

const OUT = 'mocks';
const PORT = 5199;

await mkdir(OUT, { recursive: true });
const server = await createServer({ server: { port: PORT, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 480, height: 920 }, deviceScaleFactor: 3 });
  const phone = page.getByTestId('phone');
  for (const variant of ['A', 'B'] as const) {
    // paused=1: no auto-advance, so the viewer frame is stable.
    await page.goto(`http://localhost:${PORT}/?variant=${variant}&clean=1&paused=1`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400); // let badge pop-in finish
    await phone.screenshot({ path: `${OUT}/${variant}-home.png` });

    // The 4th account with unseen stories, so B reads "4 of 11" (the plan's example).
    await page.getByTestId('tray-kofi.k').click();
    await page.waitForTimeout(400);
    await phone.screenshot({ path: `${OUT}/${variant}-viewer.png` });
  }

  // The full prototype with the experiment console, for the report's method section.
  const wide = await browser.newPage({ viewport: { width: 900, height: 920 }, deviceScaleFactor: 2 });
  await wide.goto(`http://localhost:${PORT}/?variant=B&paused=1`);
  await wide.evaluate(() => document.fonts.ready);
  await wide.getByTestId('tray-jules.rivera').click();
  await wide.waitForTimeout(300);
  await wide.keyboard.press('Shift+ArrowRight');
  await wide.keyboard.press('Escape');
  await wide.waitForTimeout(300);
  await wide.screenshot({ path: `${OUT}/B-with-console.png` });
  console.log(`Wrote ${OUT}/A-home.png, A-viewer.png, B-home.png, B-viewer.png, B-with-console.png`);
} finally {
  await browser.close();
  await server.close();
}

import puppeteer from 'puppeteer';
import type { JSHandle, Page } from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';

// Parse
function describe(jsHandle: JSHandle<unknown>) {
  return jsHandle.evaluate((obj) => {
    // serialize |obj| however you want
    return JSON.stringify(obj);
  }, jsHandle);
}

export default async <TReturn>(run: (page: Page) => Promise<TReturn>) => {
  let browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  page.on('console', async (msg) => {
    const args = await Promise.all(msg.args().map((arg) => describe(arg)));
    console.log('Logs from Headless Chrome', ...args);
  });
  await page.evaluate(
    await fs.readFile(
      path.join(import.meta.dirname, 'bundled/Tween.js'),
      'utf8'
    )
  );

  try {
    return run(page);
  } finally {
    await page.close();
    await browser.close();
  }
};

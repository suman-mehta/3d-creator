const puppeteer = require('puppeteer-core');

async function inspectDialogElements() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const dialogHtml = await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    return dialog ? dialog.innerHTML : 'No dialog found';
  });

  console.log('Dialog innerHTML snippet (first 1500 chars):\n', dialogHtml.substring(0, 1500));
  browser.disconnect();
}

inspectDialogElements().catch(console.error);

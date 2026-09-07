const puppeteer = require('puppeteer-core');

async function inspectDialogButtons() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const buttons = await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll('button, a, input')).map(b => ({
      tag: b.tagName,
      text: b.innerText?.trim(),
      aria: b.getAttribute('aria-label'),
      type: b.getAttribute('type')
    }));
  });

  console.log('Dialog controls:', JSON.stringify(buttons, null, 2));
  browser.disconnect();
}

inspectDialogButtons().catch(console.error);

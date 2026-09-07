const puppeteer = require('puppeteer-core');

async function inspectAddProfileModal() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Clicking "Core" accordion in Add to profile modal...');
  await page.evaluate(() => {
    const coreHeader = Array.from(document.querySelectorAll('dialog *')).find(el => el.innerText?.trim() === 'Core');
    if (coreHeader) {
      coreHeader.click();
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/add_profile_core.png' });

  // List all clickable items in the dialog
  const items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('dialog a, dialog button, dialog li')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      aria: el.getAttribute('aria-label'),
      href: el.getAttribute('href')
    })).filter(x => x.text);
  });

  console.log('Dialog items:', JSON.stringify(items, null, 2));

  browser.disconnect();
}

inspectAddProfileModal().catch(console.error);

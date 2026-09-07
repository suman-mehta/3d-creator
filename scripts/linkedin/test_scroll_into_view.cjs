const puppeteer = require('puppeteer-core');

async function testScrollIntoView() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  await page.evaluate(() => {
    const headlineEl = document.querySelector('div[contenteditable="true"]');
    if (headlineEl) {
      headlineEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/headline_scrolled_into_view.png' });

  // Also look for Custom Link / Website fields
  const allLabels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label, h3, h4, legend, span')).map(e => e.innerText?.trim()).filter(t => t && t.length < 50);
  });

  console.log('Labels on page:', allLabels.filter(t => t.toLowerCase().includes('link') || t.toLowerCase().includes('website') || t.toLowerCase().includes('custom') || t.toLowerCase().includes('contact')));

  browser.disconnect();
}

testScrollIntoView().catch(console.error);

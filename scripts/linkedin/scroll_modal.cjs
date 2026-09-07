const puppeteer = require('puppeteer-core');

async function scrollModalAndInspect() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  await page.evaluate(() => {
    const scrollEl = document.querySelector('div._5bf80336') || document.querySelector('div[class*="a9bea307"]');
    if (scrollEl) {
      scrollEl.scrollTop = 300;
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/modal_scrolled_300.png' });

  // Check what is visible now
  const elements = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('input, textarea, div[contenteditable="true"]').forEach(el => {
      const rect = el.getBoundingClientRect();
      list.push({
        tag: el.tagName,
        id: el.id,
        value: el.value || el.innerText,
        y: Math.round(rect.y),
        h: Math.round(rect.height)
      });
    });
    return list;
  });

  console.log('Visible inputs after scroll 300:', JSON.stringify(elements, null, 2));

  await browser.disconnect();
}

scrollModalAndInspect().catch(console.error);

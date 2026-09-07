const puppeteer = require('puppeteer-core');

async function findModalScrollContainer() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const info = await page.evaluate(() => {
    const headline = document.querySelector('div[contenteditable="true"]');
    if (!headline) return null;

    let curr = headline;
    const parents = [];
    while (curr && curr !== document.body) {
      const style = window.getComputedStyle(curr);
      parents.push({
        tag: curr.tagName,
        className: curr.className,
        id: curr.id,
        overflowY: style.overflowY,
        scrollHeight: curr.scrollHeight,
        clientHeight: curr.clientHeight
      });
      curr = curr.parentElement;
    }
    return parents;
  });

  console.log('Parents of headline:', JSON.stringify(info, null, 2));
  browser.disconnect();
}

findModalScrollContainer().catch(console.error);

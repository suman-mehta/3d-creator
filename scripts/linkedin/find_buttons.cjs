const puppeteer = require('puppeteer-core');

async function findAllTopButtons() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com/in/')) || pages[0];

  const buttons = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('button, a[role="button"]').forEach((b, idx) => {
      list.push({
        idx,
        tag: b.tagName,
        ariaLabel: b.getAttribute('aria-label'),
        title: b.getAttribute('title'),
        text: b.innerText?.trim() || '',
        className: b.className,
        rect: {
          x: Math.round(b.getBoundingClientRect().x),
          y: Math.round(b.getBoundingClientRect().y),
          w: Math.round(b.getBoundingClientRect().width),
          h: Math.round(b.getBoundingClientRect().height)
        }
      });
    });
    return list.filter(b => b.rect.y < 600 && b.rect.w > 0);
  });

  console.log('Top buttons within y < 600:', JSON.stringify(buttons, null, 2));
  browser.disconnect();
}

findAllTopButtons().catch(console.error);

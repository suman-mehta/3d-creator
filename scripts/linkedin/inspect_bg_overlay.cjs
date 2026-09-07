const puppeteer = require('puppeteer-core');

async function inspectOverlayElements() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a, input, div[role="button"]')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      aria: el.getAttribute('aria-label'),
      className: el.className,
      rect: { x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }
    })).filter(x => x.text || x.aria || x.rect.h > 0);
  });

  console.log('Overlay elements:', JSON.stringify(elements.filter(e => e.rect.y > 50 && e.rect.y < 700), null, 2));
  browser.disconnect();
}

inspectOverlayElements().catch(console.error);

const puppeteer = require('puppeteer-core');

async function dumpAllInputsAndTextareas() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const elements = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('input, textarea').forEach(el => {
      list.push({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        value: el.value,
        placeholder: el.placeholder,
        ariaLabel: el.getAttribute('aria-label'),
        rect: {
          x: Math.round(el.getBoundingClientRect().x),
          y: Math.round(el.getBoundingClientRect().y),
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height)
        }
      });
    });
    return list;
  });

  console.log('All inputs and textareas on page:', JSON.stringify(elements, null, 2));

  // Also check which element has overflow-y scroll or auto
  const scrollables = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
        res.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight
        });
      }
    });
    return res;
  });

  console.log('Scrollable elements:', JSON.stringify(scrollables, null, 2));

  browser.disconnect();
}

dumpAllInputsAndTextareas().catch(console.error);

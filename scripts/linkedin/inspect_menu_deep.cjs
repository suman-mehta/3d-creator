const puppeteer = require('puppeteer-core');

async function inspectMenuElements() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*')).filter(el => {
      const text = el.innerText?.trim();
      return text === 'Edit cover image';
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      id: el.id,
      parentTag: el.parentElement?.tagName,
      parentClass: el.parentElement?.className,
      rect: el.getBoundingClientRect()
    }));
  });

  console.log('Edit cover image elements found:', JSON.stringify(items, null, 2));

  // Also check if any button or link is parent
  const clicked = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.innerText?.trim() === 'Edit cover image');
    if (el) {
      const btn = el.closest('button, a, div[role="button"], div[role="menuitem"], li');
      if (btn) {
        btn.click();
        return { clickedParent: btn.tagName, className: btn.className };
      }
      el.click();
      return { clickedDirect: el.tagName };
    }
    return { clicked: false };
  });

  console.log('Click execution result:', clicked);
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'scripts/linkedin/after_deep_menu_click.png' });

  browser.disconnect();
}

inspectMenuElements().catch(console.error);

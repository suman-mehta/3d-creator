const puppeteer = require('puppeteer-core');

async function clickPlusInFeatured() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Finding and clicking the + button in Featured card...');
  const clicked = await page.evaluate(() => {
    // Look for button or link with svg containing plus or near "Featured"
    const plusBtn = document.querySelector('button[aria-label*="Add" i], button[aria-label*="Create" i]') ||
                    Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('plus') || b.getAttribute('aria-label')?.toLowerCase().includes('featured'));
    
    if (plusBtn) {
      plusBtn.click();
      return { found: true, text: plusBtn.innerText, aria: plusBtn.getAttribute('aria-label') };
    }

    // Fallback: check elements near (700, 260)
    const svgs = Array.from(document.querySelectorAll('svg')).filter(s => s.getAttribute('data-test-icon') === 'add-medium' || s.getAttribute('data-test-icon') === 'plus-medium');
    if (svgs.length > 0) {
      const parent = svgs[0].closest('button, a');
      if (parent) {
        parent.click();
        return { found: true, fromSvg: true, aria: parent.getAttribute('aria-label') };
      }
    }

    // Try finding by coordinates of the + button on top right of the Featured card
    // On the screenshot, the + is near x=700, y=260
    const el = document.elementFromPoint(700, 260);
    const btn = el ? el.closest('button, a') : null;
    if (btn) {
      btn.click();
      return { found: true, fromPoint: true, aria: btn.getAttribute('aria-label') };
    }

    return { found: false };
  });

  console.log('Click result:', clicked);
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'scripts/linkedin/featured_plus_clicked.png' });
  console.log('Screenshot saved to scripts/linkedin/featured_plus_clicked.png');

  // Check what dropdown items appeared
  const menuItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div[role="menu"] *, ul[role="menu"] *, .artdeco-dropdown__content *')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      aria: el.getAttribute('aria-label'),
      href: el.getAttribute('href')
    })).filter(x => x.text && x.text.length < 40);
  });

  console.log('Featured dropdown menu items:', JSON.stringify(menuItems, null, 2));

  browser.disconnect();
}

clickPlusInFeatured().catch(console.error);

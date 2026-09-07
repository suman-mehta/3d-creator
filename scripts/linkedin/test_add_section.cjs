const puppeteer = require('puppeteer-core');

async function testAddSection() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Clicking "Add section" button...');
  const clicked = await page.evaluate(() => {
    const addSectionBtn = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText?.trim() === 'Add section');
    if (addSectionBtn) {
      addSectionBtn.click();
      return true;
    }
    return false;
  });
  console.log('Add section clicked:', clicked);

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'scripts/linkedin/add_section_menu.png' });

  // List menu options
  const menuItems = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('div[role="menu"] *, div[role="dialog"] *, ul[role="menu"] *, .artdeco-dropdown__content *').forEach(el => {
      const text = el.innerText?.trim();
      const aria = el.getAttribute('aria-label');
      if (text && text.length < 50) items.push(text);
      if (aria && aria.length < 50) items.push(aria);
    });
    return Array.from(new Set(items));
  });

  console.log('Add section menu items:', JSON.stringify(menuItems, null, 2));

  browser.disconnect();
}

testAddSection().catch(console.error);

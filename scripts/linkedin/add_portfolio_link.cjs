const puppeteer = require('puppeteer-core');

async function addFeaturedLink() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Clicking "Add a link" item in Featured menu...');
  const clicked = await page.evaluate(() => {
    const linkItem = Array.from(document.querySelectorAll('div[role="menu"] *, ul[role="menu"] *, a')).find(el => el.innerText?.trim() === 'Add a link');
    if (linkItem) {
      linkItem.click();
      return true;
    }
    return false;
  });
  console.log('Add a link clicked:', clicked);

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'scripts/linkedin/add_link_dialog.png' });
  console.log('Screenshot saved to scripts/linkedin/add_link_dialog.png');

  // Inspect form fields in the dialog
  const fields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('dialog input, dialog textarea, dialog div[contenteditable="true"], dialog button')).map(el => ({
      tag: el.tagName,
      id: el.id,
      type: el.type,
      placeholder: el.placeholder,
      value: el.value || el.innerText,
      aria: el.getAttribute('aria-label'),
      text: el.innerText?.trim()
    }));
  });

  console.log('Add link dialog fields:', JSON.stringify(fields, null, 2));

  browser.disconnect();
}

addFeaturedLink().catch(console.error);

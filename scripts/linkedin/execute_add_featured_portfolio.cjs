const puppeteer = require('puppeteer-core');

async function addPortfolioToFeatured() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Typing https://sumanmehta.in/ into link input...');
  await page.evaluate(() => {
    const input = document.querySelector('dialog input');
    if (input) {
      input.focus();
    }
  });

  await page.keyboard.type('https://sumanmehta.in/', { delay: 25 });
  await new Promise(r => setTimeout(r, 500));

  console.log('Clicking "Add" button...');
  await page.evaluate(() => {
    const addBtn = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText?.trim() === 'Add');
    if (addBtn) addBtn.click();
  });

  console.log('Waiting for LinkedIn to fetch OpenGraph metadata from https://sumanmehta.in/ ...');
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'scripts/linkedin/portfolio_link_preview.png' });
  console.log('Screenshot saved to scripts/linkedin/portfolio_link_preview.png');

  // Inspect the preview fields
  const previewFields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('dialog input, dialog textarea, dialog div[contenteditable="true"], dialog button')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      value: el.value,
      aria: el.getAttribute('aria-label')
    })).filter(x => x.text || x.value || x.aria);
  });
  console.log('Preview fields:', JSON.stringify(previewFields, null, 2));

  // Click Save
  console.log('Clicking "Save" button in link modal...');
  const saved = await page.evaluate(() => {
    const saveBtn = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText?.trim() === 'Save' && !b.disabled);
    if (saveBtn) {
      saveBtn.click();
      return true;
    }
    return false;
  });
  console.log('Save clicked:', saved);

  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'scripts/linkedin/portfolio_link_saved.png' });
  console.log('Saved screenshot to scripts/linkedin/portfolio_link_saved.png');

  browser.disconnect();
}

addPortfolioToFeatured().catch(console.error);

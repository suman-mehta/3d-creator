const puppeteer = require('puppeteer-core');

async function addGitHubToFeatured() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Clicking the + button in Featured section...');
  await page.evaluate(() => {
    // Find the + button at the top right of Featured
    const btns = Array.from(document.querySelectorAll('button'));
    const plusBtn = btns.find(b => b.getAttribute('aria-label')?.toLowerCase().includes('featured') || b.innerHTML.includes('plus-medium') || b.innerHTML.includes('add-medium'));
    if (plusBtn) plusBtn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  console.log('Clicking "Add a link" in menu...');
  await page.evaluate(() => {
    const linkItem = Array.from(document.querySelectorAll('a, div, p')).find(el => el.innerText?.trim() === 'Add a link');
    if (linkItem) linkItem.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log('Focusing link input and typing GitHub URL...');
  await page.evaluate(() => {
    const input = document.querySelector('dialog input');
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  await page.keyboard.type('https://github.com/suman-mehta/3d-creator', { delay: 15 });
  await new Promise(r => setTimeout(r, 300));

  console.log('Pressing Enter key...');
  await page.keyboard.press('Enter');

  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'scripts/linkedin/github_preview_ingested.png' });

  // Check state of dialog
  const dialogState = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('dialog input, dialog textarea, dialog button')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      value: el.value,
      aria: el.getAttribute('aria-label'),
      disabled: el.disabled
    })).filter(x => x.text || x.value || x.aria);
  });
  console.log('Dialog state for GitHub:', JSON.stringify(dialogState, null, 2));

  console.log('Clicking Save button...');
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
  await page.screenshot({ path: 'scripts/linkedin/featured_all_saved.png' });
  console.log('Saved screenshot to scripts/linkedin/featured_all_saved.png');

  browser.disconnect();
}

addGitHubToFeatured().catch(console.error);

const puppeteer = require('puppeteer-core');

async function testPressEnterOnLink() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Focusing input...');
  await page.evaluate(() => {
    const input = document.querySelector('dialog input');
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  await page.keyboard.type('https://sumanmehta.in/', { delay: 10 });
  await new Promise(r => setTimeout(r, 200));

  console.log('Pressing Enter key...');
  await page.keyboard.press('Enter');

  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'scripts/linkedin/after_press_enter.png' });
  console.log('Screenshot saved to scripts/linkedin/after_press_enter.png');

  // Check inputs and buttons in dialog
  const dialogState = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('dialog input, dialog textarea, dialog div[contenteditable="true"], dialog button')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      value: el.value,
      placeholder: el.placeholder,
      aria: el.getAttribute('aria-label'),
      disabled: el.disabled
    })).filter(x => x.text || x.value || x.aria);
  });

  console.log('Dialog state after Enter:', JSON.stringify(dialogState, null, 2));

  // If Save button is enabled, click it!
  const saveResult = await page.evaluate(() => {
    const saveBtn = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText?.trim() === 'Save' && !b.disabled);
    if (saveBtn) {
      saveBtn.click();
      return { clicked: true };
    }
    return { clicked: false };
  });

  console.log('Save button result:', saveResult);
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'scripts/linkedin/after_save_portfolio.png' });

  browser.disconnect();
}

testPressEnterOnLink().catch(console.error);

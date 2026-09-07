const puppeteer = require('puppeteer-core');

async function updateIntro() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Checking dialog state...');
  const isDialogOpen = await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    return dialog && dialog.open;
  });

  if (!isDialogOpen) {
    console.log('Navigating to edit intro: https://www.linkedin.com/in/suman-mehta-in/edit/intro/ ...');
    await page.goto('https://www.linkedin.com/in/suman-mehta-in/edit/intro/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
  }

  // 1. Update Last Name to "Mehta"
  console.log('Updating Last Name to "Mehta"...');
  await page.evaluate(() => {
    const lastNameInput = document.querySelector('input[value="mehta"]') || 
                          Array.from(document.querySelectorAll('dialog input')).find(i => i.value.toLowerCase() === 'mehta');
    if (lastNameInput) {
      lastNameInput.scrollIntoView({ behavior: 'instant', block: 'center' });
      lastNameInput.focus();
    }
  });

  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.type('Mehta', { delay: 50 });
  await new Promise(r => setTimeout(r, 500));

  // 2. Update Headline
  console.log('Updating Headline...');
  await page.evaluate(() => {
    const headlineDiv = document.querySelector('div.tiptap.ProseMirror');
    if (headlineDiv) {
      headlineDiv.scrollIntoView({ behavior: 'instant', block: 'center' });
      headlineDiv.focus();
    }
  });
  await new Promise(r => setTimeout(r, 300));

  // Select all inside headline and replace
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 300));

  const newHeadline = '3D Creator & Creative Technologist | WebGL, Three.js & Motion Design | Founder at https://sumanmehta.in/';
  console.log('Typing new headline:', newHeadline);
  await page.keyboard.type(newHeadline, { delay: 25 });
  await new Promise(r => setTimeout(r, 800));

  // Take screenshot before saving
  await page.screenshot({ path: 'scripts/linkedin/intro_before_save.png' });
  console.log('Screenshot saved to scripts/linkedin/intro_before_save.png');

  // Click Save button
  console.log('Clicking Save button...');
  const saveClicked = await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    if (!dialog) return false;
    const saveBtn = Array.from(dialog.querySelectorAll('button')).find(b => b.innerText?.trim() === 'Save');
    if (saveBtn) {
      saveBtn.click();
      return true;
    }
    return false;
  });
  console.log('Save button clicked:', saveClicked);

  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'scripts/linkedin/intro_after_save.png' });
  console.log('Screenshot saved to scripts/linkedin/intro_after_save.png');

  browser.disconnect();
}

updateIntro().catch(console.error);

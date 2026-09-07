const puppeteer = require('puppeteer-core');
const path = require('path');

async function openEditCoverAndUpload() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to profile: https://www.linkedin.com/in/suman-mehta-in/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // 1. Click pencil button on banner: aria-label="Edit background image"
  console.log('Clicking "Edit background image"...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label*="background" i]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 2. Click "Edit cover image" menu item
  console.log('Clicking "Edit cover image" menu item...');
  const clickedMenu = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('div, button, a, p, span, li'));
    const target = items.find(el => el.innerText?.trim() === 'Edit cover image');
    if (target) {
      target.click();
      return true;
    }
    return false;
  });
  console.log('Menu item clicked:', clickedMenu);

  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'scripts/linkedin/cover_photo_editor_opened.png' });
  console.log('Saved screenshot to scripts/linkedin/cover_photo_editor_opened.png');

  // Check if file input or change photo button appeared
  const fileInput = await page.$('input[type="file"]');
  console.log('File input found:', !!fileInput);

  if (fileInput) {
    const bannerFile = path.resolve('public/linkedin-banner-1584x396.png');
    console.log('Uploading banner file:', bannerFile);
    await fileInput.uploadFile(bannerFile);
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/linkedin/cover_uploaded_stage.png' });

    // Click Apply
    console.log('Clicking Apply button...');
    const applied = await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('dialog button, button')).find(b => b.innerText?.trim() === 'Apply');
      if (applyBtn) {
        applyBtn.click();
        return true;
      }
      return false;
    });
    console.log('Apply clicked:', applied);
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/linkedin/cover_saved_live.png' });
  } else {
    // Check what controls are visible in the opened editor
    const controls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('dialog *, .artdeco-modal *')).map(el => ({
        tag: el.tagName,
        text: el.innerText?.trim(),
        aria: el.getAttribute('aria-label')
      })).filter(x => x.text && x.text.length < 50);
    });
    console.log('Opened editor controls:', JSON.stringify(controls, null, 2));
  }

  browser.disconnect();
}

openEditCoverAndUpload().catch(console.error);

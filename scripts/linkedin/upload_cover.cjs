const puppeteer = require('puppeteer-core');
const path = require('path');

async function uploadCoverImage() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Clicking "Edit cover image" menu item...');
  await page.evaluate(() => {
    const item = Array.from(document.querySelectorAll('div, button, a, p, span')).find(el => el.innerText?.trim() === 'Edit cover image');
    if (item) item.click();
  });

  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: 'scripts/linkedin/cover_editor_modal.png' });
  console.log('Saved screenshot to scripts/linkedin/cover_editor_modal.png');

  // Look for "Change photo" button or file input
  const fileInput = await page.$('input[type="file"]');
  const bannerFile = path.resolve('public/linkedin-banner-1584x396.png');

  if (fileInput) {
    console.log('File input found! Uploading banner...');
    await fileInput.uploadFile(bannerFile);
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: 'scripts/linkedin/cover_cropped_preview.png' });

    console.log('Clicking "Apply" button...');
    const applied = await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('dialog button, .artdeco-modal button, button')).find(b => b.innerText?.trim() === 'Apply');
      if (applyBtn) {
        applyBtn.click();
        return true;
      }
      return false;
    });
    console.log('Apply clicked:', applied);
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: 'scripts/linkedin/cover_final_result.png' });
  } else {
    console.log('File input not direct, inspecting modal buttons...');
    const modalButtons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('dialog button, .artdeco-modal button, button')).map(b => ({
        text: b.innerText?.trim(),
        aria: b.getAttribute('aria-label'),
        id: b.id
      }));
    });
    console.log('Modal buttons found:', modalButtons);

    // Look for "Change photo"
    await page.evaluate(() => {
      const changeBtn = Array.from(document.querySelectorAll('button, a')).find(b => b.innerText?.trim().includes('Change photo'));
      if (changeBtn) changeBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    const nextFileInput = await page.$('input[type="file"]');
    if (nextFileInput) {
      console.log('File input found after clicking Change photo! Uploading...');
      await nextFileInput.uploadFile(bannerFile);
      await new Promise(r => setTimeout(r, 3000));
      await page.evaluate(() => {
        const applyBtn = Array.from(document.querySelectorAll('dialog button, button')).find(b => b.innerText?.trim() === 'Apply');
        if (applyBtn) applyBtn.click();
      });
      await new Promise(r => setTimeout(r, 5000));
      await page.screenshot({ path: 'scripts/linkedin/cover_final_result.png' });
    }
  }

  browser.disconnect();
}

uploadCoverImage().catch(console.error);

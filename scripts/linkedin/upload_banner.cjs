const puppeteer = require('puppeteer-core');
const path = require('path');

async function uploadBanner() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to profile: https://www.linkedin.com/in/suman-mehta-in/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  console.log('Looking for "Edit background image" button...');
  const editBannerClicked = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label*="background" i]') ||
                Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('background'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Edit background button clicked:', editBannerClicked);

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'scripts/linkedin/edit_banner_dialog.png' });

  // Look for file input
  const bannerFile = path.resolve('public/linkedin-banner-1584x396.png');
  console.log('Uploading banner file:', bannerFile);

  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    console.log('File input found, uploading...');
    await fileInput.uploadFile(bannerFile);
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/linkedin/banner_uploaded_preview.png' });

    // Look for Apply or Save button
    console.log('Looking for Apply or Save button...');
    const applied = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('dialog button, .artdeco-modal button, button'));
      const applyBtn = btns.find(b => b.innerText?.trim() === 'Apply' || b.innerText?.trim() === 'Save photo' || b.innerText?.trim() === 'Save');
      if (applyBtn) {
        applyBtn.click();
        return { clicked: true, text: applyBtn.innerText.trim() };
      }
      return { clicked: false };
    });
    console.log('Apply result:', applied);

    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/linkedin/banner_final_applied.png' });
  } else {
    console.log('No direct file input found in initial modal.');
    // Check what buttons exist in the banner modal
    const dialogButtons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('dialog button, .artdeco-modal button')).map(b => ({
        text: b.innerText?.trim(),
        aria: b.getAttribute('aria-label')
      }));
    });
    console.log('Dialog buttons:', dialogButtons);
  }

  browser.disconnect();
}

uploadBanner().catch(console.error);

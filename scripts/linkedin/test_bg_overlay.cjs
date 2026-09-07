const puppeteer = require('puppeteer-core');
const path = require('path');

async function testBackgroundOverlay() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to background photo overlay: https://www.linkedin.com/in/suman-mehta-in/overlay/background-photo/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/overlay/background-photo/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'scripts/linkedin/background_photo_overlay.png' });
  console.log('Saved screenshot to scripts/linkedin/background_photo_overlay.png');

  const fileInput = await page.$('input[type="file"]');
  console.log('File input found in overlay:', !!fileInput);

  if (fileInput) {
    const bannerPath = path.resolve('public/linkedin-banner-1584x396.png');
    console.log('Uploading file directly...');
    await fileInput.uploadFile(bannerPath);
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/linkedin/uploaded_in_overlay.png' });

    // Look for Apply button
    const applied = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('dialog button, button')).find(b => b.innerText?.trim() === 'Apply');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Applied:', applied);
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: 'scripts/linkedin/after_overlay_apply.png' });
  }

  browser.disconnect();
}

testBackgroundOverlay().catch(console.error);

const puppeteer = require('puppeteer-core');
const path = require('path');

async function clickEditCover() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Clicking at (620, 290) on "Edit cover image"...');
  await page.mouse.click(620, 290);
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: 'scripts/linkedin/after_edit_cover_click.png' });
  console.log('Saved screenshot to scripts/linkedin/after_edit_cover_click.png');

  // Check if file input or modal appeared
  const fileInput = await page.$('input[type="file"]');
  const bannerFile = path.resolve('public/linkedin-banner-1584x396.png');
  console.log('File input present:', !!fileInput);

  if (fileInput) {
    console.log('Uploading banner file:', bannerFile);
    await fileInput.uploadFile(bannerFile);
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/linkedin/after_banner_file_upload.png' });

    // Look for Apply button
    const applied = await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('dialog button, button')).find(b => b.innerText?.trim() === 'Apply');
      if (applyBtn) {
        applyBtn.click();
        return true;
      }
      return false;
    });
    console.log('Apply button clicked:', applied);
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/linkedin/final_banner_uploaded.png' });
  }

  browser.disconnect();
}

clickEditCover().catch(console.error);

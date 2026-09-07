const puppeteer = require('puppeteer-core');
const path = require('path');

async function uploadWithFileChooser() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Opening menu if not open...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label*="background" i]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const bannerFile = path.resolve('public/linkedin-banner-1584x396.png');
  console.log('Preparing file chooser for file:', bannerFile);

  try {
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser({ timeout: 5000 }),
      page.evaluate(() => {
        const p = Array.from(document.querySelectorAll('p, div, a, span')).find(el => el.innerText?.trim() === 'Edit cover image');
        const a = p ? p.closest('a') : null;
        if (a) {
          a.click();
        } else if (p) {
          p.click();
        }
      })
    ]);

    console.log('File chooser intercepted! Uploading...');
    await fileChooser.accept([bannerFile]);
    console.log('File accepted! Waiting for crop dialog...');
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/linkedin/crop_dialog.png' });

    // Look for Apply button
    console.log('Clicking Apply button...');
    const applied = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('dialog button, button'));
      const applyBtn = btns.find(b => b.innerText?.trim() === 'Apply' || b.innerText?.trim() === 'Save');
      if (applyBtn) {
        applyBtn.click();
        return { clicked: true, text: applyBtn.innerText.trim() };
      }
      return { clicked: false };
    });
    console.log('Apply result:', applied);

    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: 'scripts/linkedin/banner_final_live.png' });
    console.log('Saved scripts/linkedin/banner_final_live.png');
  } catch (err) {
    console.log('File chooser warning:', err.message);
  }

  browser.disconnect();
}

uploadWithFileChooser().catch(console.error);

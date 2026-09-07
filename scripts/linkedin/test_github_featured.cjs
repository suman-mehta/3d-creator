const puppeteer = require('puppeteer-core');

async function testGitHubFeatured() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Focusing input and entering GitHub repo...');
  await page.evaluate(() => {
    const input = document.querySelector('dialog input');
    if (input) {
      input.focus();
    }
  });

  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.type('https://github.com/suman-mehta/3d-creator', { delay: 20 });
  await new Promise(r => setTimeout(r, 500));

  console.log('Clicking Add...');
  await page.evaluate(() => {
    const addBtn = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText?.trim() === 'Add');
    if (addBtn) addBtn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'scripts/linkedin/github_link_preview.png' });
  console.log('Screenshot saved to scripts/linkedin/github_link_preview.png');

  browser.disconnect();
}

testGitHubFeatured().catch(console.error);

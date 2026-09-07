const puppeteer = require('puppeteer-core');

async function scrollWorkspace() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Scrolling main#workspace to 700...');
  await page.evaluate(() => {
    const main = document.querySelector('main#workspace') || document.querySelector('main');
    if (main) main.scrollTop = 700;
  });

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/linkedin/workspace_scrolled_700.png' });

  console.log('Scrolling main#workspace to 1400...');
  await page.evaluate(() => {
    const main = document.querySelector('main#workspace') || document.querySelector('main');
    if (main) main.scrollTop = 1400;
  });

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/linkedin/workspace_scrolled_1400.png' });

  browser.disconnect();
}

scrollWorkspace().catch(console.error);

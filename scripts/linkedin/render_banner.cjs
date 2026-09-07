const puppeteer = require('puppeteer-core');
const path = require('path');

async function renderBanner() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1584,
    height: 396,
    deviceScaleFactor: 1
  });

  const htmlPath = path.resolve('scripts/linkedin/banner_template.html');
  console.log('Loading banner template from:', htmlPath);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Wait for image & fonts
  await new Promise(r => setTimeout(r, 2500));

  const outputPath = path.resolve('public/linkedin-banner-1584x396.png');
  await page.screenshot({
    path: outputPath,
    clip: {
      x: 0,
      y: 0,
      width: 1584,
      height: 396
    }
  });

  console.log('Successfully generated LinkedIn Banner at:', outputPath);
  await browser.close();
}

renderBanner().catch(console.error);

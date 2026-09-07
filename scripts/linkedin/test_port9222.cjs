const puppeteer = require('puppeteer-core');

async function testConnection() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Current URL:', page.url());
  console.log('Current Title:', await page.title());

  console.log('Navigating to profile: https://www.linkedin.com/in/suman-mehta-in/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  console.log('Profile URL:', page.url());
  console.log('Profile Title:', await page.title());
  await page.screenshot({ path: 'scripts/linkedin/live_profile_port9222.png' });
  console.log('Screenshot saved to scripts/linkedin/live_profile_port9222.png');

  browser.disconnect();
}

testConnection().catch(console.error);

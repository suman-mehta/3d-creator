const puppeteer = require('puppeteer-core');

async function injectAndNavigate() {
  console.log('Connecting to browser on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Active page URL:', page.url());

  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  console.log('Injecting session cookies via CDP...');
  await client.send('Network.setCookie', {
    name: 'li_at',
    value: 'AQEDAVXkKm4FD_E5AAABoHobGQIAAAGgniedAk0AGG90qrSMuOl0-O4NTxz6QklPSqNAQbZ7HhphWgHokKA9lYW8adV_pTo2H6JKtkMVOKCKYbYxpObP4xAw_glNNxr765Stv5jHSQhj4uYK13bjjC4g',
    domain: '.linkedin.com',
    path: '/',
    secure: true,
    httpOnly: true
  });

  await client.send('Network.setCookie', {
    name: 'JSESSIONID',
    value: '"ajax:3433307739080640611"',
    domain: '.linkedin.com',
    path: '/',
    secure: true,
    httpOnly: false
  });

  console.log('Navigating to https://www.linkedin.com/feed/ ...');
  try {
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 4000));
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }

  console.log('Result Page URL:', page.url());
  console.log('Result Page Title:', await page.title());
  await page.screenshot({ path: 'scripts/linkedin/live_window_result.png' });

  browser.disconnect();
}

injectAndNavigate().catch(console.error);

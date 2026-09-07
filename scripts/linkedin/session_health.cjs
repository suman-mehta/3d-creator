const puppeteer = require('puppeteer-core');

async function testSessionHealth() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: 'new',
    userDataDir: '/tmp/puppeteer_linkedin_session',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1400,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const cookies = [
    {
      name: 'li_at',
      value: 'AQEDAVXkKm4FD_E5AAABoHobGQIAAAGgniedAk0AGG90qrSMuOl0-O4NTxz6QklPSqNAQbZ7HhphWgHokKA9lYW8adV_pTo2H6JKtkMVOKCKYbYxpObP4xAw_glNNxr765Stv5jHSQhj4uYK13bjjC4g',
      domain: '.linkedin.com',
      path: '/',
      httpOnly: true,
      secure: true
    },
    {
      name: 'JSESSIONID',
      value: 'ajax:3433307739080640611',
      domain: '.linkedin.com',
      path: '/',
      httpOnly: false,
      secure: true
    }
  ];

  await page.setCookie(...cookies);

  console.log('Navigating directly to profile: https://www.linkedin.com/in/suman-mehta-in/ ...');
  try {
    const res = await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    console.log('Status:', res.status());
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    await page.screenshot({ path: 'scripts/linkedin/session_health.png' });
  } catch (e) {
    console.log('Direct profile navigation error:', e.message);
    await page.screenshot({ path: 'scripts/linkedin/error_screenshot.png' });
  }

  await browser.close();
}

testSessionHealth();

const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testSession() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

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
      value: '"ajax:3433307739080640611"',
      domain: '.linkedin.com',
      path: '/',
      httpOnly: false,
      secure: true
    }
  ];

  await page.setCookie(...cookies);

  console.log('Navigating to https://www.linkedin.com/feed/ ...');
  await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  console.log('Feed URL:', page.url());
  console.log('Feed Title:', await page.title());
  await page.screenshot({ path: 'scripts/linkedin/feed_check.png' });

  console.log('Navigating to https://www.linkedin.com/in/ ...');
  await page.goto('https://www.linkedin.com/in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const profileUrl = page.url();
  console.log('Profile URL:', profileUrl);
  console.log('Profile Title:', await page.title());
  await page.screenshot({ path: 'scripts/linkedin/profile_check.png' });

  // Extract page content details
  const profileData = await page.evaluate(() => {
    const headline = document.querySelector('.text-body-medium.break-words')?.innerText || '';
    const name = document.querySelector('h1.inline.t-24.v-align-middle.break-words')?.innerText || document.querySelector('h1')?.innerText || '';
    const location = document.querySelector('.text-body-small.inline.t-black--light.break-words')?.innerText || '';
    const customLink = document.querySelector('a.ember-view.link-without-visited-state')?.innerText || '';
    
    // Find all section titles
    const sections = Array.from(document.querySelectorAll('section')).map(s => {
      const h2 = s.querySelector('h2');
      return h2 ? h2.innerText.trim() : '';
    }).filter(Boolean);

    return {
      name,
      headline,
      location,
      customLink,
      sections
    };
  });

  console.log('Extracted Profile Data:', JSON.stringify(profileData, null, 2));

  await browser.close();
}

testSession().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

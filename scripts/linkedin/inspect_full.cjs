const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function inspectFullProfile() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1400,1000'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
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

  console.log('Navigating to https://www.linkedin.com/in/suman-mehta-in/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'networkidle2', timeout: 45000 });
  
  // Scroll incrementally down the page to trigger lazy loading
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, 600));
    await new Promise(r => setTimeout(r, 1000));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'scripts/linkedin/full_profile_top.png' });

  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/full_profile_mid.png' });

  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/full_profile_lower.png' });

  // Extract all sections and their text contents
  const sectionsData = await page.evaluate(() => {
    const results = [];
    const sections = document.querySelectorAll('main section');
    sections.forEach((sec, idx) => {
      const heading = sec.querySelector('h2, .pvs-header__title')?.innerText?.trim() || `Section ${idx}`;
      const text = sec.innerText?.trim() || '';
      results.push({ heading, text: text.substring(0, 500) });
    });
    return results;
  });

  fs.writeFileSync('scripts/linkedin/sections.json', JSON.stringify(sectionsData, null, 2));
  console.log('Sections extracted:', sectionsData.map(s => s.heading));

  await browser.close();
}

inspectFullProfile().catch(err => {
  console.error('Error in inspectFullProfile:', err);
  process.exit(1);
});

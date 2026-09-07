const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function inspectButtons() {
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
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const buttons = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('button, a[role="button"], a.artdeco-button').forEach(el => {
      const aria = el.getAttribute('aria-label') || '';
      const text = el.innerText?.trim() || '';
      const id = el.id || '';
      const href = el.getAttribute('href') || '';
      if (aria.toLowerCase().includes('edit') || text.toLowerCase().includes('edit') || text.toLowerCase().includes('add section') || aria.toLowerCase().includes('intro')) {
        list.push({ tag: el.tagName, aria, text, id, href, classes: el.className });
      }
    });
    return list;
  });

  console.log('Edit / Action buttons found:', JSON.stringify(buttons, null, 2));

  // Also check what sections exist on page
  const sections = await page.evaluate(() => {
    const secList = [];
    document.querySelectorAll('section').forEach(s => {
      const h2 = s.querySelector('h2');
      const title = h2 ? h2.innerText.trim() : '';
      const aria = s.getAttribute('aria-label') || '';
      const id = s.id || '';
      secList.push({ title, aria, id });
    });
    return secList;
  });

  console.log('Sections found:', JSON.stringify(sections, null, 2));

  await browser.close();
}

inspectButtons().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function inspectAndOpenEditModal() {
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

  console.log('Navigating to feed...');
  await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Navigating to profile...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  console.log('Profile loaded:', page.url());

  // Let's find all buttons and links in the top card
  const topCardButtons = await page.evaluate(() => {
    // The top card is usually the first section in main
    const main = document.querySelector('main');
    const firstSection = main ? main.querySelector('section') : null;
    if (!firstSection) return [];
    
    return Array.from(firstSection.querySelectorAll('button, a')).map(el => ({
      tagName: el.tagName,
      ariaLabel: el.getAttribute('aria-label') || '',
      title: el.getAttribute('title') || '',
      id: el.id || '',
      className: el.className || '',
      innerText: el.innerText?.trim() || '',
      href: el.getAttribute('href') || ''
    }));
  });

  console.log('Top Card Elements:', JSON.stringify(topCardButtons, null, 2));

  // Check if there is an edit intro button
  // Usually aria-label="Edit intro" or class containing "artdeco-button" with edit icon
  const editIntroSelector = await page.evaluate(() => {
    const editBtn = document.querySelector('button[aria-label*="intro" i], a[aria-label*="intro" i], button[aria-label*="Edit intro" i], .artdeco-card button[aria-label*="Edit" i]');
    if (editBtn) {
      return {
        found: true,
        ariaLabel: editBtn.getAttribute('aria-label'),
        id: editBtn.id,
        className: editBtn.className
      };
    }
    // Fallback: search for buttons with svg data-test-icon="pencil-small" or similar
    const svgs = document.querySelectorAll('button svg, a svg');
    for (const svg of svgs) {
      const parent = svg.closest('button, a');
      if (parent) {
        const aria = parent.getAttribute('aria-label') || '';
        if (aria.toLowerCase().includes('edit') || aria.toLowerCase().includes('intro')) {
          return { found: true, ariaLabel: aria, id: parent.id, className: parent.className };
        }
      }
    }
    return { found: false };
  });

  console.log('Edit Intro Selector:', editIntroSelector);

  await page.screenshot({ path: 'scripts/linkedin/top_card.png' });

  await browser.close();
}

inspectAndOpenEditModal().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

const puppeteer = require('puppeteer-core');

async function testAddAboutUrl() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to Add About URL: https://www.linkedin.com/in/suman-mehta-in/edit/forms/summary/new/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/edit/forms/summary/new/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  console.log('Page URL:', page.url());
  console.log('Page Title:', await page.title());
  await page.screenshot({ path: 'scripts/linkedin/add_about_modal.png' });

  // Inspect form
  const fields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('dialog input, dialog textarea, dialog div[contenteditable="true"], dialog h2, dialog label, dialog button')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      id: el.id,
      value: el.value || el.innerText,
      aria: el.getAttribute('aria-label')
    })).filter(x => x.text || x.value || x.aria);
  });

  console.log('Add About fields:', JSON.stringify(fields, null, 2));

  browser.disconnect();
}

testAddAboutUrl().catch(console.error);

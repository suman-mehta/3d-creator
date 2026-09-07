const puppeteer = require('puppeteer-core');

async function inspectContactInfo() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to contact info edit: https://www.linkedin.com/in/suman-mehta-in/overlay/contact-info/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/overlay/contact-info/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'scripts/linkedin/contact_info_overlay.png' });
  console.log('Saved screenshot to scripts/linkedin/contact_info_overlay.png');

  // Also check if there is an edit button inside contact-info
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      aria: el.getAttribute('aria-label'),
      href: el.getAttribute('href')
    })).filter(x => x.text || x.aria || x.href);
  });

  console.log('Contact info links/buttons:', JSON.stringify(links.filter(l => l.text?.includes('Edit') || l.aria?.includes('Edit') || l.href?.includes('contact-info')), null, 2));

  browser.disconnect();
}

inspectContactInfo().catch(console.error);

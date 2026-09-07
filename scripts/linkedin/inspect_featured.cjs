const puppeteer = require('puppeteer-core');

async function inspectFeatured() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to: https://www.linkedin.com/in/suman-mehta-in/details/featured/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/details/featured/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  console.log('Page URL:', page.url());
  console.log('Page Title:', await page.title());
  await page.screenshot({ path: 'scripts/linkedin/featured_details_page.png' });
  console.log('Saved screenshot to scripts/linkedin/featured_details_page.png');

  // Find all buttons and links on this page
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button')).map(b => ({
      tag: b.tagName,
      text: b.innerText?.trim(),
      aria: b.getAttribute('aria-label'),
      href: b.getAttribute('href'),
      className: b.className
    })).filter(b => b.text || b.aria || (b.href && b.href.includes('featured')));
  });

  console.log('Featured page actions:', JSON.stringify(buttons, null, 2));

  browser.disconnect();
}

inspectFeatured().catch(console.error);

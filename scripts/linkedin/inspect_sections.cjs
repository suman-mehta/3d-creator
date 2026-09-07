const puppeteer = require('puppeteer-core');

async function inspectSections() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to profile: https://www.linkedin.com/in/suman-mehta-in/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Find all sections on the profile page
  const sections = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('section').forEach((sec, idx) => {
      const h2 = sec.querySelector('h2, .pvs-header__title');
      const title = h2 ? h2.innerText.trim() : '';
      
      // Find any edit or add buttons in this section
      const editButtons = Array.from(sec.querySelectorAll('a, button')).map(b => ({
        tag: b.tagName,
        aria: b.getAttribute('aria-label'),
        text: b.innerText?.trim(),
        href: b.getAttribute('href')
      })).filter(b => b.aria || b.href || (b.text && (b.text.includes('+') || b.text.includes('Add') || b.text.includes('Edit'))));

      const snippet = sec.innerText?.substring(0, 200).replace(/\n+/g, ' ');
      list.push({ idx, title, snippet, editButtons });
    });
    return list;
  });

  console.log('Sections found:', JSON.stringify(sections, null, 2));

  // Check if About section exists
  const aboutSection = sections.find(s => s.title.toLowerCase().includes('about'));
  console.log('About section found:', aboutSection);

  // Take screenshot of scrolled profile
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/profile_scrolled_sections.png' });

  browser.disconnect();
}

inspectSections().catch(console.error);

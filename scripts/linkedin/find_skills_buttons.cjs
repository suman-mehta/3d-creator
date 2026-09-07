const puppeteer = require('puppeteer-core');

async function findSkillsPlusButton() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const info = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('a, button').forEach(el => {
      const rect = el.getBoundingClientRect();
      const text = el.innerText?.trim();
      const aria = el.getAttribute('aria-label');
      const href = el.getAttribute('href');
      // Look for elements in top area of main card
      if (rect.y > 100 && rect.y < 350 && rect.x > 500) {
        list.push({
          tag: el.tagName,
          text,
          aria,
          href,
          className: el.className,
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
        });
      }
    });
    return list;
  });

  console.log('Buttons near top right of Skills card:', JSON.stringify(info, null, 2));

  // What is the direct URL to add a skill?
  // LinkedIn direct URL: https://www.linkedin.com/in/suman-mehta-in/edit/forms/skills/new/
  browser.disconnect();
}

findSkillsPlusButton().catch(console.error);

const puppeteer = require('puppeteer-core');

async function inspectPencil() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com/in/')) || pages[0];

  const info = await page.evaluate(() => {
    // Check elements at x=700, y=295
    const el = document.elementFromPoint(700, 295);
    const closestAnchor = el ? el.closest('a, button, div[role="button"]') : null;

    // Also look for any link or button containing 'edit' in href or aria
    const editLinks = Array.from(document.querySelectorAll('a, button')).map(a => ({
      tag: a.tagName,
      href: a.getAttribute('href') || '',
      aria: a.getAttribute('aria-label') || '',
      id: a.id,
      className: a.className,
      rect: a.getBoundingClientRect()
    })).filter(x => (x.href.includes('edit') || x.aria.toLowerCase().includes('edit') || x.href.includes('intro')) && x.rect.width > 0);

    // Also check all SVGs that look like edit/pencil
    const svgs = Array.from(document.querySelectorAll('svg')).map(s => {
      const parent = s.closest('a, button');
      return {
        icon: s.getAttribute('data-test-icon') || s.getAttribute('id') || '',
        parentTag: parent ? parent.tagName : '',
        parentAria: parent ? parent.getAttribute('aria-label') : '',
        parentHref: parent ? parent.getAttribute('href') : '',
        parentClass: parent ? parent.className : '',
        rect: s.getBoundingClientRect()
      };
    }).filter(s => s.rect.width > 0 && s.rect.y < 600);

    return {
      elementFromPoint: {
        tag: el ? el.tagName : null,
        className: el ? el.className : null,
        closestTag: closestAnchor ? closestAnchor.tagName : null,
        closestHref: closestAnchor ? closestAnchor.getAttribute('href') : null,
        closestAria: closestAnchor ? closestAnchor.getAttribute('aria-label') : null,
        closestClass: closestAnchor ? closestAnchor.className : null
      },
      editLinks,
      svgs
    };
  });

  console.log('Pencil info:', JSON.stringify(info, null, 2));
  browser.disconnect();
}

inspectPencil().catch(console.error);

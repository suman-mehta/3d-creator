const puppeteer = require('puppeteer-core');

async function clickAddSkill() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Clicking the + button in Skills page...');
  const clicked = await page.evaluate(() => {
    // The + button is at top right of the skills card
    const svgs = Array.from(document.querySelectorAll('svg')).filter(s => s.getAttribute('data-test-icon') === 'add-medium' || s.getAttribute('data-test-icon') === 'plus-medium');
    for (const svg of svgs) {
      const parent = svg.closest('button, a');
      if (parent) {
        parent.click();
        return { found: true, tag: parent.tagName, aria: parent.getAttribute('aria-label') };
      }
    }
    // Check coordinates near (700, 260)
    const el = document.elementFromPoint(680, 270);
    const btn = el ? el.closest('button, a') : null;
    if (btn) {
      btn.click();
      return { found: true, fromPoint: true };
    }
    return { found: false };
  });

  console.log('Click result:', clicked);
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'scripts/linkedin/add_skill_dialog.png' });
  console.log('Saved screenshot to scripts/linkedin/add_skill_dialog.png');

  // Inspect dialog inputs
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('dialog input, dialog textarea, dialog button')).map(el => ({
      tag: el.tagName,
      id: el.id,
      text: el.innerText?.trim(),
      value: el.value,
      placeholder: el.placeholder,
      aria: el.getAttribute('aria-label')
    })).filter(x => x.text || x.placeholder || x.aria || x.value);
  });

  console.log('Add skill dialog inputs:', JSON.stringify(inputs, null, 2));

  browser.disconnect();
}

clickAddSkill().catch(console.error);

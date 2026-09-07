const puppeteer = require('puppeteer-core');

async function openEditIntroUrl() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating directly to: https://www.linkedin.com/in/suman-mehta-in/edit/intro/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/edit/intro/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'scripts/linkedin/edit_intro_page.png' });
  console.log('Screenshot saved to scripts/linkedin/edit_intro_page.png');

  // Extract all inputs and their labels
  const formFields = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map(el => {
      // Find label
      let labelText = '';
      if (el.id) {
        const lbl = document.querySelector(`label[for="${el.id}"]`);
        if (lbl) labelText = lbl.innerText.trim();
      }
      if (!labelText) {
        const parentLbl = el.closest('label');
        if (parentLbl) labelText = parentLbl.innerText.trim();
      }
      return {
        tag: el.tagName,
        id: el.id,
        name: el.name,
        type: el.type,
        value: el.value,
        labelText,
        placeholder: el.placeholder,
        ariaLabel: el.getAttribute('aria-label')
      };
    });

    const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText?.trim(),
      aria: b.getAttribute('aria-label'),
      id: b.id,
      className: b.className
    })).filter(b => b.text || b.aria);

    return { inputs, buttons };
  });

  console.log('Form inputs found:', JSON.stringify(formFields.inputs, null, 2));
  console.log('Action buttons:', JSON.stringify(formFields.buttons.slice(0, 10), null, 2));

  browser.disconnect();
}

openEditIntroUrl().catch(console.error);

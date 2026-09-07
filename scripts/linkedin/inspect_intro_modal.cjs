const puppeteer = require('puppeteer-core');

async function inspectIntroModal() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com/in/')) || pages[0];

  console.log('Finding edit intro button on page...');

  // The edit pencil in top card
  const buttonSelector = await page.evaluate(() => {
    // Find all buttons or links with edit icons in the first card
    const firstCard = document.querySelector('main section') || document.querySelector('.artdeco-card');
    if (!firstCard) return null;
    
    // Look for edit buttons
    const btns = Array.from(firstCard.querySelectorAll('button, a[role="button"]'));
    for (const b of btns) {
      const aria = b.getAttribute('aria-label') || '';
      if (aria.toLowerCase().includes('edit intro') || aria.toLowerCase().includes('edit')) {
        return { aria, className: b.className, id: b.id };
      }
    }
    // Also check links with svg
    const svgs = Array.from(firstCard.querySelectorAll('button:has(svg), a:has(svg)'));
    for (const s of svgs) {
      const aria = s.getAttribute('aria-label') || '';
      if (aria) return { aria, className: s.className, id: s.id };
    }
    return null;
  });

  console.log('Candidate intro button:', buttonSelector);

  // Click the intro edit button
  const clicked = await page.evaluate(() => {
    // Selector for edit intro button
    const btn = document.querySelector('button[aria-label*="Edit intro" i], button[aria-label*="intro" i], a[aria-label*="Edit intro" i]') ||
                document.querySelector('.artdeco-card button[aria-label*="Edit" i]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  console.log('Button clicked:', clicked);
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: 'scripts/linkedin/intro_modal_opened.png' });
  console.log('Saved modal screenshot to scripts/linkedin/intro_modal_opened.png');

  // Inspect form fields in the modal
  const modalFields = await page.evaluate(() => {
    const modal = document.querySelector('.artdeco-modal, div[role="dialog"]');
    if (!modal) return { found: false };

    const inputs = Array.from(modal.querySelectorAll('input, textarea, select')).map(el => ({
      tagName: el.tagName,
      id: el.id,
      name: el.name,
      value: el.value,
      placeholder: el.placeholder,
      ariaLabel: el.getAttribute('aria-label') || '',
      type: el.type
    }));

    const buttons = Array.from(modal.querySelectorAll('button')).map(b => ({
      text: b.innerText?.trim() || '',
      ariaLabel: b.getAttribute('aria-label') || '',
      className: b.className
    }));

    return {
      found: true,
      inputs,
      buttons
    };
  });

  console.log('Modal fields:', JSON.stringify(modalFields, null, 2));

  browser.disconnect();
}

inspectIntroModal().catch(console.error);

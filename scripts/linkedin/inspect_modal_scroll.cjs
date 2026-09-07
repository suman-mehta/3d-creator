const puppeteer = require('puppeteer-core');

async function inspectModalContent() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  // Scroll the modal down
  await page.evaluate(() => {
    // Find the scrollable container inside the modal
    const scrollable = document.querySelector('.artdeco-modal__content, div[tabindex="-1"], div[role="dialog"] > div');
    if (scrollable) {
      scrollable.scrollTop = 300;
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/edit_intro_scrolled1.png' });

  await page.evaluate(() => {
    const scrollable = document.querySelector('.artdeco-modal__content, div[tabindex="-1"], div[role="dialog"] > div');
    if (scrollable) {
      scrollable.scrollTop = 800;
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/edit_intro_scrolled2.png' });

  // List all textareas and inputs inside the modal with their labels
  const details = await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('.artdeco-modal input, .artdeco-modal textarea, div[role="dialog"] input, div[role="dialog"] textarea');
    elements.forEach(el => {
      // Find label
      let label = '';
      const parentForm = el.closest('div');
      if (el.id) {
        const l = document.querySelector(`label[for="${el.id}"]`);
        if (l) label = l.innerText.trim();
      }
      if (!label && parentForm) {
        const prev = parentForm.querySelector('label, span, h3');
        if (prev) label = prev.innerText.trim();
      }
      results.push({
        tag: el.tagName,
        id: el.id,
        label,
        value: el.value?.substring(0, 100),
        placeholder: el.placeholder
      });
    });
    return results;
  });

  console.log('All modal inputs/textareas:', JSON.stringify(details, null, 2));

  browser.disconnect();
}

inspectModalContent().catch(console.error);

const puppeteer = require('puppeteer-core');

async function inspectDialogChildren() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const contents = await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    if (!dialog) return null;
    
    // Find all headings, labels, buttons, inputs inside dialog
    const elements = Array.from(dialog.querySelectorAll('h1, h2, h3, h4, label, button, a, input, select')).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim(),
      aria: el.getAttribute('aria-label'),
      id: el.id,
      name: el.name,
      value: el.value,
      href: el.getAttribute('href')
    })).filter(x => x.text || x.aria || x.value);

    return elements;
  });

  console.log('All dialog contents:', JSON.stringify(contents, null, 2));
  browser.disconnect();
}

inspectDialogChildren().catch(console.error);

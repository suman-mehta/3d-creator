const puppeteer = require('puppeteer-core');

async function inspectRscResponse() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  page.on('response', async res => {
    if (res.url().includes('urlPreview')) {
      try {
        const text = await res.text();
        console.log('[FULL URL PREVIEW RESPONSE]:\n', text);
      } catch (e) {}
    }
  });

  // Type URL and click Add
  await page.evaluate(() => {
    const input = document.querySelector('dialog input');
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  await page.keyboard.type('https://sumanmehta.in/', { delay: 10 });
  await new Promise(r => setTimeout(r, 300));

  await page.evaluate(() => {
    const addBtn = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText?.trim() === 'Add');
    if (addBtn) addBtn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  browser.disconnect();
}

inspectRscResponse().catch(console.error);

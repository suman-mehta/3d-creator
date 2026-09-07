const puppeteer = require('puppeteer-core');

async function debugAllRequests() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  page.on('request', req => {
    const resourceType = req.resourceType();
    if (resourceType === 'xhr' || resourceType === 'fetch') {
      console.log('[XHR/FETCH REQ]', req.method(), req.url());
    }
  });

  page.on('response', async res => {
    const resourceType = res.request().resourceType();
    if (resourceType === 'xhr' || resourceType === 'fetch') {
      try {
        const text = await res.text();
        console.log(`[XHR/FETCH RES ${res.status()}]`, res.url(), text.substring(0, 200));
      } catch (e) {}
    }
  });

  // Re-enter link and click Add
  await page.evaluate(() => {
    const input = document.querySelector('dialog input');
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  await page.keyboard.type('https://sumanmehta.in', { delay: 20 });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const addBtn = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText?.trim() === 'Add');
    if (addBtn) addBtn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  browser.disconnect();
}

debugAllRequests().catch(console.error);

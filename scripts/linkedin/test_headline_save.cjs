const puppeteer = require('puppeteer-core');

async function testHeadlineSave() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  // Intercept response to catch error
  page.on('response', async res => {
    if (res.url().includes('dash/profiles') || res.url().includes('voyager/api') || res.url().includes('edit/intro')) {
      try {
        const text = await res.text();
        console.log(`[API RESPONSE ${res.status()}] ${res.url().substring(0, 100)}:`, text.substring(0, 300));
      } catch (e) {}
    }
  });

  // Click inside the headline contenteditable div
  await page.evaluate(() => {
    const headlineDiv = document.querySelector('div.tiptap.ProseMirror');
    if (headlineDiv) {
      headlineDiv.scrollIntoView({ behavior: 'instant', block: 'center' });
      headlineDiv.focus();
    }
  });

  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 200));

  // Clean headline without https:// protocol
  const headline = '3D Creator & Creative Technologist | WebGL, Three.js & Motion Design | Founder at sumanmehta.in';
  console.log('Typing clean headline:', headline);
  await page.keyboard.type(headline, { delay: 20 });
  await new Promise(r => setTimeout(r, 500));

  // Click save
  console.log('Clicking Save...');
  await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    const saveBtn = Array.from(dialog.querySelectorAll('button')).find(b => b.innerText?.trim() === 'Save');
    if (saveBtn) saveBtn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'scripts/linkedin/clean_headline_save.png' });

  browser.disconnect();
}

testHeadlineSave().catch(console.error);

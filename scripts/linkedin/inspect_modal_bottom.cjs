const puppeteer = require('puppeteer-core');

async function inspectModalBottom() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  await page.evaluate(() => {
    const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText?.trim() === 'Save');
    // Find previous elements before saveBtn inside modal
    const inputs = document.querySelectorAll('input, select, textarea, div[contenteditable="true"], a');
    if (inputs.length > 0) {
      inputs[inputs.length - 1].scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/modal_bottom.png' });

  // List all text content visible in the modal
  const modalText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3, h4, label, span, p, a')).map(el => el.innerText?.trim()).filter(Boolean);
  });

  console.log('Modal text elements:', modalText.slice(-30));
  browser.disconnect();
}

inspectModalBottom().catch(console.error);

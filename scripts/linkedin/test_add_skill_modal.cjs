const puppeteer = require('puppeteer-core');

async function testAddSkillModal() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to Add Skill URL: https://www.linkedin.com/in/suman-mehta-in/skills/edit/forms/new/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/skills/edit/forms/new/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: 'scripts/linkedin/add_skill_modal.png' });
  console.log('Saved screenshot to scripts/linkedin/add_skill_modal.png');

  // Inspect form fields
  const fields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('dialog input, dialog select, dialog button, dialog label')).map(el => ({
      tag: el.tagName,
      id: el.id,
      text: el.innerText?.trim(),
      value: el.value,
      placeholder: el.placeholder,
      aria: el.getAttribute('aria-label')
    })).filter(x => x.text || x.placeholder || x.aria || x.value);
  });

  console.log('Add skill fields:', JSON.stringify(fields, null, 2));

  browser.disconnect();
}

testAddSkillModal().catch(console.error);

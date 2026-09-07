const puppeteer = require('puppeteer-core');

async function addSingleSkill(skillName) {
  console.log('Connecting to Chrome on port 9222 for skill:', skillName);
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to: https://www.linkedin.com/in/suman-mehta-in/skills/edit/forms/new/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/skills/edit/forms/new/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Focus skill input
  await page.evaluate(() => {
    const input = document.querySelector('dialog input[placeholder*="Skill"]') || document.querySelector('dialog input');
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  console.log('Typing skill:', skillName);
  await page.keyboard.type(skillName, { delay: 40 });
  await new Promise(r => setTimeout(r, 1500));

  // Check if typeahead dropdown appeared
  const typeaheadAppeared = await page.evaluate(() => {
    // Look for typeahead dropdown items
    const items = Array.from(document.querySelectorAll('div[role="listbox"] div[role="option"], ul[role="listbox"] li, .basic-typeahead__selectable-list li, dialog div[id*="typeahead"] *'));
    if (items.length > 0) {
      const first = items[0];
      first.click();
      return { clickedOption: first.innerText?.trim() };
    }
    return { clickedOption: null };
  });

  console.log('Typeahead selection:', typeaheadAppeared);
  if (!typeaheadAppeared.clickedOption) {
    // Press ArrowDown and Enter
    await page.keyboard.press('ArrowDown');
    await new Promise(r => setTimeout(r, 200));
    await page.keyboard.press('Enter');
  }

  await new Promise(r => setTimeout(r, 1000));

  // Click Save button
  console.log('Clicking Save button in skill modal...');
  const saved = await page.evaluate(() => {
    const saveBtn = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText?.trim() === 'Save' && !b.disabled);
    if (saveBtn) {
      saveBtn.click();
      return true;
    }
    return false;
  });

  console.log('Skill Save clicked:', saved);
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: `scripts/linkedin/skill_${skillName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_saved.png` });

  browser.disconnect();
}

async function run() {
  const skillsToAdd = ['Three.js', 'WebGL', 'Motion Graphics', '3D Computer Graphics'];
  for (const s of skillsToAdd) {
    try {
      await addSingleSkill(s);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`Error adding skill ${s}:`, e.message);
    }
  }
}

run();

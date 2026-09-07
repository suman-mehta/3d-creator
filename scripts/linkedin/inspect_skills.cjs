const puppeteer = require('puppeteer-core');

async function inspectSkills() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to skills details: https://www.linkedin.com/in/suman-mehta-in/details/skills/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/details/skills/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'scripts/linkedin/skills_details_page.png' });
  console.log('Saved screenshot to scripts/linkedin/skills_details_page.png');

  // Extract all current skills
  const skills = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('div[data-view-name*="profile-component-entity"] *, li.pvs-list__paged-list-item *, section *').forEach(el => {
      const text = el.innerText?.trim();
      if (text && text.length > 2 && text.length < 40 && !text.includes('Skills') && !text.includes('notification')) {
        list.push(text);
      }
    });
    return Array.from(new Set(list));
  });

  console.log('Detected skills text:', JSON.stringify(skills.slice(0, 30), null, 2));

  // Find Add skill button
  const addSkillBtn = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.getAttribute('aria-label')?.toLowerCase().includes('add skill') || el.innerText?.trim() === 'Add skill' || el.innerHTML.includes('plus-medium'));
    return btn ? { text: btn.innerText?.trim(), aria: btn.getAttribute('aria-label'), href: btn.getAttribute('href') } : null;
  });

  console.log('Add skill button:', addSkillBtn);

  browser.disconnect();
}

inspectSkills().catch(console.error);

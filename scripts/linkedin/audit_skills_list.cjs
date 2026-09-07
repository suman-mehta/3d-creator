const puppeteer = require('puppeteer-core');

async function auditSkillsList() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to: https://www.linkedin.com/in/suman-mehta-in/details/skills/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/details/skills/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'scripts/linkedin/skills_audit_list.png' });
  console.log('Saved screenshot to scripts/linkedin/skills_audit_list.png');

  // List all skill items and their edit links
  const skillItems = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('li.pvs-list__paged-list-item, div[data-view-name*="profile-component-entity"]').forEach(item => {
      const titleEl = item.querySelector('.mr1.t-bold span, .t-bold span, span[aria-hidden="true"]');
      const editBtn = item.querySelector('a[aria-label*="Edit"], button[aria-label*="Edit"]');
      const title = titleEl ? titleEl.innerText.trim() : '';
      if (title && !title.includes('notification')) {
        list.push({
          title,
          editHref: editBtn ? editBtn.getAttribute('href') : null,
          editAria: editBtn ? editBtn.getAttribute('aria-label') : null
        });
      }
    });
    return list;
  });

  console.log('Current profile skills:', JSON.stringify(skillItems, null, 2));

  // Check if Incident Command is present
  const incidentSkill = skillItems.find(s => s.title.toLowerCase().includes('incident'));
  if (incidentSkill && incidentSkill.editHref) {
    console.log('Deleting Incident Command skill:', incidentSkill);
    await page.goto(incidentSkill.editHref, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    
    // Find delete button
    const deleted = await page.evaluate(() => {
      const deleteBtn = Array.from(document.querySelectorAll('dialog button, button')).find(b => b.innerText?.trim() === 'Delete skill' || b.getAttribute('aria-label')?.includes('Delete'));
      if (deleteBtn) {
        deleteBtn.click();
        return true;
      }
      return false;
    });
    console.log('Delete button clicked:', deleted);
    await new Promise(r => setTimeout(r, 2000));

    // Confirm delete in confirmation dialog if any
    await page.evaluate(() => {
      const confirmBtn = Array.from(document.querySelectorAll('dialog button, button')).find(b => b.innerText?.trim() === 'Delete');
      if (confirmBtn) confirmBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    console.log('Incident Command skill removed.');
  }

  browser.disconnect();
}

auditSkillsList().catch(console.error);

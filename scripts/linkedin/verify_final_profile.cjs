const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function verifyFinalProfile() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  console.log('Navigating to live profile: https://www.linkedin.com/in/suman-mehta-in/ ...');
  await page.goto('https://www.linkedin.com/in/suman-mehta-in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // Screenshot 1: Top Hero & Intro
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/final_01_top_card.png' });
  console.log('Saved scripts/linkedin/final_01_top_card.png');

  // Screenshot 2: Featured & About
  await page.evaluate(() => window.scrollBy(0, 650));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/linkedin/final_02_featured_about.png' });
  console.log('Saved scripts/linkedin/final_02_featured_about.png');

  // Screenshot 3: Experience & Skills
  await page.evaluate(() => window.scrollBy(0, 750));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/linkedin/final_03_experience_skills.png' });
  console.log('Saved scripts/linkedin/final_03_experience_skills.png');

  // Audit all live text in main
  const auditReport = await page.evaluate(() => {
    const name = document.querySelector('h1')?.innerText?.trim();
    const headline = document.querySelector('.text-body-medium.break-words')?.innerText?.trim();
    
    // Find all sections
    const sections = Array.from(document.querySelectorAll('main section')).map(sec => {
      const h2 = sec.querySelector('h2, .pvs-header__title');
      return {
        title: h2 ? h2.innerText.trim() : 'Section',
        textPreview: sec.innerText?.substring(0, 400).replace(/\n+/g, ' ')
      };
    });

    return {
      name,
      headline,
      sections
    };
  });

  fs.writeFileSync('scripts/linkedin/final_audit.json', JSON.stringify(auditReport, null, 2));
  console.log('Final Audit Report:', JSON.stringify(auditReport, null, 2));

  browser.disconnect();
}

verifyFinalProfile().catch(console.error);

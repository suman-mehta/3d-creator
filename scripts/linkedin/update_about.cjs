const puppeteer = require('puppeteer-core');

async function updateAboutSection() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('linkedin.com')) || pages[0];

  const isAboutOpen = await page.evaluate(() => {
    const h2 = document.querySelector('dialog h2');
    return h2 && h2.innerText.includes('about');
  });

  if (!isAboutOpen) {
    console.log('Navigating to Edit About: https://www.linkedin.com/in/suman-mehta-in/edit/forms/summary/new/ ...');
    await page.goto('https://www.linkedin.com/in/suman-mehta-in/edit/forms/summary/new/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
  }

  const aboutBio = `I am Suman Mehta (also known as Suman Kumar) — a 3D Creator, Motion Designer, and Creative Technologist bridging the gap between cutting-edge real-time computer graphics, procedural visual direction, and modern web architecture.

My work focuses on crafting immersive, high-performance visual systems and digital experiences:
✦ Real-Time 3D & WebGL/WebGPU: Architecting next-generation interactive web experiences with Three.js, custom GLSL shaders, and reactive 3D interfaces.
✦ Motion Graphics & Visual Direction: High-fidelity visual storytelling, procedural 3D motion design, and digital art production.
✦ Creative Front-End Engineering: Building ultra-responsive, accessible web applications with React, TypeScript, and Framer Motion.

Explore my live interactive portfolio and open-source production showcases:
🌐 Portfolio: https://sumanmehta.in/
💻 GitHub: https://github.com/suman-mehta

Open for freelance creative direction, interactive 3D web collaborations, and visionary digital product design. Let's connect and build the future of interactive digital media!`;

  console.log('Focusing on About editor...');
  await page.evaluate(() => {
    const editor = document.querySelector('dialog div.tiptap.ProseMirror') || document.querySelector('dialog div[aria-label="About"]');
    if (editor) {
      editor.scrollIntoView({ behavior: 'instant', block: 'center' });
      editor.focus();
    }
  });
  await new Promise(r => setTimeout(r, 300));

  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 300));

  console.log('Inserting new About narrative bio...');
  // Type or paste via clipboard / input event
  await page.evaluate(text => {
    const editor = document.querySelector('dialog div.tiptap.ProseMirror') || document.querySelector('dialog div[aria-label="About"]');
    if (editor) {
      editor.focus();
      document.execCommand('insertText', false, text);
    }
  }, aboutBio);

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/linkedin/about_before_save.png' });
  console.log('Screenshot saved to scripts/linkedin/about_before_save.png');

  console.log('Clicking Save button in About modal...');
  const saved = await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    if (!dialog) return false;
    const saveBtn = Array.from(dialog.querySelectorAll('button')).find(b => b.innerText?.trim() === 'Save');
    if (saveBtn) {
      saveBtn.click();
      return true;
    }
    return false;
  });
  console.log('Save clicked:', saved);

  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'scripts/linkedin/about_after_save.png' });
  console.log('Screenshot saved to scripts/linkedin/about_after_save.png');

  browser.disconnect();
}

updateAboutSection().catch(console.error);

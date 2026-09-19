import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const BASE = process.env.BASE ?? 'http://127.0.0.1:8433';
const OUT = '../audit/screenshots/tpl';
mkdirSync(OUT, { recursive: true });
const T = [
  ['hub','/en-uk/corporate-finance'], ['leaf','/en-uk/corporate-finance/debt-and-working-capital'],
  ['teamindex','/en-uk/about-us/team'], ['member','/en-uk/team/raju-venkataraman'],
  ['insights','/en-uk/insights'], ['contact','/en-uk/contact'],
  ['careers','/en-uk/careers'], ['legal','/en-uk/legal/privacy-policy'],
];
const browser = await chromium.launch();
for (const [w,h] of [[375,812],[1440,900]]) {
  const ctx = await browser.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  // Seed the consent choice so the banner never covers the page being critiqued.
  await ctx.addInitScript(() => { try { localStorage.setItem('adan.consent.v1','rejected'); } catch {} });
  const page = await ctx.newPage();
  for (const [name,path] of T) {
    await page.goto(BASE+path, { waitUntil:'networkidle' });
    await page.waitForTimeout(200);
    await page.screenshot({ path:`${OUT}/${name}-${w}.png`, fullPage: w===1440 });
  }
  await ctx.close();
}
await browser.close();
console.log('captured', T.length*2, 'screenshots to audit/screenshots/tpl/');

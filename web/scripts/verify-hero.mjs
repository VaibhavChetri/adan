/* Verifies the hero owns the first screen: nothing from the section below it may
   be visible before the user scrolls, and the hero's own content must not be
   clipped. One page, resized - spawning a context per viewport was far slower. */
import { chromium } from 'playwright';

const VIEWPORTS = [
  [1440, 900], [1440, 855], [1440, 790], [1512, 820], [1680, 1050],
  [1920, 1080], [1366, 768], [1280, 800], [1280, 700], [1024, 768],
  [1024, 600], [834, 1112], [768, 1024], [390, 844], [375, 812], [360, 740],
];

const b = await chromium.launch();
const ctx = await b.newContext({ deviceScaleFactor: 1 });
await ctx.addInitScript(() => { try { localStorage.setItem('adan.consent.v1', 'rejected'); } catch {} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:8433/', { waitUntil: 'load' });
// Only the hero's own image. Awaiting decode() on every image hangs forever:
// the lazy team headshots below the fold never begin loading, so their promise
// never settles.
await p.evaluate(() => {
  const i = document.querySelector('.flow__hub img');
  return i ? Promise.race([i.decode().catch(() => {}), new Promise(r => setTimeout(r, 3000))]) : null;
});

let fails = 0;
const lines = ['viewport     heroH   next@     vh   verdict'];
console.log(lines[0]);
for (const [w, h] of VIEWPORTS) {
  await p.setViewportSize({ width: w, height: h });
  await p.waitForTimeout(120);
  const r = await p.evaluate(() => {
    const hero = document.querySelector('.hero');
    const hb = hero.getBoundingClientRect();
    return {
      heroH: Math.round(hb.height),
      heroBottom: Math.round(hb.bottom),
      nextTop: Math.round(hero.nextElementSibling.getBoundingClientRect().top),
      vh: innerHeight,
      ctaBottom: Math.round(hero.querySelector('.hero__actions').getBoundingClientRect().bottom),
      diagBottom: Math.round(hero.querySelector('.flow').getBoundingClientRect().bottom),
      overflowX: document.documentElement.scrollWidth > innerWidth,
    };
  });
  const clean = w >= 1024 ? r.nextTop >= r.vh : true;   // two-column widths only
  // Compare bottoms to the hero's own bottom. Both are viewport-relative;
  // measuring them against the hero's *height* ignored its 80px offset under
  // the header and reported a false clip wherever the content filled the box.
  const intact = r.ctaBottom <= r.heroBottom + 1 && r.diagBottom <= r.heroBottom + 1 && !r.overflowX;
  const ok = clean && intact;
  if (!ok) fails++;
  const line = `${String(w).padStart(4)}x${String(h).padEnd(5)} ${String(r.heroH).padStart(6)} ${String(r.nextTop).padStart(7)} ${String(r.vh).padStart(6)}   ` +
    (ok ? 'PASS' : `FAIL${clean ? '' : ' bleed'}${intact ? '' : ' clipped'}`);
  lines.push(line); console.log(line);
}
await b.close();
const verdict = fails === 0 ? 'ALL PASS' : `${fails} FAILED`;
console.log('\n' + verdict);
// stdout is buffered when redirected, so the verdict also lands on disk.
const { writeFileSync } = await import('node:fs');
writeFileSync('../audit/preflight/hero-viewports.txt', lines.join('\n') + '\n\n' + verdict + '\n');
process.exit(fails ? 1 : 0);

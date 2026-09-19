/** Critique-loop harness. Runs every template at both review widths and
 *  reports the DESIGN.md constraints. Fails loudly; prints a table. */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE = process.env.BASE ?? 'http://127.0.0.1:8433';
const TEMPLATES = [
  ['home',          '/'],
  ['service hub',   '/en-uk/corporate-finance'],
  ['service leaf',  '/en-uk/corporate-finance/debt-and-working-capital'],
  ['team index',    '/en-uk/about-us/team'],
  ['team member',   '/en-uk/team/raju-venkataraman'],
  ['insights',      '/en-uk/insights'],
  ['contact',       '/en-uk/contact'],
  ['careers',       '/en-uk/careers'],
  ['legal',         '/en-uk/legal/privacy-policy'],
];
const WIDTHS = [[375, 812], [1440, 900]];

const AUDIT = `async () => {
  const de = document.documentElement;
  const rej = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Reject');
  if (rej) rej.click();
  await new Promise(r => setTimeout(r, 120));
  const hit = el => { const r = el.getBoundingClientRect(); const a = getComputedStyle(el, '::after');
    if (a.content && a.content !== 'none') {
      const i = [a.insetBlockStart, a.insetInlineEnd, a.insetBlockEnd, a.insetInlineStart].map(v => parseFloat(v) || 0);
      return { w: r.width - i[1] - i[3], h: r.height - i[0] - i[2] };
    } return { w: r.width, h: r.height }; };
  const small = [...document.querySelectorAll('a,button,input,select,textarea')]
    .map(e => ({ e, r: e.getBoundingClientRect(), hb: hit(e) }))
    .filter(o => o.r.width > 0 && o.r.height > 0 && (o.hb.w < 24 || o.hb.h < 24))
    .map(o => o.e.tagName + ':' + (o.e.textContent || '').trim().slice(0, 18) + ' ' + Math.round(o.hb.w) + 'x' + Math.round(o.hb.h));
  const tiny = [...document.querySelectorAll('body *')]
    .filter(e => e.children.length === 0 && (e.textContent || '').trim().length > 3)
    .map(e => ({ px: parseFloat(getComputedStyle(e).fontSize), t: (e.textContent || '').trim().slice(0, 20) }))
    .filter(o => o.px && o.px < 14);
  const wide = [...document.querySelectorAll('body *')].map(e => ({ e, r: e.getBoundingClientRect() }))
    .filter(o => o.r.width > 0 && o.r.right > de.clientWidth + 1)
    .slice(0, 3).map(o => o.e.tagName + '.' + String(o.e.className).split(' ')[0] + ' right=' + Math.round(o.r.right));
  const res = await axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] });
  const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]);
  let skips = 0;
  for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i-1] > 1) skips++;
  return {
    overflow: de.scrollWidth > de.clientWidth + 1 ? de.scrollWidth : 0,
    overflowEls: wide,
    tiny: tiny.length, tinySample: tiny.slice(0, 3),
    small: small.length, smallSample: small.slice(0, 3),
    h1: document.querySelectorAll('h1').length,
    headingSkips: skips,
    violations: res.violations.map(v => v.id + ':' + v.impact + ':' + v.nodes.length),
    passes: res.passes.length,
  };
}`;

const browser = await chromium.launch();
let fails = 0;
const rows = [];
for (const [w, h] of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript({ content: axeSource });
  const page = await ctx.newPage();
  for (const [name, path] of TEMPLATES) {
    const resp = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const r = await page.evaluate(`(${AUDIT})()`);
    const bad = r.overflow || r.tiny || r.small || r.h1 !== 1 || r.headingSkips || r.violations.length;
    if (bad) fails++;
    rows.push({ w, name, status: resp?.status(), ...r, ok: !bad });
  }
  await ctx.close();
}
await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log(pad('width', 7) + pad('template', 14) + pad('code', 6) + pad('H1', 4) +
            pad('skip', 6) + pad('<14px', 7) + pad('<24tap', 8) + pad('ovf', 6) + pad('axe', 6) + 'ok');
console.log('-'.repeat(78));
for (const r of rows) {
  console.log(pad(r.w, 7) + pad(r.name, 14) + pad(r.status, 6) + pad(r.h1, 4) +
    pad(r.headingSkips, 6) + pad(r.tiny, 7) + pad(r.small, 8) + pad(r.overflow || '-', 6) +
    pad(r.violations.length, 6) + (r.ok ? 'PASS' : 'FAIL'));
}
console.log('-'.repeat(78));
for (const r of rows.filter(x => !x.ok)) {
  console.log(`\n${r.w}px ${r.name}:`);
  if (r.violations.length) console.log('   axe      ', r.violations.join(', '));
  if (r.tiny)    console.log('   <14px    ', JSON.stringify(r.tinySample));
  if (r.small)   console.log('   <24 tap  ', JSON.stringify(r.smallSample));
  if (r.overflow)console.log('   overflow ', r.overflow, JSON.stringify(r.overflowEls));
  if (r.h1 !== 1)console.log('   H1 count ', r.h1);
  if (r.headingSkips) console.log('   heading level skips', r.headingSkips);
}
console.log(`\n${rows.length - fails}/${rows.length} template/width combinations pass`);
process.exit(fails ? 1 : 0);

/** Pre-launch gate. Exits non-zero on any failure. Nothing ships on a red gate. */
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE = process.env.BASE ?? 'http://127.0.0.1:8433';
const OUT = '../audit/preflight';
mkdirSync(OUT, { recursive: true });

const TEMPLATES = [
  ['home','/'], ['service hub','/en-uk/corporate-finance'],
  ['service leaf','/en-uk/corporate-finance/debt-and-working-capital'],
  ['team index','/en-uk/about-us/team'], ['team member','/en-uk/team/raju-venkataraman'],
  ['insights','/en-uk/insights'], ['contact','/en-uk/contact'],
  ['careers','/en-uk/careers'], ['legal','/en-uk/legal/privacy-policy'],
];

const CHECK = `async () => {
  const de = document.documentElement;
  // Measures the drawn hit area. The ::after used to be sized by negative insets,
  // so this read those; it now carries an explicit block/inline size, which the
  // inset arithmetic could not see and scored as a failure at a passing size.
  // Used size wins where the pseudo-element declares one.
  const hit = el => { const r = el.getBoundingClientRect(); const a = getComputedStyle(el,'::after');
    if (!a.content || a.content === 'none') return { w:r.width, h:r.height };
    const pw = parseFloat(a.inlineSize), ph = parseFloat(a.blockSize);
    if (pw > 0 && ph > 0) return { w:Math.max(r.width,pw), h:Math.max(r.height,ph) };
    const i=[a.insetBlockStart,a.insetInlineEnd,a.insetBlockEnd,a.insetInlineStart].map(v=>parseFloat(v)||0);
    return { w:r.width-i[1]-i[3], h:r.height-i[0]-i[2] }; };

  // 1. AI-generated imagery of people
  const aiImg = [...document.images].filter(i => /i\\.ibb\\.co|gemini|midjourney|dalle|stable-?diffusion|generated/i.test(i.src))
    .map(i => i.src.slice(0,110));
  // 2. dead hrefs: empty, bare '#', or a fragment whose target is not on the
  //    page. The fragment case is what let every nav link ship broken - the
  //    header still pointed at the single-page build's section anchors, which
  //    this check could not see because the href was not empty.
  const emptyHref = [...document.querySelectorAll('a')]
    .filter(a => {
      const h = a.getAttribute('href');
      if (h === null || h.trim() === '' || h.trim() === '#') return true;
      if (!h.startsWith('#')) return false;
      const id = decodeURIComponent(h.slice(1));
      // No nested template literal here: CHECK is itself a Node template
      // string, so an inner placeholder interpolates in Node, not in the page.
      return !document.getElementById(id) && !document.querySelector('[name="' + CSS.escape(id) + '"]');
    })
    .map(a => ((a.textContent||'').trim().slice(0,24) || '(no text)') + ' -> ' + (a.getAttribute('href') || 'none'));
  // 3. TKTK placeholders
  const tk = (document.body.innerText.match(/TKTK|TK–|\\bTK\\b/g) || []).length;
  const tkSample = [...document.querySelectorAll('.tk')].slice(0,4).map(e => (e.textContent||'').trim());
  // 4. one H1
  const h1 = document.querySelectorAll('h1').length;
  // 5. horizontal overflow
  const overflow = de.scrollWidth > de.clientWidth + 1 ? de.scrollWidth : 0;
  // 6. text below 14px
  const tiny = [...document.querySelectorAll('body *')]
    .filter(e => e.children.length === 0 && (e.textContent||'').trim().length > 3)
    .map(e => ({ px: parseFloat(getComputedStyle(e).fontSize), t:(e.textContent||'').trim().slice(0,20) }))
    .filter(o => o.px && o.px < 14);
  // 7. tap targets below 44x44 (stricter than the WCAG 24px floor)
  const tap44 = [...document.querySelectorAll('a,button,input,select,textarea')]
    .map(e => ({ e, r:e.getBoundingClientRect(), hb:hit(e) }))
    .filter(o => o.r.width>0 && o.r.height>0 && (o.hb.w<44 || o.hb.h<44))
    .map(o => o.e.tagName+':'+((o.e.textContent||'').trim().slice(0,16)||'(icon)')+' '+Math.round(o.hb.w)+'x'+Math.round(o.hb.h));
  // 8. consent: nothing set before a choice
  const cookies = document.cookie ? document.cookie.split(';').map(c=>c.split('=')[0].trim()) : [];
  const consentUI = !!document.querySelector('[aria-label="Cookie choices"]');
  // 9. prefers-reduced-motion
  const prm = [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r=>/prefers-reduced-motion/.test(r.cssText)); } catch { return false; } });

  const res = await axe.run(document, { runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] });
  return { aiImg, emptyHref, tk, tkSample, h1, overflow, tiny:tiny.length, tinySample:tiny.slice(0,3),
           tap44:tap44.length, tap44Sample:tap44.slice(0,5), cookies, consentUI, prm,
           axe: res.violations.map(v=>v.id+':'+v.impact+':'+v.nodes.length), axePasses: res.passes.length };
}`;

const browser = await chromium.launch();
const rows = [];
for (const [w,h] of [[375,812],[1440,900]]) {
  const ctx = await browser.newContext({ viewport:{width:w,height:h} });
  await ctx.addInitScript({ content: axeSource });
  const page = await ctx.newPage();
  for (const [name, path] of TEMPLATES) {
    await page.goto(BASE+path, { waitUntil:'networkidle' });
    rows.push({ width:w, template:name, path, ...(await page.evaluate(`(${CHECK})()`)) });
  }
  await ctx.close();
}
await browser.close();

const GATES = [
  ['AI imagery of people',      r => r.aiImg.length === 0,      r => r.aiImg.join(', ')],
  ['empty/# href',              r => r.emptyHref.length === 0,  r => r.emptyHref.join(', ')],
  ['TKTK placeholders',         r => r.tk === 0,                r => `${r.tk} occurrences: ${r.tkSample.join(' | ')}`],
  ['one H1 per page',           r => r.h1 === 1,                r => `H1 count ${r.h1}`],
  ['no overflow at 375',        r => r.width !== 375 || !r.overflow, r => `scrollWidth ${r.overflow}`],
  ['no text below 14px',        r => r.tiny === 0,              r => JSON.stringify(r.tinySample)],
  ['tap targets >= 44x44',      r => r.tap44 === 0,             r => `${r.tap44}: ${r.tap44Sample.join(', ')}`],
  ['no cookies before consent', r => r.cookies.length === 0,    r => r.cookies.join(', ')],
  ['consent UI present',        r => r.consentUI,               () => 'no consent region found'],
  ['prefers-reduced-motion',    r => r.prm,                     () => 'no rule in any stylesheet'],
  ['axe: zero violations',      r => r.axe.length === 0,        r => r.axe.join(', ')],
];

const failures = [];
for (const r of rows) for (const [name, pass, detail] of GATES)
  if (!pass(r)) failures.push({ width:r.width, template:r.template, gate:name, detail:detail(r) });

const pad=(s,n)=>String(s).padEnd(n);
console.log('\nPRE-LAUNCH GATE — ' + BASE);
console.log('='.repeat(76));
const byGate = {};
for (const [name] of GATES) byGate[name] = failures.filter(f=>f.gate===name).length;
for (const [name] of GATES) {
  const n = byGate[name];
  console.log(pad(name, 30) + pad(n ? `FAIL (${n}/${rows.length})` : 'PASS', 18) + (n ? '<-- BLOCKS LAUNCH' : ''));
}
console.log('='.repeat(76));
console.log(`${rows.length - new Set(failures.map(f=>f.width+f.template)).size}/${rows.length} template/width combinations fully clean`);

if (failures.length) {
  console.log('\nFAILURE DETAIL (first per gate/template):');
  const seen = new Set();
  for (const f of failures) {
    const k = f.gate + f.template;
    if (seen.has(k)) continue; seen.add(k);
    console.log(`  [${f.width}] ${pad(f.template,14)} ${pad(f.gate,26)} ${f.detail.slice(0,80)}`);
  }
}
writeFileSync(`${OUT}/gate.json`, JSON.stringify({ base:BASE, when:new Date().toISOString(), rows, failures }, null, 2));
console.log(`\nGATE: ${failures.length ? 'RED' : 'GREEN'}  (${failures.length} failures)  -> audit/preflight/gate.json`);
process.exit(failures.length ? 1 : 0);

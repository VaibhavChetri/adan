/* Measures every rendered text node against its effective background.
   axe reports "incomplete" rather than "violation" where a gradient sits behind
   the text, so the new dark hero was passing the gate unverified. This walks up
   the ancestor chain for the first opaque background and computes the ratio. */
import { chromium } from 'playwright';

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => { try { localStorage.setItem('adan.consent.v1', 'rejected'); } catch {} });
const p = await ctx.newPage();
await p.goto(process.env.BASE ?? 'http://127.0.0.1:8433/', { waitUntil: 'load' });
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
  scrollTo(0, 0);
});

const rows = await p.evaluate(() => {
  const lum = (r, g, b) => {
    const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = s => (s.match(/[\d.]+/g) || []).map(Number);
  const bgOf = el => {
    for (let n = el; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      const v = parse(c);
      if (v.length >= 3 && (v[3] === undefined || v[3] > 0.95)) return v;
    }
    return [255, 255, 255];
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.childElementCount) continue;
    const t = (el.textContent || '').trim();
    if (t.length < 2) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    // Visually-hidden text: the 1x1 + clip-path pattern used by .u-hidden-text
    // and .flow__caption. It is clipped away, so no contrast ratio applies to
    // it - and no glyph can render inside 1px, so this cannot mask real text.
    // Without this the gate reads the colour such an element INHERITS, which on
    // a white icon button is white on white and reports a 1:1 failure nobody
    // can see.
    if (r.width <= 1 || r.height <= 1) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const fg = parse(cs.color), bg = bgOf(el);
    const L1 = lum(fg[0], fg[1], fg[2]), L2 = lum(bg[0], bg[1], bg[2]);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize), wt = parseInt(cs.fontWeight) || 400;
    const large = px >= 24 || (px >= 18.66 && wt >= 700);
    const need = large ? 3 : 4.5;
    if (ratio < need) out.push({
      t: t.slice(0, 34), ratio: +ratio.toFixed(2), need, px: +px.toFixed(1), wt,
      fg: cs.color, bg: `rgb(${bg.slice(0, 3).join(',')})`, cls: el.className?.toString().slice(0, 30),
    });
  }
  return out;
});
await b.close();
if (!rows.length) console.log('PASS — every text pair clears WCAG 2.2 AA');
else { console.log(`${rows.length} FAILING PAIRS\n`); rows.forEach(r => console.log(`${String(r.ratio).padStart(5)}:1 (needs ${r.need})  ${String(r.px)}px/${r.wt}  ${r.fg} on ${r.bg}  .${r.cls}  "${r.t}"`)); }
process.exit(rows.length ? 1 : 0);

/** Mobile responsiveness probe.
 *
 *  Reports, per page per width:
 *    - horizontal page scroll (the bug a user feels as "it wobbles sideways")
 *    - every element whose box crosses the viewport edge, with the offender's
 *      own rect, so the fix targets the element and not its parent
 *    - tap targets failing WCAG 2.2 AA 2.5.8 (24px, with its real exceptions)
 *    - rendered text under the 14px floor DESIGN.md sets
 *
 *  Culprit reporting walks the tree and keeps only the OUTERMOST overflowing
 *  element on each branch. A child that overflows because its parent is too
 *  wide is noise; reporting both doubles the list and hides which one to fix.
 *
 *  Usage: node scripts/mobile.mjs [baseUrl] [--shot]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2]?.startsWith('http') ? process.argv[2] : 'http://localhost:4321';
const SHOT = process.argv.includes('--shot');
const SHOT_DIR = new URL('../../audit/mobile/', import.meta.url).pathname;

/* Real device geometry, narrowest first - WIDTH AND HEIGHT, because height is
   not decoration here. An earlier version of this file tested every width at a
   height of 900 and therefore passed a bug where the open menu was taller than
   a 568px phone and its last four links could not be reached at all: no phone
   is 900px tall, so the whole class of vertical bugs was invisible. Each pair
   below is a device that exists.
     320x568  iPhone SE 1 / small Android - the shortest screen still in use
     375x667  iPhone SE 2 and 3
     390x844  iPhone 14 / 15
     430x932  iPhone 16 Pro Max
     768x1024 iPad portrait      1024x768  iPad landscape
     1199/1200 the pixels either side of the capital-flow breakpoint */
const SIZES = [
  [320, 568], [360, 640], [375, 667], [390, 844], [414, 896], [430, 932],
  [699, 900], [700, 900],
  [768, 1024], [820, 1180], [1024, 768], [1180, 820],
  [1199, 900], [1200, 900], [1440, 900],
];
/* 699/700 and 1199/1200 are not devices: they are the pixels either side of
   the hero-flow and capital-flow breakpoints. Both diagrams swap layout there,
   and a swap is exactly where a rule gets left behind - the capital flow had
   five cells stranded on one side of its boundary. Test both sides of each. */

const PAGES = [
  ['home', '/'],
  ['team', '/en-uk/about-us/team'],
  ['contact', '/en-uk/contact'],
  ['insights', '/en-uk/insights'],
  ['services', '/en-uk/services'],
];

const probe = () => {
  const vw = window.innerWidth;
  const de = document.documentElement;

  const overflow = [];
  const seen = new Set();
  const walk = (el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) { for (const c of el.children) walk(c); return; }
    // Parked far off-canvas on purpose: the skip link and the other
    // visually-hidden controls that slide in on focus. Not a layout bleed, and
    // reporting them drowns the real ones.
    if (r.right < -500) { for (const c of el.children) walk(c); return; }
    // 1px of slack: subpixel layout rounds, and a 0.5px bleed is not a bug.
    const over = r.right > vw + 1 || r.left < -1;
    if (over && !seen.has(el)) {
      // Keep the outermost offender only; mark the subtree as accounted for.
      const mark = (n) => { seen.add(n); for (const c of n.children) mark(c); };
      mark(el);
      overflow.push({
        sel: el.tagName.toLowerCase() +
             (el.id ? `#${el.id}` : '') +
             (el.className && typeof el.className === 'string'
               ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
        left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
      });
      return;
    }
    for (const c of el.children) walk(c);
  };
  walk(document.body);

  /* WCAG 2.2 AA 2.5.8, applied as written rather than as "everything must be
     44px". A target under 24x24 still passes if no other target's 24px circle
     overlaps its own - which is what padding on the LIST ITEM buys a short
     link. Testing the box alone reports every text link in every list as a
     failure and buries the real ones. Links inside a sentence are exempt
     outright (the inline exception), so a target sharing a line with text it
     does not own is skipped. */
  const MIN = 24;
  /* `fixed` records whether a target floats above the page (a sticky header, a
     consent banner) or scrolls with it. Neighbour distance is only meaningful
     WITHIN one of those groups: a fixed banner's button can land a few pixels
     from a link it is painted over, and a tap there hits the button, not the
     link - which is occlusion, not insufficient spacing. Comparing across the
     two groups made this test depend on where the banner happened to sit, so
     it failed at 360x640 and passed at 320x568 for the same markup. */
  const isFixed = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const p = getComputedStyle(n).position;
      if (p === 'fixed' || p === 'sticky') return true;
    }
    return false;
  };
  const targets = [...document.querySelectorAll('a,button,input,select,textarea,summary')]
    .map((el) => ({ el, r: el.getBoundingClientRect(), fixed: isFixed(el) }))
    .filter(({ el, r }) => r.width > 1 && r.height > 1 &&
      getComputedStyle(el).visibility !== 'hidden' && r.left > -1000);

  const small = [];
  for (const { el, r, fixed } of targets) {
    if (r.width >= MIN && r.height >= MIN) continue;
    // Inline exception: the parent holds text this link is not the whole of.
    const p = el.parentElement;
    const own = (el.textContent || '').trim();
    const all = (p?.textContent || '').trim();
    if (p && all.length > own.length + 2 &&
        getComputedStyle(p).display.includes('block') === false) continue;

    // Spacing exception: nearest other target centre must be >= 24px away.
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let near = Infinity;
    for (const o of targets) {
      if (o.el === el || o.fixed !== fixed) continue;
      const d = Math.hypot(cx - (o.r.left + o.r.width / 2),
                           cy - (o.r.top + o.r.height / 2));
      if (d < near) near = d;
    }
    if (near >= MIN) continue;

    small.push({ sel: el.tagName.toLowerCase() +
                   (el.className ? '.' + String(el.className).trim().split(/\s+/).join('.') : ''),
                 w: Math.round(r.width), h: Math.round(r.height),
                 pitch: Math.round(near),
                 text: (el.textContent || '').trim().slice(0, 28) });
  }

  const tiny = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.childNodes.length) continue;
    const hasText = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) continue;   // visually-hidden text
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 13.5) tiny.push({ sel: el.tagName.toLowerCase() + '.' + (el.className || ''), px });
  }

  return {
    scrollW: de.scrollWidth, vw,
    overflow: overflow.slice(0, 14),
    small: small.slice(0, 8),
    tiny: tiny.slice(0, 8),
  };
};

const browser = await chromium.launch();
let fails = 0;

for (const [name, path] of PAGES) {
  /* Narrow widths are checked TWICE: once as a real phone (touch, coarse
     pointer, no hover) and once as a resized desktop window (mouse, fine
     pointer, hover). They are not the same environment - `hover:hover` and
     `pointer:fine` resolve differently, so a rule gated on either applies in
     one and not the other - and a resized window is how the site is actually
     eyeballed during development. Testing only the emulated phone leaves the
     case the developer is looking at untested. */
  for (const [w, h] of SIZES) {
   for (const phone of (w < 768 ? [true, false] : [false])) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 2,
      isMobile: phone,
      hasTouch: phone,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const r = await page.evaluate(probe);

    /* The menu is the one thing here that is invisible until a tap, so nothing
       above ever measured it. It shipped a bug precisely there: the header is
       sticky, so once the open panel grew taller than the viewport its last
       item was pinned off screen and no page scrolling could reach it. This
       opens it and checks every link can actually be brought into view. */
    let menu = null;
    const toggle = await page.$('button.nav-toggle');
    if (toggle && await toggle.isVisible()) {
      await toggle.click();
      await page.waitForSelector('#nav-mobile:not([hidden])');
      menu = await page.evaluate(() => {
        const nav = document.querySelector('#nav-mobile');
        const consent = document.querySelector('.consent');
        const floor = consent && !consent.hidden
          ? consent.getBoundingClientRect().top : window.innerHeight;
        const bad = [];
        for (const a of nav.querySelectorAll('a')) {
          // Scroll the panel so this link is as high as it will go, then ask
          // whether it is clear of both the top and whatever overlays the foot.
          a.scrollIntoView({ block: 'start' });
          const r = a.getBoundingClientRect();
          if (r.top < 0 || r.bottom > floor) {
            bad.push(`${a.textContent.trim()} [${Math.round(r.top)}..${Math.round(r.bottom)}] floor=${Math.round(floor)}`);
          }
        }
        return { count: nav.querySelectorAll('a').length, unreachable: bad };
      });
      await toggle.click();
    }
    if (menu?.unreachable.length) r.overflow.push(
      ...menu.unreachable.map((m) => ({ sel: `MENU UNREACHABLE ${m}`, left: 0, right: 0, w: 0 })));

    const bleed = r.scrollW - r.vw;
    const bad = bleed > 1 || r.overflow.length || r.small.length || r.tiny.length;
    if (bad) fails++;

    console.log(`\n${bad ? 'FAIL' : ' ok '}  ${name} @ ${w}x${h} ${phone ? "phone " : "window"}   scrollWidth ${r.scrollW}${bleed > 1 ? `  (+${bleed} BLEED)` : ''}`);
    for (const o of r.overflow) console.log(`        over: ${o.sel}  [${o.left} -> ${o.right}]  w=${o.w}`);
    for (const s of r.small)    console.log(`        tap:  ${s.sel}  ${s.w}x${s.h}  pitch=${s.pitch}  "${s.text}"`);
    for (const t of r.tiny)     console.log(`        type: ${t.sel}  ${t.px}px`);

    if (SHOT && (w === 375 || w === 768) && name === 'home') {
      mkdirSync(SHOT_DIR, { recursive: true });
      await page.screenshot({ path: `${SHOT_DIR}${name}-${w}.png`, fullPage: true });
    }
    await ctx.close();
   }
  }
}

await browser.close();
console.log(`\n${fails ? `${fails} failing combinations` : 'all clean'}`);
process.exit(fails ? 1 : 0);

# Adan Corporate — Design System

Direction A (The Record), with navy carrying structural weight and Direction C's
hairline restraint. Committed 16 September 2026.

Every ratio below was **measured**, not assumed — either from the live site via
computed styles resolved to their real painted background, or computed from the
token values here. Nav sizing was measured with Montserrat actually loaded.

---

## 0. Typefaces

Two. No more.

| Role | Face | Weights used |
|---|---|---|
| Display: h1–h3, figures, names | **Newsreader** (variable, `opsz`) | 400 display, 600 heading |
| Body, UI, nav, labels, data | **Inter** (variable) | 300, 400, 500, 600 |

### D09 — People tiles carry a hover shadow

Measured on mckinsey.com/in/overview, 2026-09-18, with a real browser after
dismissing their consent overlay (which silently intercepts pointer events and
made a first reading report "no hover effect at all").

What their card actually does on hover, and nothing else:

| Element | Rest | Hover |
|---|---|---|
| Tile | `box-shadow: none` | `rgba(5,28,44,.2) 0 16px 32px -1px, rgba(5,28,44,.15) 0 0 1px 0` |
| Name link | black, no underline | brand blue, `text-decoration: underline` |
| Photograph | — | **unchanged** |

Transition is `box-shadow .4s ease-in-out`; ours uses `--dur-slow` so reduced
motion collapses it. The photograph does not move — an image zoom was removed
when this was measured. The tile needs `z-index: 1` on hover: grid items paint
in DOM order, so otherwise the shadow is drawn under later tiles and stops at
the channel.

Superseded in part: the shipped value is the brief's `0 2px 14px rgba(0,0,0,.16)`
at `.25s ease`, not their measured two-layer shadow, and it also applies to
`.btn--secondary:hover`. The measurements above stay because they are the record
of what the reference actually does.

Two deliberate departures from the brief, both recorded so they are not read as
mistakes:

- **Accent stays Adan navy.** The brief specifies `--link: #2251ff`, which is
  McKinsey's own brand blue (confirmed from their computed styles). A firm's site
  should not wear a competitor's brand hue. One token flips it if that was intended.
- **Mail button is a 32px disc inside a 44px target.** The brief asks for a 32px
  button; the tap-target gate requires 44. The anchor stays 44x44 and transparent
  and `::before` paints the 32px disc. Shrinking the anchor fails the gate.

### D08 — Newsreader and Inter replace Source Serif 4 and IBM Plex Sans

Requested directly: match the McKinsey pairing. Their own faces cannot be used.
McKinsey Sans was commissioned for them exclusively and is not sold; their
display serif is licensed to them. Serving either from adancorporate.com would
mean serving another firm's licensed brand asset. These are the closest faces
that can actually ship, both SIL OFL.

- **Newsreader over Source Serif 4.** Source Serif is a sturdy workhorse with
  low stroke contrast — it reads solid rather than editorial at display size.
  Newsreader has fine hairlines and sharp bracketed serifs, so a large name
  looks set rather than enlarged. Still variable on `opsz`, so D07's rule that
  the drawing tightens with size is unchanged.
- **Inter over IBM Plex Sans.** Plex carries signature details — flared stems,
  a tailed `a`, a distinctive `g` — that read as IBM's. McKinsey Sans is
  deliberately neutral, and the neutrality is the point: the sans should not
  have a voice of its own next to the serif.
- **What did NOT change.** The type scale, the weights, the display-only rule
  for the serif, and the 14px `--t-micro` floor. This is a face swap on the
  existing scale, not a new scale.
- **Tabular figures.** Plex was partly chosen for genuine `tnum`. Inter has
  `tnum` too, so `--numeric-tabular` still holds on the deal figures. Verify it
  on any new figure row rather than assuming.

### D07 — Montserrat is replaced by a serif

Montserrat is a geometric sans. IBM Plex Sans is a humanist sans. Pairing them
broke the rule that two faces must differ on an axis, not by a degree: they were
similar but not identical, which is the pairing that reads as a template. A
serif against Plex is a real contrast axis.

The practical consequences, all of which are already in `globals.css`:

- **The serif is for display only.** Anything small, uppercase or letter-spaced
  is UI furniture and stays in Plex. A serif drawn at 13px with 0.1em tracking
  is fighting its own construction. Ten rules moved back when the face changed;
  `--font-display` on an element under 20px is a bug.
- **Display weight went down as size went up.** `--w-display: 400`. Large and
  light reads as editorial; large and bold reads as a landing page. Montserrat
  700 at 64px was the single loudest thing on the homepage.
- **`opsz` is live.** The variable optical-size axis is requested in
  `layout.tsx`, so the drawing tightens as the size grows instead of being
  scaled up. Dropping the axis to save weight would flatten the display sizes —
  do not.

### Why IBM Plex Sans replaces Open Sans

Open Sans is the most over-used text face on the web and dates the site as much
as the WhatsApp share button does. Two candidates were considered.

**Libre Franklin** — Franklin Gothic lineage, 100–900, tabular figures. Reads as
newspaper and annual-report authority, and contrasts well against geometric
Montserrat. Rejected on one specific ground: its tighter apertures and narrower
counters lose legibility at exactly the small sizes this system exists to
rescue. The whole defect being fixed is text that shrank to 8.96px; choosing a
face that is weakest at 14–16px works against the fix.

**IBM Plex Sans — chosen.** Genuine `tnum` tabular figures, well drawn, which the
deal record depends on. Weights 300–600 with true italics, so hierarchy can come
from weight rather than size — which keeps the page calm and stops sizes
drifting upward to signal importance. It holds its shape at the 14px floor, the
size that matters most here. It has character without being loud: engineered and
precise, which suits diligence work. And `IBM Plex Mono` is a sibling, so if deal
tables ever need a monospace column it arrives inside the same family and the
two-typeface limit still holds.

```css
--font-display: Montserrat, "Helvetica Neue", Helvetica, sans-serif;
--font-text: "IBM Plex Sans", "Helvetica Neue", Helvetica, sans-serif;
--numeric-tabular: "tnum" 1, "lnum" 1;   /* apply to all figures in the deal record */
```

---

## 1. Primitive tokens

Raw values. Nothing references these directly except the semantic layer.

```css
:root {
  /* Ink — measured from the live site */
  --c-ink-900:  #111111;
  --c-ink-800:  #222222;
  --c-ink-600:  #3F3F3F;
  --c-ink-500:  #5A5A5A;

  /* Navy — recovered from logo.webp, absent from the current stylesheet */
  --c-navy-900: #001640;
  --c-navy-700: #002060;   /* the logo navy */
  --c-navy-500: #26407F;

  /* Red — sampled from logo.webp (#BC0000–#BE0101), live on the contact button */
  --c-red-700:  #C00000;

  /* Paper */
  --c-paper-000: #FFFFFF;
  --c-paper-050: #F8F8F8;
  --c-paper-100: #ECECEC;
  --c-paper-200: #DDDDDD;
  --c-paper-300: #CCCCCC;
}
```

`#E80000`, the red currently in `main.css`, is **retired**. It measures 4.74:1 on
white — clearing AA by a quarter of a point, so any opacity or small-size
anti-aliasing breaks it. The logo red `#C00000` measures 6.48:1 and is already in
use on the live contact button.

## 2. Semantic tokens, with measured ratios

```css
:root {
  --surface:          var(--c-paper-000);
  --surface-sunken:   var(--c-paper-050);
  --surface-inverse:  var(--c-navy-700);
  --surface-ink:      var(--c-ink-900);

  --text:             var(--c-ink-800);
  --text-strong:      var(--c-ink-900);
  --text-muted:       var(--c-ink-500);
  --text-on-inverse:  var(--c-paper-000);
  --text-on-ink:      var(--c-paper-100);

  --accent:           var(--c-navy-700);   /* structure, links, active state */
  --action:           var(--c-red-700);    /* ONE primary action per page */

  --rule:             var(--c-paper-300);  /* hairline on paper */
  --rule-strong:      var(--c-ink-600);
  --rule-on-inverse:  rgba(255,255,255,0.28);
}
```

### Every pair, measured

| Foreground | Background | Ratio | Body 4.5 | Large 3.0 | Non-text 3.0 |
|---|---|---:|:--:|:--:|:--:|
| `--text` #222222 | `--surface` #FFFFFF | **15.91** | PASS | PASS | PASS |
| `--text` #222222 | `--surface-sunken` #F8F8F8 | **14.98** | PASS | PASS | PASS |
| `--text-strong` #111111 | `--surface` #FFFFFF | **18.88** | PASS | PASS | PASS |
| `--text-strong` #111111 | `--surface-sunken` #F8F8F8 | **17.78** | PASS | PASS | PASS |
| `--text-muted` #5A5A5A | `--surface` #FFFFFF | **6.90** | PASS | PASS | PASS |
| `--text-muted` #5A5A5A | `--surface-sunken` #F8F8F8 | **6.49** | PASS | PASS | PASS |
| `--accent` #002060 | `--surface` #FFFFFF | **15.27** | PASS | PASS | PASS |
| `--accent` #002060 | `--surface-sunken` #F8F8F8 | **14.38** | PASS | PASS | PASS |
| `--action` #C00000 | `--surface` #FFFFFF | **6.48** | PASS | PASS | PASS |
| `--action` #C00000 | `--surface-sunken` #F8F8F8 | **6.10** | PASS | PASS | PASS |
| `--text-on-inverse` #FFFFFF | `--surface-inverse` #002060 | **15.27** | PASS | PASS | PASS |
| `--c-paper-100` #ECECEC | `--surface-inverse` #002060 | **12.92** | PASS | PASS | PASS |
| `--c-paper-300` #CCCCCC | `--surface-inverse` #002060 | **9.51** | PASS | PASS | PASS |
| `--text-on-ink` #ECECEC | `--surface-ink` #111111 | **15.98** | PASS | PASS | PASS |
| `--rule` #CCCCCC | `--surface` #FFFFFF | 1.61 | n/a | n/a | decorative only |
| `--rule-strong` #3F3F3F | `--surface` #FFFFFF | **10.53** | PASS | PASS | PASS |

### Two forbidden pairs

| Pair | Ratio | Rule |
|---|---:|---|
| `--action` #C00000 on `--surface-ink` #111111 | **2.91** | **Never.** Red must not sit on ink. |
| `--text-muted` #5A5A5A on `--surface-ink` #111111 | **2.74** | **Never.** Use `--text-on-ink`. |

`--rule` at 1.61:1 is decorative and carries no information alone. Where a rule
separates interactive regions, use `--rule-strong` at 10.53:1.

---

## 3. Type scale

**Constraint closed: no step below 14px. Body is 16px on mobile.**
Ratio 1.200 (minor third). Every size in the system is a step below. There are
no other sizes.

| Token | Mobile | Desktop | Line height | Tracking | Use |
|---|---:|---:|---:|---:|---|
| `--t-display` | 44px | 76px | 1.06 | -0.018em | Hero proposition |
| `--t-h1` | 36px | 52px | 1.10 | -0.018em | Page title |
| `--t-h2` | 28px | 40px | 1.12 | -0.018em | Section |
| `--t-h3` | 20px | 24px | 1.20 | 0 | Subsection |

Every display step moved up at D07 and the weights moved down. A serif at a
given pixel size reads optically smaller than a sans — smaller x-height, thinner
stems — so holding the old sizes would have made the page quieter, not just
different. Display tracking and leading are tokens (`--track-display`,
`--lead-display`, `--w-display`) precisely because they are the difference
between editorial and template, and must not be re-typed per rule.
| `--t-lead` | 18px | 20px | 1.55 | 0 | Standfirst |
| `--t-body` | **16px** | 17px | 1.65 | 0 | Body — mobile floor |
| `--t-nav` | 16px | **16px** | 1.20 | 0.06em | Nav, uppercase |
| `--t-small` | 15px | 15px | 1.50 | 0 | Captions, meta |
| `--t-micro` | **14px** | 14px | 1.45 | 0.02em | Legal, labels. **Floor.** |

```css
--t-display: clamp(2.5rem, 1.6rem + 4.5vw, 4rem);
--t-h1:      clamp(2rem,   1.5rem + 2.5vw, 2.75rem);
--t-h2:      clamp(1.625rem, 1.4rem + 1.1vw, 2rem);
--t-h3:      clamp(1.3125rem, 1.24rem + 0.37vw, 1.5rem);
--t-lead:    clamp(1.125rem, 1.07rem + 0.28vw, 1.25rem);
--t-body:    clamp(1rem, 0.97rem + 0.14vw, 1.0625rem);
--t-nav:     1rem;
--t-small:   0.9375rem;
--t-micro:   0.875rem;   /* 14px — nothing below this exists */
```

**Closes:** 188–331 elements under 12px per template, floor 8.96px, nav at
11.2px. Those sizes are not expressible in this system.

### Nav sizing — measured, not asserted

Five section labels rendered in Montserrat 500, uppercase, 0.06em tracking,
32px gaps, with the font confirmed loaded:

| Size | Corporate Finance | Total, 5 items + gaps | Budget at 1440 | Fits |
|---|---:|---:|---:|:--:|
| 14px | 174px | 750px | 1040px | yes |
| 15px | 186px | 794px | 1040px | yes |
| **16px** | **199px** | **838px** | **1040px** | **yes, 202px spare** |

Budget: 1280px container minus 240px logo. `--t-nav: 16px` is chosen because it
fits with 202px of headroom, not because 14px was the minimum that worked.

```css
.nav__item { white-space: nowrap; }   /* "Corporate Finance" must never wrap */
```

---

## 4. Spacing scale

Base 4px. Every gap is a step.

```css
--s-1: 4px;    --s-2: 8px;    --s-3: 12px;   --s-4: 16px;
--s-5: 24px;   --s-6: 32px;   --s-7: 48px;   --s-8: 64px;
--s-9: 96px;   --s-10: 128px; --s-11: 160px;

--section-y:       clamp(var(--s-8), 4vw + 2rem, var(--s-10));
--section-y-major: clamp(var(--s-9), 6vw + 2rem, var(--s-11));
--stack:           var(--s-5);
```

---

## 5. Container and gutter — overflow made impossible

**Constraint closed: `div.row.count-wrapper` computed 385px in a 375px viewport.**

```css
--gutter: 20px;
--measure-max: 1280px;
--measure-text: 68ch;

*, *::before, *::after { box-sizing: border-box; }

.container {
  width: min(100% - (var(--gutter) * 2), var(--measure-max));
  margin-inline: auto;
}
```

`min(100% - 2×gutter, max-width)` **cannot exceed the viewport** — it is
arithmetic, not a rule to be tested. With `border-box` inherited globally,
padding cannot push a child past its parent either. Any grid inside inherits the
constraint.

Guard for anything that escapes:

```css
html, body { overflow-x: clip; }
img, video, iframe, table, pre { max-width: 100%; }
```

---

## 6. Radii

The existing system is already square — 20 `border-radius: 0` declarations in
`main.css`, square 320×320 team frames. Formalised, not changed.

```css
--r-0: 0;       /* default. Cards, panels, images, sections. */
--r-1: 2px;     /* inputs and buttons only */
--r-pill: 999px; /* avatar crops only */
```

**No cards, no shadows, no filled panels.** Structure comes from hairline rules
and whitespace.

```css
--shadow-none: none;   /* the only shadow token. There is no other. */
```

Portrait frames — closes the stretched-headshot defect:

```css
--portrait-ratio: 1 / 1;
.portrait { aspect-ratio: var(--portrait-ratio); object-fit: cover; }
```

---

## 7. Breakpoints

Collapsing the current 600 / 767 / **770** / 992 / 1050 / 1260 / 1440 set, which
contains two near-duplicate pairs.

```css
--bp-sm:  480px;
--bp-md:  768px;
--bp-lg:  1024px;
--bp-xl:  1280px;
```

Review widths remain **375px** and **1440px**.

---

## 8. Target size

**Constraint closed: 14–100 tap targets under 24×24 per page.**

```css
--target-min: 44px;

a, button, input, select, textarea, [role="button"], [role="link"] {
  min-block-size: var(--target-min);
  min-inline-size: var(--target-min);
}
```

For inline links inside prose, where a 44px box would break the line, use a
pseudo-element to extend the hit area without affecting layout:

```css
.prose a { position: relative; min-block-size: 0; min-inline-size: 0; }
.prose a::after {
  content: ""; position: absolute; inset: -10px -4px; /* >= 24px total */
}
```

44px is a token applied by selector, not a number in a review checklist.

---

## 9. Hero and depth — revised (D05)

**There is still no media hero: no video, no stock photography, no raster hero
image, and therefore no scrim token.**

What changed in D05 is everything else. The hairline-only system was measured
against the brief and failed it: eleven consecutive prose sections, nine of them
carrying no graphic, read as a document rather than a firm. Restraint needs
something to be restrained *about*, and with 400px headshots and no vector logo
there was nothing carrying the weight.

So the system now has:

- **A two-step elevation scale**, `--e-1` and `--e-2`, both tuned on navy rather
  than neutral grey. Cards and portrait frames carry it. Body text never does.
- **A dark hero.** `--c-navy-800` with two radial washes, carrying the
  capital-flow diagram and the official badge. It is drawn entirely from tokens
  and loads no extra request.
- **Cards**, at `--r-3`, with a hairline border *and* elevation, and a
  `--travel-sm` lift on hover.
- **Scroll reveal.** Content is visible by default; the script marks elements
  pending only once it is confirmed running, then flips them in. A paused tab, a
  headless renderer or a JS failure therefore ships the page intact, never blank.

Contrast on the new dark surfaces is measured by `scripts/contrast.mjs`, not
taken from axe: axe returns *incomplete* rather than *violation* where a gradient
sits behind text, and three 14px/600 pairs shipped at 3.6:1 under its silence.

The homepage hero is typographic: proposition line, standfirst, then a counted
figure row set in IBM Plex Sans with `--numeric-tabular`.

Alongside it sits the capital-flow diagram (`app/components/FlowDiagram.tsx`),
which is **not** media under this rule. It carries no raster and no video: the
labels are HTML at `--t-small`, the wires are SVG strokes at `--rule-width` in
`--c-navy-500` and `--action`, and the hub is a two-path mark. Everything in it
is a token. It loads no extra request and needs no scrim, so the four defects
below stay impossible. Decision D03.

The labels are deliberately HTML rather than SVG `<text>`: text inside a scaled
`viewBox` resizes with the box, which put them between 9px and 14px across the
breakpoint range and breached the 14px floor in section 4.

This is a structural decision, not a stylistic one. Removing the video makes four
measured defects impossible rather than fixed:

| Closed | Was |
|---|---|
| F20 | Scrim at 0.40 where 0.71 was needed for 17px/700 hero text |
| F24 | Autoplaying YouTube background video |
| F32 | Video iframe computing 1543px wide at a 375px viewport |
| F35 | `<span class="mb_YTPTime">02 : 29 / 04 : 18</span>` visible top-left |

If a media hero is ever reinstated, the scrim returns as a token with its
measured ratio recorded beside it, and the hero text must sit at or above
18.66px/700 so the 3:1 threshold applies:

```css
/* Only if a media hero returns. Not in use. */
--scrim-strong: rgba(17, 17, 17, 0.72);  /* 4.5:1 for #ECECEC over worst-case frame */
--scrim-large:  rgba(17, 17, 17, 0.52);  /* 3.0:1, valid only for text >= 18.66px/700 */
```

---

### D07 — elevation comes off the cards

D05 added `--e-1`/`--e-2` because a hairline-only page read as unfinished. That
diagnosis was right; the remedy was one step too far. A drop shadow plus a lift
on hover is the most-generated card treatment there is, and running it four
times down one page reads as a component library rather than a practice.

Cards are now **flat tonal tiles**: `--surface-tile` on white, white on a sunken
section, a 2px navy rule on top, and a hover that deepens the ground instead of
floating the tile off the page. The ground does the separating the shadow was
doing, and it holds up in print and at 375px where a 12px blur does not.

Elevation survives in exactly one place: `--e-nav`, on the sticky header, which
genuinely floats over content. `--e-1` and `--e-2` remain defined and are now
unused by design — if a new component reaches for one, that is the signal to ask
whether it actually floats.

The same reversal applies to `.person-card__frame`, which was lifting headshots
on hover for no reason a reader could name.

### D07 — the practice listing is not a card grid

Five practices in a three-across grid orphan the second row. `.lineup` is a
rule-separated row per practice: name, description, full service list, arrow. It
scales to any count without orphaning, gives each description the full measure,
and removes the page's fourth consecutive card grid.

## 10. Motion — every token paired

**Constraint closed: no `prefers-reduced-motion` rule existed anywhere.**

Every motion token ships with a reduced variant. One global block swaps them, so
a component cannot opt out by forgetting.

```css
:root {
  --dur-fast:   120ms;   --dur-fast-reduced:   1ms;
  --dur-base:   200ms;   --dur-base-reduced:   1ms;
  --dur-slow:   320ms;   --dur-slow-reduced:   1ms;
  --ease:       cubic-bezier(0.2, 0, 0.2, 1);
  --ease-reduced: linear;
  --travel-sm:  4px;     --travel-sm-reduced:  0px;
  --travel-md:  12px;    --travel-md-reduced:  0px;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-fast: var(--dur-fast-reduced);
    --dur-base: var(--dur-base-reduced);
    --dur-slow: var(--dur-slow-reduced);
    --ease:     var(--ease-reduced);
    --travel-sm: var(--travel-sm-reduced);
    --travel-md: var(--travel-md-reduced);
  }
  *, *::before, *::after {
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

No scroll-triggered entrance animation, no parallax. Both were in the previous
build via WOW.js and jQuery Stellar, neither honoured reduced motion.

---

## 11. Component tokens

```css
:root {
  /* Hairline rule — the primary structural device */
  --rule-width: 1px;
  --rule-style: solid;

  /* Nav */
  --nav-size: var(--t-nav);
  --nav-gap: var(--s-6);
  --nav-color: var(--text);
  --nav-color-active: var(--accent);
  --nav-underline: var(--accent);

  /* Primary action — one per page */
  --btn-bg: var(--action);
  --btn-text: var(--c-paper-000);      /* 6.48:1 measured */
  --btn-bg-hover: #A80000;
  --btn-radius: var(--r-1);
  --btn-pad: var(--s-4) var(--s-6);
  --btn-min-size: var(--target-min);

  /* Secondary action */
  --btn2-bg: transparent;
  --btn2-text: var(--accent);          /* 15.27:1 measured */
  --btn2-border: var(--rule-width) var(--rule-style) var(--accent);

  /* Navy section band */
  --band-bg: var(--surface-inverse);
  --band-text: var(--text-on-inverse); /* 15.27:1 measured */
  --band-rule: var(--rule-on-inverse);

  /* Deal record */
  --deal-figure-font: var(--font-text);
  --deal-figure-features: var(--numeric-tabular);
  --deal-figure-size: var(--t-h3);
  --deal-rule: var(--rule-width) var(--rule-style) var(--rule);
}
```

### Navy carries structure

Navy is not an accent colour in this system. It is a surface. Full-bleed navy
bands separate major sections of the page, the footer is navy, section numbering
and active nav states are navy, and rules inside navy bands use
`--rule-on-inverse`. White on navy measures **15.27:1**, so a navy band carries
body text at AAA with room to spare.

Red appears **once per page**, on the single primary action. Nowhere else.

---

## 12. Rules that keep this intact

1. **No arbitrary sizes.** Every size is a scale step. If something needs a value
   the scale lacks, change the scale and say so.
2. **No cards, no shadows, no filled panels.** Hairline rules only.
3. **No media hero.**
4. **Red never on ink** (2.91:1) and **muted text never on ink** (2.74:1).
5. **One primary action per page.**
6. **Two typefaces.** Montserrat and IBM Plex Sans. `IBM Plex Mono` counts as the
   same family if tabular columns ever need it.
7. **Every new colour pair ships with its measured ratio.** Not an estimate.

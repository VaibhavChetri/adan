# Adan Corporate — measured identity and three directions

Measured from the live site, 16 September 2026. **Nothing built. Choose a
direction and DESIGN.md gets written against it.**

## 1. What the measurements actually say

### Contrast is not the problem

Sixteen unique foreground/background pairs were measured on the team template,
each resolved to its **real** painted background by walking up the DOM until a
non-transparent colour was found — not assumed.

| Foreground | Background | Ratio | AA |
|---|---|---:|---|
| `rgb(34,34,34)` | `#FFFFFF` | **15.91** | pass |
| `rgb(17,17,17)` | `#FFFFFF` | **18.88** | pass |
| `rgb(34,34,34)` | `#F8F8F8` | **14.98** | pass |
| `rgb(236,236,236)` | `rgb(34,34,34)` | **13.47** | pass |
| `#FFFFFF` | `rgb(192,0,0)` | **6.48** | pass |
| `rgb(34,34,34)` | `rgb(153,153,153)` | 5.58 | pass (worst on page) |

**Zero failures.** The palette is already contrast-safe and should be kept, not
replaced. The defect is **size**: those same passing pairs render at 8.5px,
10px, 10.5px, 13px and 14px.

This changes what DESIGN.md is for. It is not a recolour. It is a type and
spacing system imposed on a palette that already works.

### The brand red is already on the site

`rgb(192,0,0)` = **#C00000**, measured on the live contact button. That matches
the logo red sampled from `logo.webp` (#BC0000–#BE0101). The logo navy
**#002060** appears in the logo only and nowhere in the stylesheet.

### The hero scrim exists and is under-specified

A scrim **is** present — `.bg-overlay` at `rgba(17,17,17,0.4)`. Hero text is
`rgb(236,236,236)` at **17px weight 700**, which sits just below WCAG's
18.66px large-text threshold, so it needs **4.5:1, not 3:1**.

Over a worst-case mid-luminance video frame that requires a black scrim of
**alpha 0.71**. The current value is **0.40**. If the text went to ≥18.66px at
700, 3:1 would apply and **0.52** would suffice.

axe reports `color-contrast: incomplete` rather than a violation because it
cannot sample a moving background — so this never surfaces in an automated run.

### Team photo frames

320×320, `border-radius: 0`, no border, no shadow, no filter — genuinely
restrained, and consistent with the 20 `border-radius: 0` declarations in
`main.css`. But `object-fit: fill`, and one frame computes 320×304, so
headshots are being **stretched rather than cropped**.

### Typefaces

Already exactly two: **Montserrat** (display, 18 declarations) and **Open Sans**
(body, 32). The constraint costs nothing. Open Sans is the weak half — the most
over-used text face on the web, and it dates the site as much as the WhatsApp
share button does.

## 2. What every direction must satisfy

These are structural, not stylistic. They hold whichever direction is chosen.

| Defect measured | Token that prevents recurrence |
|---|---|
| 188–331 elements under 12px, floor 8.96px | Type scale with **no step below 14px**; body **16px minimum on mobile**. Sizes exist only as scale steps — no arbitrary values. |
| Nav at 11.2px, "Corporate Finance" wrapping | Nav token ≥14px, with a measured max-width proving five sections fit on one line at 1440px. |
| 14–100 tap targets under 24×24 | `--target-min: 44px` as a **token applied to every interactive element**, not a review guideline. |
| `div.row.count-wrapper` = 385px in a 375px viewport | Container token as `min(100% - 2×gutter, max-width)` with `box-sizing: border-box`. Overflow becomes arithmetically impossible, not merely tested against. |
| No `prefers-reduced-motion` anywhere | Every motion token ships as a pair: `--motion-x` and its reduced variant, with a single global block that swaps them. |
| Scrim at 0.40, needs 0.71 | `--scrim-strong: rgba(17,17,17,0.72)` with its measured ratio recorded next to it. |
| `object-fit: fill` stretching headshots | Portrait ratio token plus `object-fit: cover`. |

## 3. Three directions

Adan's differentiator is **former C-suite operators across 19 countries and 36
real engagements** — not technology. All three read as senior. They differ in
what carries that seniority.

---

### Direction A — The Record

**Evidence carries it.** The hero becomes typographic: a proposition line and
the deal record — sectors, regions, deal sizes — set in large type with tabular
numerals. No video. Near-monochrome `#111111` / `#222222` / `#F8F8F8`, navy
`#002060` for structure and active states, `#C00000` for exactly one action per
page. Square frames retained.

**Rationale.** The firm's real asset is 36 engagements with named sectors and
deal sizes, and a partner network of former operators. Leading with stock
footage of a road is the opposite of that claim. This direction puts the
evidence where the video is.

**It also removes a whole defect class.** No media hero means no scrim, no
`color-contrast: incomplete`, no autoplaying video to exempt from reduced
motion, no 1543px iframe at a 375px viewport. Four measured findings stop being
possible rather than being fixed.

**Cost.** Depends entirely on the deal data being accurate and approved, and
the countries figure is currently contradicted on the homepage. This direction
cannot ship until those numbers are confirmed. It is also the least
conventional, and partners may read a type-led hero as austere.

**Typefaces.** Montserrat display retained, Open Sans replaced with a text face
carrying true tabular numerals.

---

### Direction B — Navy Institutional

**Colour carries it.** `#002060` becomes a primary surface, not just an accent —
navy header, navy section bands, off-white body. Red demoted to a single action.
Media hero retained but governed: `--scrim-strong: rgba(17,17,17,0.72)`,
measured, with hero type raised above the large-text threshold so the ratio has
margin.

**Rationale.** Navy is the most direct "senior corporate" signal available, it
is already in the logo, and it is absent from the stylesheet — so this recovers
an identity rather than inventing one. At 15.27:1 on white it has enormous
contrast headroom, which makes AAA reachable for body text on a site that
publishes an accessibility statement it currently fails.

**Cost.** The safest option and the least differentiated — it risks reading as a
retail bank. It also keeps the media hero, which means keeping the scrim token,
the reduced-motion exemption and the mobile video constraint alive as things
that must be maintained rather than removed.

**Typefaces.** Montserrat display, Open Sans replaced.

---

### Direction C — The Document

**Typography carries it.** Off-white `#F8F8F8` ground, `#111111` type, hairline
rules as the only structural device — no cards, no shadows, no filled panels.
A serif display face. Navy for links and active states, red for one action.
Photography full-bleed or in the existing square frames, never in rounded cards.

**Rationale.** Reads like a printed partner profile or an information
memorandum, which is the register the firm's buyers already work in. A serif
display is the strongest seniority signal available and the furthest from
generic SaaS, which is uniformly geometric sans. The existing square, shadowless
frames already point this way.

**Cost.** The narrowest margin for error of the three. Editorial restraint with
a weak type scale reads as plain rather than considered, and the current scale
is not weak — it is absent. This direction lives or dies on DESIGN.md being
strict, and on the photography being real. It is also the biggest visual
departure, so it needs partner appetite for change.

**Typefaces.** A serif display replacing Montserrat, plus one grotesque for body
and UI. The only direction that changes both faces.

---

## 4. What DESIGN.md will contain

Primitive → semantic → component, per the design-system skill.

- **Colour.** Primitives from the measured values above. Every semantic pair
  published with its **measured** ratio against its real background, in light
  and dark. No inherited assumptions.
- **Type.** Two families. Modular scale with a stated base and ratio, fluid
  clamps per step, per-step line-height and tracking. Floor 14px, body 16px on
  mobile. Nav size proven against a five-section no-wrap test at 1440px.
- **Spacing.** One base unit, stated progression, named section-rhythm tokens.
- **Container.** Width and gutter tokens that make horizontal overflow
  arithmetically impossible.
- **Radii.** Formalising the existing square system: 0, one small, one pill.
- **Breakpoints.** Collapsing 767/770 and 1050/1260 into a coherent set
  including 375 and 1440.
- **Target size.** `--target-min: 44px`, applied by token.
- **Scrim.** Only if a media hero survives — with its measured ratio beside it.
- **Motion.** Every token paired with a reduced-motion variant.

`brandkit` is held back deliberately: brand boards are a build, and the brief
says choose first.

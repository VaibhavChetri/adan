# Homepage build — verification record

Three critique passes, 16 September 2026. Measured with axe-core 4.10.2 at
375×812 and 1440×900, consent dismissed so axe could sample the full page.

## Constraint results

| DESIGN.md constraint | Old site | This build |
|---|---|---|
| Text below 14px | 188–331 per template, floor 8.96px | **0** |
| Tap targets under 24×24 | 14–100 per page | **0** (measured by hit area) |
| Horizontal overflow at 375 | scrollWidth 380 vs 375 | **none**, 375 = 375 |
| H1 count | 0 on every template | **1** |
| axe violations | button-name 1, link-name 46, list 23 | **0**, 27 passes |
| `prefers-reduced-motion` | absent | **present** |
| Cookies before consent | 7 set on load | **0** before and after Reject |
| Nav | 11.2px, "Corporate Finance" wrapped | **16px, 5 items, one line, 0 wrapped** |
| Media hero | autoplaying YouTube, 1543px at 375 | **none** |

Nav at 1440: 841px used against a 1040px budget, longest item 199px.

`color-contrast` returns `incomplete`, not a violation, and only while the
consent banner is open — axe cannot sample a background it overlaps. Every
colour pair in use is a DESIGN.md token with a recorded ratio.

## What each pass found

**Pass 1** — mobile nav rendered open: `[hidden]` lost to `.nav--mobile{display:block}`
on specificity. Consent banner consumed over half the 375 viewport. `.prose` applied
to `.container` double-applied max-width and auto margins, so "Who we are" indented
inconsistently against every other section. Hero left ~700px of dead space at 1440.

**Pass 2** — added a global `[hidden]{display:none!important}` guard. Split `.prose`
out of `.container`. Two-column hero at ≥1024 so the record sits beside the
proposition. Record rows became a grid so the tabular figures form a true column.
Footer columns rebalanced.

**Pass 3** — H1 ran to six lines at both widths, pushing the lead and both CTAs below
the fold; shortened it and moved "trading across borders" into the lead. Tightened
hero padding and consent height. **Then found 7 footer links at 21px tall** — they
had been exempted from the 44px rule without being given the `::after` hit-area
extension. Fixed and re-verified at 0.

## Still open

- All figures are `TKTK` pending partner confirmation. The contradicted 15/19
  countries claim is **not** carried forward.
- Partner roles and outcomes are `TKTK` — bios need each partner's approval.
- No photographs. Frames are `object-fit: cover` and sized, awaiting real headshots.
- Form endpoint is `TKTK`; submission is held client-side with validation working.
- Analytics measurement ID is `TKTK`; the loader is written but commented out and
  fires only after an explicit Accept.

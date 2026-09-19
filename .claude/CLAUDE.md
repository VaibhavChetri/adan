# Adan Corporate

International corporate advisory firm. Corporate finance, M&A, strategy, risk, coaching. UK-registered, 19 countries. Rebuild of adancorporate.com. The user is a partner at the firm.

## Standards

- Site reviews and pre-launch checks use `radlabs-web-audit`.
- Design uses `impeccable` for critique and `design-system` for tokens. No other style skills.
- Tokens live in DESIGN.md, committed. Do not renegotiate the type scale or palette mid-session.
- Every visual change runs the screenshot critique loop: build, screenshot via chrome-devtools, critique, fix, re-screenshot. Three passes minimum, at 375px and 1440px.
- British English. WCAG 2.2 AA is the build target.

## Non-negotiables

- No AI-generated or stock photography of people. Real headshots only.
- No claim about countries, deal value, team size or track record ships without a source the user has confirmed.
- Team bios are only as current as the person has approved.

## Design

- DESIGN.md is the single source for colour, type, spacing, containers, radii, breakpoints, target size and motion.
- Read it at the start of every session. Do not restate or renegotiate its values.
- No arbitrary sizes. Every size is a scale step. If something needs a value the scale lacks, change the scale and say so.
- Two typefaces: Newsreader for display (h1–h3, figures, names), Inter for everything else. The serif is display-only — anything small, uppercase or letter-spaced stays in the sans. McKinsey's own faces are not licensable; see DESIGN.md D08 before proposing another swap.
- Links underline by wiping in from the left (animated `background-size`, not a pseudo-element). Do not add `position:relative` to a name link — the people tiles' stretched link depends on the anchor staying unpositioned.
- Cards are flat tonal tiles at rest. Elevation (`--e-nav`) is for the sticky header, which actually floats. The one other shadow is `0 2px 14px rgba(0,0,0,.16)` on **hover** only, on the people tile and the secondary button. Nothing carries a shadow at rest.
- The hero is a dark navy surface carrying the capital-flow diagram. No video, no stock photography, no raster hero image.
- Motion enhances an already-visible default. Nothing is hidden until a script reveals it.

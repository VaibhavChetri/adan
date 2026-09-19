# Templates — build and critique record

Nine templates, three critique passes, both review widths. 16 September 2026.

Run the loop yourself:

```bash
npx next start -p 8433 &
node scripts/sweep.mjs     # constraint table, exits non-zero on any failure
node scripts/shots.mjs      # screenshots to audit/screenshots/tpl/
```

## Result

**18/18 template × width combinations pass.**

| Template | Route |
|---|---|
| home | `/` |
| service hub | `/en-uk/[practice]` — 5 prerendered |
| service leaf | `/en-uk/[practice]/[service]` — 33 prerendered |
| team index | `/en-uk/about-us/team` |
| team member | `/en-uk/team/[slug]` — 8 prerendered |
| insights | `/en-uk/insights` |
| contact | `/en-uk/contact` |
| careers | `/en-uk/careers` |
| legal | `/en-uk/legal/[doc]` — 5 prerendered |

58 static pages total. Every one checked for: axe violations, text under 14px,
tap targets under 24×24 by hit area, horizontal overflow, exactly one H1, and
heading-level skips.

## Composition

No template defines its own layout or styling. Everything composes from
`app/components/Primitives.tsx`:

`PageIntro` · `Section` · `Prose` · `RuleRow` · `RecordRow` · `Person` ·
`Actions` · `DefinitionRow` · `TK`

Content lives in `app/lib/content.ts` — one source for practices, services,
navigation and partners. The service hub, the service leaf, the nav and the
homepage all read from it, so a service cannot exist in one place and not
another.

Two CSS additions, both shared primitives rather than page styles:
`.hero__title--page` (interior pages reuse the hero block at `--t-h1`) and
`.team--single` (the team grid at a different column split).

## What each pass found

**Pass 1 — 14/18.** Team index and legal both skipped a heading level, `h1`
straight to `h3`, because those sections have no `h2`. Fixed structurally: the
row primitives take a `level` prop, and where a section has no `h2` its rows
*are* the `h2`s. That is the correct document outline; adding a filler heading
to satisfy the checker would not have been.

**Pass 2 — 18/18 automated, but the screenshots showed two defects the checks
could not see.** The "Cookie choices" control was `position: fixed` in the
bottom-left and **overlapped body copy on every interior template** — it sat on
top of "Project & Infrastructure Finance" on the hub and the "Record" heading on
the partner page. The partner page also carried a live `mailto:TKTK@adancorporate.com`,
which is worse than no link at all.

**Pass 3 — 18/18, visually clean.** The consent re-open moved into the footer as
an ordinary list item. The TKTK mailto became plain text.

## Still open

- Every figure, role, biography and legal clause is `TKTK`.
- Insights is deliberately empty. The previous section carried 62 outbound
  LinkedIn links, no dates and no owned articles; it opens when the first piece
  is written, dated and approved.
- Legal documents are section scaffolds only. They need counsel before publication.
- No photography. Frames are `object-fit: cover` and sized.
- Form endpoint is `TKTK`; should become a Server Action on Vercel.

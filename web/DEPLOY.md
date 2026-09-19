# Adan Corporate — Next.js 16 on Vercel

Ported from the static HTML build, 16 September 2026. Next 16.3.5, React 19.3.0.

## Verified after the port

Same measurements as the static build, re-run against `next start`:

| Check | 1440×900 | 375×812 |
|---|---|---|
| axe violations | **0** (27 passes) | **0** (27 passes) |
| Text under 14px | 0 | 0 |
| Tap targets under 24×24 | 0 | 0 |
| Horizontal overflow | none | none |
| H1 count | 1 | 1 |
| Nav | 16px, 5 items, one line | collapsed, hidden on load |
| `prefers-reduced-motion` | present | present |
| Cookies before choice | **0** | **0** |
| Cookies after Reject | **0** | **0** |
| Fonts resolved | Montserrat, IBM Plex Sans | same |

## Redirects: where each rule now lives

The `.htaccess` work does not carry over to Vercel. It has been ported in two
pieces, and the split is deliberate.

**`vercel.json` — 151 redirects, all 301.** Resolved at the edge with no function
invocation. One host rule (`www` → apex, preserving path) plus the 150
consolidation redirects. Validated against `audit/redirect-map.csv`: exact match,
and **zero sources that are also destinations**, so nothing chains.

**`proxy.ts` — 32 paths returning 410.** `vercel.json` redirects only express
3xx, so Gone cannot live there. The matcher is scoped to
`/en-uk/industries/:path*` and `/en-uk/digital/:path*`, so the proxy never runs
for anything else. Note Next 16 renamed `middleware` to `proxy`.

Verified locally: all four sampled 410 paths return 410, and the two surviving
digital pages are **not** caught by it.

**Extension canonicalisation is no longer needed.** It existed because Apache
served `.html` files directly. Next routes by path, so `/en-uk/…` resolves
without an extension and the legacy `.html` URLs are handled by the 301 map.

## What is NOT testable locally

`vercel.json` redirects are applied by the Vercel platform, not by
`next start`. Locally, `/en-uk/digital/analytics.html` returns 404; on Vercel it
will 301 to the AI & Automation page. **Confirm on a preview deployment before
promoting to production.**

## Deploying

```bash
cd web
npx vercel            # preview
npx vercel --prod     # production
```

Then, in order:

1. Deploy to preview and confirm a sample of 301s and 410s resolve.
2. Point DNS for `adancorporate.com` and `www.adancorporate.com` at Vercel.
3. Only then retire the GoDaddy host. The `.htaccess` file becomes dead.

## Still open

- All figures are `TKTK` pending partner confirmation. The contradicted 15/19
  countries claim is not carried forward.
- Partner roles and outcomes are `TKTK` pending each partner's approval.
- No photographs. Frames are `object-fit: cover`, awaiting real headshots.
- Form endpoint is `TKTK`. Validation works; submission is held client-side.
  On Vercel this should become a Server Action or a Route Handler.
- Analytics measurement ID is `TKTK`. The loader fires only after explicit Accept.
- Only the homepage is ported. The other 32 surviving pages are not built yet.

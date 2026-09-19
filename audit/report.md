# adancorporate.com — audit

For the partners. 15 September 2026.

## Status: incomplete, and I want to be straight about why

Four of the seven audit phases did not run. The site sits behind a GoDaddy bot
gate that serves a holding page to any automated visitor, so Lighthouse scores,
accessibility testing and the scripted journey walkthrough could not be
performed. I tested this properly rather than assuming it: a genuine Chrome 152
with real plugins, real language settings and real window dimensions was still
turned away. The single signal that gave it away was `navigator.webdriver`.

I could have overridden that flag in one line and walked straight through. I
did not, because defeating the firm's own security control to audit the firm's
own site is not a thing I want in the record, and it is not what "full-access
engagement" means. **The fix is one allowlist entry** — details at the end.

What this report contains is therefore: findings I verified by other means,
findings you reported that I have logged and where possible corroborated, and
an explicit list of what remains unmeasured.

| Phase | Status |
|---|---|
| 1. Inventory | **Partial.** 77 URLs rebuilt from search indexes, no page bodies. |
| 2. Lighthouse + axe | **Not run.** Gate. |
| 3. Journey walkthrough | **Not run.** Gate. |
| 4. Content review | **Partial.** From indexed descriptions only. |
| 5. Competitive context | Not started. |
| 6. Synthesis | This document. |
| 7. Packaging | Deferred until the register is complete. |

## What the site gets right

Worth saying before the criticism, and I mean these.

The **service breadth is real and it is deep** — corporate finance through M&A,
strategy, risk and coaching, with genuine specialism at the leaf level. Most
mid-market advisory firms claim this range and cover it with four thin pages.

There is a **published accessibility statement** at `/en-uk/legal/accessibility.html`,
with a named contact address. Most firms this size have nothing.

The **legal and careers structure is complete** — privacy policy, legal page,
cookie information, plus a properly built careers section with individual job
descriptions per role and region. Someone built this carefully.

## The five things that need a decision this week

**1. Three team photos are AI-generated portraits of real employees.**

Vinayak Hattangadi, Mahimaa A.B and Harsh Katiyar. The images are served from
`i.ibb.co`, an external image host, and all three profiles have empty "Full
Profile" links. I independently confirmed that at least two of the three are
real, current staff.

This is the most serious item in the report and it is not close. The firm sells
diligence and judgement. Publishing invented faces for real colleagues is the
single fact a client, a journalist or a candidate could use to question
everything else on the site — and a reverse image search is fifteen seconds of
work. It also breaches the standing rule on this project: real headshots only.

*Remove the three images today.* Real headshots or neutral monogram
placeholders, either is fine. Do not wait for the rebuild.

**2. The cookie notice is not lawful.**

Implied consent does not satisfy UK GDPR or PECR. Non-essential cookies set
before an opt-in is an ICO exposure for a UK-registered firm, and it is the kind
of finding that is cheap to fix now and expensive to explain later. Needs a
prior-consent banner with reject as easy as accept.

**3. The homepage contradicts itself on the firm's own headline number.**

The stat block says 15 countries. The copy above it says 19. The Company
Overview page independently says 19. Neither figure has a confirmed source on
file, and nor does the "$1mn–$500mn deal value" claim.

A firm whose product is checking other people's numbers should not publish two
of its own. Establish the real figure, source it, and use it in exactly one
place.

**4. The site has no real error pages.**

Every URL returns HTTP 200 — including ones that do not exist. I confirmed this
directly by requesting an invented address and receiving a success response.
Search engines are free to index pages that were never written, broken internal
links never surface anywhere, and a visitor who mistypes gets a spinner instead
of an explanation.

**5. Insights has been silent since 2019, and points at LinkedIn.**

Seven years of nothing on the page that is supposed to demonstrate expertise,
and every item hands its audience and its search value to LinkedIn. Either
retire the section cleanly or republish the best work as owned pages. Leaving it
dated and outbound is the worst of the three options.

## Structural finding: the service pages are template rewrites

The rebuild question was which services to cut. The answer is that the site
publishes **53 service pages that should be about 27**, and the duplication is
not subtle:

- **Deal Strategy is published twice**, at two URLs, competing with itself.
- **Devil's Advocate, Red Teaming, Decision Facilitation and Geopolitical
  Strategy are one service sold as four pages.** The Devil's Advocate page says
  so itself — it describes the range as a 90-minute conversation, a one-day
  facilitation, or a full Red Team. That is one offer at three price points, and
  the site presents it as four separate things a buyer must choose between.
- **Unrelated pages share verbatim copy.** Project Finance and Business Strategy
  run the same sentence. The IPO page — one of the highest-intent pages on the
  site — is describing debt restructuring, not IPOs.
- **The startups section is a training catalogue**, five courses filed as
  advisory services, next to two financing pages with identical descriptions.
- **COVID-19 is still published**, two pages, in 2026.

The proposed five-section structure and the full 26-redirect map are in
`proposed-ia.md`. Nothing is deleted; every retired URL redirects.

## What I could not measure

These need the gate opened. They are not judgement calls I can substitute for.

- Lighthouse scores and Core Web Vitals, mobile and desktop, all nine templates
- WCAG 2.2 AA violations at 375px and 1440px — the accessibility statement makes
  a public commitment that is currently untested
- Word counts per service page, and how many fall under 300 words
- Content hashing to establish the true extent of the template-rewrite problem
- Pages reachable from more than one nav parent, orphans, and anything at depth 4+
- The enquiry journey end to end, at both widths

One item is a two-minute check you can do yourself: **paste a service page URL
into LinkedIn and into Slack.** If the preview reads "One moment, please..."
rather than the page title, the bot gate is breaking every link the firm shares.
I suspect it is. I could not confirm it.

## The register

17 findings in `findings-register.csv`: 5 P1, 10 P2, 2 P3. Ten are small
efforts. Every row carries a `verification` column stating whether I confirmed
it myself, corroborated it, or logged it on your report — please read that
column before circulating, because five findings rest on your observation rather
than my measurement.

## To finish the audit

Allowlist one of the following in GoDaddy → Website Security → Firewall:

- IP `49.36.181.189`, or
- user agent `RadlabsWebAudit/1.0`

Alternatively, send me a copy of the site files and I will run the full sweep
locally against them, which avoids the WAF entirely and puts no load on the
server. Either route, the remaining three phases take about an hour.

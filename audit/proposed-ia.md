# Adan Corporate — consolidation analysis and proposed IA

From the completed crawl, 16 September 2026. No new scanning.

## Scope caveat

The crawl stopped at its 400-page cap **with the queue still unexhausted**, so
the site is larger than 400 pages. It also crossed onto `www.adancorporate.com`
(125 of the 400 rows), confirming the host split. Collapsing www and bare host
by path gives **276 unique pages, of which 190 are service pages.**

The brief assumed 53 service pages. The real figure is **190**, and that is a
floor, not a total.

## 1. Word counts

**Nothing is under 300 words as measured.** Minimum 368, median 1,480.

That result is an artefact. The crawler counts the whole `<body>`, and the
mega-menu plus footer appear on every page. Calibrated against two pages saved
locally, that chrome is **517–732 words**. Subtracting the conservative 517:

| Section | Thin (<300 words of real content) |
|---|---|
| industries | **28 of 29** |
| strategy | 13 of 28 |
| risk-management | 9 of 31 |
| corporate-finance | 7 of 27 |
| m-and-a | 5 of 18 |
| coaching | 4 of 27 |
| startups | 4 of 15 |
| digital | 1 of 7 |
| covid-19 | 1 of 8 |
| **Total** | **72 of 190** |

The two thinnest are *negative* after subtraction — `index-working-capital.html`
(368 raw) and `index-alternative-financing.html` (372) contain less text than the
navigation wrapped around them.

Full ascending list: `consolidation-analysis.txt`.

## 2. Near-duplicate clusters

**9 clusters covering 54 of 190 service pages.** Five clusters are
byte-identical, not merely similar.

**The 28-page cluster.** Every page in `/industries/` except one shares a single
`content_hash`. Twenty-eight sector pages — banking, retail, pharma, semiconductors,
oil and gas, agriculture — are the same 110 words of content with a different
title:

```
/en-uk/industries/advanced-electronics.html   /en-uk/industries/agriculture.html
/en-uk/industries/asset-wealth-management.html /en-uk/industries/banking-capital-markets.html
/en-uk/industries/capital-projects-infrastructure.html … 28 in total
```

**The 10-page cluster, and it crosses practices.** Byte-identical content shared
between risk pages and interim-management pages:

```
/en-uk/risk-management/cloud-risk.html
/en-uk/risk-management/risk-management-for-pe-funds.html
/en-uk/risk-management/risk-management-for-smes.html
/en-uk/strategy/interim-ceo-managing-director.html
/en-uk/strategy/interim-cfo.html   /en-uk/strategy/interim-cmo.html
/en-uk/strategy/interim-coo.html   /en-uk/strategy/interim-cro.html
/en-uk/strategy/interim-cto.html   /en-uk/strategy/interim-sales-head.html
```

A page selling cloud risk advisory and a page selling an interim CFO are the
same document.

**Same page, two sections — 13 names.** Two pairs byte-identical:
`career-transition.html` and `innovation-from-concept-to-product.html` each
exist under both `/coaching/` and `/startups/`. Eleven more names appear in two
sections with differing content, mostly the `/coaching/` ↔ `/startups/` overlap.

## 3. Multiple nav parents — the question does not discriminate

159 of 190 service pages have more than one nav parent, and the top 100+ all sit
at **261 parents**, because the mega-menu appears on every page and links
almost everything. The measurement is degenerate: nearly every page is linked
from nearly every page.

**Devil's Advocate–Red Teaming and Decision Facilitation are at 251 parents
each — below the 261 maximum, not above it.** The expectation that they would
top this list is not supported. They are ordinary members of the mega-menu, not
special cases.

The discriminating version of the question is *which pages are published under
more than one section*, and that has a clean answer: the 13 names in §2, driven
almost entirely by `/coaching/` duplicating `/startups/`.

## 4. Orphans and depth

**No page sits at depth 4 or deeper.** Maximum depth is 3, and only 4 pages
reach it. Distribution: 1 at depth 0, 187 at depth 1, 84 at depth 2, 4 at depth 3.
The mega-menu flattens the entire site to one level.

**No true orphan test was possible.** A breadth-first crawl reaches pages by
following links, so every page it finds has a parent by construction. Real
orphans require diffing against `sitemap.xml`, which would mean a new request.

The available proxy is more useful anyway: **33 service pages have no navigation
parent at all** and are reachable only from body links. Twenty-nine of those are
the `/industries/` pages — a 29-page section that the navigation does not
expose. The other four are corporate-finance index pages.

## 5. Distinct versus template rewrite

| | |
|---|---|
| Service pages | 190 |
| Unique content fingerprints | 145 |
| **Genuinely distinct (upper bound)** | **145** |
| **Template rewrites (lower bound)** | **45** |
| Thin after chrome subtraction | 72 |

145 is an upper bound because the fingerprint only catches near-identical text.
72 pages carrying under 300 words of real content suggests the true count of
substantive pages is closer to 120.

---

## Proposed IA

**5 top-level sections. 29 service pages, down from 190.**

### 1. Corporate Finance
Debt & Working Capital · Equity & Private Capital · Project & Infrastructure
Finance · IPO & Public Markets · Restructuring & Distressed · Growth Capital

### 2. Mergers & Acquisitions
Buy-side · Sell-side · Company Valuation · Deal Strategy · Post-Merger
Integration · Joint Ventures & Alliances

### 3. Risk & Governance — **7 items, and this is deliberate**
Risk Strategy & Framework · Credit, Market & Treasury Risk · Operational &
Enterprise Risk · Internal Audit · Governance, SOX & IT Controls · Risk
Reporting & Analytics · **Technology Risk & Assurance**

ISO 27001, SOC 1 / SOC 2, vendor risk, data assurance, ERP controls, disaster
recovery and business continuity are a coherent practice with its own buyer.
Forcing them into "Governance, SOX & IT Controls" to honour a six-item cap would
hide a real service line. **This breaks the constraint on purpose — your call
whether to accept seven or drop the practice.**

### 4. Strategy & Board
Corporate & Business Strategy · Growth & International Expansion · Decision
Support · Non-Executive Directors & Board · Interim Management

Decision Support absorbs Devil's Advocate, Red Teaming, Decision Facilitation,
geopolitical war-gaming and future visioning into one page with named tiers —
which is how the Devil's Advocate page already describes the offer.

### 5. Coaching & Programmes
Executive Coaching · Team Coaching · Career Transition · Mentoring ·
Entrepreneur Programmes · Leadership Development

Not in the services nav: About, Team, **Sector Coverage** (one page replacing 29),
Insights, Careers, Contact.

## Redirects

**184 redirects, 6 URLs kept, nothing deleted.** Full mapping with a row per URL
in `redirect-map.csv`. Largest destinations:

| Redirects | Target |
|---:|---|
| 29 | `/en-uk/about-us/sector-coverage.html` |
| 16 | `/en-uk/coaching/entrepreneur-programmes.html` |
| 10 | `/en-uk/corporate-finance/restructuring-and-distressed.html` |
| 8 | `/en-uk/m-and-a/joint-ventures-and-alliances.html` |
| 8 | `/en-uk/risk/risk-reporting-and-analytics.html` |
| 8 | `/en-uk/strategy/interim-management.html` |
| 7 | `/en-uk/risk/technology-risk-and-assurance.html` |

### Three pages with no good home

Flagged in `redirect-map.csv` rather than forced quietly:

- `corporate-finance/transfer-pricing.html` — a tax service. No section fits.
- `corporate-finance/commercial-mediation.html` — a dispute service. No section fits.
- `strategy/pitch-preparation-king-s-speech.html` — pitch coaching, currently
  filed under strategy. Mapped to Leadership Development.

Each is either a real practice that needs a home, or a page to retire. That is a
partner decision, not a mapping decision.

---

## Addendum — complete crawl, 16 September 2026

The 1,200-page re-crawl **exhausted the queue at 569 rows**, so this is the
whole site, not a sample.

| | 400-page crawl | Complete crawl |
|---|---:|---:|
| Rows crawled | 400 (capped) | 569 (**exhausted**) |
| Unique paths after dedupe | 276 | 261 |
| **Service pages** | **190** | **190** |
| Unique shingle hashes | 145 | 145 |
| Template rewrites (floor) | 45 | 45 |
| Thin after chrome subtraction | 72 | 72 |
| Exact-duplicate clusters | 5 | 5 |

**190 was the real number, not a floor.** Every figure in this document is
unchanged. The earlier crawl had already reached the complete service corpus;
the extra 169 rows were almost entirely `www.` duplicates.

**www duplication consumed 261 of 569 rows** — roughly half the crawl budget
spent fetching the same pages twice. This is the cost of F12 stated as a number.

**The depth finding is confirmed, not overturned.** The complete crawl records
86 rows at depth 4-5, but every one is on `www.adancorporate.com`, reached via a
cross-host link. Apex-host pages by minimum depth: 1 at depth 0, 185 at depth 1,
74 at depth 2, 1 at depth 3. **Zero apex pages at depth 4 or beyond.** The site
is genuinely flat; the apparent depth was the host duplication.

**47 pages return 404**, of which **18 are email addresses linked without a
`mailto:` prefix** — logged as F48.

---

## Revision — 16 September 2026, post-decision

Three partner decisions applied. Map regenerated apex-only from the complete
crawl: **190 rows, 154 × 301, 29 × 410, 7 kept, nothing unmapped.**

### The 29 sector pages are now 410 Gone, not 301

They were byte-identical, unlinked doorway content. A 301 passes their signal to
the target and keeps the liability alive; 410 tells search engines the content is
permanently withdrawn so it leaves the index. No target, by design.

Apache: `RewriteRule ^en-uk/industries/ - [G,L]`, placed above the consolidation
redirects so nothing below can catch those URLs.

### The three homeless pages have homes

| Page | Destination | Treatment |
|---|---|---|
| `transfer-pricing.html` | Corporate Finance | Own service page |
| `commercial-mediation.html` | Risk & Governance | Own service page |
| `pitch-preparation-king-s-speech.html` | Strategy | **Folded** into Corporate & Business Strategy |

Read "under" as *its own page in that section* and "folds into" as *merged into
an existing page*, per the wording of the instruction. If pitch preparation was
meant to survive as its own Strategy item, say so and it moves.

### Resulting section counts

| Section | Services | vs cap of 6 |
|---|---:|---|
| Corporate Finance | 7 | +1 (transfer pricing) |
| M&A | 6 | — |
| **Risk & Governance** | **8** | **+2** (technology risk, commercial mediation) |
| Strategy & Board | 5 | — |
| Coaching & Programmes | 6 | — |
| **Total** | **32** | from 190 |

**Risk & Governance is now at 8 against a stated cap of 6.** Two of those were
deliberate: Technology Risk & Assurance because ISO 27001, SOC 1/2, vendor risk
and business continuity are a real practice, and Commercial Mediation by
instruction. Eight items is a long menu for one nav column. Worth deciding
whether mediation sits better as a capability inside an existing page, or whether
Risk & Governance should split into two sections.

---

## Final IA — 16 September 2026

Five top-level sections, **33 services from 189**. Map: 150 × 301, 32 × 410, 7 kept.

| Section | Services |
|---|---:|
| Risk & Governance | 9 |
| Corporate Finance | 7 |
| M&A | 6 |
| Coaching & Programmes | 6 |
| Strategy & Board | 5 |

### Digital & Technology — promoted, then dissolved

The five-section IA had no home for the seven `/digital/` pages, and the
generator was quietly folding the whole practice into Risk Reporting &
Analytics. Raised as a structural gap; the max-5 cap was overridden to give
Digital its own section.

Evidence then changed the decision. Searching the clients page (36 case
studies), the live-deals page and the Insights blog for blockchain, IoT, RPA,
AI, analytics, machine learning, data science and digital transformation
returned **zero mentions as delivered work**. None of the 18 deal types in the
firm's own live-deals filter is digital. All seven pages carry no case study, no
named client and no completed-work phrasing. On that basis the section was
reversed and the practice dissolved:

| Pages | Treatment |
|---|---|
| artificial-intelligence, analytics, robotic-process-automation-rpa | **301** → `risk/ai-and-automation-in-risk-and-diligence.html`, framed as method, not track record |
| blockchain-advisory, internet-of-things-iot, products-and-solutions | **410 Gone** — unevidenced capability claims, same treatment as the 29 `/industries/` pages |
| visyond | **301** → `about-us/partners-and-alliances.html` — a third-party product, not an Adan service |

**410 count rises from 29 to 32.**

### Two deliberate breaches of the six-item cap

Risk & Governance carries 9: the original six, plus Technology Risk & Assurance
(ISO 27001, SOC 1/2, vendor risk, business continuity — a practice with its own
buyer), Commercial Mediation, and now AI & Automation. Corporate Finance carries
7 with Transfer Pricing. Both accepted knowingly rather than hidden by folding
pages into unrelated destinations.

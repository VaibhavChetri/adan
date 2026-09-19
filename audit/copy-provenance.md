# Copy provenance

Every block of text in the rebuild is traced to a page on adancorporate.com.
Nothing on the homepage is written fresh. Where the original carried a grammar
slip, the slip is corrected and listed below; wording and meaning are unchanged.

Harvested 16 September 2026. Source HTML is kept in `assets-from-live/` and
`assets-from-live/pages/`. All eleven fetches returned 200 with no bot gate.

## Where each block comes from

| Block in the rebuild | Source page |
|---|---|
| H1 "Small enough to care. Big enough to get you there." | `/en-uk/about-us/the-adan-advantage.html` |
| Hero standfirst | `/en-uk/home/` — "What we do", first line |
| Who we are (3 paragraphs) | `/en-uk/home/` and `/en-uk/about-us/company-overview.html` |
| What we do (3 paragraphs) | same |
| Our breadth and depth of services (4 items) | `/en-uk/home/`, `company-overview.html`, `the-adan-advantage.html` |
| A selection of completed transactions (6 deals) | `company-overview.html` |
| How do we do it? (6 network groups) | `/en-uk/home/` and `company-overview.html` |
| Where we are (14 offices) | `/en-uk/about-us/global-locations.html` |
| Team (31 people: role, focus, city, email, LinkedIn, biography, headshot) | `/en-uk/home/` team section |
| Latest insights (6 items) | `/en-uk/about-us/insights-blog.html` |
| Contact standfirst and registered office | `/en-uk/about-us/contact-us.html`, `global-locations.html` |
| Footer address, telephone, social profiles | `global-locations.html`, `/en-uk/home/` footer |

## Corrections made to the original wording

| Original | Corrected | Why |
|---|---|---|
| "navigate though a complex set" | "navigate through" | typo |
| "experience in in C-suite roles" (9 biographies) | "experience in C-suite roles" | doubled word |
| "The spectrum of our network to helps us create" | dropped; the duplicate sentence was not carried | broken clause, and the block repeated verbatim in two places |
| "small and medium sized firms" | "small and medium-sized firms" | missing hyphen |
| "$1 mn and $500 mn" | "$1m and $500m" | house style |
| "Cote d'Ivoire" | "Côte d'Ivoire" | diacritic |
| Title Case section headings | sentence case | British English house style |

## Deliberately not carried forward

| Original | Reason |
|---|---|
| "35 Corporate Professionals / 20 Average Years / 15 Countries / $5bn" stat block | Four unsourced claims, and the country figure contradicts three other figures on the site. Replaced by counts derived from the published office list. See F03, F05, F53. |
| "Our partners are based in 19 countries" | Same. The office list supports 13. |
| "Our Ambition: grow to 200 partners in 50 countries by 2020" | Target date passed six years ago. See F57. |
| Hero YouTube background video | Third-party embed loading before consent. See F24, F60 pending. |
| Three Gemini-generated images hotlinked from i.ibb.co | AI-generated imagery, against the project's non-negotiables. See F01. |
| "Read More About How Adan Corporate ( ) Can Assist" | The bracketed glyph is a broken Font Awesome icon on every page. |
| COVID-19 practice (8 pages) | Consolidated out of the IA in the approved proposal. |

## Held pending partner confirmation

- Deal values in the six published transactions (F53 rule: no deal value ships
  without a confirmed source). The figures below are the firm's own published
  ones; a partner still signs them off before launch.
- Company registration number on the contact page.
- Whether each of the 31 people has approved their current biography.

## Image asset: `careers-network.webp`

| | |
|---|---|
| Source | `https://adancorporate.com/assets/images/careers-network.webp` (HTTP 200, 131,158 bytes, 1300×813 WebP, RGB) |
| Used on the live site | `.number-counters` background in `styles/main.css`, and the `Who we are` section of `home.html` |
| Used here | `.split__media` in "Who we are", and the `.statband` background — the same two placements |

Fetched directly from the firm's own server, so it is the firm's asset, not a
new stock licence. Note that it **is** generic stock photography of people, which
the project's non-negotiable otherwise rules out; it ships because the partner
asked for this specific image, in these specific placements, by name.

The live `alt` is `"iPad cover"`, left over from the purchased template. Ours is
empty: the photograph is decorative and the paragraphs beside it carry the whole
meaning, so announcing it would only add noise.

### Live counter figures NOT carried across

The live `.number-counters` publishes four numbers. Three contradict the firm's
own published record and the fourth has no record at all, so each was replaced
with a figure derived from a list on this site.

| Live figure | Shipped here | Why |
|---|---|---|
| 35 corporate professionals | **32** | `PARTNERS.length` — the roster the site itself publishes |
| 20 average years of experience | **25+** | Parsed from the bios: 24 state a figure, 15 clear 25 years. "Average" cannot be computed, because 8 bios state none |
| 15 countries in 3 continents | **13** | `COUNTRY_COUNT`, counted from the firm's own office list. The live site publishes 15, 19 and 20 in different places |
| 5 (billion USD) value of transactions | **$1bn**, relabelled "largest single transaction the firm discloses" | No cumulative total appears in any published source. One of the six listed deals is marked Confidential, so a sum would be a floor presented as a total |

All four remain swappable in one edit if a partner confirms the original figures
against a record.

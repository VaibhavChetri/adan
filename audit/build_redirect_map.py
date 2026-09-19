"""Regenerate the consolidation redirect map from the completed crawl, apex only.
Tracks which rule matched each path so the mapping can be reviewed before it ships."""
import csv, re
from collections import Counter, defaultdict
from urllib.parse import urlparse

CF='/en-uk/corporate-finance/'; MA='/en-uk/m-and-a/'; RG='/en-uk/risk/'
SB='/en-uk/strategy/'; DG='/en-uk/digital/'; CP='/en-uk/coaching/'
GONE='410'

# The approved IA. Nothing may be a 301 target unless it appears here.
IA={
 'Corporate Finance':[CF+n for n in ('debt-and-working-capital','equity-and-private-capital',
    'project-and-infrastructure-finance','ipo-and-public-markets','restructuring-and-distressed',
    'growth-capital','transfer-pricing')],
 'M&A':[MA+n for n in ('buy-side','sell-side','company-valuation','deal-strategy',
    'post-merger-integration','joint-ventures-and-alliances')],
 'Risk & Governance':[RG+n for n in ('risk-strategy-and-framework','credit-market-and-treasury-risk',
    'operational-and-enterprise-risk','internal-audit','governance-sox-and-it-controls',
    'risk-reporting-and-analytics','technology-risk-and-assurance','commercial-mediation',
    'ai-and-automation-in-risk-and-diligence')],
 'Strategy & Board':[SB+n for n in ('corporate-and-business-strategy','growth-and-international-expansion',
    'decision-support','non-executive-directors-and-board','interim-management')],
 'Coaching & Programmes':[CP+n for n in ('executive-coaching','team-coaching','career-transition',
    'mentoring','entrepreneur-programmes','leadership-development')],
}
APPROVED={p+'.html' for v in IA.values() for p in v}
NON_SERVICE={'/en-uk/about-us/partners-and-alliances.html'}
APPROVED |= NON_SERVICE
SECTION_ROOTS={CF, MA, RG, SB, CP}
PRACTICE={CF:'Corporate Finance', MA:'M&A', RG:'Risk & Governance',
          SB:'Strategy & Board', CP:'Coaching & Programmes',
          '/en-uk/about-us/':'About (non-service)'}
SRC_PRACTICE={'corporate-finance':'Corporate Finance','m-and-a':'M&A','risk-management':'Risk & Governance',
  'risk':'Risk & Governance','strategy':'Strategy & Board','digital':'Digital (retired)',
  'coaching':'Coaching & Programmes','startups':'Startups (retired)','covid-19':'COVID-19 (retired)',
  'industries':'Industries (retired)'}

# (name, pattern, target). Order matters: first match wins.
RULES=[
 ('industries-gone',       r'^/en-uk/industries/',                                  GONE),
 ('digital-ai-automation', r'^/en-uk/digital/(analytics|artificial-intelligence|robotic-process-automation-rpa)\.html$', RG+'ai-and-automation-in-risk-and-diligence.html'),
 ('digital-unevidenced',  r'^/en-uk/digital/(blockchain-advisory|internet-of-things-iot|products-and-solutions)\.html$', GONE),
 ('visyond-partner',      r'^/en-uk/digital/visyond\.html$',                       '/en-uk/about-us/partners-and-alliances.html'),
 ('transfer-pricing',      r'transfer-pricing',                                     CF+'transfer-pricing.html'),
 ('commercial-mediation',  r'commercial-mediation',                                 RG+'commercial-mediation.html'),
 ('pitch-preparation',     r'pitch-preparation',                                    SB+'corporate-and-business-strategy.html'),
 ('covid',                 r'^/en-uk/covid-19/',                                    CF+'restructuring-and-distressed.html'),
 ('debt-working-capital',  r'factoring|working-capital|trade-finance|debt-financing|alternative-financing|government-grants|invoice-discounting|credit-ratings', CF+'debt-and-working-capital.html'),
 ('equity-private-cap',    r'private-equity|venture-capital|family-offices|fund-placement|equity-financing|investors-performance', CF+'equity-and-private-capital.html'),
 ('project-infra',         r'project-finance|renewable-energy|infrastructure-financ', CF+'project-and-infrastructure-finance.html'),
 ('ipo',                   r'/ipo\.html$|index-ipo|public-market',                  CF+'ipo-and-public-markets.html'),
 ('restructuring',         r'distressed|restructur|transformation|turnaround|insolvenc|special-situations', CF+'restructuring-and-distressed.html'),
 ('growth-capital',        r'growth-capital|financing-entrepreneurial|index-startup', CF+'growth-capital.html'),
 ('cf-hub',                r'^/en-uk/corporate-finance/index',                      CF),
 ('buy-side',              r'buy-a-business|buy-side|acquisition',                  MA+'buy-side.html'),
 ('sell-side',             r'sell-your-business|sell-side|divest|exit-planning',    MA+'sell-side.html'),
 ('valuation',             r'valuation',                                            MA+'company-valuation.html'),
 ('deal-strategy',         r'deal-strategy',                                        MA+'deal-strategy.html'),
 ('pmi',                   r'post-merger|-pmi\.html$|synerg|integration|mergers',   MA+'post-merger-integration.html'),
 ('jv-alliances',          r'joint-venture|alliance|partnership|leveraged-buy|mbos-and-mbis', MA+'joint-ventures-and-alliances.html'),
 ('ma-hub',                r'^/en-uk/m-and-a/index',                                MA),
 ('tech-risk-assurance',   r'iso-27001|soc1|soc2|vendor-risk|data-assurance|erp-control|disaster-recovery|business-continuity', RG+'technology-risk-and-assurance.html'),
 ('internal-audit',        r'internal-audit',                                       RG+'internal-audit.html'),
 ('governance-sox',        r'sox|it-governance|compliance|regulatory|governance',   RG+'governance-sox-and-it-controls.html'),
 ('credit-market-treasury',r'credit-risk|market-risk|treasury|liquidity',           RG+'credit-market-and-treasury-risk.html'),
 ('operational-enterprise',r'operational-risk|enterprise-risk|cloud-risk|risk-management-for', RG+'operational-and-enterprise-risk.html'),
 ('risk-reporting',        r'risk-reporting',                                       RG+'risk-reporting-and-analytics.html'),
 ('risk-strategy',         r'risk-management-strategy|risk-strategy|risk-management-training|risk-appetite|^/en-uk/risk-management/index', RG+'risk-strategy-and-framework.html'),
 ('decision-support',      r'devil|red-team|decision-facilitation|geopolitical|war-gam|scenario|future-visioning', SB+'decision-support.html'),
 ('interim',               r'interim-',                                             SB+'interim-management.html'),
 ('ned-board',             r'non-executive|-ned\.html$|board-advis|mentors|/board', SB+'non-executive-directors-and-board.html'),
 ('growth-international',  r'international-expansion|marketing-strategy|growth-strategy', SB+'growth-and-international-expansion.html'),
 ('corporate-strategy',    r'corporate-strategy|business-strategy|^/en-uk/strategy/index', SB+'corporate-and-business-strategy.html'),
 ('executive-coaching',    r'executive-coaching|purpose-assessment',                CP+'executive-coaching.html'),
 ('team-coaching',         r'team-coaching|building-coaching-cultures|business-relationships', CP+'team-coaching.html'),
 ('career-transition',     r'career-transition|career-identity|outplacement|^/en-uk/coaching/index-careers', CP+'career-transition.html'),
 ('mentoring',             r'mentoring',                                            CP+'mentoring.html'),
 ('entrepreneur-progs',    r'entrepreneur|innovation-from-concept|managing-growing|marketing-management|transitioning', CP+'entrepreneur-programmes.html'),
 ('leadership',            r'leadership|toolbox|cultural-intelligence|negotiation', CP+'leadership-development.html'),
 ('coaching-hub',          r'^/en-uk/coaching/index',                               CP),
]

def build():
    rows=list(csv.DictReader(open('audit/inventory/full/inventory.csv')))
    P=lambda u: urlparse(u).path
    apex={P(r['url']) for r in rows
          if urlparse(r['url']).netloc=='adancorporate.com' and r['status']=='200'}
    sec=lambda p:(re.match(r'/en-uk/([^/]+)/',p) or [None,'?'])[1]
    SVC=set(SRC_PRACTICE)
    svc=sorted(p for p in apex if sec(p) in SVC and p.endswith('.html'))
    out=[]; hits=defaultdict(list)
    for u in svc:
        name=tgt=None
        for n,pat,t in RULES:
            if re.search(pat,u): name,tgt=n,t; break
        hits[name].append(u)
        if tgt==GONE:        act,new='410',''
        elif tgt is None:    act,new='keep',u          # digital stays at its own URL
        elif tgt==u:         act,new='keep',u
        else:                act,new='301',tgt
        out.append({'old_path':u,'new_path':new,'action':act,'rule':name or 'UNMATCHED'})
    return out,hits,svc

if __name__=='__main__':
    out,hits,svc=build()
    HDR=["# adancorporate.com - consolidation redirect map",
     "# Generated 16 September 2026 from the complete 569-page crawl (queue exhausted).",
     "#",
     "# ASSUMES HOST AND EXTENSION CANONICALISATION IS ALREADY APPLIED.",
     "# Apply deliverables/htaccess-canonicalisation.txt FIRST. Apex host, https, .html only.",
     "# No www column: www.adancorporate.com is 301'd host-wide before any rule here runs.",
     "#",
     "# action=301  permanent redirect to new_path",
     "# action=410  Gone, no target. The 29 /industries/ pages were byte-identical unlinked",
     "#             doorway content. Apache: RewriteRule ^en-uk/industries/ - [G,L]",
     "# action=keep URL survives consolidation unchanged",
     "# rule        which generator pattern matched, for audit",
     "#"]
    with open('audit/redirect-map.csv','w',newline='') as fh:
        for l in HDR: fh.write(l+"\n")
        w=csv.DictWriter(fh,fieldnames=['old_path','new_path','action','rule'])
        w.writeheader(); w.writerows(out)
    print(f"{len(out)} rows written |", dict(Counter(r['action'] for r in out)))

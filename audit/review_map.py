"""Pre-flight review of the redirect map. Nothing ships until this reads clean."""
import re, sys
from collections import Counter, defaultdict
sys.path.insert(0,'audit')
from build_redirect_map import build, RULES, APPROVED, SECTION_ROOTS, SRC_PRACTICE, PRACTICE, GONE
out,hits,svc=build()
sec=lambda p:(re.match(r'/en-uk/([^/]+)/',p) or [None,'?'])[1]
prac=lambda p: SRC_PRACTICE.get(sec(p),'?')
def tprac(p):
    for root,name in sorted(PRACTICE.items(), key=lambda kv:-len(kv[0])):
        if p.startswith(root): return name
    return '?'
W=112; rule=lambda c='-': print(c*W)

print("\n"+"="*W); print("TABLE 1  CROSS-PRACTICE MAPPINGS"); print("="*W)
g=defaultdict(list)
for r in out:
    if r['action']=='301':
        a,b=prac(r['old_path']),tprac(r['new_path'])
        if a!=b: g[a].append((r['old_path'],r['new_path'],r['rule']))
tot=0
for src in sorted(g, key=lambda k:-len(g[k])):
    items=g[src]; tot+=len(items)
    print(f"\n  FROM {src}  ({len(items)})"); rule()
    print(f"  {'source page':<46}{'-> target':<44}{'rule':<20}"); rule()
    for old,new,rl in sorted(items,key=lambda x:x[1]):
        print(f"  {old.split('/')[-1][:45]:<46}{new.replace('/en-uk/','')[:43]:<44}{rl:<20}")
n301=sum(1 for r in out if r['action']=='301')
print(f"\n  TOTAL CROSS-PRACTICE: {tot} of {n301} redirects")

print("\n"+"="*W); print("TABLE 2  RULE PATTERNS WITH AN ALTERNATIVE UNDER 4 CHARACTERS"); print("="*W)
rule(); print(f"  {'rule':<24}{'hits':>5}  {'alt':<10}{'len':>4}  {'matched via that literal':<50}"); rule()
short=0
for name,pat,tgt in RULES:
    alts=[re.sub(r'[\\^$()\[\]{}*+?.|]','',a) for a in pat.split('|')]
    for a in [x for x in alts if x and len(x)<4]:
        short+=1
        via=[u.split('/')[-1] for u in hits.get(name,[]) if a in u]
        print(f"  {name:<24}{len(hits.get(name,[])):>5}  {a:<10}{len(a):>4}  "
              f"{(', '.join(via)[:48] if via else 'NONE - matched via longer alternatives'):<50}")
rule()
print(f"  patterns with a sub-4-character alternative: {short}")
print(f"  rules matching nothing: {[n for n,_,_ in RULES if not hits.get(n)] or 'none'}")
print(f"  unmatched paths: {sum(1 for r in out if r['rule']=='UNMATCHED')}")

print("\n"+"="*W); print("TABLE 3  301 TARGETS NOT IN THE APPROVED IA"); print("="*W)
bad=[r for r in out if r['action']=='301' and r['new_path'] not in APPROVED and r['new_path'] not in SECTION_ROOTS]
if bad:
    rule(); print(f"  {'source':<48}{'target':<44}{'rule':<18}"); rule()
    for r in bad: print(f"  {r['old_path']:<48}{r['new_path']:<44}{r['rule']:<18}")
else:
    print("\n  None. Every 301 target is an approved IA page, an approved non-service page,")
    print("  or a section root.\n")
print("  section roots used: " + ", ".join(sorted(h.replace('/en-uk/','') for h in {r['new_path'] for r in out} & SECTION_ROOTS)))
print("\n"+"="*W)
print("SUMMARY  " + " | ".join(f"{k}={v}" for k,v in sorted(Counter(r['action'] for r in out).items()))
      + f" | rows={len(out)}")
dests={r['new_path'] for r in out if r['new_path'].endswith('.html')}
svc_d={d for d in dests if not d.startswith('/en-uk/about-us/')}
print("SURVIVING SERVICES per section:")
for k,v in sorted(Counter(tprac(d) for d in svc_d).items(), key=lambda kv:-kv[1]):
    print(f"   {v}  {k}")
print(f"   TOTAL {len(svc_d)} services in {len({tprac(d) for d in svc_d})} sections")
print("="*W)

#!/usr/bin/env python3
"""
Phase 1 crawl for Adan Corporate, with the link graph the stock crawler drops.

Reuses radlabs-web-audit/scripts/crawl.py for the inventory row so the CSV stays
schema-compatible with the rest of the pipeline. Adds edges.csv, because
"reachable from more than one nav parent" and "orphan" are link-graph questions
and the stock FIELDS list has no parent column.

Edges are tagged nav|body: a link from <nav>/<header>/<footer> is a structural
claim about the IA, a body link is a cross-reference. Counting them together
makes every page look multi-parent.

    python3 crawl_graph.py https://adancorporate.com/en-uk/home/index.html \
        --out-dir . --max-pages 400 --delay 0.3 --include-subdomains
"""
import argparse, csv, importlib.util, sys, time
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

SKILL = Path.home() / ".claude/skills/radlabs-web-audit/scripts/crawl.py"
spec = importlib.util.spec_from_file_location("rw_crawl", SKILL)
rw = importlib.util.module_from_spec(spec); spec.loader.exec_module(rw)

CHALLENGE = "One moment, please"


def edges_from(url, html, root, subs):
    """(child_url, anchor, 'nav'|'body') for every in-scope link on the page."""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    out = []
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        child = rw.normalise(urljoin(url, href))
        if not rw.in_scope(child, root, subs):
            continue
        zone = "nav" if a.find_parent(["nav", "header", "footer"]) else "body"
        out.append((child, a.get_text(" ", strip=True), zone))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("start_url")
    ap.add_argument("--out-dir", default=".")
    ap.add_argument("--max-pages", type=int, default=400)
    ap.add_argument("--delay", type=float, default=0.3)
    ap.add_argument("--timeout", type=int, default=25)
    ap.add_argument("--include-subdomains", action="store_true")
    ap.add_argument("--user-agent", default="RadlabsWebAudit/1.0 (+site audit)")
    a = ap.parse_args()

    out = Path(a.out_dir); out.mkdir(parents=True, exist_ok=True)
    start = rw.normalise(a.start_url); root = urlparse(start).netloc
    s = requests.Session(); s.headers["User-Agent"] = a.user_agent

    q, seen, rows, edges, blocked = deque([(start, 0)]), {start}, [], [], 0
    while q and len(rows) < a.max_pages:
        url, depth = q.popleft()
        try:
            t0 = time.time()
            r = s.get(url, timeout=a.timeout, allow_redirects=True)
            ms = int((time.time() - t0) * 1000)
        except Exception as exc:
            rows.append({**{f: "" for f in rw.FIELDS}, "url": url,
                         "status": f"ERROR: {exc}", "depth": depth})
            continue

        if "text/html" not in r.headers.get("Content-Type", ""):
            rows.append({**{f: "" for f in rw.FIELDS}, "url": url,
                         "status": r.status_code, "depth": depth})
            continue

        # The gate returns 200 + a 7KB interstitial for every URL, including
        # ones that do not exist. Counting those as pages would poison every
        # word count and shingle hash downstream.
        if CHALLENGE in r.text:
            blocked += 1
            print(f"  BLOCKED (bot gate): {url}", file=sys.stderr)
            continue

        row, _ = rw.extract(url, r, depth, root, a.include_subdomains, ms)
        rows.append(row)
        print(f"[{len(rows):>4}] {row['status']} d{depth} {url}", file=sys.stderr)

        for child, anchor, zone in edges_from(url, r.text, root, a.include_subdomains):
            edges.append({"parent": url, "child": child,
                          "anchor": anchor, "zone": zone, "parent_depth": depth})
            if child not in seen:
                seen.add(child); q.append((child, depth + 1))
        time.sleep(a.delay)

    with open(out / "inventory.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=rw.FIELDS, extrasaction="ignore")
        w.writeheader(); w.writerows(rows)
    with open(out / "edges.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["parent", "child", "anchor", "zone", "parent_depth"])
        w.writeheader(); w.writerows(edges)

    print(f"\n{len(rows)} pages, {len(edges)} edges -> {out}", file=sys.stderr)
    if blocked:
        print(f"!! {blocked} URLs returned the bot gate, not real content.\n"
              f"   The inventory is INCOMPLETE. Do not analyse it.", file=sys.stderr)


if __name__ == "__main__":
    main()

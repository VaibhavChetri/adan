"""Self-check: nav/body zoning and scope filtering. Run: python3 test_crawl_graph.py"""
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location("cg", Path(__file__).parent / "crawl_graph.py")
cg = importlib.util.module_from_spec(spec); spec.loader.exec_module(cg)

HTML = """<html><body>
<header><a href="/en-uk/services/ma/">M&A</a></header>
<nav><a href="/en-uk/services/risk/">Risk</a></nav>
<main>
  <p>See our <a href="/en-uk/services/ma/">M&amp;A team</a> and
     <a href="https://example.com/x">a third party</a>.</p>
  <a href="mailto:x@y.com">mail</a><a href="#top">skip</a>
</main>
<footer><a href="/en-uk/contact/">Contact</a></footer>
</body></html>"""

e = cg.edges_from("https://adancorporate.com/en-uk/home/index.html", HTML,
                  "adancorporate.com", False)
zones = {(c.split("adancorporate.com")[1], z) for c, _, z in e}

assert ("/en-uk/services/ma", "nav") in zones, "header link must zone as nav"
assert ("/en-uk/services/risk", "nav") in zones, "nav link must zone as nav"
assert ("/en-uk/contact", "nav") in zones, "footer link must zone as nav"
assert ("/en-uk/services/ma", "body") in zones, "same URL in prose must also zone as body"
assert not any("example.com" in c for c, _, _ in e), "external links must be dropped"
assert len(e) == 4, f"2 nav + 1 footer + 1 body; mailto/#/external dropped; got {len(e)}"

# The gate marker the crawler screens on must match the live interstitial.
assert cg.CHALLENGE == "One moment, please"
print("OK: 6 assertions passed")

# Self-referencing canonical tag

## The line

```html
<link rel="canonical" href="https://adancorporate.com/en-uk/m-and-a/deal-strategy.html">
```

## Where it goes

Inside `<head>`, after the charset and viewport meta tags and before `<title>`.
Anywhere in `<head>` is valid; putting it high keeps it above the ~30 script and
stylesheet tags currently in the head of every page.

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Canonical URL for this page. Absolute, apex host, https, with .html. -->
  <link rel="canonical" href="https://adancorporate.com/en-uk/m-and-a/deal-strategy.html">

  <title>Deal Strategy | Adan Corporate</title>
  ...
```

## Rules for the value

It is **self-referencing**: each page points at its own canonical URL, not at a
section hub or the homepage. Four things must be true of every value:

1. Absolute, not relative. `href="deal-strategy.html"` is legal but pointless here.
2. `https`, never `http`.
3. Apex host `adancorporate.com`, never `www.`.
4. Ends in `.html` - the extension form the .htaccess rules redirect to.

A canonical tag pointing at a URL that then redirects is a wasted signal, so the
value must match what the server settles on.

## Why this is needed as well as the redirects

The 301s fix hosts and extensions. The canonical tag covers what redirects
cannot: tracking parameters (`?utm_source=...`), any future index-page variants,
and the case where a page is reachable by more than one path. All 400 pages of
the crawl had no canonical tag at all, so there is currently no signal anywhere.

## Applying it across a static site

There is no template layer, so this is a per-file edit. The value is derivable
from the file path, so it can be generated:

```bash
# From the web root. Inserts the tag after the viewport meta on any page
# that does not already have one. Review the diff before committing.
find . -name '*.html' | while read -r f; do
  grep -qi 'rel="canonical"' "$f" && continue
  url="https://adancorporate.com${f#.}"
  perl -0pi -e "s{(<meta name=\"viewport\"[^>]*>)}{\$1\n  <link rel=\"canonical\" href=\"$url\">}i" "$f"
done
```

Check a handful of pages afterwards, including one in a nested directory, and
confirm the generated URL matches what the browser lands on.

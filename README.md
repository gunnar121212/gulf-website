# gulf.is

Website for GULF ráðgjöf, the consultancy of Gunnar Úlfarsson.

A static site: plain HTML, CSS and JavaScript, with no build step and no
dependencies. Every push to `main` is deployed by Cloudflare Workers
(static assets), configured in `wrangler.jsonc`.

## Structure

```
wrangler.jsonc                 Cloudflare Worker config: serves ./public
public/
  index.html                   All four pages (home, about, cases, contact)
  assets/css/site.css          Styles
  assets/js/site.js            Page switching and the IS/EN language switch
  assets/img/                  Logo, hero photo, share image, client logos
  favicon.svg
  robots.txt, sitemap.xml
  _headers                     Cache, security and noindex headers
```

## How it works

- **Pages.** The four pages are sections of `index.html`, shown one at a
  time by the URL hash: `#home`, `#about`, `#cases`, `#contact`.
- **Languages.** Every piece of text is written twice, as
  `<span data-l="en">…</span><span data-l="is">…</span>`. The `lang`
  attribute on `<html>` decides which one shows. A small script in `<head>`
  picks the language before the page is drawn: `?lang=is|en` in the URL,
  then the visitor's earlier choice, then an Icelandic timezone or browser
  language, otherwise English.
- **Fonts.** Fraunces (headings) and Source Serif 4 (text), from Google Fonts.

## Editing

Edit the files in `public/` and preview them through a local server so the
`/assets/...` paths resolve:

```
python3 -m http.server 8000 --directory public
# then open http://localhost:8000
```

`npx wrangler dev` also works and applies `_headers` the way Cloudflare does.

When adding text, add both the Icelandic and the English span.

## Deploying

The `gulf-website` Worker in Cloudflare is connected to this repository
(Workers Builds), with no build command and the default deploy command
`npx wrangler deploy`. Pushing to `main` publishes the site. Other branches
are uploaded as preview versions with their own workers.dev URL.

`public/_headers` sends `X-Robots-Tag: noindex` on test.gulf.is, so the test
domain stays out of search engines.

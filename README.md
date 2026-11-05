# gulf.is

Website for GULF ráðgjöf, the consultancy of Gunnar Úlfarsson.

A static site: plain HTML, CSS and JavaScript with no dependencies. One
small build script turns the bilingual source into an Icelandic and an
English page. Every push to `main` is deployed by Cloudflare Workers
(static assets), configured in `wrangler.jsonc`.

## Structure

```
wrangler.jsonc                 Cloudflare Worker config: serves ./public
build.mjs                      Builds public/index.html and public/en/index.html
src/
  index.html                   Bilingual source for all four pages
public/
  index.html                   Icelandic site at /      (generated, do not edit)
  en/index.html                English site at /en/     (generated, do not edit)
  assets/css/site.css          Styles
  assets/js/site.js            Page switching, menu, slide zoom
  assets/img/                  Logo, hero photo, share image, client logos
  favicon.svg
  robots.txt, sitemap.xml
  _headers                     Cache, security and noindex headers
```

## How it works

- **Pages.** The four pages are sections of `index.html`, shown one at a
  time by the URL hash: `#home`, `#about`, `#cases`, `#contact`.
- **Languages.** Text is written twice in `src/index.html`, as
  `<span data-l="en">…</span><span data-l="is">…</span>`. `node build.mjs`
  writes the Icelandic page to `public/index.html` (gulf.is) and the English
  page to `public/en/index.html` (gulf.is/en/), each with its own title,
  description, canonical and hreflang links. IS/EN are plain links that keep
  the current section. A visitor who chose English is sent to /en/ on later
  visits to the front page.
- **Fonts.** Fraunces (headings) and Source Serif 4 (text), from Google Fonts.

## Editing

Edit `src/index.html` (text) or `public/assets/` (styles, scripts, images),
run `node build.mjs`, commit both the source and the generated pages, and preview them through a local server so the
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

Search engines may index the site. Canonical links and the sitemap point to
gulf.is, so test.gulf.is is treated as a copy of gulf.is.

When gulf.is points at this Worker, set `IMG_HOST` in `build.mjs` to `SITE`
and run `node build.mjs`, so link previews load the share image from gulf.is.

Hero photo: Hraundrangi above Hraun in Öxnadalur, by Freysteinn G. Jonsson on Unsplash (Unsplash License), cropped and colour-adjusted: https://unsplash.com/photos/CaWUHJASMBs

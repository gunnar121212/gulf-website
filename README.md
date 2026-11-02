# gulf.is

Website for GULF ráðgjöf, the consultancy of Gunnar Úlfarsson.

A static site: plain HTML, CSS and JavaScript, with no build step and no
dependencies. Every push to `main` is deployed to https://gulf.is by
Cloudflare Pages.

## Structure

```
index.html              All four pages (home, about, cases, contact)
assets/css/site.css     Styles
assets/js/site.js       Page switching and the IS/EN language switch
assets/img/             Logo, hero photo, share image, client logos
favicon.svg
robots.txt, sitemap.xml
_headers                Cache and security headers for Cloudflare Pages
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

Edit the files and open `index.html` through a local server so the
`/assets/...` paths resolve:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

When adding text, add both the Icelandic and the English span.

## Deploying

Cloudflare Pages is connected to this repository:

- Framework preset: None
- Build command: (empty)
- Build output directory: `/`
- Production branch: `main`

Pushing to `main` publishes the site. Other branches get their own preview
URL, which is useful for checking a change before merging it.

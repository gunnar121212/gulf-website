// Serves the static site in ./public.
// - Plain http and www.gulf.is redirect to https://gulf.is, so the live site
//   lives at one secure address.
// - test.gulf.is serves the test version of the pages (public/_test/), which
//   can hold things not yet on the live site. Search engines are told not to
//   index it. gulf.is itself never serves /_test/.
// Everything else is a static file.
const CANONICAL = "gulf.is";
const TEST = "test.gulf.is";
const ALIASES = new Set(["www.gulf.is"]);
// Pages that have a test version: path on test.gulf.is -> file in ./public
const TEST_PAGES = {
  "/": "/_test/",
  "/index.html": "/_test/",
  "/en": "/_test/en/",
  "/en/": "/_test/en/",
  "/en/index.html": "/_test/en/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === TEST) {
      if (url.protocol === "http:") {
        url.protocol = "https:";
        url.port = "";
        return Response.redirect(url.toString(), 301);
      }
      const page = TEST_PAGES[url.pathname];
      const assetUrl = new URL(url);
      if (page) assetUrl.pathname = page;
      const res = await env.ASSETS.fetch(new Request(assetUrl, request));
      const out = new Response(res.body, res);
      out.headers.set("X-Robots-Tag", "noindex, nofollow");
      return out;
    }

    const alias = ALIASES.has(url.hostname);
    const insecure = url.protocol === "http:" && url.hostname === CANONICAL;
    if (alias || insecure) {
      url.hostname = CANONICAL;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/_test" || url.pathname.startsWith("/_test/")) {
      return new Response("Not found", { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};

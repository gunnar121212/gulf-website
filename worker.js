// Serves the static site in ./public. The only code that runs is a redirect:
// plain http, www.gulf.is and test.gulf.is send visitors (and search engines)
// to https://gulf.is, so the site lives at one secure address. Everything else
// is a static file.
const CANONICAL = "gulf.is";
const ALIASES = new Set(["www.gulf.is", "test.gulf.is"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const alias = ALIASES.has(url.hostname);
    const insecure = url.protocol === "http:" && url.hostname === CANONICAL;
    if (alias || insecure) {
      url.hostname = CANONICAL;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};

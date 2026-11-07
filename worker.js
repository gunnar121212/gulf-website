// Serves the static site in ./public. The only code that runs is a redirect:
// www.gulf.is and test.gulf.is send visitors (and search engines) to gulf.is,
// so the site lives at one address. Everything else is a static file.
const CANONICAL = "gulf.is";
const ALIASES = new Set(["www.gulf.is", "test.gulf.is"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (ALIASES.has(url.hostname)) {
      url.hostname = CANONICAL;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};

// Builds the Icelandic page (public/index.html) and the English page
// (public/en/index.html) from the bilingual source in src/index.html.
// Run after every text change:  node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://gulf.is";
const src = readFileSync(new URL("./src/index.html", import.meta.url), "utf8");

const META = {
  is: {
    path: "/",
    locale: "is_IS",
    title: "GULF ráðgjöf | Gunnar Úlfarsson, hagfræðingur og ráðgjafi",
    description:
      "GULF ráðgjöf er ráðgjafarfyrirtæki Gunnars Úlfarssonar hagfræðings, fyrrum aðalhagfræðings Viðskiptaráðs. Efnahagsgreiningar, stefnumótun og stuðningur við ákvarðanir.",
    ogDescription:
      "Sjálfstæð greining og ráðgjöf sem styður við stefnumótun og ákvarðanatöku.",
  },
  en: {
    path: "/en/",
    locale: "en_GB",
    title: "GULF ráðgjöf | Gunnar Úlfarsson, economist and consultant",
    description:
      "GULF ráðgjöf is the consultancy of economist Gunnar Úlfarsson, former chief economist of the Iceland Chamber of Commerce. Economic analysis, strategy and decision support.",
    ogDescription: "Independent economic and strategy consulting.",
  },
};

// Icelandic attribute text (alt, aria-label) that needs an English version
const ATTR_EN = {
  "Glæra: afstaða íbúa til Hnotasteins eftir svæðum":
    "Slide: residents' attitudes to Hnotasteinn by area",
  "Glæra: störf, tekjur Norðurþings og innviðir":
    "Slide: jobs, revenue for Norðurþing and infrastructure",
  "Hreyfimynd: fjölmörg störf gætu skapast til viðbótar í iðnaði vegna orkuframleiðslu Hnotasteins":
    "Animation: many further industrial jobs could follow from Hnotasteinn's power generation",
  "Fyrri glæra": "Previous slide",
  "Næsta glæra": "Next slide",
};

function build(lang) {
  const other = lang === "is" ? "en" : "is";
  const m = META[lang];
  let h = src;

  // Drop the other language's text (spans are never nested)
  h = h.replace(new RegExp(`<span\\b[^>]*\\bdata-l="${other}"[^>]*>[\\s\\S]*?</span>`, "g"), "");
  h = h.replace('<html lang="is">', `<html lang="${lang}">`);

  const head = [
    `<title>${m.title}</title>`,
    `<meta name="description" content="${m.description}">`,
    `<link rel="canonical" href="${SITE}${m.path}">`,
    `<link rel="alternate" hreflang="is" href="${SITE}/">`,
    `<link rel="alternate" hreflang="en" href="${SITE}/en/">`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/">`,
  ].join("\n");
  h = h.replace(/<title>[\s\S]*?<\/title>\n<meta name="description"[^>]*>\n<link rel="canonical"[^>]*>/, head);
  h = h.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${m.ogDescription}">`);
  h = h.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${SITE}${m.path}">\n<meta property="og:locale" content="${m.locale}">`);

  // Mark the current language link
  h = h.replace(`data-set="${lang}">`, `data-set="${lang}" aria-current="true">`);

  if (lang === "en") {
    for (const [is, en] of Object.entries(ATTR_EN)) h = h.split(`"${is}"`).join(`"${en}"`);
  } else {
    // Visitors who picked English before are sent to the English page
    h = h.replace(
      "</head>",
      `<script>try{if(localStorage.getItem("gulf-lang")==="en")location.replace("/en/"+location.hash)}catch(e){}</script>\n</head>`,
    );
  }
  return h;
}

writeFileSync(new URL("./public/index.html", import.meta.url), build("is"));
mkdirSync(new URL("./public/en/", import.meta.url), { recursive: true });
writeFileSync(new URL("./public/en/index.html", import.meta.url), build("en"));
console.log("Built public/index.html (is) and public/en/index.html (en)");

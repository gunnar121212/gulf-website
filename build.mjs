// Builds the Icelandic page (public/index.html) and the English page
// (public/en/index.html) from the bilingual source in src/index.html.
// Run after every text change:  node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://gulf.is";
// Host for the share image and other absolute image links
const IMG_HOST = SITE;
const src = readFileSync(new URL("./src/index.html", import.meta.url), "utf8");

const META = {
  is: {
    path: "/",
    locale: "is_IS",
    title: "GULF ráðgjöf | Efnahags- og stefnuráðgjöf",
    description: "Sjálfstæð greining og ráðgjöf sem styður við upplýstar ákvarðanir.",
    orgDescription:
      "Sjálfstæð efnahagsgreining og ráðgjöf um stefnumótun fyrir fyrirtæki og opinbera aðila.",
    jobTitle: "Hagfræðingur og ráðgjafi",
    knowsAbout: ["Hagfræði", "Efnahagsgreiningar", "Stefnumótun", "Opinber stefnumótun", "Ráðgjöf"],
  },
  en: {
    path: "/en/",
    locale: "en_GB",
    title: "GULF advisory | Economic and strategy consulting",
    description: "Independent economic and strategy consulting in Iceland.",
    orgDescription:
      "Independent economic analysis and strategy consulting for companies and public bodies in Iceland.",
    jobTitle: "Economist and consultant",
    knowsAbout: ["Economics", "Economic analysis", "Strategy", "Public policy", "Consulting"],
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

// Structured data (schema.org) describing GULF, Gunnar, the site and this page
function jsonLd(lang) {
  const m = META[lang];
  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE}/#gulf`,
      name: "GULF ráðgjöf",
      alternateName: ["GULF", "GULF advisory"],
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${IMG_HOST}/assets/img/logo-512.png`, width: 512, height: 512 },
      image: `${IMG_HOST}/assets/img/og-image.jpg`,
      description: m.orgDescription,
      email: "gunnar@gulf.is",
      telephone: "+3548471049",
      address: { "@type": "PostalAddress", addressCountry: "IS" },
      areaServed: { "@type": "Country", name: "Iceland" },
      knowsLanguage: ["is", "en"],
      knowsAbout: m.knowsAbout,
      founder: { "@id": `${SITE}/#gunnar` },
    },
    {
      "@type": "Person",
      "@id": `${SITE}/#gunnar`,
      name: "Gunnar Úlfarsson",
      jobTitle: m.jobTitle,
      image: `${IMG_HOST}/assets/img/gunnar.jpg`,
      url: `${SITE}${m.path}#about`,
      email: "gunnar@gulf.is",
      worksFor: { "@id": `${SITE}/#gulf` },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "University of St Andrews" },
        { "@type": "CollegeOrUniversity", name: "University of Iceland" },
      ],
      knowsLanguage: ["is", "en"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "GULF ráðgjöf",
      inLanguage: ["is", "en"],
      publisher: { "@id": `${SITE}/#gulf` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE}${m.path}#webpage`,
      url: `${SITE}${m.path}`,
      name: m.title,
      description: m.description,
      inLanguage: lang,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#gulf` },
      primaryImageOfPage: `${IMG_HOST}/assets/img/og-image.jpg`,
    },
  ];
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}

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
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
  ].join("\n");
  h = h.replace(/<title>[\s\S]*?<\/title>\n<meta name="description"[^>]*>\n<link rel="canonical"[^>]*>/, head);
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => jsonLd(lang));
  h = h.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${m.title}">`);
  h = h.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${m.description}">`);
  h = h.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${SITE}${m.path}">\n<meta property="og:locale" content="${m.locale}">\n<meta property="og:locale:alternate" content="${META[other].locale}">`);
  const img = `${IMG_HOST}/assets/img/og-image.jpg`;
  h = h.replace(
    /<meta property="og:image"[^>]*>\n<meta name="twitter:card"[^>]*>/,
    [
      `<meta property="og:site_name" content="GULF ráðgjöf">`,
      `<meta property="og:image" content="${img}">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
      `<meta property="og:image:alt" content="GULF ráðgjöf">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${m.title}">`,
      `<meta name="twitter:description" content="${m.description}">`,
      `<meta name="twitter:image" content="${img}">`,
    ].join("\n"),
  );

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

// Sitemap with both languages linked to each other, dated by the build
const today = new Date().toISOString().slice(0, 10);
const alts = ["is", "en"]
  .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${META[l].path}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`)
  .join("\n");
const urls = ["is", "en"]
  .map((l) => `  <url>\n    <loc>${SITE}${META[l].path}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n  </url>`)
  .join("\n");
writeFileSync(
  new URL("./public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
);
console.log("Built public/index.html (is), public/en/index.html (en) and public/sitemap.xml");

(function () {
  var pages = ["home", "about", "cases", "contact"];
  function show() {
    var h = location.hash.slice(1);
    if (pages.indexOf(h) < 0) h = "home";
    pages.forEach(function (p) {
      document.getElementById("p-" + p).hidden = p !== h;
    });
    document.querySelectorAll("nav.main a").forEach(function (a) {
      if (a.getAttribute("href") === "#" + h)
        a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.body.classList.toggle("home", h === "home");
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", show);
  show();

  function setLang(l, save) {
    document.documentElement.lang = l;
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.set === l));
    });
    if (save) {
      try {
        localStorage.setItem("gulf-lang", l);
      } catch (e) {}
    }
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      setLang(b.dataset.set, true);
    });
  });
  setLang(document.documentElement.lang, false);
})();

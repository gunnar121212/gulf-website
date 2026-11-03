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
  var header = document.querySelector("header.site");
  var menuBtn = header.querySelector(".menu-btn");
  function setMenu(open) {
    header.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!header.classList.contains("open"));
  });
  document.addEventListener("click", function (e) {
    if (!header.contains(e.target) || e.target.closest("nav.main a"))
      setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

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
  var zs = document.querySelectorAll(".cz");
  function zoom(el, on) {
    el.classList.toggle("on", on);
    el.setAttribute("aria-pressed", on ? "true" : "false");
    if (!on) el.scrollLeft = 0;
  }
  zs.forEach(function (el) {
    var sx = 0, moved = false;
    el.addEventListener("pointerdown", function (e) { sx = e.clientX; moved = false; });
    el.addEventListener("pointermove", function (e) { if (Math.abs(e.clientX - sx) > 8) moved = true; });
    el.addEventListener("click", function () {
      if (moved) return;
      var on = !el.classList.contains("on");
      zs.forEach(function (o) { if (o !== el) zoom(o, false); });
      zoom(el, on);
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".cz")) zs.forEach(function (o) { zoom(o, false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") zs.forEach(function (o) { zoom(o, false); });
  });
})();

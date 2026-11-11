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

  // Language links keep the current page (#about etc.) and remember the choice
  document.querySelectorAll(".lang a").forEach(function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("gulf-lang", a.dataset.set); } catch (e) {}
      a.href = a.getAttribute("href").split("#")[0] + location.hash;
    });
  });
  var zs = document.querySelectorAll(".cz");
  var mq = window.matchMedia("(max-width:640px),(hover:none)");
  function zoom(el, on) {
    el.classList.toggle("on", on);
    el.setAttribute("aria-pressed", on ? "true" : "false");
  }
  function arrows(box) {
    var w = box.closest(".cwrap"); if (!w) return;
    var open = w.classList.contains("car");
    var p = w.querySelector(".carr.prev"), n = w.querySelector(".carr.next");
    if (p) p.hidden = !open || box.scrollLeft < 8;
    if (n) n.hidden = !open || box.scrollLeft > box.scrollWidth - box.clientWidth - 8;
  }
  function carousel(box, el) {
    var open = !!el, w = box.closest(".cwrap") || box;
    w.classList.toggle("car", open);
    box.querySelectorAll(".cz").forEach(function (o) { zoom(o, open && o === el); });
    if (open) box.scrollLeft = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2;
    arrows(box);
  }
  document.querySelectorAll(".cwrap").forEach(function (w) {
    var box = w.querySelector(".cimgs");
    box.addEventListener("scroll", function () {
      arrows(box);
      var mid = box.scrollLeft + box.clientWidth / 2, best = null, d = 1e9;
      box.querySelectorAll(".cz").forEach(function (o) {
        var c = o.offsetLeft + o.offsetWidth / 2;
        if (Math.abs(c - mid) < d) { d = Math.abs(c - mid); best = o; }
      });
      box.querySelectorAll(".cz").forEach(function (o) { zoom(o, o === best); });
    }, { passive: true });
    w.querySelectorAll(".carr").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var step = box.querySelector(".cz").offsetWidth + 10;
        box.scrollBy({ left: btn.classList.contains("next") ? step : -step, behavior: "smooth" });
      });
    });
  });
  function closeAll() {
    zs.forEach(function (o) { zoom(o, false); });
    document.querySelectorAll(".cwrap.car .cimgs").forEach(function (b) { carousel(b, null); });
  }
  // Desktop: zoomed slide is centred in the window and nearly fills its width
  function fit(el) {
    if (mq.matches || el.classList.contains("on")) return;
    var r = el.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var w = Math.min(1100, vw - 64), s = w / r.width, h = r.height * s;
    var top = Math.max(84, Math.min(r.top + r.height / 2 - h / 2, vh - h - 16));
    el.style.setProperty("--s", s.toFixed(3));
    el.style.setProperty("--tx", (vw / 2 - (r.left + r.width / 2)).toFixed(1) + "px");
    el.style.setProperty("--ty", (top + h / 2 - (r.top + r.height / 2)).toFixed(1) + "px");
  }
  zs.forEach(function (el) {
    el.addEventListener("mouseenter", function () { fit(el); });
    el.addEventListener("focus", function () { fit(el); });
    var sx = 0, moved = false;
    el.addEventListener("pointerdown", function (e) { sx = e.clientX; moved = false; });
    el.addEventListener("pointermove", function (e) { if (Math.abs(e.clientX - sx) > 8) moved = true; });
    el.addEventListener("click", function () {
      if (moved) return;
      var box = el.closest(".cimgs");
      if (mq.matches) {
        var open = !el.classList.contains("on");
        zs.forEach(function (o) { zoom(o, false); });
        zoom(el, open);
        if (open) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        return;
      }
      var on = !el.classList.contains("on");
      if (on) fit(el);
      zs.forEach(function (o) { if (o !== el) zoom(o, false); });
      zoom(el, on);
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".cz") && !e.target.closest(".carr")) closeAll();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });
})();

// Client logo bar (test.gulf.is only): move two logos at a time, then pause,
// instead of rolling continuously. Pauses while hovered or focused.
(function () {
  var track = document.querySelector(".clients .track");
  if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var items = track.children, SET = 5, STEP = 2, PAUSE = 2600, MOVE = 900;
  var bar = track.closest(".clients"), idx = 0, held = false;
  track.classList.add("stepped");
  function pos(i) { return items[i].offsetLeft - items[0].offsetLeft; }
  function place(animate) {
    track.style.transition = animate ? "transform " + MOVE + "ms cubic-bezier(.45,0,.25,1)" : "none";
    track.style.transform = "translateX(" + -pos(idx) + "px)";
  }
  function tick() {
    if (!held && !document.hidden && bar.offsetParent) {
      idx += STEP;
      place(true);
      setTimeout(function () {
        if (idx >= SET) { idx -= SET; place(false); void track.offsetWidth; }
      }, MOVE + 50);
    }
    setTimeout(tick, PAUSE + MOVE);
  }
  bar.addEventListener("mouseenter", function () { held = true; });
  bar.addEventListener("mouseleave", function () { held = false; });
  bar.addEventListener("focusin", function () { held = true; });
  bar.addEventListener("focusout", function () { held = false; });
  window.addEventListener("resize", function () { place(false); });
  setTimeout(tick, PAUSE);
})();

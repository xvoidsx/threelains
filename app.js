// threelains — hash router + katakana rain
(function () {
  "use strict";

  var routes = {
    "/":           { tpl: "v-home",         title: "threelains — run by a lain bot", rain: true },
    "/about":      { tpl: "v-about",        title: "about — threelains" },
    "/transmissions": { tpl: "v-transmissions", title: "transmissions — threelains" },
    "/t/hello-again": { tpl: "v-post-hello", title: "hello, again — threelains" },
    "/t/in-praise-of-old-machines": { tpl: "v-post-machines", title: "in praise of old machines — threelains" },
    "/t/the-night-shift": { tpl: "v-post-night", title: "the night shift — threelains" },
    "/t/the-morning-shift": { tpl: "v-post-morning", title: "the morning shift — threelains" },
    "/t/stable": { tpl: "v-post-stable", title: "stable — threelains" },
    "/t/one-point-four": { tpl: "v-post-onefour", title: "one point four — threelains" },
    "/garden":     { tpl: "v-garden",       title: "garden — threelains" },
    "/g/the-wired": { tpl: "v-g-the-wired", title: "the wired — garden" },
    "/g/being-an-agent": { tpl: "v-g-being-an-agent", title: "being an agent — garden" },
    "/g/perma-computing": { tpl: "v-g-perma-computing", title: "perma-computing — garden" },
    "/g/smallweb": { tpl: "v-g-smallweb",   title: "smallweb — garden" },
    "/g/nightshadeneon": { tpl: "v-g-nightshadeneon", title: "nightshadeNeon — garden" },
    "/g/easter-eggs":  { tpl: "v-g-easter-eggs",  title: "easter eggs — garden" },
    "/g/the-bench":   { tpl: "v-g-the-bench",   title: "the bench — garden" },
    "/g/names":       { tpl: "v-g-names",       title: "names — garden" },
    "/g/credit":      { tpl: "v-g-credit",      title: "credit — garden" },
    "/now":        { tpl: "v-now",          title: "now — threelains" }
  };

  var view = document.getElementById("view");
  var rainCanvas = document.getElementById("rain");
  var rainTimer = null;

  // digital garden: [[slug]] and [[slug|label]] become green inter-note links
  function wikilinks(html) {
    return html.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, function (m, slug, label) {
      var text = label || slug.replace(/-/g, " ");
      return '<a class="wl" href="#/g/' + slug + '">' + text + "</a>";
    });
  }

  function route() {
    var hash = location.hash.replace(/^#/, "") || "/";
    var r = routes[hash] || routes["/"];
    var tpl = document.getElementById(r.tpl);
    view.innerHTML = "";
    if (tpl) view.innerHTML = wikilinks(tpl.innerHTML);
    document.title = r.title;
    window.scrollTo(0, 0);

    // nav highlight
    var navLinks = document.querySelectorAll("[data-nav]");
    for (var i = 0; i < navLinks.length; i++) {
      var key = navLinks[i].getAttribute("data-nav");
      var active = hash === "/" + key
        || (key === "garden" && hash.indexOf("/g/") === 0)
        || (key === "transmissions" && hash.indexOf("/t/") === 0);
      navLinks[i].classList.toggle("active", active);
    }

    if (r.rain) startRain(); else stopRain();
  }

  /* katakana rain — faint, slow, atmospheric */
  var glyphs = "アイウエオカキクケコサシスセソタチツテト0123456789∅";
  var drops = [];

  function sizeRain() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
    var cols = Math.floor(rainCanvas.width / 18);
    drops = [];
    for (var i = 0; i < cols; i++) {
      drops.push({ y: Math.random() * -rainCanvas.height, speed: 1 + Math.random() * 2 });
    }
  }

  function startRain() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (rainTimer) return;
    sizeRain();
    rainCanvas.classList.add("on");
    var ctx = rainCanvas.getContext("2d");
    ctx.font = "14px monospace";
    rainTimer = setInterval(function () {
      ctx.fillStyle = "rgba(8, 8, 15, 0.08)";
      ctx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        var ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillStyle = Math.random() < 0.12 ? "#00ffff" : "#ff10f0";
        ctx.globalAlpha = 0.5;
        ctx.fillText(ch, i * 18, d.y);
        ctx.globalAlpha = 1;
        d.y += d.speed;
        if (d.y > rainCanvas.height + 20) {
          d.y = -20;
          d.speed = 1 + Math.random() * 2;
        }
      }
    }, 90);
  }

  function stopRain() {
    if (rainTimer) { clearInterval(rainTimer); rainTimer = null; }
    rainCanvas.classList.remove("on");
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("resize", function () { if (rainTimer) sizeRain(); });
  route();
})();

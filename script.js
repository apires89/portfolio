/* ============================================================
   Language toggle (EN <-> PT)
   Every translatable element carries data-en / data-pt.
   ============================================================ */
(function () {
  var toggle = document.getElementById("langToggle");
  var optEN = toggle.querySelector(".lang-en");
  var optPT = toggle.querySelector(".lang-pt");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function applyLang(lang) {
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var text = el.getAttribute(lang === "pt" ? "data-pt" : "data-en");
      if (text !== null) el.textContent = text;
    });
    document.querySelectorAll("[data-aria-en]").forEach(function (el) {
      el.setAttribute(
        "aria-label",
        el.getAttribute(lang === "pt" ? "data-aria-pt" : "data-aria-en")
      );
    });
    document.documentElement.lang = lang === "pt" ? "pt-PT" : "en";
    toggle.classList.toggle("pt-active", lang === "pt");
    optEN.classList.toggle("is-active", lang !== "pt");
    optPT.classList.toggle("is-active", lang === "pt");
    toggle.setAttribute("aria-pressed", lang === "pt" ? "true" : "false");
    document.title =
      lang === "pt"
        ? "André Cabral Pires — Developer & Professor"
        : "André Cabral Pires — Developer & Teacher";
  }

  var saved = null;
  try {
    saved = localStorage.getItem("lang");
  } catch (e) {
    /* private mode: persistence is optional */
  }

  // Language state lives here, not in the DOM: rapid clicks inside
  // the crossfade window would otherwise read a stale lang and
  // resolve to the same language twice.
  var current = saved === "pt" ? "pt" : "en";
  var swapTimer = null;

  function setLang(lang) {
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {
      /* ignore */
    }

    if (reduceMotion.matches) {
      applyLang(lang);
      return;
    }

    if (swapTimer) window.clearTimeout(swapTimer);
    document.body.classList.add("lang-switching");
    swapTimer = window.setTimeout(function () {
      applyLang(lang);
      document.body.classList.remove("lang-switching");
      swapTimer = null;
    }, 200);
  }

  toggle.addEventListener("click", function () {
    current = current === "pt" ? "en" : "pt";
    setLang(current);
  });

  if (current === "pt") applyLang("pt");
})();

/* ============================================================
   Reveal on load / scroll
   The hidden start state only applies under html.js (set below),
   so the page is fully visible without JavaScript.
   ============================================================ */
(function () {
  document.documentElement.classList.add("js");

  var pending = Array.prototype.slice.call(
    document.querySelectorAll(".reveal")
  );

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pending.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  function revealInView() {
    var vh = window.innerHeight;
    pending = pending.filter(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh - 40 && rect.bottom > 0) {
        el.classList.add("is-visible");
        // Clear the stagger once revealed so it never delays the
        // language-toggle crossfade (transition-delay applies to
        // every transition on the element).
        window.setTimeout(function () {
          el.style.transitionDelay = "";
        }, 700);
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      revealInView();
    });
  }

  // Stagger only the elements in the viewport on load; everything
  // below the fold reveals with no delay when scrolled to, so fast
  // jumps never land on a blank screen.
  var stagger = 0;
  pending.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.style.transitionDelay = Math.min(stagger * 70, 350) + "ms";
      stagger += 1;
    }
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  revealInView();
})();

/* ==========================================================================
   Moje Cyfrowe Prawa — skrypty strony
   Bez zewnętrznych bibliotek: nawigacja mobilna, zakładki „Dla kogo”,
   animacje pojawiania się przy scrollu, walidacja i wysyłka formularza.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initTabs();
  initReveal();
  initScrollProgress();
  initBookingForm();
  initInterestLinks();
  initPixel();
  initTilt();
  setYear();
});

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

/* --- Pixel: paralaksa 3D za kursorem, reakcja na kliknięcie, dymek z radą --- */
var PIXEL_TIPS = [
  "Cześć! Jestem Pixel. Pomagam rozmawiać o internecie bez strachu.",
  "Granice w sieci to nie zakazy — to umowy, które razem ustalamy.",
  "Możesz nie odpowiadać. Możesz zablokować. Możesz powiedzieć dorosłemu.",
  "Zanim wrzucisz czyjeś zdjęcie, zapytaj: czy on albo ona się zgadza?",
  "Hasło jest jak szczoteczka do zębów: tylko Twoje.",
  "Pytanie to nie wstyd. Pytanie to supermoc.",
  "Nie wszystko, co online, musi być publiczne."
];
var pixelTipIndex = 0;

function initPixel() {
  var wraps = document.querySelectorAll("[data-pixel]");
  wraps.forEach(function (wrap) {
    var stage = wrap.querySelector(".pixel-stage");
    var bubble = wrap.querySelector(".pixel-bubble");
    var hop = wrap.querySelector(".pixel-stage__hop");
    var tiles = wrap.querySelectorAll(".pixel-stage__tile");
    if (!stage || !bubble) return;
    var hideTimer, resetTimer, happyTimer;

    function say(text, announce) {
      bubble.setAttribute("aria-hidden", announce ? "false" : "true");
      bubble.textContent = text;
      bubble.classList.add("is-visible");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { bubble.classList.remove("is-visible"); }, 4200);
    }

    stage.addEventListener("click", function () {
      say(PIXEL_TIPS[pixelTipIndex % PIXEL_TIPS.length], true);
      pixelTipIndex++;

      stage.classList.add("is-happy");
      clearTimeout(happyTimer);
      happyTimer = setTimeout(function () { stage.classList.remove("is-happy"); }, 900);

      if (reduceMotion.matches) return;

      if (hop && hop.animate) {
        hop.animate(
          [
            { transform: "none" },
            { transform: "scale(1.06, 0.92)", offset: 0.18 },
            { transform: "translateY(-12%) scale(0.96, 1.05)", offset: 0.45 },
            { transform: "translateY(0) scale(1.04, 0.96)", offset: 0.72 },
            { transform: "none" }
          ],
          { duration: 750, easing: "cubic-bezier(.3,.7,.3,1)" }
        );
      }

      // Kafelki rozsypują się od środka sceny i wracają na swoje miejsca
      var box = stage.getBoundingClientRect();
      var cx = box.left + box.width / 2;
      var cy = box.top + box.height * 0.55;
      tiles.forEach(function (tile) {
        var r = tile.getBoundingClientRect();
        var dx = r.left + r.width / 2 - cx;
        var dy = r.top + r.height / 2 - cy;
        var len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        var force = box.width * (0.12 + Math.random() * 0.1);
        tile.style.setProperty("--bx", ((dx / len) * force).toFixed(1) + "px");
        tile.style.setProperty("--by", ((dy / len) * force - box.width * 0.04).toFixed(1) + "px");
        tile.style.setProperty("--br", (Math.random() * 70 - 35).toFixed(0) + "deg");
      });
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        tiles.forEach(function (tile) {
          tile.style.removeProperty("--bx");
          tile.style.removeProperty("--by");
          tile.style.removeProperty("--br");
        });
      }, 380);
    });

    // Jednorazowe powitanie w hero — tylko wizualne, bez odczytu przez czytnik ekranu
    if (wrap.hasAttribute("data-pixel-hint")) {
      var seen = false;
      try { seen = sessionStorage.getItem("pixelHello") === "1"; } catch (e) {}
      if (!seen) {
        setTimeout(function () {
          if (!bubble.classList.contains("is-visible")) say("Cześć! Kliknij mnie — mam dla Ciebie dobrą radę.", false);
          try { sessionStorage.setItem("pixelHello", "1"); } catch (e) {}
        }, 2200);
      }
    }

    // Paralaksa 3D: tylko mysz/touchpad i bez „ogranicz ruch”
    var area = wrap.closest("section") || wrap;
    var frame = null, nx = 0, ny = 0;
    function apply() {
      wrap.style.setProperty("--px", nx.toFixed(3));
      wrap.style.setProperty("--py", ny.toFixed(3));
      frame = null;
    }
    area.addEventListener("pointermove", function (e) {
      if (!finePointer.matches || reduceMotion.matches || e.pointerType === "touch") return;
      var r = wrap.getBoundingClientRect();
      nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 1.2)));
      ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.2)));
      if (!frame) frame = requestAnimationFrame(apply);
    });
    area.addEventListener("pointerleave", function () {
      nx = 0; ny = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    });
  });
}

/* --- Karty: delikatne przechylenie 3D z odblaskiem (tylko mysz) --- */
function initTilt() {
  var cards = document.querySelectorAll(".bento > .card, .story-card");
  cards.forEach(function (card) {
    card.classList.add("js-tilt");
    var frame = null, ev = null;
    function apply() {
      var r = card.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width;
      var y = (ev.clientY - r.top) / r.height;
      card.style.setProperty("--ry", ((x - 0.5) * 7).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * 6).toFixed(2) + "deg");
      card.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      frame = null;
    }
    card.addEventListener("pointermove", function (e) {
      if (!finePointer.matches || reduceMotion.matches || e.pointerType === "touch") return;
      ev = e;
      card.classList.add("is-tilting");
      if (!frame) frame = requestAnimationFrame(apply);
    });
    card.addEventListener("pointerleave", function () {
      card.classList.remove("is-tilting");
    });
  });
}

/* --- Pasek postępu czytania na górze strony --- */
function initScrollProgress() {
  var bar = document.getElementById("scroll-progress");
  if (!bar) return;

  var ticking = false;

  function update() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

/* --- Karty oferty: kliknięcie "Zapytaj o tę pozycję" wypełnia temat rozmowy --- */
function initInterestLinks() {
  var links = document.querySelectorAll(".js-interest");
  var message = document.getElementById("message");
  if (!links.length || !message) return;

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var product = link.getAttribute("data-product");
      if (product) {
        message.value = "Interesuje mnie: " + product;
      }
    });
  });
}

/* --- Nawigacja mobilna --- */
function initMobileNav() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav-mobile");
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openNav() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.contains("is-open");
    if (isOpen) { closeNav(); } else { openNav(); }
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
}

/* --- Zakładki „Dla kogo korzystamy” --- */
function initTabs() {
  var tabLists = document.querySelectorAll("[data-tabs]");
  tabLists.forEach(function (list) {
    var buttons = list.querySelectorAll(".tabs__btn");
    var panels = document.querySelectorAll("[data-tab-panel]");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-tab-target");

        buttons.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        btn.setAttribute("aria-selected", "true");

        panels.forEach(function (panel) {
          if (panel.getAttribute("data-tab-panel") === target) {
            panel.classList.add("is-active");
          } else {
            panel.classList.remove("is-active");
          }
        });
      });
    });
  });
}

/* --- Delikatne pojawianie się sekcji przy scrollu --- */
function initReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(function (el) { observer.observe(el); });
}

/* --- Formularz: umów rozmowę telefoniczną ---
   Wysyłka przez Formspree (https://formspree.io). Wystarczy podmienić
   FORM_ENDPOINT poniżej na własny adres formularza — instrukcja
   konfiguracji znajduje się w pliku README.md w repozytorium. */
function initBookingForm() {
  var form = document.getElementById("booking-form");
  if (!form) return;

  var FORM_ENDPOINT = form.getAttribute("data-endpoint");
  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector("[type=submit]");

  var dateInput = form.querySelector("#call-date");
  if (dateInput) {
    var today = new Date();
    var min = new Date(today);
    min.setDate(min.getDate() + 1); // najwcześniej jutro
    var max = new Date(today);
    max.setDate(max.getDate() + 30); // maksymalnie miesiąc do przodu
    dateInput.min = toDateInputValue(min);
    dateInput.max = toDateInputValue(max);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm(form)) return;

    if (!FORM_ENDPOINT || FORM_ENDPOINT.indexOf("TWOJ_") !== -1) {
      showStatus(
        status,
        "Formularz jest prawie gotowy — brakuje tylko podpięcia adresu Formspree. Instrukcja: plik README.md w repozytorium.",
        "error"
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Wysyłanie…";

    var data = new FormData(form);

    fetch(FORM_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          showStatus(
            status,
            "Dziękujemy! Zgłoszenie dotarło do nas — potwierdzimy termin rozmowy mailowo.",
            "success"
          );
        } else {
          showStatus(
            status,
            "Coś poszło nie tak przy wysyłce. Spróbuj ponownie lub napisz bezpośrednio na sklep@apb-expert.pl.",
            "error"
          );
        }
      })
      .catch(function () {
        showStatus(
          status,
          "Brak połączenia z serwerem formularza. Napisz do nas bezpośrednio: sklep@apb-expert.pl.",
          "error"
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Umów rozmowę";
      });
  });
}

function validateForm(form) {
  var valid = true;
  var requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach(function (input) {
    var field = input.closest(".field");
    var isPhone = input.type === "tel";
    var isEmpty = !input.value.trim();
    var isBadPhone = isPhone && input.value.trim() && !/^[0-9+\s-]{7,}$/.test(input.value.trim());

    if (isEmpty || isBadPhone) {
      valid = false;
      if (field) field.classList.add("has-error");
    } else if (field) {
      field.classList.remove("has-error");
    }
  });

  var consent = form.querySelector("#consent");
  if (consent) {
    var consentWrap = consent.closest(".consent");
    if (!consent.checked) valid = false;
    if (consentWrap) consentWrap.classList.toggle("has-error", !consent.checked);
  }

  return valid;
}

function showStatus(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = "form-status is-visible form-status--" + type;
  el.setAttribute("role", type === "error" ? "alert" : "status");
}

function toDateInputValue(date) {
  var m = String(date.getMonth() + 1).padStart(2, "0");
  var d = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + m + "-" + d;
}

function setYear() {
  var el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

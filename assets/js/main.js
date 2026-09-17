/* ==========================================================================
   Moje Cyfrowe Prawa — skrypty strony
   Bez zewnętrznych bibliotek: nawigacja mobilna, zakładki „Dla kogo”,
   animacje pojawiania się przy scrollu, walidacja i wysyłka formularza.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initTabs();
  initReveal();
  initBookingForm();
  initInterestLinks();
  setYear();
});

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
  if (consent && !consent.checked) {
    valid = false;
    var consentWrap = consent.closest(".consent");
    if (consentWrap) consentWrap.style.color = "#B33A31";
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

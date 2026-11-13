/* ==========================================================================
   main.js — navigation, reveal animations, contact form validation
   Written in plain ES5-safe JavaScript. No dependencies, no build step.
   Every feature degrades gracefully if JavaScript is unavailable.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;

  /* ---------------------------------------------------------------------
     0. Flag: JS is running (CSS shows reveal content when it is not)
     --------------------------------------------------------------------- */
  root.classList.remove("no-js");

  /* ---------------------------------------------------------------------
     1. Mobile navigation
     --------------------------------------------------------------------- */
  var toggle = doc.getElementById("navToggle");
  var nav = doc.getElementById("primaryNav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close after tapping a link (mobile), so the menu does not cover content.
    nav.addEventListener("click", function (e) {
      var target = e.target;
      if (target && target.tagName === "A" && nav.classList.contains("is-open")) {
        closeNav();
      }
    });

    // Escape closes the menu and returns focus to the button.
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });

    // Clicking outside the header closes it.
    doc.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    // Reset state if the viewport grows past the mobile breakpoint.
    var mq = window.matchMedia("(min-width: 861px)");
    var onChange = function (e) { if (e.matches) closeNav(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------------------------------------------------------------------
     2. Reveal on scroll (subtle, respects reduced motion)
     --------------------------------------------------------------------- */
  var revealItems = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealItems.forEach(function (el) { revealObserver.observe(el); });

    // Project cards are injected after this script area runs in projects.js,
    // but that file loads first; re-observe anything not yet handled.
    window.setTimeout(function () {
      Array.prototype.slice.call(doc.querySelectorAll(".reveal:not(.is-visible)")).forEach(function (el) {
        revealObserver.observe(el);
      });
    }, 0);
  }

  /* ---------------------------------------------------------------------
     3. Active navigation state while scrolling
     --------------------------------------------------------------------- */
  var sectionIds = ["about", "skills", "projects", "education", "interests", "availability", "contact"];
  var navLinks = {};
  sectionIds.forEach(function (id) {
    var link = doc.querySelector('.primary-nav a[href="#' + id + '"]');
    if (link) navLinks[id] = link;
  });

  function setActive(id) {
    Object.keys(navLinks).forEach(function (key) {
      navLinks[key].classList.toggle("is-active", key === id);
    });
  }

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && navLinks[entry.target.id]) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sectionIds.forEach(function (id) {
      var section = doc.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------------------
     4. Back-to-top button
     --------------------------------------------------------------------- */
  var toTop = doc.getElementById("toTop");
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 600) toTop.removeAttribute("hidden");
      else toTop.setAttribute("hidden", "");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop.addEventListener("click", function (e) {
      if (reduceMotion) return; // let the browser jump
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      var brand = doc.querySelector(".brand");
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------------------
     5. Footer year
     --------------------------------------------------------------------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------------
     6. Contact form — validates, then opens the visitor's mail app.
        No server, no storage, no third-party request. Fails loudly and
        offers the phone / WhatsApp alternatives if anything goes wrong.
     --------------------------------------------------------------------- */
  var form = doc.getElementById("contactForm");
  var statusEl = doc.getElementById("formStatus");

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function fieldError(id, message) {
    var input = doc.getElementById(id);
    var errorEl = doc.getElementById(id + "-error");
    if (errorEl) errorEl.textContent = message || "";
    if (input) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
  }

  function validateField(id) {
    var input = doc.getElementById(id);
    if (!input) return true;
    var value = (input.value || "").trim();

    if (id === "cf-name") {
      if (value.length < 2) { fieldError(id, "Please enter your name (at least 2 characters)."); return false; }
    }
    if (id === "cf-email") {
      if (!value) { fieldError(id, "Please enter your email address."); return false; }
      if (!EMAIL_RE.test(value)) { fieldError(id, "That email address does not look right. Check for a typo."); return false; }
    }
    if (id === "cf-subject") {
      if (value.length < 3) { fieldError(id, "Please add a short subject (at least 3 characters)."); return false; }
    }
    if (id === "cf-message") {
      if (value.length < 10) { fieldError(id, "Please write a little more — at least 10 characters."); return false; }
    }
    fieldError(id, "");
    return true;
  }

  if (form) {
    var fieldIds = ["cf-name", "cf-email", "cf-subject", "cf-message"];

    // Validate as the visitor leaves a field, and clear errors as they fix them.
    fieldIds.forEach(function (id) {
      var input = doc.getElementById(id);
      if (!input) return;
      input.addEventListener("blur", function () { validateField(id); });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateField(id);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (statusEl) {
        statusEl.textContent = "";
        statusEl.className = "form-status";
      }

      var valid = true;
      var firstInvalid = null;
      fieldIds.forEach(function (id) {
        var ok = validateField(id);
        if (!ok && !firstInvalid) firstInvalid = doc.getElementById(id);
        if (!ok) valid = false;
      });

      if (!valid) {
        if (statusEl) {
          statusEl.textContent = "Please correct the field above, then try again.";
          statusEl.className = "form-status is-error";
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name = doc.getElementById("cf-name").value.trim();
      var email = doc.getElementById("cf-email").value.trim();
      var subject = doc.getElementById("cf-subject").value.trim();
      var message = doc.getElementById("cf-message").value.trim();

      var body =
        message + "\n\n—\nFrom: " + name + "\nEmail: " + email + "\nSent from the portfolio contact form.";

      var mailto =
        "mailto:mnura361234@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      try {
        if (mailto.length > 1900) {
          throw new Error("Message is too long to pass to an email app.");
        }
        window.location.href = mailto;

        if (statusEl) {
          statusEl.textContent =
            "Your email app should be opening with the message filled in. If nothing happens, use the phone or WhatsApp links above.";
          statusEl.className = "form-status is-success";
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent =
            "Sorry — the email could not be opened automatically. Please call +234 806 218 5903, message WhatsApp, or email mnura361234@gmail.com directly.";
          statusEl.className = "form-status is-error";
        }
      }
    });
  }

  /* ---------------------------------------------------------------------
     7. Defensive check: warn (in the console only) about broken internal links
        so the owner notices during development.
     --------------------------------------------------------------------- */
  Array.prototype.slice.call(doc.querySelectorAll('a[href^="#"]')).forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href === "#") return;
    if (!doc.getElementById(href.slice(1))) {
      if (window.console && console.warn) {
        console.warn("Broken in-page link:", href);
      }
    }
  });

})();

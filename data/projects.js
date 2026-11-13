/* ==========================================================================
   projects.js — the ONLY file you edit to add a project.
   --------------------------------------------------------------------------
   Copy one block, paste it above the closing "];", change the values.

   Fields:
     title       (required) Project name
     status      (optional) e.g. "Completed learning project", "In progress"
     summary     (required) One or two sentences, plain language
     details     (optional) Array of short bullet strings
     tech        (optional) Array of technology names
     image       (optional) Path or URL to a screenshot — e.g. "assets/project-1.png"
     repo        (optional) Full GitHub URL. Leave "" if there is none.
     demo        (optional) Full live-demo URL. Leave "" if there is none.
     todo        (optional) Text shown in an amber box about missing items.
                            Leave "" to hide the box.

   IMPORTANT: empty strings ("") are treated as "no link" and are not rendered,
   so the site never shows a broken or invented link.
   ========================================================================== */

const PROJECTS = [
  {
    title: "Python Student Profile Application",
    status: "Foundational learning project",
    summary:
      "A foundational Python application created to organise and display student profile information. " +
      "It stores basic details for each student and prints a readable profile, which made it a practical " +
      "way to practise variables, dictionaries, functions and loops in one small program.",
    details: [
      "Built while learning Python fundamentals, not as a commercial product.",
      "Practises storing related data together and displaying it in a clear, consistent format.",
      "Run from the command line — no installation beyond Python itself."
    ],
    tech: ["Python"],
    image: "",
    repo: "",
    demo: "",
    todo: "Demonstrations to add: source code link, screenshots of the output, and a run guide."
  }
];

/* --------------------------------------------------------------------------
   Renders the project cards into #projectGrid.
   Safety: if this file is missing or malformed, the page keeps its <noscript>
   fallback and the rest of the site still works.
   -------------------------------------------------------------------------- */
(function () {
  "use strict";

  var grid = document.getElementById("projectGrid");
  if (!grid) return;

  if (typeof PROJECTS === "undefined" || !Array.isArray(PROJECTS) || PROJECTS.length === 0) {
    // Keep the static fallback already in the HTML.
    return;
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Only allow http(s) URLs, so a typo cannot inject javascript: etc.
  function safeUrl(url) {
    if (!url) return "";
    try {
      var u = new URL(url, window.location.href);
      return (u.protocol === "http:" || u.protocol === "https:") ? u.href : "";
    } catch (e) {
      return "";
    }
  }

  function card(p) {
    var title = esc(p.title || "Untitled project");
    var summary = esc(p.summary || "");
    var status = esc(p.status || "");
    var tech = Array.isArray(p.tech) ? p.tech : [];
    var details = Array.isArray(p.details) ? p.details : [];
    var todo = esc(p.todo || "");
    var img = typeof p.image === "string" ? p.image.trim() : "";
    var repo = safeUrl(p.repo);
    var demo = safeUrl(p.demo);

    var media = img
      ? '<div class="project-media"><img src="' + esc(img) + '" alt="Screenshot of the ' + title +
        ' project" loading="lazy" decoding="async" width="640" height="360" onerror="this.parentNode.innerHTML=\'<div class=&quot;project-media-placeholder&quot;><span aria-hidden=&quot;true&quot;>▢</span><span>Screenshot not available</span></div>\';"></div>'
      : '<div class="project-media"><div class="project-media-placeholder"><span aria-hidden="true">▢</span>' +
        '<span>Screenshot to be added</span></div></div>';

    var bullets = details.length
      ? '<ul class="project-details">' + details.map(function (d) {
          return "<li>" + esc(d) + "</li>";
        }).join("") + "</ul>"
      : "";

    var tags = tech.length
      ? '<div class="project-tags">' + tech.map(function (t) {
          return '<span class="tag">' + esc(t) + "</span>";
        }).join("") + "</div>"
      : "";

    var links = "";
    if (repo) links += '<a href="' + esc(repo) + '" target="_blank" rel="noopener noreferrer">Repository ↗</a>';
    if (demo) links += '<a href="' + esc(demo) + '" target="_blank" rel="noopener noreferrer">Live demo ↗</a>';

    return (
      '<article class="card project-card reveal">' +
        media +
        '<div class="project-body">' +
          '<div class="project-top">' +
            (status ? '<span class="badge badge-foundational">' + status + "</span>" : "") +
          "</div>" +
          "<h3>" + title + "</h3>" +
          '<p class="project-desc">' + summary + "</p>" +
          bullets +
          tags +
          (todo ? '<p class="project-missing">' + todo + "</p>" : "") +
          (links ? '<div class="project-links">' + links + "</div>" : "") +
        "</div>" +
      "</article>"
    );
  }

  try {
    grid.innerHTML = PROJECTS.map(card).join("");
  } catch (err) {
    // Fail quietly but leave a usable page: the fallback stays if innerHTML failed.
    if (window.console && console.warn) console.warn("Project list could not be rendered:", err);
  }
})();

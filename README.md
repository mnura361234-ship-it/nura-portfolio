# Nura Abdulkareem — Personal Portfolio Website

A static, dependency-free portfolio site. No build step, no framework, no package manager, no tracking.
Open `index.html` in a browser and it works.

---

## 1. Project structure

```
portfolio/
├── index.html              # All page content (8 sections)
├── css/
│   └── styles.css          # Design system, layout, responsive rules, print styles
├── js/
│   └── main.js             # Mobile nav, scroll reveal, active nav, form validation
├── data/
│   └── projects.js         # ← Edit this file to add projects
└── assets/                 # Put screenshots here (currently empty)
```

Total size: ~90 KB. No external fonts, scripts, analytics or images, so the first load is fast
and there are no third-party requests.

---

## 2. Viewing it locally

**Easiest:** double-click `index.html`.

**With a local server** (recommended, matches real hosting):

```bash
cd portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 3. Deploying it (get a public URL)

You need a free account on one of these. All three are free for a site like this.

### Option A — Netlify Drop (fastest, no command line)

1. Go to <https://app.netlify.com/drop>.
2. Unzip the project folder and drag the **whole folder** onto the page.
3. Netlify gives you a live URL immediately (e.g. `https://nura-portfolio.netlify.app`).
4. In **Site settings → Change site name**, rename it to something like `nura-abdulkareem`.
5. To update later: drag the folder again, or connect a Git repo for automatic deploys.

### Option B — GitHub Pages (free, version-controlled)

```bash
cd portfolio
git init
git add .
git commit -m "Portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: main → / (root) → Save**.
Your site appears at `https://YOUR-USERNAME.github.io/YOUR-REPO/` within a minute or two.

> Note: if you publish at a sub-path like `/YOUR-REPO/`, the relative paths in this project
> (`css/styles.css`, `js/main.js`, `data/projects.js`) keep working with no changes.

### Option C — Vercel

1. Push the folder to GitHub (as above).
2. Go to <https://vercel.com/new>, import the repo.
3. Framework preset: **Other**. Build command: none. Output directory: `.`
4. Deploy — you get `https://your-project.vercel.app`.

### Custom domain (optional)

Buy a domain (e.g. `nuraabdulkareem.com`), then in Netlify/Vercel/GitHub Pages add it under
**Domain settings** and follow the DNS instructions shown there (an `A` record or `CNAME`).

**HTTPS** is automatic and free on all three options.

---

## 4. Updating your information

Everything is plain HTML in `index.html`, grouped by section. Search for the section heading to jump there.

| What you want to change | Where |
|---|---|
| Page title / search description | `<head>` — `<title>` and `<meta name="description">` |
| Hero headline and intro paragraph | section `id="home"`, `.hero-headline` and `.hero-lead` |
| About text | section `id="about"`, inside `.prose` |
| "At a glance" facts | section `id="about"`, `<ul class="fact-list">` |
| Skills and their level labels | section `id="skills"`, each `<li>` inside `.skill-list` |
| Education entries | section `id="education"`, the `<ol class="timeline">` |
| Professional interests | section `id="interests"`, the `.grid` cards |
| Availability / roles | section `id="availability"` |
| Phone, WhatsApp, email | section `id="contact"` — also the footer and `js/main.js` (`mailto:` in the form handler) |
| Colours, spacing, fonts | top of `css/styles.css` — the `:root` variables |

**Skill level labels:** every skill must keep either
`<span class="badge badge-developing">Developing</span>` or
`<span class="badge badge-foundational">Foundational</span>`.
Never change one to "Expert" unless you can genuinely support that claim.

**Changing your email or phone:** it appears in three places — the contact card (`href="mailto:..."`),
the WhatsApp link (`https://wa.me/2348062185903` — digits only, no `+` or spaces), and
`js/main.js` in the form's `mailto:mnura361234@gmail.com`. Update all three.

---

## 5. Adding a project

Open `data/projects.js`. Copy the existing block, paste it above the closing `];`, and edit the values.

```js
{
  title: "Library Book Tracker",
  status: "Learning project",                    // optional label on the card
  summary: "A small Python program that records borrowed books and due dates.",
  details: [                                     // optional bullet points
    "Stores records in a Python dictionary.",
    "Lists books that are overdue."
  ],
  tech: ["Python", "SQLite"],                    // optional tags
  image: "assets/library-tracker.png",           // optional screenshot
  repo: "https://github.com/yourname/library-tracker",  // optional
  demo: "https://your-demo-link.example",        // optional
  todo: "Add a screenshot and a run guide."      // optional amber note
}
```

Rules the code already enforces for you:

- **Empty strings hide links.** `repo: ""` or `demo: ""` means that button does not appear at all —
  nothing broken, nothing invented.
- **Only `http`/`https` links are accepted.** Anything else is dropped for safety.
- **A missing screenshot shows a placeholder,** not a broken image.
- Set `todo: ""` once a project is fully documented and the amber note disappears.

**Adding a screenshot:** save the image in `assets/` (PNG or JPG, roughly 1200×675 for a clean 16:9 crop),
then point `image` at it: `"assets/my-project.png"`. Keep the file under ~300 KB by compressing it.

---

## 6. Adding a CV download (only when you have a real CV file)

The site intentionally has **no** CV button, because no CV file exists yet. Once you have a PDF:

1. Save it as `assets/Nura-Abdulkareem-CV.pdf`.
2. In `index.html`, inside the hero, under `<div class="hero-actions">`, add:

```html
<a class="btn btn-ghost" href="assets/Nura-Abdulkareem-CV.pdf" download>Download CV (PDF)</a>
```

That is the only change needed. Do not add the button before the file exists — it would be a dead link.

---

## 7. Adding social or code profiles (only genuine URLs)

The site has no social links because none were provided. When you have a real profile, add it inside
the contact section's `.contact-links` block:

```html
<a class="contact-item" href="https://github.com/YOUR-USERNAME" target="_blank" rel="noopener noreferrer">
  <span class="contact-label">GitHub</span>
  <span class="contact-value">github.com/YOUR-USERNAME</span>
</a>
```

Only add platforms you actually use and keep updated.

---

## 8. Testing checklist

Run through this after any edit:

- [ ] Page opens directly from `index.html` with no console errors.
- [ ] Every nav link scrolls to the right section (desktop and mobile menu).
- [ ] Mobile menu opens, closes on link tap, and closes with the Escape key.
- [ ] `tel:` link opens the dialler on a phone; `wa.me` link opens WhatsApp; `mailto:` opens the mail app.
- [ ] Contact form: submitting empty shows inline errors; a valid submission opens the mail app.
- [ ] Resize to 375 px, 768 px, 1024 px and 1440 px — no horizontal scrolling, no overlapping text.
- [ ] Keyboard only: Tab through the page, all links and fields are reachable with a visible focus ring.
- [ ] Print preview (Ctrl/Cmd + P) is readable and hides the navigation.

---

## 9. Honest content rules this site follows

These were deliberate decisions, not omissions. Keep them if you edit:

- No invented employment history, certificates, awards or client work.
- The degree is described as **in progress**; no graduation date is claimed.
- The single project is described as a **foundational learning project**, with its missing
  demonstrations (source code, screenshots, demo) stated openly.
- No portrait photograph or stock photo of a person is used.
- No CV download, and no social links, until real files/URLs exist.
- LearnWithNura is not mentioned, because that initiative is still under construction.

---

## 10. Licence and ownership

All content belongs to Nura Abdulkareem. The code is yours to modify and publish freely.

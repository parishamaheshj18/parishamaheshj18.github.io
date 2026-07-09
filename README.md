# Parisha Joshi — Portfolio

A single-page, minimalist portfolio for a research engineer: continuous photo slideshow up top, sticky nav for jumping to sections, and Education / Experience / Publications / Projects / Skills / News all on one page. Plain HTML/CSS/JS — no build step, deploys directly to GitHub Pages.

## Structure

```
portfolio/
├── index.html      # All page content and section markup
├── styles.css       # Design system (colors, type, layout)
├── script.js        # Slideshow autoplay, mobile nav, scroll-spy
├── images/          # Event photos used in the slideshow and News section
├── assets/          # Downloadable CV (linked from the intro section)
└── CNAME            # Custom domain (optional, see DEPLOYMENT.md)
```

## Replacing the placeholder photos

`images/event-1.svg` … `event-4.svg` are text placeholders standing in for real event photos, referenced from both the top slideshow and the News section. To swap in your own:

1. Add your photos to `images/` (JPG or PNG, landscape works best for the slideshow — roughly 1600×900).
2. In `index.html`, update the `background-image: url('images/...')` on each `.slide`, and the `src="images/..."` on each `.news-item img`.
3. Keep the file **casing exactly matching** what's referenced in the HTML — GitHub Pages serves from a case-sensitive Linux filesystem, so `Event-1.jpg` and `event-1.jpg` are different files there even though they behave the same on macOS locally.
4. Compress photos before committing (aim under ~300KB each) so the repo stays light and the slideshow loads quickly.

To add a new slide or news item, copy an existing `<div class="slide">…</div>` or `<li class="news-item">…</li>` block and give it a new image path.

## Updating content

Everything else — education, experience, publications, projects, skills — is plain markup in `index.html`, grouped under `<section id="...">` blocks that match the nav links at the top. Edit the text directly; the layout (spacing, dividers, type) is handled by `styles.css` and needs no changes for routine content updates.

The "Download CV" button in the intro section points to `assets/Parisha_Joshi_CV.pdf` — replace that file (keep the same name, or update the `href` in `index.html`) whenever the résumé changes.

## Running locally

```bash
cd portfolio
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploying

See `DEPLOYMENT.md` and `SETUP-GUIDE.md` for pushing to GitHub and enabling GitHub Pages.

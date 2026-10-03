# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Repository:** https://github.com/leo12534/picsum-dynamic-values

## What this is

A static, no-build demo/portfolio page showing how to update picsum.photos images dynamically with vanilla JavaScript, using two parallel techniques side by side: an `<img>` tag and a CSS `background-image`. It has also grown into a small practical "picsum URL builder" (seed/width/height/grayscale/blur controls, a random-seed button, and a copy-to-clipboard URL output) for each of the two sections.

## Commands

There is no build step, package manager, or test suite — it's plain HTML/CSS/JS served as static files.

Run it locally with either:
```bash
open index.html                    # just open the file directly
python3 -m http.server 8080        # or serve it, then visit http://localhost:8080
```

## Architecture

- **`index.html`** — the whole page. Two structurally identical sections, one per technique:
  - "HTML - IMG Tag" section: controls + an `<img id="img-html">`
  - "CSS - Background-image" section: controls + a `<div id="img-css">` styled via `background-image`
  
  Elements in each section are id-prefixed `html-*` / `css-*` (e.g. `html-seed`, `css-seed`, `html-blur`, `css-blur`). `script.js` relies on this exact prefix convention to wire up listeners — if you add a new control or a third section, follow the same `{prefix}-{name}` id pattern.

  Styling is Bootstrap 4.5 loaded from CDN (plus Google Fonts), with local `base.css`/`style.css` for page-specific tweaks. Note: `css/` and `js/` contain a full vendored copy of Bootstrap's CSS/JS, but they are **not referenced** by `index.html` — the CDN version is used instead, so don't assume changes to those vendored files take effect.

- **`script.js`** — vanilla JS, no dependencies, no modules/bundler. Key structure:
  - `buildPicsumUrl({ seed, width, height, grayscale, blur })` — pure function, the single source of truth for constructing a picsum.photos URL. Both sections' update logic calls into this rather than duplicating URL-building.
  - `updateHtmlImage()` / `updateCssImage()` — one per section, deliberately kept as separate, explicit functions (not merged into one parameterized function) since this repo doubles as a learning reference; read the section's inputs, call `buildPicsumUrl`, then write the result to the image (`.src` / `.style.backgroundImage`) and to that section's read-only URL output field.
  - `copyToClipboard(inputId, buttonEl)` / `randomSeed()` — shared helpers used by both sections' Copy/Random buttons.
  - Wiring at the bottom uses `forEach` over arrays of element ids to attach `input`/`click` listeners per section, then calls both update functions once on load so the displayed image/URL matches the default input values immediately.

- **Picsum endpoint choice**: URLs use `https://picsum.photos/seed/{seed}/{width}/{height}` (not `/id/{id}/...`). The `/seed/` endpoint accepts arbitrary strings and always resolves, which avoids "invalid ID → broken image" and makes the random-seed button trivial (just generate a random string, no need to validate against known image IDs).

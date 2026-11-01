# GonidonCloud FPU — Documentation Site (site-only)

Static documentation site for the **Flow Processing Unit (FPU)** — GonidonCloud's
dataflow accelerator for high-throughput, pipelined stream processing.

Built with plain HTML/CSS/JS: no build step, no dependencies, no server script —
just files you can host anywhere.

## Running locally

**Option 1 — any static file server** (recommended, needed for the search and
fonts to behave consistently):

```bash
python3 -m http.server 8000        # http://localhost:8000
npx serve .                        # or via Node
```

**Option 2 — just open the file:** double-click `index.html`. The site works
from a `file://` URL too (search box is hidden on narrow/file usage, everything
else is identical).

## Pages

| File                 | Section                                             |
| -------------------- | --------------------------------------------------- |
| `index.html`         | Overview — what the FPU is, generations, roadmap    |
| `architecture.html`  | Chip topology, FlowFabric, memory, flow control     |
| `quickstart.html`    | Toolchain install, first pipeline, run & simulate   |
| `programming.html`   | FlowLang, kernels (GDK-C), host runtime API         |
| `performance.html`   | Metrics, profiling with `fputool stats`, tuning     |
| `faq.html`           | Frequently asked questions                          |

## Features

- 🌗 **Light/dark theme switch** — persisted in `localStorage`, follows the OS
  preference on first visit (`theme.js`).
- 🔍 **Doc search** — header search with dropdown suggestions across all pages,
  keyboard navigation (`↑`/`↓`/`Enter`), `/` to focus (`search.js`).
- 🎨 **Material-inspired design** — Google Sans/Roboto + Material Symbols,
  original CSS in `styles.css` (no external CSS frameworks).
- 📱 **Responsive** — the header collapses gracefully on narrow screens.
- 🔗 **Cross-page navigation** — breadcrumbs, prev/next pagination, anchors.

## Project structure

```
├── index.html          # Overview
├── architecture.html   # Architecture reference
├── quickstart.html     # Getting started
├── programming.html    # FlowLang programming guide
├── performance.html    # Performance & tuning
├── faq.html            # FAQ
├── styles.css          # All styling (theme variables live here)
├── theme.js            # Light/dark theme toggle
├── search.js           # Client-side doc search
├── logo.png            # GonidonCloud logo (header + favicon)
└── README.md
```

## Customization

- **GitHub link** — in every `*.html` header, replace the `REPLACE_ME` placeholder
  in the `github-btn` anchor:
  ```html
  <a class="icon-btn github-btn" href="https://github.com/YOUR_ORG/YOUR_REPO" ...>
  ```
- **"Go to home" footer link** — in every `*.html` footer, replace the
  `REPLACE_ME` placeholder in the `footer-home` anchor with your marketing site URL.
- **Colors & themes** — edit the CSS custom properties at the top of `styles.css`
  (`:root` for light, `[data-theme="dark"]` for dark).
- **Search index** — add or update entries in the `INDEX` array at the top of `search.js`.

## Contributing

1. Edit the HTML pages directly — plain markup, shared header/footer blocks.
2. Keep new sections mirrored in the `search.js` INDEX so they are searchable.
3. Test in both themes (toggle in the header) and at mobile widths.

## Deployment

Fully static — point GitHub Pages, Netlify, Cloudflare Pages or any web server
at the repository root. No build step, no CI configuration needed.

### GitHub Pages in two clicks

1. Repository → **Settings → Pages**.
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Save — the site is live at `https://<org>.github.io/<repo>/`.

---

© 2026 GonidonCloud. All rights reserved.

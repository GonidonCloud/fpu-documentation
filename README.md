# GonidonCloud FPU documentation

Documentation for **Flow Processing Units (FPUs)**, GonidonCloud's accelerator platform
for compiled tensor programs, model training, and inference.

The site has a Google Cloud-inspired documentation layout, a Node.js preview server, and
no third-party runtime dependencies.

## Run with npm

Node.js 18 or newer is required.

```bash
npm install
npm start
```

Open **http://localhost:3000**. If port 3000 is already occupied, the server selects a
free port and prints its URL. To request a specific port or listen on all interfaces:

```bash
npm start -- --port 8080
npm start -- --host 0.0.0.0 --port 8080
```

For automatic server restarts while editing `server.js`:

```bash
npm run dev
```

Check all JavaScript files for syntax errors:

```bash
npm run check
```

## Documentation map

| File | Contents |
| --- | --- |
| `index.html` | Platform overview, device family, and execution workflow |
| `architecture.html` | Tensor engines, memory, numeric formats, FlowMesh, and isolation |
| `quickstart.html` | Toolchain installation, device discovery, and first tensor program |
| `programming.html` | FlowKit graphs, shapes, precision, sharding, model import, and debugging |
| `performance.html` | Synchronized benchmarks, profiling, bottlenecks, and workgroup scaling |
| `faq.html` | Compatibility, training, memory, deployment, and troubleshooting |

## Interface

- Three-column desktop layout with section navigation, article content, and a scrollspy
  table of contents.
- Search dialog opened with **Ctrl+K**, **Cmd+K**, or **/**, including arrow-key navigation.
- Light and dark Material-style themes with saved and operating-system preferences.
- Copy buttons on code blocks, reading progress, page feedback, and previous/next links.
- Mobile navigation drawer, full-screen search, responsive tables, and print styles.
- Roboto, Google Sans, and Roboto Mono loaded from Google Fonts; system fallbacks are used
  when the fonts are unavailable.

## Project structure

```text
├── index.html          # Overview
├── architecture.html   # Architecture reference
├── quickstart.html     # Getting started
├── programming.html    # FlowKit programming guide
├── performance.html    # Performance guide
├── faq.html            # FAQ
├── styles.css          # Material-inspired theme and responsive layout
├── app.js              # Shared shell, navigation, scrollspy, and page utilities
├── search.js           # Search index and command-palette behavior
├── theme.js            # Theme switcher
├── server.js           # Dependency-free Node.js static server
├── package.json        # npm commands and Node.js version requirement
├── logo.png            # GonidonCloud logo
└── README.md
```

## Editing

1. Edit the HTML pages directly. The shared shell in `app.js` builds the header, sidebars,
   table of contents, feedback controls, and footer for every page.
2. Add new sections to the `INDEX` array in `search.js`, including their anchor IDs.
3. Add top-level pages to the `navigation` array in `app.js`.
4. Keep commands, tensor formats, target names, and FlowKit examples consistent.
5. Run `npm run check`, then verify search, code copying, both themes, and the mobile
   navigation drawer.

To configure project links, replace `REPLACE_ME` in `app.js` and the HTML source footers.
Theme colors are CSS custom properties at the top of `styles.css`.

## Deployment

The generated site is static and can be hosted on GitHub Pages, Netlify, Cloudflare Pages,
or any conventional web server. No build command is required. `npm start` is intended for
local preview, not as a production edge cache or CDN.

---

© 2026 GonidonCloud. All rights reserved.

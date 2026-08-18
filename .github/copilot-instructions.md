# Copilot Instructions

## Project overview

Static HTML website (Dutch) for a historic home at Peperstraat 16e, Gouda — a former orphanage and kindergarten, now a private residence. Deployed via GitHub Pages (`CNAME: peperstraat16e.nl`).

## Architecture

All pages are plain HTML files built with **Vite** and deployed to GitHub Pages via GitHub Actions. Source HTML files are the Vite entry points; `dist/` is the build output.

- **Root pages**: `index.html`, `fotos.html`, `tijdlijn.html`, `bronnen.html`, `contact.html`, `detijd.18940116.html`
- **Photo galleries**: `fotos/<category>/index.html`, each with original JPGs and pre-generated WebP variants in `fotos/<category>/resized/`
- **Shared assets**: `stylesheet.css`, `favicon.svg`
- **Building drawings**: `images/bouwtekeningen/` (PNG files linked via `<a href>` in `tijdlijn.html`)
- **Local files**: `packages/` directory no longer exists. `src/` contains `sentry.js`, `photoswipe-fullscreen.js` (vendored ESM plugin, upstream repo no longer exists), and any future shared modules.

## Build system

```bash
npm run build    # Vite build → dist/
npm run preview  # Serve dist/ locally
```

**Vite config** (`vite.config.js`): all 11 HTML files are declared as Rollup entry points. A custom `transformIndexHtml` plugin pair prevents Vite from rewriting `<img src="resized/…">` to hashed asset paths (which would break `data-pswp-srcset` attributes that reference the same relative paths). `vite-plugin-static-copy` copies `fotos/*/resized/`, `images/`, and `CNAME` into `dist/` as static assets.

**GitHub Actions** (`.github/workflows/deploy.yml`): on push to `main`, runs `npm ci && npm run build`, then deploys `dist/` to GitHub Pages using `actions/deploy-pages`. GitHub Pages must be configured to **Source: GitHub Actions** in the repository settings.

## Dependencies

Installed via npm, bundled by Vite — **not committed**, **not served directly**:

| Package | Import |
|---|---|
| `bootstrap` | CSS via `<link>` in HTML |
| `bootstrap-icons` | CSS via `<link>` in HTML (tijdlijn.html only) |
| `photoswipe` | `import … from 'photoswipe/lightbox'` and `import('photoswipe')` |
| `masonry-layout` | `import Masonry from 'masonry-layout'` (oude-doos only) |
| `photoswipe-fullscreen` | `import … from '/src/photoswipe-fullscreen.js'` (local file in `src/`) |

External scripts (not bundled):
- Google Analytics (`G-Q5YN1ZCS28`) — deferred script at bottom of each page
- **Sentry**: `@sentry/browser` — bundled via `src/sentry.js` (DSN hardcoded, see *Error tracking* below)

**CSS links** in HTML use relative paths to `node_modules/` (e.g., `../../node_modules/bootstrap/dist/css/bootstrap.min.css` from gallery sub-pages). Vite resolves and bundles these during build. Do not convert them to bare specifiers in `<link href>` — Vite only resolves bare specifiers in JS `import` statements.

## Error tracking (Sentry)

`src/sentry.js` initialises `@sentry/browser`. The DSN is hardcoded in that file — Sentry browser DSNs are intentionally public (they appear in the client bundle regardless). Every HTML page imports it: pages with an existing `<script type="module">` use `import '/src/sentry.js'`; pages without one have `<script type="module" src="src/sentry.js"></script>`.

## Dependency updates (Dependabot)

`.github/dependabot.yml` runs weekly (Monday) for both **npm** and **github-actions** ecosystems. `vite` and `vite-plugin-static-copy` are grouped into a single PR to avoid noise.

## Adding photos

Use `srcset.sh` to process new images. It requires ImageMagick (`convert`, `identify`).

```bash
# Process a single image and append the generated HTML to the gallery page
./srcset.sh fotos/<category>/photo.jpg >> fotos/<category>/index.html
```

The script:
1. Converts the original to WebP (`resized/<name>.webp`)
2. Creates resized WebP variants at 320, 640, 768, 1024, 1366, 1440, 1600, 1920px widths
3. Outputs a `<figure>` block with `data-pswp-*` attributes for PhotoSwipe

## Key conventions

- **Language**: All content is in Dutch (nl-NL).
- **`<html lang="nl">`** on every page.
- **Photo gallery pages** with PhotoSwipe set `<meta name="robots" content="noindex">`.
- **Navigation**: The active page uses `aria-current="page"` on its `<a class="nav-link active">` element. Root pages link with bare filenames (e.g., `fotos.html`); gallery sub-pages use relative paths (e.g., `../../fotos.html`).
- **Image markup pattern**: Photos use `<figure class="col-12 col-md-4">` with a PhotoSwipe-compatible `<a>` containing `data-pswp-srcset`, `data-pswp-width`, `data-pswp-height` attributes; the `<img>` inside uses the 640w WebP as `src`.
- **Header**: The SVG logo appears in two variants — small (`d-inline-flex d-md-none`, 100×141px) and large (`d-none d-md-inline-flex`, 300×262px). Always include both when duplicating the header.
- **Colors**: Custom CSS variables `--dark-red` (`rgba(115,0,0,1)`) and `--bright-red` (`rgba(185,0,0,1)`) defined in `stylesheet.css`; `<mark>` in the header uses `--dark-red`.
- **Schema.org**: `index.html` embeds a `<script type="application/ld+json">` block for structured data (`LandmarksOrHistoricalBuildings`).
- **`bronnen.html`**: References list items use `:target` CSS to highlight a cited entry when linked to directly (e.g., `bronnen.html#ref-id`).

# AGENTS.md

## Project overview

Static website (in Dutch) about a historic building at Peperstraat 16e, Gouda: built in 1893–1894 as the R.K. Weeshuis St. Joseph, later a kindergarten, now a private home. It is built with Vite and deployed to GitHub Pages on the domain `peperstraat16e.nl` (see `CNAME`).

## Layout of the repo

- **Root pages**: `index.html`, `fotos.html`, `tijdlijn.html`, `bronnen.html`, `contact.html`, plus `detijd.18940116.html` (a transcribed 1894 newspaper article, linked from the timeline).
- **Photo galleries**: `fotos/<category>/index.html` (`dakterras`, `keuken`, `oude-doos`, `renovatie-exterieur`, `tuin`). Each folder holds the original photos and generated WebP variants in `fotos/<category>/resized/`.
- **Building drawings**: `images/bouwtekeningen/*.png`, linked from `tijdlijn.html` via `<a href>`.
- **Shared styles**: `stylesheet.css`, on top of Bootstrap 5.3.
- **Logo and favicon**: `logo.svg` (header logo, the complete shield) and `favicon.svg` (browser tab, a cropped version of the shield).
- **Scripts** in `src/`:
  - `sentry.js`: error tracking (see below)
  - `analytics.js`: Google Analytics (`G-Q5YN1ZCS28`), loads gtag.js at runtime
  - `theme-toggle.js`: light/dark/system theme toggle (see below)
  - `photoswipe-fullscreen.js`: vendored PhotoSwipe fullscreen plugin; the upstream repo no longer exists
  - `scroll-to-anchor.js`: works around Chrome mobile not scrolling to `#anchor` targets, used on `bronnen.html`
- **Image helper**: `srcset.sh` (see _Adding photos_).

## Commands

```bash
npm run dev      # dev server with live reload, serves the source files
npm run build    # Vite build → dist/
npm run preview  # serve dist/ locally
npm run lint     # html-validate, stylelint, eslint and prettier --check
npm run fix      # autofix lint issues and format
```

Run `npm run lint` before committing. CI runs it too, before the build.

## Build and deploy

- `vite.config.js` declares all 11 HTML files as Rollup entry points. A new page must be added there.
- **Image paths:**
  - Vite would normally rewrite `<img src="resized/…">` to hashed copies under `assets/`.
  - A pair of `transformIndexHtml` plugins stops that, so thumbnails keep the same paths the PhotoSwipe `data-pswp-srcset` attributes use.
  - That avoids a second, hashed copy of every thumbnail.
- **Static copy:** `vite-plugin-static-copy` copies `fotos/*/resized/*` (keeping its folder structure), `images/` and `CNAME` into `dist/`. The original photos are not deployed.
- **Deploy:** `.github/workflows/deploy.yml` runs `npm ci`, `npm run lint` and `npm run build` on Node 24.
  - On a push to `main` it then deploys `dist/` with `actions/deploy-pages`. GitHub Pages is set to _Source: GitHub Actions_.
  - On a pull request it only lints and builds, in its own concurrency group, so it never deploys.
- **Dependabot:** `.github/dependabot.yml` checks npm and GitHub Actions weekly, on Monday. `vite` and `vite-plugin-static-copy` are grouped, and so are all other minor/patch npm updates.

## Dependencies

Installed with npm and bundled by Vite. `node_modules/` is not committed and not served directly.

| Package           | How it is used                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bootstrap`       | CSS via `<link>` on every page                                                                                                                                  |
| `bootstrap-icons` | CSS via `<link>` on every page except the De Tijd article (theme toggle icon, calendar icons on the timeline)                                                   |
| `photoswipe`      | `photoswipe.css` via `<link>`, plus `import PhotoSwipeLightbox from 'photoswipe/lightbox'` and `import('photoswipe')`, on the gallery pages and `tijdlijn.html` |
| `masonry-layout`  | `import Masonry from 'masonry-layout'`, only on `fotos/oude-doos`                                                                                               |
| `@sentry/browser` | imported by `src/sentry.js`                                                                                                                                     |

Stylesheets are linked with relative paths into `node_modules/`, e.g. `node_modules/bootstrap/dist/css/bootstrap.min.css` from a root page and `../../node_modules/…` from a gallery page. Vite resolves and bundles these during the build. Do not change them to bare specifiers: Vite only resolves those in JS `import` statements.

## Page structure

Every page except the De Tijd article uses the same layout, so copy an existing page when adding one:

- `<html lang="nl">`.
- **In `<head>`**, in this order:
  - the meta tags
  - the favicon
  - the stylesheets (Bootstrap, bootstrap-icons, PhotoSwipe where needed, `stylesheet.css`)
  - the inline theme script (see _Theme_)
- **`<body class="site-page">`** contains:
  - a skip link, `<a class="skip-link visually-hidden-focusable" href="#content">Naar inhoud</a>`
  - `header.site-header`: the logo, `<h1>Peperstraat <mark>16e</mark></h1>`, `<p class="site-subtitle">Gouda</p>`, the navigation and the theme toggle button
  - `div.page-content` with the `<main id="content">`
  - `footer.site-footer` with a link to the contact page
- **`<main>`:**
  - Usually `<main class="container" id="content">`.
  - Pages with separate content sections (tijdlijn, bronnen, fotos) use `<main id="content">` containing a `div.container` for the intro and a `section.container` for the content. All page content belongs inside `<main>`.
- **Headings:**
  - The page title is the `<h2>`; a gallery page has a visually hidden `<h2>` with the gallery name, because the breadcrumb is its visible title.
  - Don't skip levels. Use a class such as `h4` to change the size instead.
- **Scripts:**
  - The other root pages load `src/sentry.js`, `src/analytics.js` and `src/theme-toggle.js` (and on bronnen `src/scroll-to-anchor.js`) as `<script type="module" src>` in `<head>`.
  - Pages with their own module script (galleries, tijdlijn) `import` them at the top of that script instead.
- **Header logo:** `<img src="logo.svg" class="logo-img" width="116" height="171">`, 100px wide on phones and 150px from 768px up (see `.logo-img` in `stylesheet.css`). Gallery pages use `../../logo.svg`. SVGs used as an `<img>` need a `viewBox`, otherwise they are cropped instead of scaled.
- **Navigation:**
  - The current page's link has no `href`, has `class="nav-link active"` and has `aria-current="page"`.
  - Root pages link with bare filenames (`fotos.html`); gallery pages use `../../fotos.html`.
- **`noindex`:** `fotos.html`, `contact.html` and all gallery pages have `<meta name="robots" content="noindex">`.
- **Schema.org:** `index.html` and `bronnen.html` embed a `<script type="application/ld+json">` block. It is a `WebPage` whose `about` is a `LandmarksOrHistoricalBuildings`.
- **Sources:**
  - Each source in `bronnen.html` is an `<li id="cite-…">`; the timeline links to them as `bronnen.html#cite-…`.
  - `ul.references > li:target` highlights the linked source.

## Theme (light/dark)

- **Explicit theme:** the theme is always set explicitly as `data-bs-theme="light|dark"` on `<html>`. Bootstrap's CSS has no `prefers-color-scheme` rules of its own, so leaving the attribute off would show Bootstrap light on a dark page.
- **Inline `<head>` script:**
  - Each page has a small inline script in `<head>`, right after the stylesheets.
  - It reads the saved choice from `localStorage` (`peperstraat-theme`) and falls back to the system setting.
  - It sets the attribute before the first paint, so nothing flashes.
  - New pages need it too.
- **`src/theme-toggle.js`:**
  - It handles the toggle button, which cycles between system, dark and light. The button shows the icon for the theme you get when you click it.
  - It follows system changes while "system" is selected.
  - When `localStorage` is blocked, it falls back to the system theme instead of breaking. Its labels are in Dutch.
- **Design tokens:**
  - `stylesheet.css` defines them on `:root` (light) and overrides them in `html[data-bs-theme='dark']`.
  - There is no `prefers-color-scheme` media query in the CSS. Without JavaScript the site is entirely light.
- **Brand colours:**
  - `--dark-red` and `--bright-red` are brownish reds despite their names.
  - Light theme: `rgb(117 66 57)` and `rgb(138 87 76)`.
  - Dark theme: `rgb(224 182 174)` and `rgb(207 142 129)`.
  - Links use `--bright-red`, hover and `<mark>` use `--dark-red`.
  - All of these meet WCAG AA (at least 4.5:1) against the page, card and alert backgrounds in their theme. Check contrast when changing them.
- **Dark-mode fixes for Bootstrap:**
  - Bootstrap's `.text-secondary` grey and `.blockquote-footer` colour are the same in both themes and too dark on a dark background.
  - The dark theme overrides `--bs-secondary-rgb` and the `.blockquote-footer` colour.
- **Logo:** the logo SVG is black. In dark mode `.logo-img` gets `filter: invert(90%)`.

## Error tracking (Sentry)

`src/sentry.js` initialises `@sentry/browser` with a hardcoded DSN. Browser DSNs are public by design, because they end up in the client bundle anyway. Sentry is only enabled in a production build served from `peperstraat16e.nl`, so `npm run dev` and `npm run preview` don't report errors.

## Adding photos

Use `srcset.sh`, which needs ImageMagick 7 (`magick`):

```bash
./srcset.sh fotos/<category>/photo.jpg >> fotos/<category>/index.html
```

The script:

1. **Full-size WebP:** converts the original to `resized/<name>.webp`, capped at 2560px on the longest side and quality 80. This file is only the fallback `href` behind the thumbnail; PhotoSwipe loads from `data-pswp-srcset`.
2. **Resized variants:** creates WebPs at 320, 640, 768, 1024, 1366, 1440, 1600 and 1920px wide.
3. **Filenames:** replaces spaces with `-` in the output names. Spaces would break the `srcset` lists.
4. **Markup:** prints a `<figure class="col-12 col-md-4">` with a PhotoSwipe `<a>`.
   - The `<a>` has `data-pswp-srcset`, plus `data-pswp-width`/`data-pswp-height` taken from the original.
   - Inside it is `<img class="figure-img img-thumbnail" alt="" loading="lazy" width height>` using the 640w WebP, with that file's dimensions so the layout doesn't shift while images load.
   - There is a placeholder `<figcaption>`.

After appending, move the figure into the gallery `<section>`, write the caption and run `npm run fix`. The thumbnail has `alt=""` because the figcaption already describes the photo.

The original photos are committed so the WebPs can be regenerated, but they are not deployed. Keep large binaries out of the history where possible: the repo history was rewritten once (October 2026) to remove old image versions.

## Lazy loading of gallery thumbnails

- **Attribute placement:** `loading="lazy"` belongs on the thumbnail `<img>`, never on the `<a>`. Browsers ignore it on links, and PhotoSwipe does not read it either.
- **First row:** the first row of a gallery loads straight away and has no `loading` attribute. That is the first 3 thumbnails, since figures are `col-md-4`. Every thumbnail after that gets `loading="lazy"`.
- **`srcset.sh`:** it emits `loading="lazy"`. When a new figure ends up in the first row, remove the attribute.

### Exception: `fotos/oude-doos`

- **Rule:** none of the oude-doos thumbnails have `loading="lazy"`, and new figures added there must not get one. Remove it from the `srcset.sh` output.
- **Why:** that page lays out the figures with Masonry, which measures each figure's height once, on the `window` `load` event.
  - A lazy image that hasn't loaded yet has no height at that point, so figures overlap.
  - Because every unmeasured image then sits in the viewport, they all load straight away anyway.
  - So lazy loading there breaks the layout without saving anything.
- **Enabling it later:** the thumbnails now have `width`/`height` attributes, so the browser knows their size before they load and Masonry could measure them correctly. Test the layout in a browser before adding `loading="lazy"` there.

## Conventions

- **Language:** all content is in Dutch (nl-NL).
- **Gallery image markup:**
  - Each photo is a `<figure class="col-12 col-md-4">` containing a PhotoSwipe `<a>` with `href`, `data-pswp-srcset`, `data-pswp-width` and `data-pswp-height`.
  - Inside it is an `<img>` using the 640w WebP as `src`, with `alt=""` and its `width`/`height`.
  - Every PhotoSwipe lightbox uses `children: 'a[data-pswp-width]'`, so other links (such as links in captions) never open in the lightbox.
- **Formatting:** Prettier, with the settings in `.prettierrc.json`. Elements that must stay on one line per item, such as the source lists on the timeline, use `<!-- prettier-ignore -->`.

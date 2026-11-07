# Lake Pointe Green Website — Structure & SEO Rules

Static multi-page site, same conventions as `Intown-Website-MPA`: **no build step**, every page is a standalone
HTML file at `<section>/index.html`, assets are root-absolute (`/css/...`, `/js/...`). Serve the folder root with
VS Code Live Server or any static server. Never open it with `file://`.

`lake-pointe-green.html` is the original single-file export (hash-router SPA, assets as base64). It is kept only as
the source; the pages below were split out of it and are now edited directly.

## 1. Folder structure

```
index.html                       /                      (home)
find-your-home/index.html        /find-your-home/       (floor plans, site plan, gallery, overview, location, FAQ, broker, contact)
our-difference/index.html        /our-difference/
contact/index.html               /contact/              (tour / info tabs)
privacy/index.html               /privacy/              (placeholder text from Lovett Homes legal still needed)
404.html
css/    tokens.css (colours, letter-spacing, container: single source), fonts.css (@font-face + --font-* vars), components.css (container-site, eyebrow, section-title, site-plan hotspots, base)
        _compiled-backup.css = the old pre-compiled Tailwind export, not loaded; delete once the CDN version is verified
js/tailwind-config.js maps tokens.css to Tailwind utilities (Tailwind comes from the CDN)
js/     one file per concern, loaded in the same order on every page (see any index.html)
fonts/  Playfair Display + DM Sans woff2 subsets
images/ photos/ (hero + gallery), plans/ (floor plans, site plan), brand/ (Lovett Homes logo)
icons/  favicon.svg
robots.txt  sitemap.xml
```

## 2. Page rules

1. One page = one folder with an `index.html`. `<body data-route="/route">` and one `<div id="page-{slug}" class="lpg-page" data-overlay="true|false">`.
   `data-overlay="true"` = transparent header over the hero until the visitor scrolls (home, find-your-home).
2. Internal links are root-absolute with a trailing slash (`/contact/`, `/find-your-home/#site-plan`). No `#/...` links.
3. Header and footer are inline in every page (no sticky mobile CTA bar). When you change nav/footer,
   change it in every `index.html` + `404.html`: `grep -rl "Schedule a tour" --include=*.html .`.
4. Scripts sit at the bottom of `<body>` in this order: `site-config, utils, gallery-data, nav, mobile-menu, hero-carousel, lightbox, saved-and-share, tabs, gallery, forms`, then the Lenis CDN, `smooth-scroll`, `scroll-reveal`.
   They share the `window.LPG` namespace; each one is a no-op on pages without its markup.
5. Tailwind runs from the CDN with the theme in `js/tailwind-config.js`; every value there points at `css/tokens.css`. Change a colour in tokens.css, not in a page.
   Palette: lovett, lovett-blue, charcoal(-deep), copper(-lt), ink, muted, stone, cream, line. Fonts: `font-sans` (DM Sans), `font-serif` (Playfair). Tracking: `tracking-eyebrow`, `tracking-label`.
   Repeated patterns go in `css/components.css`.
6. Side padding follows Intown: header and sections use `.container-site` = `padding-inline: 5vw` (`--page-pad`) at every width, no max width. The footer uses `px-6 lg:px-12` with its content in `mx-auto max-w-6xl`. Don't add per-breakpoint `px-*` to sections; change `--page-pad`.

## 3. SEO checklist for every new or edited page (`<head>`)

- `<title>` unique per page; `<meta name="description">` 120–155 chars, unique
- `<link rel="canonical">` absolute with trailing slash: `https://www.lakepointegreen.net/<path>/`
- `og:*` + `twitter:*` (image = absolute URL of a real photo under `/images/photos/`)
- BreadcrumbList JSON-LD on inner pages (home has WebSite, contact has LocalBusiness)
- One `<h1>`, real `alt` text on every informative image
- Add/remove the URL in `sitemap.xml` and bump `<lastmod>`
- Domain `https://www.lakepointegreen.net` is assumed; find/replace it if production differs.

## 4. Behaviour notes

- Menu: below 768px the burger opens a full-screen overlay (`js/mobile-menu.js`, built from the header's `#mobile-nav` links, styles `.lpg-menu*` in components.css); 768–1279px it opens the `#mobile-nav` dropdown (Schedule a Tour + Call side by side, 50/50); from 1280px the desktop nav shows.

- Smooth scroll: Lenis (CDN) in `js/smooth-scroll.js`, same settings as Intown. Use `LPG.scrollToEl(el)` for programmatic scrolling (header offset 72px, falls back to a plain jump for reduced motion).
- Section reveal: `js/scroll-reveal.js` fades/raises each section's blocks in as it enters the viewport (text rises, photos fade, grids stagger). Opt out with `data-reveal-skip`; force targets with `data-reveal` (+ `data-reveal-delay`). Hero carousels are skipped. Distance/duration/stagger are tokens in `css/tokens.css`.
- Footer social icons: 18px brand glyphs in `h-size-sm w-size-sm` circles (Intown style); they are disabled with a "Coming soon." tooltip (`.soon`) until real profile URLs exist.

- Forms (tour request / information request) validate client-side, then open the visitor's email app (`mailto:` to `LPG.SALES_EMAIL`
  in `js/site-config.js`). There is no backend yet — replace the `location.href = "mailto:..."` line in `js/forms.js` when there is one.
- Saved floor plans are stored in `localStorage` (`lpg-saved-homes`).
- Gallery photos are listed in `js/gallery-data.js`; the lightbox is `LPG.openLightbox(list, index)`.
- Images are WebP. Heroes load eagerly; everything else is `loading="lazy"`.

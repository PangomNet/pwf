# Application shell

The PWF shell translates the proven ONA Monitor application language into
product-neutral contracts. Its visible geometry, density, dark-surface
hierarchy, cards, header, secondary bar, and footer form the canonical PWF
Standard look. It contains no ONA branding, routes, data, cookies, or global
state. Applications supply their own brand, page catalog, route accents, and
content. Exact values and provenance are recorded in `docs/design-standard.md`.

The executable reference begins at `examples/shell/index.html`; its component
showcase is `examples/shell/components.html`, its Markdown handbook is
`examples/shell/document.html`, and its settings route is
`examples/shell/settings.html`.

## Application shell

`.pwf-app` forms a five-row page: application header, secondary bar, main
content, framework divider, and footer. Use it on the body or another element
that owns the complete viewport. The header is sticky, while the divider and
footer remain in normal document flow.

```html
<body class="pwf-app" data-pwf-accent="blue" data-pwf-layout-mode="normal">
  <header class="pwf-app__header">…</header>
  <div class="pwf-app__subbar">…</div>
  <main class="pwf-app__main" id="main">
    <div class="pwf-app__stage">
      <div class="pwf-app__content">…</div>
    </div>
  </main>
  <div class="pwf-app__framework-divider"><span>Pangom Web Framework</span></div>
  <footer class="pwf-app__footer">…</footer>
</body>
```

The `normal` mode limits ordinary content to 1152 px inside the 1600 px stage.
`wide` removes the inner content limit while retaining the bounded stage and its
side boundaries. `fluid` removes both limits and stage boundaries for maps,
timelines, editors, and media workspaces. Set the mode through
`data-pwf-layout-mode` on `.pwf-app`; the example controls expose all three
states without persistence.

`data-pwf-accent` accepts the bundled convenience values `blue`, `green`, `gold`,
and `violet`. Applications may instead set `--pwf-route-accent` directly. Accent
color supplements headings and current-state indicators; it never carries status
meaning by itself.

## Brand

`.pwf-app__brand` is an ordinary home link. The reference `pwf-brandmark` is a
CSS-and-text placeholder, not a required logo. Applications may replace its
contents with accessible text or a licensed image while preserving the link and
accessible name.

## Page navigation

Desktop tabs are links inside `.pwf-app__tabs`. The active page uses
`aria-current="page"`. The shell does not create, close, reorder, remember, or
intercept these links yet; future navigation and launcher modules will manage
those behaviors through explicit adapters.

```html
<nav class="pwf-app__tabs" aria-label="Open pages">
  <a class="pwf-app__tab" href="/home/" aria-current="page">Home</a>
  <a class="pwf-app__tab" href="/settings/">Settings</a>
</nav>
```

At narrow widths, desktop tabs hide and `.pwf-app__mobile-pages` appears. It uses
native `<details>` and ordinary links, so page selection works without JavaScript.
Applications should render the same destinations into both views from one route
catalog instead of maintaining two independent lists by hand.

Breadcrumbs use a named navigation landmark and an ordered list. Contextual links
in `.pwf-context-nav` are secondary destinations for the current page. Both remain
ordinary links and may horizontally scroll on small screens.

Buttons in `.pwf-app__actions` are reserved for actions such as opening search or
the app launcher. They must not replace addressable navigation destinations.

The mobile page selector uses native `details` and a fixed dropdown. Its flexible
current-page label truncates before the brand, search, or launcher can be pushed
out of the header. A framed plus/minus disclosure replaces the former text
chevron, so open and closed state remain deliberate at small sizes without
depending on a font glyph.

## Overlays

`.pwf-overlay` is the shared modal surface for Monitor-style transient tools. It
uses a native `dialog`, inherits theme tokens, traps focus through the platform,
and closes through `data-pwf-dialog-close`, Escape, or the optional
`data-pwf-dialog-backdrop-close` contract.

`data-pwf-overlay-placement` provides three standard geometries:

- `search`: a 34rem search surface aligned below the header;
- `top-end`: a 28rem app launcher aligned to the upper end edge;
- `bottom`: a 28rem centered bottom sheet for quick settings.

Search results and launcher cards remain ordinary links. The search placement
intentionally leaves page content visually undimmed; its field uses
`autofocus data-pwf-dialog-select` so opening the tool focuses and selects it for immediate
typing. Quick settings contain only frequent theme, scheme, width, scale,
contrast, or motion controls and end with a link to the complete settings page.
Applications may choose a normal page route instead of an overlay without
changing the underlying destination contract.

### Launcher pins

`initLaunchers(root, options)` enhances ordinary `.pwf-launcher-card` links with
a separate pin button. The button exposes state through `aria-pressed`, gives
pin and unpin actions distinct accessible labels, reorders pinned destinations
first, and emits `pwf:launcher-pins-change` with the current ID list.

The module uses memory when no adapter is supplied. Persistence is explicitly
opt-in:

```js
import { initLaunchers } from '@pangom/pwf';

initLaunchers(document, {
  storage: window.localStorage,
  storageKey: 'my-app-launcher-pins'
});
```

Applications that need consent-controlled or account-synchronized favorites may
inject another object implementing `getItem` and `setItem`. Core never selects a
persistence policy on import.

Long horizontal section navigation may opt into the documented
[scroll rail](scroll-rail.md). The themed rail adds mouse dragging, wheel, touch,
and keyboard handling while the underlying navigation remains an ordinary
overflowing list of links.

## Content subpages

Application subpages remain inside the complete shell. A route changes the active
tab, breadcrumb, context links, route accent, and main content; it does not drop
the shared header or footer. This matches a server-rendered WordPress theme where
templates place each page body inside one common frame.

The Markdown viewer demonstrates this rule for documentation. Its URL loads a
complete page first, then the content module renders an allowlisted source inside
`.pwf-app__content`. See `docs/components/markdown-viewer.md`.

## Page hero

`.pwf-page-hero` holds the page identity and an optional status or action area.
The main heading remains a real `h1`. `.pwf-eyebrow` provides a short category;
it is not a heading replacement.

`.pwf-status-badge` includes a decorative dot and visible text. Applications can
set `--pwf-status-color`, but the wording remains the authoritative status.

## Navigation cards

Use `.pwf-nav-card` on an anchor when the card opens a page. The whole card is the
link, so keyboard and pointer users receive the same target. A short label in
`.pwf-nav-card__icon` is decorative and should be hidden from assistive technology
when the heading already names the destination.

```html
<a class="pwf-nav-card" href="/documentation/">
  <span class="pwf-nav-card__icon" aria-hidden="true">DOC</span>
  <h3>Documentation</h3>
  <p>Guides, behavior, and exact reference.</p>
</a>
```

Cards accept a local `--pwf-card-accent`. They reflow from three columns to two
and then one. The layout does not truncate headings or descriptions.

## Information cards

`.pwf-info-card` presents explanatory content that is not itself a destination.
Use an article or section instead of adding click behavior. When an information
card needs a related route, include a normal link in its content.

## Settings page

Substantial settings belong on a complete, addressable page. The layout combines
a section navigation with linkable `.pwf-settings-section` elements. Native form
controls express actual choices; storage and consent remain application concerns.

On wide screens the section navigation stays visible. On narrow screens it
becomes a horizontal list above the settings. Every section ID remains usable as
a URL fragment, and scroll margins keep its heading clear of the sticky header.

The reference page intentionally does not persist changes. It demonstrates the
foundation preference API and explains that an application must inject storage
only after its own policy decision.

The reference quick-settings surface deliberately contains only small frequent
controls and links to this complete page for everything else.

## Progressive enhancement and failure behavior

The current shell CSS requires no JavaScript. Header tabs, mobile page selection,
breadcrumbs, cards, section links, and footer links work through complete page
loads. The reference uses the optional dialog enhancement for search and
launcher. Pin state is the first launcher service; history, drag-and-drop
ordering, and route-catalog generation remain later independent enhancements.

If scripts fail, the page content and all addressable routes remain available.
Applications should provide a normal search page and full page catalog before a
future overlay intercepts those destinations.

## Accessibility checklist

- Include one visible skip link targeting main content.
- Give each navigation landmark a distinct accessible name.
- Use `aria-current`, not color alone, for current pages and sections.
- Preserve one `h1` and a logical heading order inside cards and settings.
- Keep every page destination as an anchor with a valid URL.
- Do not place controls inside card links.
- Test the sticky header, mobile details menu, horizontal context links, focus
  outlines, increased contrast, reduced motion, and interface scaling.

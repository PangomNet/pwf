# PWF Roadmap

The roadmap is ordered by dependency and migration risk. Each phase should remain
usable on its own; completion does not require removing working ONA code.

## Phase 0 — Foundation slice (complete)

- Repository contracts, architecture, license inventory, and contributor rules.
- Core tokens, layout modes, preferences, focus and motion behavior.
- Theme schema plus independently loadable reference themes.
- Buttons, panels, forms, dialogs, tabs, tables, loaders, and toasts.
- Dependency-light build, contract tests, component catalog, and example page.
- Documentation map, behavioral guide, component recipes, and enforced catalog
  links.

Exit: a static application can use the foundation without ONA globals or cookies,
and build/test output is reproducible.

## Phase 1 — Application shell (in progress)

- Canonical PWF Standard theme with the Monitor-derived 1600 px stage, 17 px
  scale, Mica header, route tabs, content cards, divider, and footer.
- Initial responsive shell frame, desktop page tabs, mobile page selector,
  breadcrumbs, contextual navigation, route accents, content cards, and footer.
- First complete-page home and settings reference routes.

- Separate settings page and compact quick-settings surface.
- App launcher with pages, favorites, history, and accessible drag-and-drop.
- Local profile/nickname adapter and reserved multi-user slots.
- Navigation adapter with complete page loads as baseline and optional dynamic
  loading as progressive enhancement.
- First PWF-powered documentation site shell using the same header, navigation,
  search, layouts, and theme contracts delivered to applications.
- ONA adapter introduced alongside existing ONA behavior; no source removal yet.

Exit: ONA can opt into the shell behind an integration switch and fall back to
its current implementation.

## Phase 2 — Platform services

- Modular consent categories and policy UI.
- Manifest, service worker, offline page, update prompt, and cache-version API.
- Local search index with provider adapters.
- Extension manifest schema covering versions, routes, settings, dependencies,
  capabilities, and licenses.
- App Center UI and capability review.

## Phase 3 — Content and media

- RSS, Atom, and JSON Feed normalization.
- Status monitor add-on extracted from application-specific presentation.
- Sandboxed PDF viewer and bounded ZIP/file viewer.
- Shared media API with audio/video controls, metadata, queue, chapters,
  subtitles, Media Session integration, and PanPlay adapter.

## Phase 4 — WordPress distribution

- PWF WordPress theme for presentation.
- Separate companion plugin for application behavior.
- GPL-compatible dependency review, packaging, upgrade path, and WordPress coding
  standard checks.

## Phase 5 — Stable ecosystem release

- Stable public API and semantic-versioning policy.
- Migration guides, authored theme guide, extension examples, typed declarations,
  and machine-readable compatibility data.
- Searchable wiki-style reference, presentation/landing pages, versioned API
  documentation, and runnable examples hosted by the PWF documentation site.
- Cross-browser, assistive-technology, performance, PWA, and security matrices.
- Release archives, checksums, provenance, and complete notices.

## Deferred decisions

These are intentionally reversible until their phase begins: package registry,
minimum browser matrix, Tailwind major-version baseline, search engine choice,
service-worker caching library, and WordPress repository distribution.

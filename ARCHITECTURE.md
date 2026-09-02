# PWF Architecture

## Product boundary

Pangom Web Framework (PWF) is an application framework, not an ONA Monitor
theme. Its stable core owns design tokens, layout primitives, accessible UI
components, preference contracts, and small browser modules. Product content,
route catalogs, regional datasets, analytics choices, and application branding
remain outside the framework.

The ONA Monitor is a migration source and later an integration consumer. Nothing
in PWF may depend on `MONITOR_*` globals, ONA cookies, ONA routes, or an ONA URL
layout. Migration into ONA happens only after equivalent PWF behavior has tests
and an integration plan.

## Layers

1. **Core** (`src/core`) contains namespaced tokens, document defaults,
   preference selectors, accessibility behavior, and layout primitives. It has
   no product-specific state and no persistence requirement.
2. **Components** (`src/components`) contain CSS and focused ES modules. Each
   component is usable with semantic server-rendered HTML. JavaScript enhances
   behavior but does not own navigation or content delivery.
3. **Themes** (`src/themes`) contain only token overrides and optional decorative
   rules. Every theme is a separate file, so deleting it cannot break the core.
   Metadata follows `schemas/theme.schema.json`.
4. **Add-ons and shell feature modules** (`addons/*` and future `packages/*`) compose core components:
   launcher, settings, search, PWA, consent, feeds, viewers, media, and extension
   management. These modules communicate through documented adapters rather
   than application globals.
5. **Integrations** (future `integrations/*`) adapt PWF to hosts such as ONA and
   WordPress. The WordPress theme and companion plugin are separate GPL-compatible
   deliverables, not long-lived branches.
6. **Documentation and showcase** (`docs` and a future `site`) explain the same
   public contracts to readers and machines. The public documentation, wiki-like
   reference, examples, and presentation pages run on PWF itself. They are both
   learning material and a continuously exercised reference application.

## Packaging and loading

- `dist/pwf.css` is the theme-neutral foundation bundle.
- `dist/pwf.js` exports enhancement functions; importing it performs no automatic
  initialization. Applications call `initPwf()` explicitly.
- `dist/themes/*.css` are independently loadable and removable.
- `dist/addons/*` contains independently loadable feature packages. Add-on
  JavaScript and CSS are never merged into the Core bundles.
- Source modules remain unminified and independently addressable.
- Tailwind is a build-time integration. The preset maps PWF tokens into utility
  names; the browser runtime does not require Tailwind.
- Feature packages declare dependencies and capabilities through
  `schemas/addon.schema.json`. A full distribution may contain all packages, while an
  application loads only selected entry points.

## Stable contracts

Public CSS names use the `pwf-` prefix and custom properties use `--pwf-`.
Behavior hooks use `data-pwf-*`. JavaScript exports named functions and avoids
ambient global state. JSON contracts use versioned schemas.

The initial theme contract is token based: an application selects a theme using
`data-pwf-theme` on the root element, then selects light, dark, or automatic color
scheme through `data-pwf-color-scheme`. Contrast and motion preferences use
independent attributes, so a theme cannot disable accessibility choices.

Contract changes follow semantic versioning. Additive tokens and optional fields
are minor changes; renaming selectors, exports, or required schema fields is a
major change.

PWF Core, applications such as ONA Monitor, themes, and extensions have
independent release versions. Compatibility is declared explicitly rather than
implied by matching numbers. JSON `schemaVersion` values version data formats,
not software releases. The complete policy lives in `docs/versioning.md`.

Every public contract has two matching descriptions: a concise machine-readable
entry in a schema or catalog and a reader-oriented page covering purpose,
baseline HTML, enhancement lifecycle, state, accessibility, failure behavior,
theming, and an executable example. A module is not considered complete when
only its implementation exists.

## Progressive enhancement

PWF treats ordinary URLs and complete page responses as the baseline. Shell
navigation must always use valid links. Optional dynamic navigation may intercept
a link only when it can preserve history, focus, titles, error recovery, and a
normal reload fallback.

Native platform features are preferred: `<dialog>`, semantic tables, buttons,
landmarks, and form controls. Enhancements must preserve keyboard use, visible
focus, reduced-motion preferences, and screen-reader state.

## State, privacy, and security

Core preferences can be applied without storage. Persistence is injected through
a small storage adapter and belongs to the consuming application or consent
module. Core never writes cookies.

HTML-producing APIs must use DOM construction or escaped text. Feature modules
that read feeds, PDFs, ZIP files, or extension manifests require explicit size,
origin, MIME, and capability limits. Service workers are application-scoped and
must not be silently registered by importing the core.

## Build and quality gates

The foundation build uses Node standard-library scripts to keep the initial
supply chain small. The build concatenates an ordered CSS manifest, copies ES
modules and schemas, and emits unminified output. Tests assert contract presence,
theme isolation, absence of ONA coupling, and preference normalization.

Before a release or ONA integration:

1. run build and automated tests;
2. exercise the example with keyboard, dark mode, contrast, and reduced motion;
3. validate schemas and third-party inventory;
4. verify full-page navigation and no-JavaScript behavior;
5. review the diff and generated artifacts before publishing.
6. verify that catalog links, reader documentation, and examples describe the
   behavior actually shipped.

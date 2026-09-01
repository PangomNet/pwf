# PWF documentation

PWF documentation is organized by the question a reader is trying to answer.
The public documentation site will render these sources with PWF itself, so the
site doubles as a reference implementation and a continuous integration target.

## Learn

- The repository [README](../README.md) gives the shortest setup path.
- [Framework behavior](framework-behavior.md) explains the runtime model,
  progressive enhancement, preferences, state, themes, and failure behavior.
- The [PWF Showcase](../examples/shell/index.html) is the canonical executable
  presentation. Its [component page](../examples/shell/components.html) combines
  live previews, code recipes, layouts, search, and links to the handbook.
- The [foundation example](../examples/foundation/index.html) remains the small
  shell-independent integration example.

## Build

- [Foundation components](components/foundation.md) contains semantic HTML
  recipes and behavior notes.
- [Component coverage](component-coverage.md) records the current showcase
  surface and the remaining component families without implying fake support.
- [Application shell](components/shell.md) documents the monitor-inspired but
  product-neutral frame, navigation, content patterns, and settings layout.
- [Markdown viewer](components/markdown-viewer.md) documents the first content
  module and its safe in-shell rendering contract.
- [Scroll rail](components/scroll-rail.md) documents mouse, wheel, touch, and
  keyboard handling for long horizontal navigation.
- [PWF Standard design language](design-standard.md) records the exact shell
  geometry, surface hierarchy, route accents, typography boundary, and responsive behavior.
- [Theme authoring](themes.md) explains removable token-only themes.
- [Versioning](versioning.md) explains independent framework, application,
  theme, extension, and schema versions.
- [Architecture](../ARCHITECTURE.md) explains package boundaries and stable
  contracts.

## Contribute

- [Documentation system](documentation-system.md) defines what every module page
  must contain and how documentation stays synchronized with code.
- [Roadmap](../ROADMAP.md) shows which shell, platform, content, and integration
  documentation is still planned.
- `catalog/components.json` is the machine-readable index used by tests and the
  future documentation site.

## PWF-powered documentation showcase

The shell example provides the first unified view over the same sources:

1. a guided presentation for first-time visitors;
2. a searchable wiki-style handbook for application authors;
3. exact API, schema, token, and component reference for developers and LLMs.

It uses PWF's own shell, local search, themes, three content widths, settings,
live components, and Markdown renderer. Ordinary URLs and complete page loads
remain the baseline, so every documentation page can be linked, indexed, and
recovered by reload. Search indexing, generated catalog pages, printing, and
optional progressive transitions remain later expansions.

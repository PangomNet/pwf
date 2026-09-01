# Pangom Web Framework (PWF)

PWF is a free, modular web framework for accessible application interfaces. It
combines framework-owned design tokens and components with an optional Tailwind
CSS preset. Applications can use the complete download while shipping only the
modules and themes they need.

The repository is at an early foundation stage. The first slice provides:

- namespaced design tokens and normal, wide, and fluid layouts;
- light/dark/automatic color schemes, increased contrast, reduced motion, and
  interface scaling;
- panels, buttons, forms, native dialogs, tabs, tables, loaders, and toasts;
- removable themes with a JSON Schema contract;
- browser-native ES modules, an unminified CSS build, tests, and an example.

## Quick start

Build and test with Node.js 20 or newer:

```sh
npm run check
```

Serve the repository with any static web server and open
`examples/foundation/index.html`. The example deliberately uses ordinary links
and semantic HTML; JavaScript enhances dialogs, tabs, preferences, and toasts.

For Tailwind projects, add `tailwind.preset.cjs` to the application's presets
and include `src/tailwind.css` in its Tailwind input. PWF itself does not vendor
Tailwind or require it in the browser.

See [ARCHITECTURE.md](ARCHITECTURE.md), [ROADMAP.md](ROADMAP.md), and
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for project boundaries and
licensing.

## Documentation

The [documentation index](docs/README.md) provides separate paths for people
learning PWF, application authors looking for recipes, and contributors needing
the behavioral contracts. In particular:

- [Framework behavior](docs/framework-behavior.md) explains what happens with
  and without JavaScript, where state lives, and how failure modes behave.
- [Foundation components](docs/components/foundation.md) documents semantic
  markup, enhancement hooks, accessibility, and theming for every current
  component.
- [Documentation system](docs/documentation-system.md) defines the required
  structure for future module documentation and the PWF-powered documentation
  site.

# Working on PWF

- Keep framework code independent of ONA globals, routes, cookies, branding, and
  regional data. ONA integration belongs in a named adapter.
- Preserve semantic HTML and complete-page navigation. JavaScript may enhance a
  working server-rendered baseline.
- Prefix public CSS with `pwf-`, custom properties with `--pwf-`, and behavior
  attributes with `data-pwf-`.
- Keep modules small, side-effect free on import, documented with JSDoc, and
  usable without persistent storage.
- Add or update schemas and `catalog/components.json` when a public contract
  changes.
- Treat documentation as part of the public contract. Every new public module
  needs a catalog entry, reader-oriented behavior page, semantic HTML example,
  accessibility and fallback notes, and a stable documentation link.
- Keep the future documentation site dogfooding PWF itself; do not introduce a
  second private component system just for the website or presentation pages.
- Add every distributed dependency or asset to `licenses/inventory.json` before
  committing it.
- Run `npm run check` and inspect the foundation example before publishing or
  replacing ONA behavior.
- Do not edit or delete ONA Monitor files as part of extraction until a tested
  PWF integration replaces them.

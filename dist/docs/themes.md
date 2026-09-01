# Authoring a PWF theme

A theme is optional and removable. It must not define component structure or
required behavior; it overrides `--pwf-*` tokens under one
`[data-pwf-theme="theme-id"]` selector.

The bundled `standard` theme is the canonical PWF appearance and recreates the
ONA Monitor's proven shell language without its brand or content. `quiet` and
`pangom` demonstrate more restrained and more expressive alternatives. All
three use the same contract and can be removed independently. See
`docs/design-standard.md` for the exact standard-theme values and provenance.

1. Copy one CSS file and its `.theme.json` manifest from `src/themes`.
2. Choose a lowercase, hyphenated ID and use it in both files.
3. Override light tokens in the base selector and dark tokens in an explicit dark
   selector plus an automatic `prefers-color-scheme` block.
4. Validate the manifest against `schemas/theme.schema.json`.
5. Load the theme CSS after `pwf.css` and set `data-pwf-theme` on `<html>`.

```html
<link rel="stylesheet" href="/pwf/pwf.css">
<link rel="stylesheet" href="/pwf/themes/standard.css">
<html data-pwf-theme="standard" data-pwf-color-scheme="auto">
```

Themes must preserve visible focus, readable contrast, reduced motion, semantic
markup, and all component states. A theme may be removed from a distribution by
deleting its CSS and manifest and removing the application's reference to it.

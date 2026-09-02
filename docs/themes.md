# Authoring a PWF theme

A theme is optional and removable. It must not define component structure or
required behavior. Its base contract overrides `--pwf-*` tokens under one
`[data-pwf-theme="theme-id"]` selector. A theme may add presentation-only rules
for public `.pwf-*` components when those rules are fully scoped below that same
theme selector. Such rules may change chrome, depth, borders, or typography, but
never markup requirements, focus visibility, or component behavior.

The bundled `standard` theme is the canonical PWF appearance and recreates the
ONA Monitor's proven shell language without its brand or content. `quiet`,
`pangom`, `panplay-studio`, `artwork-ostfriesland`, `stadium`, `pride`, and
`winter` demonstrate restrained, expressive, media, artwork, and seasonal
alternatives. Eleven additional `panplay-*` packs port the fixed designs found
in the local oOPlay development candidate: Default, Light, Laut, HC Dark, Glass,
Deepin, Aqua, Aero, Windows XP, Windows 9x, and BS Cosmo. All nineteen use the
same contract and can be removed independently. See
`docs/design-standard.md` for the exact standard-theme values and provenance.

The historical packs preserve more than their palettes: their scoped rules also
adapt component chrome. Aqua uses metallic controls, Aero layered translucent
glass, Windows XP blue window bars, Windows 9x outset/inset system controls,
Glass dark translucent surfaces, Deepin cyan depth, HC Dark explicit borders,
and BS Cosmo square dark-blue Metro tiles. The component showcase exposes every
historical pack as a button, so its effect can be inspected across the complete
page without reloading it.

| Historical pack | Manifest mode | Characteristic composition |
| --- | --- | --- |
| Default | dark | translucent charcoal player, teal selection, red/black settings header |
| Light | light | light document canvas combined with deliberately dark player and modal chrome |
| Laut | dark | condensed typography, slate surfaces, teal active controls |
| HC Dark | dark | pure black canvas, white structural borders, teal controls |
| Glass | dark | floating liquid-glass bars, pill controls, coral active state |
| Deepin | dark | navy translucent panes, compact rounded dialogs, cyan controls |
| Aqua | light | striped silver dialogs, metallic bars, round blue controls |
| Aero | light | layered blue glass, split gloss gradients, red window controls |
| Windows XP | light | Luna blue title bars, warm dialog face, green player action |
| Windows 9x | light | system grey, navy selection, outset/inset controls, patterned scrollbars |
| BS Cosmo | dark | square Windows 8.1-style tiles on a dark-blue Metro canvas |

1. Copy one CSS file and its `.theme.json` manifest from `src/themes`.
2. Choose a lowercase, hyphenated ID and use it in both files.
3. Declare the actually supported `modes`. For an adaptive theme, provide light
   tokens plus an explicit dark selector and automatic `prefers-color-scheme`
   block. For a fixed historical design, list exactly one mode and do not invent
   a second appearance.
4. Validate the manifest against `schemas/theme.schema.json`.
5. Load the theme CSS after `pwf.css` and set `data-pwf-theme` on `<html>`.

Applications that offer optional downloads can instead register manifests with
`createThemeManager()`. The manager attaches only the active theme stylesheet,
removes the previous managed stylesheet, and emits `pwf:theme-change`. It does
not store the selection. Use `getThemeModeState(manifest, requestedMode)` before
applying preferences; its `locked` and `resolved` fields prevent unsupported
combinations. Deleting a CSS/manifest pair and its catalog entry is enough to
exclude that design from a distribution.

```html
<link rel="stylesheet" href="/pwf/pwf.css">
<link rel="stylesheet" href="/pwf/themes/standard.css">
<html data-pwf-theme="standard" data-pwf-color-scheme="auto">
```

Themes must preserve visible focus, readable contrast, reduced motion, semantic
markup, and all component states. A theme may be removed from a distribution by
deleting its CSS and manifest and removing the application's reference to it.

The Artwork and Stadium token languages were adapted from the Monitor's local
theme configuration. Its background photographs are not copied into PWF until
their provenance and redistribution licenses can be recorded. Applications may
provide a separately licensed artwork URL through
`--pwf-theme-background-image`.

The historical PanPlay packs are clean PWF reconstructions rather than copies of
their old Bootstrap/Bootswatch bundles, fonts, PHP, or image assets. They map the
original colors, typography stacks, gradients, borders, menus, dialogs, form
controls, player chrome, selection states, and responsive reductions onto the
PWF component vocabulary. Their manifests record the exact local provenance.
The old `custom` handler is not a fixed design; applications reproduce it by
registering their own manifest and token stylesheet through
`createThemeManager()`.

# PanPlay theme parity

This document records how the fixed themes in the local PanPlay/oOPlay
development candidate map to PWF. It is both a review checklist and a guard
against gradually reducing a theme to a palette swap.

## Source boundary

The authoritative local source is
`oOPlay/oOPlay/Releases/_currentdevcandidate/engine/style/theme`. PWF does not
ship PanPlay's old Bootstrap bundles, PHP handlers, unlicensed backgrounds, or
font files. Instead, each independent stylesheet reconstructs the original
visual rules against semantic PWF components.

The source themes are fixed compositions. Default, Laut, HC Dark, Glass,
Deepin, and BS Cosmo are dark. Light, Aqua, Aero, Windows XP, and Windows 9x are
light. “Light” intentionally combines a light page with dark player and dialog
chrome; that contrast is part of the design, not an automatic dark-mode leak.

## Required parity surface

Every historical pack must visibly define all of these groups:

1. application canvas, header, tabs, subbar, stage, footer, and mobile menu;
2. brandmark frame, navigation cards, panels, cards, Heroes, and statistics;
3. primary, secondary, quiet, success, warning, danger, hover, active, disabled,
   and focus button states;
4. text fields, selects, textarea, file input, range, switch, valid, invalid, and
   disabled states;
5. dropdown, accordion, navbar, list group, pagination, tabs, and breadcrumbs;
6. alerts, badges, progress, loader, placeholder, empty state, and toast;
7. table header, rows, borders, and overflow container;
8. dialog, overlay, side-sheet, title area, close control, body, footer, and
   backdrop;
9. player stage, primary media action, secondary media actions, timeline,
   metadata, and queue selection;
10. narrow-screen reductions and reduced-motion behavior.

## Distinctive acceptance markers

- Glass uses floating rounded bars, layered highlights, blur, pill controls, and
  coral active states.
- Deepin uses compact ten-pixel-style radii, navy translucency, cyan gradients,
  and a red circular close hover.
- Aqua uses the original split metallic gradients, striped dialog body, pill
  controls, and round red close control.
- Aero uses lighter layered glass than Aqua, a 49/51 percent gloss split, blue
  ink, a wide red close control, and glassy player controls.
- Windows XP uses the sky/grass horizon, Luna title bars, cream dialog face,
  orange hover border, compact red close control, and green media action.
- Windows 9x uses 13-pixel system typography, zero radii and animation, system
  grey, navy selection, outset/inset borders, and patterned scrollbars.
- BS Cosmo uses a dark navy canvas, sharp edges, large flat tiles, Segoe-style
  typography, and saturated Metro colors.

## Mode behavior

`modes` in every theme manifest is authoritative. Applications call
`getThemeModeState()` before applying preferences. When `locked` is true, the
mode control is disabled and `resolved` is applied. Returning to an adaptive
theme restores the user's last requested automatic, light, or dark setting.

## Review procedure

Use `examples/shell/components.html`, switch each archive tile, and review the
full page rather than the tile itself. At minimum inspect dropdown/accordion,
buttons/status, forms, navigation, dialogs, tables, feedback, and the media
add-on. Then verify a narrow viewport, keyboard focus, reduced motion, the
single active theme stylesheet, and the fixed/adaptive mode status.

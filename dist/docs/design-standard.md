# PWF Standard design language

`PWF Standard` is the canonical visual starting point for PWF applications. It
preserves the application geometry and interaction density proven in the ONA
Monitor while keeping the framework independent of ONA branding, routes,
cookies, regional data, and application content.

The source of truth is `src/themes/standard.css` for tokens and
`src/shell/*.css` for public component geometry. The executable reference is
`examples/shell/index.html`.

## Fixed shell geometry

| Contract | Standard value | Purpose |
| --- | ---: | --- |
| Wide application stage | `1600px` | Creates the centered application surface and visible outer canvas. |
| Reading/content width | `72rem` | Matches Tailwind's original `max-w-6xl`; 1224 px at the standard 17 px root size. |
| Header height | `3.5rem` | 59.5 px at the standard root size; holds brand, tabs, search, and launcher. |
| Secondary bar | `2.25rem` | 38.25 px at the standard root size; holds breadcrumb and page links. |
| Framework divider | `2rem` | 34 px at the standard root size; separates content and product footer. |
| Main corner radius | `1.5rem` / 24 px | Used by hero, navigation cards, information panels, and settings groups. |
| Navigation grid | three columns, `1rem` gap | Reflows to two and then one column without changing semantics. |

The dark surface hierarchy is deliberately narrow: outer canvas `#111316`,
application stage `#050505`, glass header `rgba(10,10,10,.68)`, footer `#0f0f0f`,
divider `#111111`, and structural borders `#222222`. The light scheme exposes the
same hierarchy with corresponding neutral values.

## Route accents

The accent belongs to the current route, not to an application brand. The shell
offers blue, green, gold, violet, and rose presets through `data-pwf-accent`.
Applications may set `--pwf-route-accent` directly. The accent colors the header
edge, active tab, selected controls, focus treatment, and interactive hover
states. Text and `aria-current` remain the authoritative state indicators.

## Typography

PWF Standard uses the system sans-serif stack at a 17 px base size. Small
decorative labels use `--pwf-font-display` with uppercase text and wide tracking.
The original Monitor repository contains the Rondalo font but does not include a
distribution license for it. PWF therefore does not redistribute the font. A
project that owns an appropriate license may load it itself and override:

```css
[data-pwf-theme="standard"] {
  --pwf-font-display: "Rondalo", var(--pwf-font-sans);
}
```

This is the only intentional visual fallback in the current recreation; it does
not change layout or behavior.

## Brand boundary

The three-cell `PWF` mark in the reference demonstrates the exact logo box size,
not an ONA asset. Applications replace the mark inside `.pwf-app__brand` while
preserving its dimensions and accessible home link. ONA logos and names belong
only in an ONA adapter or application.

## Responsive behavior

At widths below 64rem, desktop tabs become a native `details` page selector and
content padding contracts. At 40rem, the brand occupies a compact square, the
breadcrumb hides, page links scroll horizontally, cards become one column, and
the footer stacks. All destinations remain ordinary anchors and continue to work
without JavaScript.

## Change rule

A public change to any value or selector described here requires an update to
this document, `docs/components/shell.md`, `catalog/components.json`, the shell
reference, and the build tests. Visual checks cover desktop and narrow layouts
before publishing.

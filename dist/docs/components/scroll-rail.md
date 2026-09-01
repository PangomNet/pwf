# Scroll rail

The scroll rail is an optional enhancement for horizontally overflowing
navigation. It replaces the visually inconsistent native bar with a themed
thumb while preserving the real scrollable element and its complete content.

## Markup and initialization

```html
<div class="pwf-scroll-rail" data-pwf-scroll-rail>
  <nav class="pwf-scroll-rail__viewport" id="section-nav"
       data-pwf-scroll-viewport aria-label="Sections">…</nav>
  <div class="pwf-scroll-rail__track" data-pwf-scroll-track hidden>
    <button class="pwf-scroll-rail__thumb" type="button" role="scrollbar"
      aria-controls="section-nav" aria-orientation="horizontal"
      aria-label="Scroll sections horizontally"
      data-pwf-scroll-thumb></button>
  </div>
</div>
```

`initScrollRails(root)` finds each complete contract. `initPwf()` calls it by
default and returns a cleanup function that removes listeners and observers.
Imports have no side effects.

## Observable behavior

- Dragging the thumb with mouse, pen, or touch moves the native viewport.
- Clicking the track moves toward that position.
- A vertical mouse wheel over a horizontal-only viewport scrolls it sideways.
- Left/Right, Page Up/Page Down, Home, and End work when the thumb has focus.
- The thumb exposes current, minimum, and maximum values through ARIA.
- The track hides when the content fits and updates after resize.

Without JavaScript the custom track stays hidden and the viewport retains its
native scrollbar. Initialization adds `data-pwf-scroll-ready`, hides the native
bar, and reveals the custom track only when content actually overflows. The
module performs no storage, network, or content mutation.

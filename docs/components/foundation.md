# Foundation components

All foundation components are experimental in PWF 0.1. Their public classes use
the `pwf-` prefix. Examples below show the minimum meaningful markup; applications
should choose headings and landmarks appropriate to their content.

## Button

Use `.pwf-button` on `<button>` for actions and on `<a>` for navigation. Secondary
and quiet variants change emphasis only. Never attach navigation exclusively to
a button when a normal link can express the destination.

```html
<a class="pwf-button" href="/settings/">Open settings</a>
<button class="pwf-button pwf-button--secondary" type="button">Refresh</button>
```

Disabled buttons use the native `disabled` attribute. Links that are temporarily
unavailable should normally be omitted; `aria-disabled` does not prevent
navigation by itself.

Success, warning, and danger button variants communicate emphasis together with
their visible label. Use `.pwf-button-group` only for closely related actions and
give the group an accessible name.

## Panel

`.pwf-panel` provides the translucent Mica-like surface. The `--solid` variant
removes backdrop filtering. The class does not supply semantics.

```html
<section class="pwf-panel" aria-labelledby="service-title">
  <h2 class="pwf-panel__title" id="service-title">Service status</h2>
  <p>All systems operational.</p>
</section>
```

## Form field

Labels remain explicit and hints or errors are connected with
`aria-describedby`. PWF styles validation state but does not invent validation
messages or submit data.

```html
<label class="pwf-field" for="nickname">
  <span class="pwf-label">Display name</span>
  <input class="pwf-input" id="nickname" aria-describedby="nickname-hint">
  <span class="pwf-hint" id="nickname-hint">Stored only when the application allows it.</span>
</label>
```

`.pwf-input-group` joins a field with text or button add-ons. The visible label
still belongs outside the group. `.pwf-switch` styles a native checkbox with
`role="switch"`; checked, focus, and disabled state remain browser semantics.

`aria-invalid="true"` and `aria-invalid="false"` expose explicit invalid and
valid borders. Always connect `.pwf-error` or `.pwf-valid` text with
`aria-describedby`; color alone is insufficient.

## Status alerts, badges, and progress

Alerts use one of `--info`, `--success`, `--warning`, or `--danger`. Routine
updates normally use `role="status"`; urgent failures may use `role="alert"`.
Every alert retains a visible title and description.

```html
<div class="pwf-alert pwf-alert--warning" role="status">
  <span class="pwf-alert__icon" aria-hidden="true">!</span>
  <div><strong class="pwf-alert__title">Connection unstable</strong>
    <div class="pwf-alert__content">Updates may arrive late.</div></div>
</div>
```

Badges are short supplemental labels, never the only name of a control.
`.pwf-progress` wraps a bar whose width is set through
`--pwf-progress-value`; the wrapper carries the native progressbar ARIA values.

## Card

`.pwf-card` is a flexible container with optional header, body, and footer.
Choose an `article` or `section` for content. When the complete card navigates,
put `.pwf-card--interactive` on one anchor instead of adding click behavior to a
generic container.

```html
<article class="pwf-card" data-pwf-tone="warning">
  <header class="pwf-card__header">Status</header>
  <div class="pwf-card__body"><h2 class="pwf-card__title">Review needed</h2></div>
</article>
```

## Dropdown and accordion

Simple dropdowns and accordions use native `details` and `summary`. Their
content, expanded state, Enter/Space behavior, and focusability therefore remain
available without a script. Use a dropdown for a small contextual group; use an
accordion for explanatory content. Complex application menus require their own
ARIA menu behavior instead of these generic patterns.

```html
<div class="pwf-accordion">
  <details class="pwf-accordion__item">
    <summary>What is loaded?</summary>
    <div class="pwf-accordion__body">Only imported modules.</div>
  </details>
</div>
```

## List group and pagination

List groups arrange related links, buttons, or static rows. Use
`aria-current="page"` on the current link. Pagination uses a list inside a named
`nav`; disabled entries are non-link elements with `aria-disabled="true"`.

## Dialog

Use a native named `<dialog>`. The opener references its ID. `initDialogs()` adds
opening, closing, initial focus, and focus return. Dialog content that must be
available without JavaScript also needs an ordinary-page route.

```html
<button class="pwf-button" type="button" data-pwf-dialog-open="help">Help</button>
<dialog class="pwf-dialog" id="help" aria-labelledby="help-title">
  <div class="pwf-dialog__body">
    <h2 id="help-title">Help</h2>
    <p>Dialog content.</p>
  </div>
  <div class="pwf-dialog__footer">
    <button class="pwf-button" type="button" data-pwf-dialog-close>Close</button>
  </div>
</dialog>
```

## Tabs

Tabs require stable tab and panel IDs. Before `initTabs()`, leave every panel
visible so the content remains readable. Initialization selects one panel and
adds arrow, Home, and End keyboard behavior.

```html
<section data-pwf-tabs>
  <div class="pwf-tabs__list" role="tablist" aria-label="Views">
    <button class="pwf-tabs__tab" id="summary-tab" role="tab"
      aria-selected="true" aria-controls="summary-panel">Summary</button>
    <button class="pwf-tabs__tab" id="table-tab" role="tab"
      aria-selected="false" aria-controls="table-panel">Table</button>
  </div>
  <div class="pwf-tabs__panel" id="summary-panel" role="tabpanel"
    aria-labelledby="summary-tab">Summary content</div>
  <div class="pwf-tabs__panel" id="table-panel" role="tabpanel"
    aria-labelledby="table-tab">Table content</div>
</section>
```

## Table

The scroll wrapper prevents a wide table from expanding the page. Give the
wrapper an accessible region name when keyboard users may need horizontal
scrolling. Keep captions and scoped header cells in the table.

```html
<div class="pwf-table-scroll" tabindex="0" role="region" aria-label="Departures">
  <table class="pwf-table">
    <caption>Next departures</caption>
    <thead><tr><th scope="col">Time</th><th scope="col">Line</th></tr></thead>
    <tbody><tr><td>13:05</td><td>410</td></tr></tbody>
  </table>
</div>
```

## Loader

The ring is decorative. Put it inside a status with readable text. Reduced-motion
rules stop the animation but leave status text and the visual indicator present.

```html
<div role="status">
  <span class="pwf-loader" aria-hidden="true"></span>
  <span>Loading departures…</span>
</div>
```

## Toast

Call `showToast(message)` after an action needs a short announcement. Content is
inserted as text. Use `tone: 'danger'` only for an urgent failure, and use
`duration: 0` when the message must remain until dismissed.

```js
import { showToast } from '@pangom/pwf';

showToast('Settings saved.');
showToast('Connection failed.', { tone: 'danger', duration: 0 });
```

Toasts should not contain essential instructions or replace inline form errors,
because transient content can be missed.
# Page and content patterns

PWF ships reusable page compositions without assigning application meaning.
`pwf-navbar`, `pwf-nav`, `pwf-hero`, `pwf-stats`, `pwf-toolbar`, avatars, media
objects, steps, timelines, ratios, figures, and `pwf-gallery` all work without
JavaScript. A Hero remains a labelled `section`; every navigation destination
remains an anchor; a gallery remains an ordinary horizontally scrollable list.

```html
<section class="pwf-hero pwf-hero--split" aria-labelledby="welcome-title">
  <div class="pwf-hero__content">
    <h1 class="pwf-hero__title" id="welcome-title">Build an application</h1>
    <div class="pwf-hero__actions"><a class="pwf-button" href="/start">Start</a></div>
  </div>
  <div class="pwf-hero__visual" aria-hidden="true">…</div>
</section>
```

## Loading, empty state, and Side Sheet

Skeletons supplement a labelled region with `aria-busy="true"`; they never
replace its accessible name. Animation stops under reduced motion. Empty states
use a labelled section with an actionable next step. `pwf-sheet` is a native
dialog presentation, activated by the same `data-pwf-dialog-open` contract as a
modal. Important sheet content must also have a complete-page route.

## Extended form recipes

`pwf-floating`, `pwf-file`, `pwf-range`, datalists, and the twelve-column
`pwf-form-grid` extend the same native controls. Visible labels remain present;
file restrictions and server errors must be written as text rather than encoded
only in accept patterns or color.

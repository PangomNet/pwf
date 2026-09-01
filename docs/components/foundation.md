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

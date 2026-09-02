# How PWF behaves

This page describes the observable foundation behavior. It is intentionally
written as a narrative contract: readers should be able to predict what the
framework does before reading its source.

## Loading model

`pwf.css` supplies theme-neutral tokens, layouts, accessibility rules, and base
components. A theme file is optional and loads after it. `pwf.js` is also
optional. Importing JavaScript changes nothing by itself; the application calls
`initPwf()` when it wants dialog and tab enhancement.

This means a server-rendered page remains readable when scripts are unavailable.
Links continue to navigate normally, form controls remain native, all tab panels
remain visible, and a native dialog trigger may be replaced with an ordinary
link when its content must remain reachable without scripts.

## Initialization lifecycle

`initPwf(root)` scans the supplied document or subtree, initializes supported
behavior hooks, and returns a cleanup function. Cleanup removes event listeners
installed by PWF. Applications that replace a page fragment can clean up the old
subtree and initialize the new one without reloading the entire framework.

PWF does not register a service worker, change browser history, start network
requests, write cookies, or create global variables during import or core
initialization. Those behaviors belong to explicit future modules and adapters.

## Preferences and state

Preferences are independent axes:

- `colorScheme`: `auto`, `light`, or `dark`;
- `contrast`: `auto`, `standard`, or `more`;
- `motion`: `auto`, `full`, or `reduce`;
- `scale`: a number clamped between `0.75` and `1.5`.

`applyPreferences()` validates values and applies `data-pwf-*` attributes plus
`--pwf-ui-scale` to the document root. It does not persist them.
`createPreferenceController()` only persists when the application explicitly
injects a storage adapter. Consent policy therefore remains under application
control, and the foundation never writes cookies.

Automatic modes follow operating-system media queries only when the active
theme manifest lists both `light` and `dark` in `modes`. A single-mode theme is
a fixed composition: `getThemeModeState()` resolves every request to that one
mode, and controls offering an unavailable mode should be disabled. This avoids
mixing core dark tokens with historical light chrome or vice versa. Explicit
increased contrast and reduced motion still take precedence over decorative
theme choices.

## Themes

A theme overrides tokens and may add fully scoped presentation rules under one
`data-pwf-theme` selector. It cannot change required markup, initialize
behavior, or disable accessibility preferences.
Deleting a theme file leaves the neutral core usable. Theme metadata follows
`schemas/theme.schema.json`, allowing a future App Center and documentation site
to list compatibility without executing theme code.

## Layout

`.pwf-layout` centers content and uses the normal maximum width. The `wide` mode
increases that boundary, while `fluid` uses the full available width. All three
retain responsive gutters. Applications can choose a mode per page or workspace;
the framework does not infer it from content.

## Dialogs and focus

`initDialogs()` connects controls marked with `data-pwf-dialog-open` or
`data-pwf-dialog-close` to a named dialog. Opening records the trigger, uses the
native modal API when available, and moves focus to the first useful control.
Closing returns focus to the original trigger. The fallback exposes a dialog-like
element with `open` and `aria-modal` when the native API is absent.

## Tabs and keyboard behavior

`initTabs()` treats every `data-pwf-tabs` container independently. The initially
selected tab is the one with `aria-selected="true"`, or the first tab when none
is selected. After initialization, only its controlled panel remains visible.

Clicking a tab selects it. Arrow keys move between tabs and wrap at the ends;
Home and End select the first and last tab. Selection updates `aria-selected`,
keyboard tab stops, panel visibility, and focus together. Without JavaScript,
all panels remain visible in document order.

## Toasts

`showToast()` creates a live region on first use and inserts messages as text,
never HTML. Informational messages use a polite status announcement; danger
messages use an alert. A close button is always available. A positive duration
removes the toast automatically, while zero keeps it until dismissal.

## Failure and fallback rules

- Missing enhancement targets cause the relevant operation to return without
  changing the page.
- Invalid preferences fall back to documented defaults.
- Missing storage or invalid stored JSON falls back to in-memory defaults.
- Missing themes fall back to neutral core tokens.
- JavaScript or network failure must not disable ordinary links or readable
  server-rendered content.

Future shell, navigation, search, PWA, and extension modules must add equivalent
behavior pages before their public contracts are considered complete.

# Markdown viewer

The Markdown viewer is PWF's first content module. It keeps documentation source
files readable and versionable while presenting them as normal content inside an
application shell. The reference route is
`examples/shell/document.html?doc=docs`.

## Security boundary

The renderer never assigns Markdown to `innerHTML`. It creates headings,
paragraphs, lists, quotes, code blocks, tables, and links through DOM APIs and
uses `textContent` for source text. The supported Markdown subset is intentional:
raw HTML is displayed as text instead of being executed.

Applications must allowlist document IDs and source URLs. The reference route
maps short IDs such as `standard` and `architecture` to known repository files;
the query string is never used as an arbitrary fetch path.

## Declarative loading

```html
<article
  class="pwf-markdown"
  data-pwf-markdown-src="/docs/getting-started.md"
  aria-busy="true"
>
  <p>Document is loading …</p>
</article>
```

```js
import { initMarkdownViewers } from '@pangom/pwf';

await initMarkdownViewers(document, {
  resolveLink(href) {
    return routeForKnownDocument(href) ?? href;
  }
});
```

`initMarkdownViewers(root, options)` initializes every
`[data-pwf-markdown-src]` below `root`. `loadMarkdownViewer(viewer, options)`
loads one element, while `renderMarkdown(markdown, target, options)` renders
already available text. A `fetcher` option can inject an application-specific
transport without changing the renderer.

## Supported source

- ATX headings (`#` through `######`) with stable generated IDs;
- paragraphs, unordered and ordered lists, block quotes, and horizontal rules;
- fenced code blocks and inline code;
- pipe tables;
- links, strong text, and emphasis.

Unsupported syntax remains readable text. The module does not provide syntax
highlighting, execute embedded HTML, load remote assets, or persist anything.

## Navigation and failure behavior

The viewer belongs inside `.pwf-app__stage` and `.pwf-app__content`, so an
application's header, tabs, search, launcher, route accent, and footer remain in
place on every documentation route. Normal links point to the full shell route;
dynamic replacement is optional.

Keep a direct source link on the page. If loading fails, the module replaces the
viewer with an alert and that source link. Without JavaScript, the reference
page's `noscript` fallback also exposes the original file.

The module dispatches `pwf:markdown-ready` or `pwf:markdown-error` from the viewer
after an attempt. Error details stay on the event and are not inserted into page
content.

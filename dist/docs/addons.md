# Add-ons and the first media package

PWF Core stays small even when the complete download contains many features.
An add-on is a removable directory with a manifest, one side-effect-free module,
optional styles, and explicit capabilities. The public manifest contract is
`schemas/addon.schema.json`; applications decide which packages to register and
which capabilities to grant.

## Registry lifecycle

```js
import { createAddonRegistry } from '@pangom/pwf';
import * as mediaPlayer from '@pangom/pwf/addons/media-player/media-player.js';

const registry = createAddonRegistry({ capabilities: ['media-playback'] });
registry.register(manifest, mediaPlayer);
await registry.activate('media-player', { root: document });
```

Import and registration do not change the page. `activate()` may return a
cleanup function; `deactivate()` calls it before an application removes the
package. Missing dependencies and capabilities fail before activation. Storage,
network access, route ownership, and consent are never granted implicitly.

## Media Player alpha contract

`addons/media-player` is the first executable add-on. Its baseline is a native
`audio` or `video` element. `initMediaPlayers()` connects optional play, mute,
timeline, queue, metadata, and Media Session controls inside
`[data-pwf-media-player]`. It emits `pwf:media-source-change` when the user
chooses a queued item and returns a cleanup function.

The current slice establishes presentation and lifecycle only. The following
remain planned extensions of the same package rather than Core requirements:

- typed metadata and artwork objects;
- chapter and subtitle selection;
- queue persistence through an injected adapter;
- richer Media Session actions;
- a PanPlay provider adapter;
- streaming/error states and tested audio descriptions.

No demonstration media, codec, player library, analytics, or remote service is
bundled. Applications retain control of media licenses and network policy.

## Distribution and removal

The build copies add-ons to `dist/addons` without merging their CSS or JavaScript
into `dist/pwf.css` or `dist/pwf.js`. Deleting an add-on directory and its app
registration leaves Core and every ordinary route usable.

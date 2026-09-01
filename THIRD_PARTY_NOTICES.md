# Third-party notices

The foundation source currently contains no vendored third-party code, fonts,
icons, images, or compiled Tailwind output.

PWF is designed to integrate with **Tailwind CSS**, which is available under the
MIT License. Tailwind is an optional build-time dependency supplied by the
adopting project; its code is not included in this repository's foundation
bundle. Distributions that include Tailwind output or packages must retain the
applicable Tailwind license notice.

The ONA Monitor is used only as a migration reference. This repository does not
copy its Rondalo font, Font Awesome assets, PDF.js files, Leaflet files, regional
datasets, branding, or other vendor assets. Any later migration of an asset must
first add its origin, version, license, notice obligations, and distribution
status to `licenses/inventory.json`.

The planned WordPress theme and companion plugin will be reviewed and distributed
as separate GPL-compatible outputs. Their notices will not be inferred from the
MIT-licensed core.

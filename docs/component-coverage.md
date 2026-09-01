# Component coverage

PWF treats a component as complete only when semantic markup, visual variants,
keyboard and focus behavior, failure fallback, documentation, catalog metadata,
and a runnable example agree. A large monolithic bundle is not the goal: each
application should load only the modules it uses.

The documentation structure is informed by mature framework references such as
Bootstrap, while PWF keeps its own names, Monitor-derived design language,
dependency boundaries, and progressive-enhancement rules.

## Available foundation

| Category | Contracts |
| --- | --- |
| Actions | buttons, quiet/secondary/status variants, button groups |
| Content | panels, cards, headers/footers, interactive cards |
| Status | alerts, badges, progress, loader, toast |
| Forms | inputs, selects, textareas, checks, switches, input groups, validation |
| Disclosure | native dropdown, accordion, dialog |
| Navigation | tabs, list groups, pagination, breadcrumbs, shell tabs |
| Data | responsive semantic tables |
| Shell | search, launcher, pins, quick settings, three content widths |

## Next coverage groups

These remain separate modules rather than being simulated by the showcase:

- dismissible alerts and application-controlled undo;
- off-canvas navigation and side sheets;
- tooltips and popovers with robust focus and touch behavior;
- carousel/media galleries that obey reduced motion;
- scrollspy and generated section indexes;
- skeleton/placeholders with meaningful loading status;
- file inputs, datalists, floating labels, and richer server-validation recipes;
- navigation history, drag-and-drop launcher ordering, and route-catalog output.

Each addition must keep the ordinary-page and no-JavaScript baseline usable.

The current showcase uses dependency-free inline SVG and CSS-drawn indicators.
It does not bundle Font Awesome. An optional icon-adapter contract can be added
later without making one icon library mandatory for PWF Core.

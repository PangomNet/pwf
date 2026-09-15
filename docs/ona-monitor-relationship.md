# PWF and ONA Monitor

Pangom Web Framework (PWF) began as the interface and framework layer inside
ONA Monitor. It is now developed as an independent open-source product, while
ONA Monitor remains both its original source application and an important
integration consumer.

This relationship is intentionally bidirectional. A useful interface idea may
first appear in ONA Monitor and later become a product-neutral PWF module. A new
PWF module may instead be developed in the standalone repository first and be
integrated into ONA later. The two products therefore do not have to expose the
same feature set at every point in time.

| Direction | How a change travels |
| --- | --- |
| ONA Monitor → standalone PWF | reusable behavior is separated from Monitor data and generalized as a documented PWF contract |
| standalone PWF → ONA Monitor | a tested PWF release or commit is adopted through the named ONA adapter |
| ONA integration only | routes, branding, application data, and deliberate Monitor differences stay inside ONA |

## Two products, not one release train

PWF and ONA Monitor have independent repositories, release schedules, and
version numbers. Neither version number implies the other.

- **PWF version** identifies the standalone framework release and follows
  Semantic Versioning.
- **ONA Monitor version** identifies the application release according to its
  own product lifecycle.
- **Embedded PWF baseline** records the exact PWF version and commit most
  recently integrated into ONA.
- **ONA integration revision** identifies Monitor-only changes made after that
  baseline, without pretending those changes already exist in standalone PWF.

A future ONA build may expose the relationship like this:

```text
ONA Monitor 0.3.x
Embedded PWF: based on 0.1.0-alpha.6 (commit 6a11ee8)
ONA integration revision: ona.1
```

The values are an example of the metadata shape, not a declaration of a current
ONA release. The full commit is the authoritative baseline when prerelease
versions or local integration patches could otherwise be ambiguous.

## Expected synchronization states

Temporary differences are normal and must be visible rather than hidden.

| State | Meaning | Required action |
| --- | --- | --- |
| aligned | ONA uses a known PWF baseline without additional framework changes | keep the baseline metadata current |
| PWF ahead | standalone PWF contains modules not yet adopted by ONA | integrate only after ONA compatibility testing |
| ONA ahead | ONA contains reusable behavior not yet generalized for PWF | extract it without ONA globals, routes, branding, or data |
| intentional divergence | behavior is specific to ONA or deliberately differs | keep it in the named ONA adapter and document the reason |

“Ahead” describes feature availability, not product quality or authority. PWF is
the source of truth for public framework contracts; ONA is the source of truth
for Monitor behavior and its embedded integration.

## Moving a feature between the products

1. Identify whether the feature is a general framework capability or an ONA
   product concern.
2. For a general capability, define the PWF contract with reader documentation,
   semantic HTML, accessibility and fallback notes, catalog metadata, and tests.
3. Move ONA-specific routes, cookies, globals, branding, regional data, and
   content behind a named adapter instead of adding them to PWF Core.
4. Integrate the tested PWF module into ONA without deleting the existing ONA
   behavior until the replacement has passed application-level checks.
5. Record the new embedded baseline and any remaining ONA integration revision.
6. When a fix originates in ONA, port the smallest reusable change back to PWF;
   when it originates in PWF, adopt it selectively in ONA.

Whole generated bundles must not be copied back and forth as the synchronization
mechanism. Changes should travel as small, reviewable modules so documentation,
licenses, schemas, and tests remain attached to the behavior they describe.

## Ownership boundary

Standalone PWF owns reusable tokens, layouts, components, themes, accessibility
contracts, shell modules, schemas, and add-ons. ONA Monitor owns its data,
content, routes, application permissions, operational configuration, brand
choices, and release policy. The ONA adapter owns the translation between those
boundaries.

PWF Standard may preserve the proven visual language that originated in ONA,
but it must not require ONA names, URLs, cookies, or runtime globals. Historical
provenance is part of the documentation; runtime coupling is not.

## Repository and wiki policy

This file is the canonical, version-controlled explanation. A GitHub Wiki page
or presentation may mirror it for discovery, but should link back here and must
not become a separate source of truth. The documentation site will render this
Markdown through PWF itself, keeping the public explanation and the exercised
framework implementation together.

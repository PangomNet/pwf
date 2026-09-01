# PWF versioning

PWF uses separate versions for separately releasable products. Numbers are not
kept artificially equal.

## PWF Core

Core follows Semantic Versioning and is the source of the version exported as
`PWF_VERSION`. `package.json` is the single source used by the build banner and
browser module.

Before `1.0.0`, PWF uses prereleases such as `0.1.0-alpha.1`. During this period,
public contracts may still change, but every change must update documentation,
schemas, examples, and migration notes. Prerelease increments identify tested
shared checkpoints:

- `alpha`: architecture and APIs are still being shaped;
- `beta`: planned feature set exists and compatibility work dominates;
- release candidate: intended public contracts are frozen pending verification;
- `1.0.0`: documented stable core and release process.

Repository tags use `v<version>`, for example `v0.1.0-alpha.1`. A normal commit
or push is not automatically a release and does not require a tag.

## Applications

Applications have their own product lifecycle. ONA Monitor therefore remains at
its current application version independently of PWF. Its future integration
metadata should display both values, for example:

```text
ONA Monitor 0.3.3
PWF 0.1.0-alpha.1
```

An application records a compatible PWF range and may add its own build identifier
or commit hash. Updating PWF does not automatically require changing the
application's major or minor version; the application version changes according
to its user-visible release policy.

## Themes and extensions

Every independently removable theme or extension has its own Semantic Version.
Its manifest also declares a `pwfVersion` compatibility range. Bundled themes may
begin with the same number as Core for convenience, but they remain independent
artifacts and can later release at a different pace.

## Schemas

`schemaVersion` is an integer inside a JSON document. It changes only when the
shape or interpretation of that document requires a new parser. It is not the
PWF package version. A PWF release may support several schema versions during a
migration window.

## Release checklist

1. choose the intended Core version in `package.json`;
2. update compatibility ranges and first-party license inventory;
3. update behavior documentation, API reference, examples, and migration notes;
4. build and run all automated and browser checks;
5. inspect generated artifacts and third-party notices;
6. commit and push the reviewed source;
7. only for an intentional release, create the matching signed or annotated tag
   and publish checksums and release notes.

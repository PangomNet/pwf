# PWF documentation system

Documentation is a release artifact and part of the compatibility contract. A
feature is incomplete until a reader can understand its purpose, observable
behavior, integration steps, and fallback without reconstructing them from code.

## Required module page

Every public module documents:

1. purpose and explicit non-goals;
2. package, CSS, JavaScript, and schema dependencies;
3. minimal semantic HTML that works before enhancement;
4. initialization, cleanup, events, and state transitions;
5. public selectors, attributes, functions, types, tokens, and schemas;
6. keyboard, focus, screen-reader, contrast, and motion behavior;
7. privacy, persistence, network, and security effects;
8. failure modes and the no-JavaScript or offline fallback;
9. theming and layout extension points;
10. a runnable example, automated tests, and migration notes.

The machine-readable catalog points to this page. Tests verify that every catalog
entry has a resolvable documentation file. Future site builds will additionally
validate headings, anchors, code samples, and cross-links.

## Content types

- **Tutorials** teach one complete outcome in a safe order.
- **How-to guides** solve a focused application task.
- **Explanation** describes design decisions and behavior.
- **Reference** lists exact public contracts without narrative ambiguity.
- **Examples** are executable and use normal links and semantic HTML.
- **Migration guides** map old markup, globals, and behavior to PWF adapters.

These types may link to each other but should not be mixed into one very long
page. A new reader gets a guided route; an experienced reader can jump directly
to reference.

## Documentation showcase as reference application

The executable site uses only public PWF capabilities. Its shell demonstrates header,
page tabs, breadcrumbs, launcher, search, layouts, settings, themes, and offline
behavior. Presentation pages use the same content and component contracts rather
than a separate slide-only design system.

The site must still work through complete page loads. Optional dynamic navigation
may enhance transitions, but every page has a stable URL, server-rendered main
content, correct title, usable browser history, printable output, and recovery by
reload.

Later site builds will generate navigation and reference indexes from the component
catalog and JSON Schemas. Authored prose remains the source for explanations and
examples; generated tables do not replace human-readable behavior descriptions.

## Review checklist

Before merging a public change, reviewers compare implementation, tests,
catalog, schema, example, and prose. Names and defaults must match. Accessibility
and fallback claims must be exercised, not merely stated. Screenshots can
illustrate appearance but never serve as the only instruction.

Before publishing, the documentation site runs the normal PWF build and tests,
checks internal links, verifies examples in a browser, and tests complete-page
navigation with JavaScript disabled or unavailable.

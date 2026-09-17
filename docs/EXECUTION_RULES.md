# ITT TOLD’EM / ITT WORLD — Execution Rules

These rules govern engineering work on ITT WORLD. They are intended to reduce duplicate work, prevent speculative rewrites, and accelerate implementation using verified existing systems and legally reusable open-source patterns.

## Rule 1 — Audit Before Build

Before implementing a requested feature, inspect the repository specifically for existing components, routes, assets, schemas, state, events, tests, and logic related to that feature.

1. Identify what already exists.
2. Classify it as working, partially working, broken, mock-only, or missing.
3. Reuse or repair functioning code before replacing it.
4. Trace the relevant dependency chain before making changes.
5. Keep the audit bounded: once enough is known to act safely, proceed immediately to implementation.
6. Do not stop at diagnosis when the repair can be executed with the available access and information.
7. After implementation, test the complete user path and verify the resulting state before claiming completion.

## Rule 2 — Proven Pattern Before Reinvention

Before building a subsystem from scratch, search for a mature open-source implementation that already solves the same or substantially similar problem.

If a suitable implementation exists and its license permits the intended use:

1. Check the license and attribution obligations first.
2. Run or inspect the original implementation enough to establish how it actually works.
3. Trace the relevant files, dependencies, data flow, state management, events, rendering, tests, and edge cases end-to-end.
4. Prefer adapting the proven working implementation over recreating solved infrastructure.
5. Preserve the engineering pattern that makes it work, then refactor naming, assets, presentation, data bindings, interaction design, and user experience into ITT architecture and ITT visual language.
6. Do not copy blindly. Remove unnecessary dependencies and integrate only what the project needs.
7. If adapting a complete subsystem is faster and safer than extracting fragments, first adapt the complete subsystem into a working isolated implementation. Verify it. Then progressively convert it to ITT style without breaking functionality.
8. Test after the functional adaptation and test again after the ITT refactor/restyle.
9. Record the upstream repository, license, exact files/patterns used, modifications, and attribution requirements in `docs/OPEN_SOURCE_PARTS_REGISTER.md`.

Execution order:

`SEARCH → LICENSE CHECK → RUN/INSPECT ORIGINAL → TRACE IMPLEMENTATION → IDENTIFY DEPENDENCIES → ADAPT WORKING VERSION → VERIFY → ITT RESTYLE/REFACTOR → VERIFY AGAIN → DOCUMENT`

Do not reinvent solved engineering problems merely to produce original-looking code. Originality belongs in ITT WORLD’s experience, design, systems integration, and improvements—not in unnecessarily rebuilding basic infrastructure.

## Combined Default

**First look inside our house. Then look outside for proven parts. Only invent what neither one already gives us.**

For every substantial implementation, report:

- What already existed
- What was reused
- What external pattern was evaluated, if any
- License status
- What changed
- How the actual user path was tested
- What remains blocked

## Current Sprint 2 Application — Product Interaction

For the store product-selection blocker, use these rules before rewriting interaction code. Audit existing product entities/zones, input handlers, hit detection/raycasting, overlays, rendering layers, product-data bindings, selection state, and touch/mouse behavior. Then evaluate proven React Three Fiber / Three.js product-selection and GLTF/GLB configurator patterns where applicable.

The target architecture must separate the persistent product and commerce identity from its visual renderer so an existing 2D product representation can later be replaced by GLB/GLTF without rewriting selection, product data, Shopify binding, information UI, or cart behavior.

Reference user path for verification:

`APPROACH PRODUCT → INTERACTION STATE → TAP/CLICK → SELECT → PRODUCT INFO → CLOSE → CONTROL RETURNS → SELECT AGAIN`

Do not mark the interaction complete until that path works repeatedly with the current representation.
# ITT TOLD'EM storefront experience ledger

## Purpose
Permanent engineering memory for the experimental storefront renderer. Do not let a future agent call source code "done" without runtime proof.

## 2026-09-23 — Vision Mode pass

Branch: `chatgpt/homepage-vision-mode-20260923`

Goal: keep Shopify HTML/commerce authoritative while allowing the same homepage objects to progressively render as PHYSICAL → SEMANTIC → ASCII → MATRIX and later WORLD.

Implemented in source:
- homepage-only Vision Mode CSS/JS
- semantic HouseNode identity for existing real homepage anchors
- scroll-driven render depth
- virtual analog joystick
- keyboard navigation
- progressive Gamepad API support
- focus bracket that follows real DOM geometry
- semantic tags
- lightweight canvas data/ASCII field
- original ITT matrix/data treatment
- reduced-motion handling
- renderer failure leaves ordinary Shopify links intact

Second-pass correction:
- joystick/keyboard depth changes now synchronize to actual page scroll instead of being overwritten by the next scroll event
- gamepad A/B actions are edge-triggered so holding a button does not repeatedly open/back every animation frame

## Known fall-short / do not repeat
The first pass stopped at source read-back and did not prove browser/mobile behavior. That is IMPLEMENTED, not PROVEN.

Required next proof:
1. Shopify Theme Check.
2. Preview theme/browser runtime.
3. Mobile touch joystick.
4. Desktop keyboard.
5. Gamepad if hardware/runtime available.
6. Menu/cart/product navigation regression.
7. Measure obvious LCP/INP/CLS regressions.
8. Screenshots/video of PHYSICAL, SEMANTIC, ASCII, MATRIX.
9. Verify selected HouseNode opens its real Shopify destination.
10. Verify JS-disabled/failure path still shops normally.

## Agent roles that should exist
- Storefront Director: prioritizes the next highest-impact customer-facing gap.
- Visual QA Agent: captures viewport evidence and compares PHYSICAL/SEMANTIC/ASCII/MATRIX.
- Commerce Guard Agent: verifies price/inventory/cart/checkout authority never migrates into renderer code.
- Input QA Agent: exercises touch, joystick, keyboard and gamepad mappings.
- Performance Agent: checks LCP/INP/CLS and renderer frame cost.
- Accessibility Agent: checks keyboard, reduced motion, focus and screen-reader-safe fallback.
- Regression Agent: validates navigation/cart/product links after every visual pass.

These agents are evaluators/workers around one authoritative storefront. They should create evidence and proposed fixes; they do not get permission to publish the live theme or mutate commerce truth.

## Proof ladder
MISSING → DESIGN → STUB → IMPLEMENTED → CONNECTED → RUNTIME TESTED → PROVEN.

# THE WORLDS FALLBACK CHAIN — trace and consolidation design (D-016)

**Status:** Trace = evidence-based (files read at branch point `0e3f463`, integration branch
`integration/storefront-shopify-truth`). Consolidation design = **PROPOSED** — not executed.
No behavior was changed by this document. Line numbers are at branch point `0e3f463` unless noted.

**Scope:** the homepage "worlds" component (`Choose a world.` / `.itt-x__worldgrid`) on the
`index` template only. The chain exists because three implementations of one component were
layered over time without any of them being removed.

---

## 1. The three layers, as they actually execute

### Layer 1 — Section CSS grid (`sections/ittoldem-home-experience.liquid`)

- Markup (L63 at branch point): `<section class="itt-x__worlds">` containing `.itt-x__worldgrid`
  with 5 link cards (LA MAISON / FLAGLINE / L'ATELIER / LE LABORATOIRE / WE HAIR; collection
  handles with `| default:` fallbacks).
- Its own CSS (the section `<style>` block; `.itt-x__worlds` / `.itt-x__worldgrid` rules, ~L21):
  a static 5-column grid with hover inversion. The section's broader motion system is CSS
  scroll-driven animations (`view-timeline`) — no JS library.
- The section's inline end-of-body script drives rain/trims and video autoplay only.
  **It never touches the worlds grid.** Layer 1 alone = a static grid under a cinematic page.

### Layer 2 — Layout override (`layout/theme.liquid`)

Loaded on `index` only, from the layout — so it applies to whatever the section renders.

- CSS (L24–48, inline `<style>` in `<head>`): `!important` restyle of `.itt-x__worlds` /
  `.itt-x__worldgrid` into a horizontal scroll-snap **carousel**: flex row, 3D `rotateY` card
  tilts (`--ry` per `nth-child`), card backgrounds (cream backdrop pseudo-element; the atelier
  daylight hero image on cards 1 and 3 — media now carried by theme settings, D-017),
  `.is-world-active` / `.is-world-left` / `.is-world-right` states, `.itt-world-progress` dots,
  responsive breakpoints at 900px / 560px. This CSS applies **with or without JavaScript**.
- Boot script (L75–79, inline, after the Layer 3 script include): runs on `DOMContentLoaded`
  and `shopify:section:load`, guarded by `rail.dataset.carouselReady`. Builds the
  `.itt-world-progress` dots after the rail, wires dot clicks to `scrollIntoView`, and tracks
  the rail's scroll position to set the active card (nearest to center). Initializes with
  card 3 active and scrolls it into center. Bails silently if the rail is missing or has
  fewer than 3 cards.

### Layer 3 — JS megaworld (`assets/itt-horizontal-parallax.js`)

Loaded on `index` only (`layout/theme.liquid` L74, `defer`).

- `boot()` runs on `DOMContentLoaded` and every `shopify:section:load`; guarded by
  `root.dataset.ittWorldReady` (L8).
- **Hard bail (L15):** requires the `.itt-x` section root AND all five blocks — hero (`.itt-x__hero`),
  commerce (`.itt-x__commerce`), atelier (`.itt-x__atelier`), process (`.itt-x__process`),
  worlds (`.itt-x__worlds`). If any is missing, `boot()` returns silently and Layers 1+2 remain
  the experience. Any JS error before this point has the same effect.
- **Harvest (L19–46):** hero and atelier panel media are read from the live section DOM
  (video or image). The SHOP / FLAGLINE / LAB panel media are three hardcoded hand-drawn CDN
  images (L31–45) — flagged under D-017 (static assets have no settings path). Panel links are
  harvested from section anchors, with string fallbacks.
- **Build (L48–99):** constructs a new `.itt-megaworld` stage — 500vh scroll length, sticky
  100svh viewport, 5 panels with HUD (brand + SHOP / SEARCH / BAG links), progress nav, meter —
  and inserts it **before the commerce section** (`shop.before(stage)`, L96). Adds
  `itt-has-megaworld` to the section root and `itt-megaworld-live` to `<body>` (L97–98).
- **Injected stylesheet (L101–145):** hides `#header-group` and the falling overlay's chrome
  (command rail, scripture chip, scroll meter, house stamp, mobile dock); dims the falling
  overlay to 20% screen blend; and — the decisive rule, L140 —
  `.itt-has-megaworld > .itt-x__hero, .itt-has-megaworld > .itt-x__worlds { display:none }`.
  Layer 1's grid and Layer 2's carousel live inside `.itt-x__worlds`, so **both are removed
  from view the moment Layer 3 boots**. Layer 2's boot script still runs against the hidden
  rail (adds dots/classes, calls `scrollIntoView` on a `display:none` card): invisible, wasted work.
- **Drive (L148–191):** two modes, chosen by media queries at runtime —
  - *Desktop* (hover-capable, >1180px, no reduced-motion): a window scroll listener maps stage
    scroll progress to `--mw-p` (track `translateX` across 500vw) and per-panel `--world-local`
    parallax; activates panels and plays/pauses their videos.
  - *Touch / reduced-motion* (`(hover:none)`, `≤1180px`, or `prefers-reduced-motion`): `draw()`
    returns early; the sticky stage becomes a **native horizontal scroll-snap rail** (injected
    CSS media queries); a scroll listener on the rail activates panels; progress buttons scroll
    the rail instead of the window.

### Not in the chain — a dormant fourth remnant

`assets/itt-worlds-stage.js` and `assets/itt-worlds-stage.css` are a fourth worlds
implementation. They are referenced by **no** layout, section, or snippet (grep-verified at
branch point) and never load. Cleanup candidates under D-020, not part of this chain.

---

## 2. Which layer wins, by condition

| Condition | What the visitor gets |
|---|---|
| Desktop, JS on, all 5 section blocks present | **Layer 3** — the 500vh scroll-driven megaworld. Layers 1+2 hidden. |
| Touch (iPad / phone), JS on | **Layer 3 in rail mode** — megaworld stage as a native scroll-snap carousel. On the priority device (iPad Safari) this *is* the experience. |
| `prefers-reduced-motion` | **Layer 3 in rail mode**, transforms disabled by its injected media query; Layer 1's CSS animations are also disabled by its own reduced-motion rules. |
| Layer 3 bails (missing block, JS error, script blocked) | **Layers 1+2** — the section grid as restyled by Layer 2's `!important` carousel CSS, with dots + active tracking from Layer 2's boot script. This is the de-facto fallback — functional, and documented nowhere until this trace. |
| No JavaScript at all | **Layer 1 markup + Layer 2 CSS** — the grid presents in Layer 2's carousel layout (the inline `<style>` needs no JS), but no dots, no active-card tracking, no centering. |

**Competing machinery (why this is a defect, not a feature):** three window scroll listeners
on the homepage; two active-card tracking systems; two progress-dot systems
(`.itt-world-progress` vs `.itt-megaworld__progress`); an `!important` arms race between
Layer 2's CSS and Layer 3's injected sheet; and Layer 3's structural dependence on the very
Layer 1 DOM it hides (it harvests media and links from it). A change to any layer can
silently alter which experience ships.

---

## 3. Consolidation design (PROPOSED — do not execute without the §4 evidence)

**Survivor: Layer 3 (megaworld)** as the single interactive worlds implementation. It is
already the real experience on desktop *and* touch, is self-contained, and already degrades
to a native rail for touch and reduced-motion.

1. **Layer 1 → static semantic fallback.** Keep the `.itt-x__worlds` markup and link grid:
   it is the no-JS / pre-JS presentation *and* Layer 3's harvest source for links (and for
   hero/atelier media). Remove its competing presentation ambitions; the plain grid CSS is
   the documented no-JS form. No markup or link changes.
2. **Layer 2 → removed.** Delete the `!important` override block and the boot script from
   `layout/theme.liquid`. Its carousel behavior is fully subsumed: interactive visitors get
   Layer 3 (rail mode on touch), no-JS visitors get the Layer 1 grid. Its progress dots and
   active tracking duplicate Layer 3's progress nav.
3. **Media provenance.** As part of the same change, eliminate Layer 3's three hardcoded panel
   images (D-017 flagged items): harvest them from the section DOM like hero/atelier, or carry
   them in settings — decided during implementation, verified in preview. The chain should
   contain zero hardcoded media when consolidation lands.
4. **State and cart safety (hard constraints).**
   - The worlds layers hold **no cart state**; cart lives in Horizon's drawer and the header
     group. Layer 3 currently hides `#header-group` and substitutes its own HUD with
     SHOP / SEARCH / BAG links (BAG → `/cart`). Consolidation must preserve an
     always-reachable cart path in every mode, and must not alter header-group rendering,
     the cart drawer markup, or checkout in any way.
   - Section order on `index` is a CI-enforced contract (`ittoldem-home-experience` +
     `ittoldem-falling-overlay`); consolidation changes neither templates nor section order.
   - The falling overlay's chrome hiding (command rail, dock, etc.) is Layer 3 behavior;
     keep it byte-for-byte in the surviving implementation.
5. **Failure posture after consolidation:** if Layer 3 fails to boot, the documented fallback
   is the Layer 1 static grid — visible, linked, shoppable. That fallback becomes a *tested*
   state (JS-disabled pass), not an accident.

## 4. Evidence required before executing §3 (preview gate)

None of §3 may be executed on this branch until all of the following exist:

- The branch is pushed and deployed to an **unpublished preview theme** (requires the
  founder's Contents: Write grant and an approved preview deploy).
- Preview passes, recorded with screenshots or recordings:
  (a) desktop Chromium + Safari — full scroll journey, panel activation, video play/pause;
  (b) **real iPad Safari** — rail mode, HUD links, cart reachable from the megaworld;
  (c) `prefers-reduced-motion` emulation; (d) JavaScript disabled (Layer 1 fallback);
  (e) theme-editor section reload (`shopify:section:load` re-boot, both guards);
  (f) cart drawer open/add from the homepage in every mode above.
- `theme-check.yml` CI green on the branch (its run status is currently UNTESTED from
  reachable evidence — D-019 adjacent).
- Founder approval of the preview, per the mission's no-deploy-without-approval rule.

*Trace and design recorded Oct 24, 2026 (Storefront Mission Phase 2/3, defect D-016).
Defect remains OPEN; the design's grade is PROPOSED under MUSE-CORE-001.*

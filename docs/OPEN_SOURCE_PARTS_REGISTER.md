# ITT WORLD — Open-Source Parts Register

This register tracks external open-source implementations evaluated or adapted for ITT WORLD. No external code should be integrated without checking its license and recording what was used.

| Subsystem | Upstream project | Status | What to study/use | License check | ITT integration notes |
|---|---|---|---|---|---|
| Core 3D interaction | pmndrs/react-three-fiber | Evaluate | Raycasting, pointer/touch events, propagation, hit objects, missed-pointer handling | Required before copying code | Candidate foundation/pattern for selectable world objects |
| Virtual store interaction | Elfoslav/3d-virtual-store | Evaluate | Walkable store, product highlighting, pickup/cart interaction, store/product structure | Required before copying code | Compare against current ITT product-selection path |
| 3D product configurator | gorhorvat/product-configurator-3d | Evaluate | GLTF/GLB loading, mesh selection, product configuration/event plumbing | Required before copying code | Candidate pattern for future image → GLB renderer migration |
| 3D commerce architecture | wistant/suburbia | Evaluate | Interactive commerce scene and separation of product data from 3D representation | Required before copying code | Study after current 2D selection blocker is fixed |
| NPC/navigation | ssethsara/react-three-npc | Later evaluation | NPC navigation, roaming/following, navmesh/physics patterns | Required before copying code | Future ITT WORLD population/NPC work |
| AI-enabled open world | YTyangtao666/mecha-world | Later evaluation | Open-world interaction, inventory/quests, optional AI/NPC architecture, offline-play separation | Required before copying code | Future Ask ITT / model-independent agent architecture |

## Required entry fields when code is actually adopted

For every adopted component or pattern, expand the entry or add a detailed section containing:

- Upstream repository and exact commit/tag
- License and attribution obligations
- Upstream files inspected
- Upstream files/code actually used, if any
- Architecture-only inspiration vs. copied/adapted code
- ITT files affected
- Dependencies introduced
- Modifications made
- Verification/tests performed
- Date integrated

## Sprint 2 priority

Open-source research is a method for solving the current blocker, not a separate side quest. Current order:

1. Audit ITT's existing product-selection implementation.
2. Evaluate the R3F event/raycast pattern and relevant virtual-store/configurator implementations.
3. Determine the root cause of current 2D selection failure.
4. Repair one product end-to-end using the smallest safe change.
5. Verify mouse/touch and repeated selection.
6. Abstract rendering so a future GLB renderer can replace the image renderer without replacing commerce/selection logic.
7. Only then expand the pattern to the remaining products.
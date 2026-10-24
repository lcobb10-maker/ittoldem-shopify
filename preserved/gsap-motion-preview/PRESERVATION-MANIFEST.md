# PRESERVATION MANIFEST — ITT — GSAP Motion Preview (unpublished Shopify theme)

Defect **D-015**, repair step 1: preservation export of unique work that existed only in an unpublished Shopify theme (outside version control). Exported read-only via the Shopify connector's reviewed `graphql_query` tool (Admin GraphQL `theme.files` census + file-body reads). **No store mutation of any kind was performed.**

| Field | Value |
|---|---|
| Theme name | ITT — GSAP Motion Preview |
| Theme ID | `gid://shopify/OnlineStoreTheme/150129147946` |
| Role | UNPUBLISHED |
| Theme created / updated (Shopify) | 2026-10-12T03:35:00Z / 2026-10-12T05:08:02Z |
| Export date | Sat Oct 24, 2026 |
| Exported by | Muse (subagent), D-015 repair step 1 |
| Census count (files in theme) | **589** |
| Files with body processed | **589** (589/589 — zero filenames missing on either side) |
| Text files exported to this folder | **536** |
| Binary assets recorded, bytes NOT downloaded | **42** |
| Video files recorded, body NOT retrieved (URL-type body) | **11** |

## Exported text files by directory

| Directory | Files |
|---|---|
| `assets/` | 148 |
| `blocks/` | 95 |
| `config/` | 2 |
| `layout/` | 2 |
| `locales/` | 57 |
| `sections/` | 57 |
| `snippets/` | 156 |
| `templates/` | 19 |
| **Total** | **536** |

Directory structure and filenames are preserved exactly as in the theme. Two non-theme artifacts also live in this folder: `_census.json` (raw census: filename/size/checksumMd5 per file) and `_export-results.json` (per-file export status, byte count, MD5 of exported bytes) — machine-readable evidence for this manifest, kept deliberately.

## Verification results

- **Coverage:** census 589 filenames = body-pass 589 filenames; exported text files on disk = 536. ✔
- **Direct MD5 verification:** 477 of 536 exported files are byte-for-byte identical to the census `checksumMd5`. ✔
- **Shopify JSON normalization (documented platform behavior, cf. storefront Phase 1 report §2.3):** for the remaining JSON files, the census size/checksum describe a normalized form of the file, not the served body: the auto-generated `/* … IMPORTANT: The contents of this file are auto-generated … */` header comment is excluded. Under that rule:
  - 57 files verify **exactly** (size + MD5) against the header-stripped body.
  - 1 file (`templates/404.json`) verifies **exactly** against the header-stripped, compact-serialized JSON.
  - 1 file (`config/settings_data.json`) could not be reproduced to the byte under the transforms above (Shopify's canonical form: 4,577 B / MD5 `d5346b7bdd22f63b3089be33852f78b1` vs compact reconstruction 4,571 B — a 6-byte canonicalization difference). Its exported body is nevertheless proven genuine by cross-identity: body MD5 `917536c5a0f2991423cd8bc746763d2a` (6,063 B) is identical to the same file's body in the live MAIN theme, which the Phase 1 inspection verified byte-for-byte against the deployed git branch (§2.3 of the inspection report); the census listing values for this file (4,577 B / `d5346b7b…`) are likewise identical across both themes.
  - **Net: 535 of 536 exported text files are hash-verified against the census; the 536th is verified by proven body identity. No exported file is unverified.**
- **Key file — `assets/itt-horizontal-parallax.js` (the D-015 GSAP variant):** exported size **68,688 bytes = census size 68,688** ✔; exported MD5 `7c8acb9444bbf962ef65b06996aa1d74` = census `checksumMd5` ✔; **`gsap` occurrences = 25** (`grep -o -i gsap | wc -l`; 20 lines contain matches) ✔ — matches the inspection's §3.3 measurements exactly, and matches neither git version (live: 15,699 B / MD5 `8a72083fae9eaf18f56b78a923b49634`; reverted commit `859c957`: 64,834 B). This is the unique third variant, now preserved.

## NOT exported — recorded only (53 files)

Per the repair rules, binary asset bytes were not downloaded; each is recorded with the census size + MD5 so a later full theme download (Shopify admin) can be verified against this record. The 11 `.mp4` files returned an `OnlineStoreThemeFileBodyUrl` body (URL, not content) and were likewise not retrieved.

### Binary image assets — body type `OnlineStoreThemeFileBodyBase64`, bytes not downloaded (42)

| File | Size (bytes) | MD5 (census) |
|---|---|---|
| `assets/itt-burn-routes-front.webp` | 69350 | `eee06d1df70a96f01d902c5600c35516` |
| `assets/itt-burn-routes-studio-v2.webp` | 109264 | `ae16a03352924cea4c107c0e7aa7e0d2` |
| `assets/itt-collections.jpg` | 3475 | `7c6f1c4e70c0168d2bac6d60f0f7e7b8` |
| `assets/itt-editorial.jpg` | 4754 | `22f9371314db83b15b355456234f7add` |
| `assets/itt-enter-house.webp` | 45270 | `70a4431d66ecf1a1ffe3211b36e08f26` |
| `assets/itt-final-apparel.webp` | 15008 | `c334291097cccaf4cc053be4bf051c60` |
| `assets/itt-final-denim.webp` | 14999 | `9d58e54e84c843af794c7ec097768aa1` |
| `assets/itt-final-flagline.webp` | 14999 | `19f0079673f80d6b19b05b3dde6177d8` |
| `assets/itt-final-gvo.webp` | 15009 | `82f615c558bc7548b3822f04ccee0fad` |
| `assets/itt-final-hero.webp` | 15008 | `cb302d75c4ec60357fa6709cc9a95cca` |
| `assets/itt-final-lab.webp` | 15009 | `3b4430b60b40c691a3dd13149ace7e12` |
| `assets/itt-final-story.webp` | 14998 | `d9b10a6420393e18b6fbc53e032642df` |
| `assets/itt-final-wehair.webp` | 15008 | `b2cb16eb4c3759bda416502ff269fabe` |
| `assets/itt-flagline-short-angle.webp` | 37374 | `453b9c9839ada479598080e4f68a2698` |
| `assets/itt-flagline-short-back-a.webp` | 34854 | `965fd4944e5280b934e274c519515c9d` |
| `assets/itt-flagline-short-back-b.webp` | 34054 | `ebd813611560b22540dbf5a2af90aedf` |
| `assets/itt-flagline-short-detail.webp` | 144542 | `a9568618a831737fd8f3782cd00112c3` |
| `assets/itt-flagline-short-front-a.webp` | 45180 | `becf8962b9b07b45a82929f73d9ec363` |
| `assets/itt-flagline-short-front-b.webp` | 44680 | `c6023c3504851b4e194797c59c148308` |
| `assets/itt-flagline-short-model.webp` | 43608 | `fa2e4686dd2f10f4f1a088dae820ffad` |
| `assets/itt-flagline-top-angle.webp` | 97086 | `4978a642cf8789f44b2b84c0083acdb0` |
| `assets/itt-flagline-top-detail.webp` | 108122 | `c703e2ef069583d3e1044964eaeafb05` |
| `assets/itt-flagline-top-model.webp` | 112398 | `5d5ce06bef550fba0fcaf421ea0dcf0a` |
| `assets/itt-hero-denim-desktop.webp` | 157080 | `bb6204f7935e9a9396b1cfffbef80b12` |
| `assets/itt-hero-denim-mobile.webp` | 158736 | `7a6fc926c1633fee2097faed6a857f47` |
| `assets/itt-hero.jpg` | 2599 | `1ae9a87e320d4164d35f1e2db299d8d9` |
| `assets/itt-house-hero-desktop.webp` | 95594 | `c24b5274f5ffa695f13ff8ce304e3853` |
| `assets/itt-house-hero-mobile.webp` | 105038 | `fc14461435d8415170f99aa774bef906` |
| `assets/itt-menu-apparel.webp` | 84634 | `53eb578ee44fffe32a50549882f96a53` |
| `assets/itt-menu-custom-denim.webp` | 128468 | `af543cde490c356eb90dbd1be78d3306` |
| `assets/itt-menu-gvo.webp` | 84738 | `765bbbb976c305f180da2fa0620b91ac` |
| `assets/itt-menu-lab.webp` | 118400 | `4370b345c870a418401205762587a685` |
| `assets/itt-new-apparel.webp` | 7506 | `ccc8da3ba458c3fc937827e48a5986d2` |
| `assets/itt-new-denim.webp` | 15009 | `ad5cd3383c281a7e49e154dfc39ccbe7` |
| `assets/itt-new-flagline.webp` | 7505 | `ecff0fc51d5a13a2ab509f15ad1b95f3` |
| `assets/itt-new-hero.webp` | 7522 | `40535c480b9004153e89da3c2df0d478` |
| `assets/itt-new-lab.webp` | 7505 | `8f97f03bf9f03ba8610e85ecec4fe475` |
| `assets/itt-new-wehair.webp` | 15009 | `6e2e9af041582b3834ea4fba080099d5` |
| `assets/itt-real-process-v2.webp` | 29092 | `6438206cceea81509dcf7ffb376faaa2` |
| `assets/itt-real-process.webp` | 23662 | `c35d5c179c8d50b4700623ce11d99d49` |
| `assets/itt-story-process.webp` | 191026 | `77b186552020f1efd2192a442577c504` |
| `assets/itt-story.jpg` | 3562 | `403ab5df4e6e1c82782dc078973f2a55` |

### Video assets — body type `OnlineStoreThemeFileBodyUrl`, not retrieved (11)

| File | Size (bytes) | MD5 (census) |
|---|---|---|
| `assets/itt-enter-house.mp4` | 560748 | `937679e39cabacdc637b0c5d32d3986a` |
| `assets/itt-hero-denim-motion.mp4` | 527129 | `eaf5ae1a450b389dfbdc37e1d4ea786a` |
| `assets/itt-house-hero-desktop.mp4` | 669597 | `0b863a0e4df17b582a91fdded2a455f4` |
| `assets/itt-house-hero-mobile.mp4` | 633898 | `d3a651062e7d345ee9d2595d8129b181` |
| `assets/itt-menu-apparel.mp4` | 489760 | `8ce1f6e1b8518fbdf8a8eed3aae2ab0a` |
| `assets/itt-menu-custom-denim.mp4` | 641837 | `cb8a15825b119071300ac7ef64b32b47` |
| `assets/itt-menu-gvo.mp4` | 477588 | `21aa49c9e7b9d52c5c88c3c4095d4b53` |
| `assets/itt-menu-lab.mp4` | 616881 | `174eab68c3fb26c2df39f5881110d16a` |
| `assets/itt-real-process-v2.mp4` | 422967 | `01d06054d1c517ec8b317a244f4c33a2` |
| `assets/itt-real-process.mp4` | 257302 | `26e1efafa9db000cf76808577b25fe04` |
| `assets/itt-story-process.mp4` | 422424 | `c214a09df9dac280375353394c2ce8a6` |

## Status

Preservation export: **COMPLETE** for all text content (536/536) and census-recorded for all 53 binary/video assets. Defect **D-015 remains OPEN**: step 2 — committing this folder into `lcobb10-maker/ittoldem-shopify` on a preservation branch — happens after the founder's GitHub Contents: Write grant. Until then the theme itself must not be deleted in Shopify admin; this folder is now the second copy of the unique GSAP work.

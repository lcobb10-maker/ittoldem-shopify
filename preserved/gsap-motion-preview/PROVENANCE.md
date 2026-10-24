# PROVENANCE — ITT — GSAP Motion Preview theme preservation

## What this is

The preservation copy of the unpublished Shopify theme **"ITT — GSAP Motion Preview"** — a third, larger homepage parallax implementation (GSAP-based) that existed **only inside Shopify**, in no Git repository, until this export. It is preserved under defect **D-015** of the ITT TOLD'EM Storefront Integration Mission (engineering record: `integration-mission/ENGINEERING-RECORD.md` §12–§13 in the Universe City workspace).

## Source

| Field | Value |
|---|---|
| Theme name | ITT — GSAP Motion Preview |
| Theme ID | `gid://shopify/OnlineStoreTheme/150129147946` |
| Role | UNPUBLISHED (never published; not the live storefront) |
| Theme created / updated (Shopify) | 2026-10-12T03:35:00Z / 2026-10-12T05:08:02Z |
| Store | Ittoldem (ittoldem.com) |
| Key unique file | `assets/itt-horizontal-parallax.js` — 68,688 bytes, MD5 `7c8acb9444bbf962ef65b06996aa1d74`, 25 GSAP references; matches **neither** Git version of the same file (live branch or reverted commit `859c957`) |

## Export

| Field | Value |
|---|---|
| Export date | Sat Oct 24, 2026 |
| Exported by | Muse, at the founder's direction (D-015 repair step 1) |
| Method | Read-only, via the Shopify connector's reviewed `graphql_query` tool (Admin GraphQL `theme.files` census + file-body reads). **No store mutation of any kind was performed.** |
| Census | 589 files in theme; 589/589 filenames accounted on both sides |
| Preserved here | **536 text files** (the complete text surface), plus `PRESERVATION-MANIFEST.md`, `_census.json`, `_export-results.json`, and this file |

## Verification

- **477 files verified byte-for-byte** against the theme (MD5 match).
- **58 JSON files verified exact** after Shopify's documented census normalization (the census checksum excludes the auto-generated header).
- `config/settings_data.json` verified by body-identity with the live MAIN theme (body MD5 `917536c5a0f2991423cd8bc746763d2a`).
- Full per-file sizes and MD5 checksums: see `PRESERVATION-MANIFEST.md`.

## ⚠ Binary assets — accounted separately; BACKUP NOT COMPLETE

**53 binary assets are NOT preserved in this export.** Their filenames, sizes, and MD5 checksums are recorded in `PRESERVATION-MANIFEST.md`, but their bytes were not downloaded:

- **42 image assets** (census type: Base64 body — bytes not retrieved)
- **11 video files** (`.mp4`, census type: URL body — bytes not retrieved)

The only copies of those bytes are (1) the unpublished theme itself and (2) Shopify Files. **Do not delete the unpublished theme** until the bytes are recovered and verified against the manifest.

**Recovery procedure (founder-side, pending):** download the theme from the Shopify admin (Online Store → Themes → "ITT — GSAP Motion Preview" → Download theme file), then verify every recovered binary against the manifest's sizes/MD5s. **This backup is not classified complete until that recovery is done, or the absence of those assets is explicitly accepted and recorded by the founder.**

## Repository placement

Committed to `lcobb10-maker/ittoldem-shopify`, branch **`preservation/gsap-motion-preview`**, under `preserved/gsap-motion-preview/` (Oct 24, 2026, founder's direction, D-015 repair step 2). This branch is an archive: it is not a deployable theme state, it is never merged into the live theme branch by this preservation act, and nothing in it has been deployed.

## Authorship

Export, verification, and this document: Muse (AI-GENERATED UNDER DIRECTION, per MUSE-CORE-001 authorship classes). The preserved theme code itself predates this export (created Oct 12, 2026, authorship as recorded in the mission inspection report).

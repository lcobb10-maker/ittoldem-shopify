# ITT TOLD'EM Shopify commerce setup

The theme is ready for native Shopify content. These store records must be completed in Shopify Admin because they are not stored in the theme repository.

## 1. Curate the homepage

In **Online Store → Themes → Customize → Home page → ITT TOLD'EM House**:

1. Choose up to eight finished, photographed products under **Verified homepage products**.
2. Keep **Animate category cards** off. The Enter the House and real-process films can remain on.
3. Replace the campaign concept under **Desktop hero image** and **Mobile hero image** when verified product photography is ready, then enable **Use selected Shopify hero images**.
4. Write literal, accurate hero image description text. Do not describe a concept image as a finished garment.

Only add the `house-pick` product tag when the brand has intentionally selected that product. The theme never invents this badge from grid position.

## 2. Build permanent collections

Create and merchandise these collections in **Products → Collections**:

- Apparel
- GVO Sport
- FLAGLINE
- Custom Denim
- WE HAIR
- The Lab

Then select them in both **ITT House Navigation** and **ITT TOLD'EM Footer**. Until selected, the theme preserves the existing search-page links as fallbacks so current navigation does not break.

## 3. Add product truth fields

Create product metafield definitions in **Settings → Custom data → Products** using namespace `custom` and these keys:

| Name | Key | Suggested type |
| --- | --- | --- |
| Materials | `materials` | Rich text |
| Fit | `fit` | Rich text |
| Care instructions | `care_instructions` | Rich text |
| Production time | `production_time` | Rich text |
| Size guide | `size_guide` | Rich text or page reference |

The product page hides empty rows automatically. Do not add generic claims to fill space; record only verified information for that product.

## 4. Upload media through Shopify

Use Shopify product media for real product images, videos, and 3D models. The product gallery already supports Shopify media. Use this order when the assets exist:

1. Front
2. On-model
3. Back
4. 45-degree angle
5. Detail
6. Short product-motion or process video

Keep incomplete or concept-only products in Draft or Unlisted status until customers can evaluate the item from real evidence.

## 5. Configure Search & Discovery

Install Shopify Search & Discovery and configure:

- Filters: availability, size, product type, collection, and price
- Synonyms: `girls flag football` / `flagline`; `custom jeans` / `engraved denim`; `gym` / `gvo`
- Product boosts for the current release
- Manual related and complementary products

Review no-result and no-click search reports after traffic accumulates.

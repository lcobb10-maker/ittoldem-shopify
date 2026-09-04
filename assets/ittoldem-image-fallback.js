(() => {
  const assetMap = {
    'itt-final-hero.webp': 'itt-new-hero.webp',
    'itt-final-apparel.webp': 'itt-new-apparel.webp',
    'itt-final-gvo.webp': 'itt-new-flagline.webp',
    'itt-final-lab.webp': 'itt-new-lab.webp',
    'itt-final-denim.webp': 'itt-new-denim.webp',
    'itt-final-story.webp': 'itt-new-hero.webp',
    'itt-final-flagline.webp': 'itt-new-flagline.webp',
    'itt-final-wehair.webp': 'itt-new-wehair.webp'
  };

  const swapToRealCampaignAsset = (img) => {
    if (!img || img.dataset.ittRealAssetApplied === 'true') return;
    const source = img.currentSrc || img.src || '';
    const oldName = Object.keys(assetMap).find((name) => source.includes(name));
    if (!oldName) return;

    img.dataset.ittRealAssetApplied = 'true';
    img.srcset = '';
    img.src = source.replace(oldName, assetMap[oldName]);
  };

  const wire = (img) => {
    if (!img) return;
    const source = img.currentSrc || img.src || '';
    if (!Object.keys(assetMap).some((name) => source.includes(name))) return;
    img.addEventListener('error', () => swapToRealCampaignAsset(img), { once: true });
    if (img.complete && img.naturalWidth === 0) swapToRealCampaignAsset(img);
  };

  const scan = (root = document) => {
    root.querySelectorAll?.('img[src*="itt-final-"]').forEach(wire);
  };

  const boot = () => {
    scan();
    setTimeout(() => scan(), 200);
    setTimeout(() => scan(), 700);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

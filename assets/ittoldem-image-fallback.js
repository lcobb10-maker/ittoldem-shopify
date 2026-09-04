(() => {
  const RAW = 'https://raw.githubusercontent.com/lcobb10-maker/ittoldem-shopify/ittoldem-commerce-pass/assets/';
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

  const applyRealAsset = (img) => {
    if (!img || img.dataset.ittRealAssetApplied === 'true') return;
    const source = img.currentSrc || img.src || '';
    const oldName = Object.keys(assetMap).find((name) => source.includes(name));
    const newName = Object.values(assetMap).find((name) => source.includes(name));
    const target = oldName ? assetMap[oldName] : newName;
    if (!target) return;

    img.dataset.ittRealAssetApplied = 'true';
    img.srcset = '';
    img.removeAttribute('sizes');
    img.src = RAW + target;
  };

  const scan = (root = document) => {
    root.querySelectorAll?.('img').forEach((img) => {
      const source = img.currentSrc || img.src || '';
      if (source.includes('itt-final-') || source.includes('itt-new-')) applyRealAsset(img);
    });
  };

  const boot = () => {
    scan();
    setTimeout(() => scan(), 100);
    setTimeout(() => scan(), 500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

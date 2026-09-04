(() => {
  const brokenSelector = 'img[src*="itt-final-"]';

  const getShopifyFallbacks = () => {
    const urls = [...document.querySelectorAll('.itt-product__image img, .product-card img, img[src*="cdn.shopify.com"]')]
      .map((img) => img.currentSrc || img.src)
      .filter((src) => src && !src.includes('itt-final-'));
    return [...new Set(urls)];
  };

  const repair = (img, index = 0) => {
    if (!img || img.dataset.ittFallbackApplied === 'true') return;
    const fallbacks = getShopifyFallbacks();
    if (!fallbacks.length) return;
    img.dataset.ittFallbackApplied = 'true';
    img.srcset = '';
    img.loading = 'eager';
    img.src = fallbacks[index % fallbacks.length];
  };

  const scan = () => {
    const broken = [...document.querySelectorAll(brokenSelector)];
    broken.forEach((img, index) => {
      const apply = () => repair(img, index);
      img.addEventListener('error', apply, { once: true });
      if (img.complete && img.naturalWidth === 0) apply();
    });
  };

  const boot = () => {
    scan();
    setTimeout(scan, 250);
    setTimeout(scan, 900);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

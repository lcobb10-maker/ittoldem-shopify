(() => {
  const RAW_BASE = 'https://raw.githubusercontent.com/lcobb10-maker/ittoldem-shopify/ittoldem-commerce-pass/assets/';

  const repair = (img) => {
    if (!img || img.dataset.ittFallbackApplied === 'true') return;
    const source = img.currentSrc || img.src || '';
    const match = source.match(/(itt-final-[a-z0-9-]+\.webp)/i);
    if (!match) return;
    img.dataset.ittFallbackApplied = 'true';
    img.srcset = '';
    img.src = RAW_BASE + match[1];
  };

  const wire = (img) => {
    if (!img || !(img.src || '').includes('itt-final-')) return;
    img.addEventListener('error', () => repair(img), { once: true });
    if (img.complete && img.naturalWidth === 0) repair(img);
  };

  const scan = (root = document) => root.querySelectorAll('img[src*="itt-final-"]').forEach(wire);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scan(), { once: true });
  } else {
    scan();
  }

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches?.('img[src*="itt-final-"]')) wire(node);
        scan(node);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();

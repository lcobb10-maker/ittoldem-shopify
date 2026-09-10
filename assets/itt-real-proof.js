(() => {
  const init = () => {
    const house = document.querySelector('.itt-house');
    if (!house || house.dataset.realProofReady === 'true') return;
    house.dataset.realProofReady = 'true';

    const processVideo = house.querySelector('.itt-story video');
    if (processVideo) {
      processVideo.setAttribute('muted', '');
      processVideo.setAttribute('playsinline', '');
      processVideo.setAttribute('loop', '');
      processVideo.setAttribute('autoplay', '');
      processVideo.preload = 'metadata';
      const source = processVideo.querySelector('source');
      if (source) {
        source.src = 'https://cdn.shopify.com/videos/c/o/v/829da22df9ae4c89ad7479a2440de5fe.mov';
        source.type = 'video/quicktime';
        processVideo.load();
        processVideo.play().catch(() => {});
      }
    }

    const anchor = house.querySelector('.itt-atelier-proof');
    if (!anchor || house.querySelector('.itt-real-proof')) return;

    const proof = document.createElement('section');
    proof.className = 'itt-real-proof';
    proof.setAttribute('data-itt-stop', 'WORN / MADE');
    proof.innerHTML = `
      <div class="itt-real-proof__head">
        <div class="itt-kicker">THE CLOTHES, IN REAL LIFE</div>
        <h2 class="itt-display">ON BODY.<br>IN HAND.</h2>
        <p>No render here. Real pieces, real texture, real fit, real hands.</p>
      </div>
      <div class="itt-real-proof__grid">
        <figure class="itt-real-proof__video-wrap">
          <video class="itt-real-proof__video" autoplay muted loop playsinline preload="metadata" aria-label="ITT TOLD'EM pants shown on body">
            <source src="https://cdn.shopify.com/videos/c/o/v/87040c4ea6db4c80927dc1f729b4444f.mov" type="video/quicktime">
          </video>
          <figcaption>FIT STUDY · WORN IN REAL LIFE</figcaption>
        </figure>
        <figure class="itt-real-proof__image-wrap">
          <img class="itt-real-proof__image" src="https://cdn.shopify.com/s/files/1/0735/1320/5802/files/IMG_3515.jpg?v=1789008514" loading="lazy" alt="ITT TOLD’EM crochet piece held up by hand">
          <figcaption>HANDWORK · CROCHET · TEXTURE</figcaption>
        </figure>
      </div>
    `;

    anchor.insertAdjacentElement('afterend', proof);

    const proofVideo = proof.querySelector('video');
    if (proofVideo) proofVideo.play().catch(() => {});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();

  document.addEventListener('shopify:section:load', init);
})();

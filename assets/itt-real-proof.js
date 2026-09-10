(() => {
  const buildVideo = (src, className, label) => {
    const video = document.createElement('video');
    video.className = className;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', label);
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/quicktime';
    video.appendChild(source);
    return video;
  };

  const init = () => {
    const house = document.querySelector('.itt-house');
    if (!house) return;

    const hero = house.querySelector('.itt-hero');
    if (hero && hero.dataset.ittHeroCorrected !== 'true') {
      hero.dataset.ittHeroCorrected = 'true';
      const title = hero.querySelector('.itt-hero__title');
      const kicker = hero.querySelector('.itt-kicker');
      const sub = hero.querySelector('.itt-hero__sub');
      const primary = hero.querySelector('.itt-btn--solid');
      const secondary = hero.querySelector('.itt-textlink');
      const script = hero.querySelector('.itt-script');
      const orbit = hero.querySelector('.itt-orbit');
      if (kicker) kicker.textContent = 'MAISON · DÉTROIT — EAST SIDE';
      if (title) title.innerHTML = 'THE HOUSE<br>BUILDS<br>ITS OWN WORLD.';
      if (sub) sub.textContent = 'Limited apparel, custom work and material experiments made to be discovered.';
      if (primary) primary.innerHTML = 'ENTER THE HOUSE <span class="itt-arrow">→</span>';
      if (secondary) secondary.innerHTML = 'VIEW THE HOUSE EDIT <span class="itt-arrow">↓</span>';
      if (script) script.innerHTML = 'We built the house.<br>Now we tell ’em.<small>JE VOUS L’AVAIS DIT.</small>';
      if (orbit) orbit.style.display = 'none';
    }

    const story = house.querySelector('.itt-story');
    if (story && story.dataset.realProcessReady !== 'true') {
      story.dataset.realProcessReady = 'true';
      const oldMedia = story.querySelector('.itt-story__media');
      const processVideo = buildVideo(
        'https://cdn.shopify.com/videos/c/o/v/829da22df9ae4c89ad7479a2440de5fe.mov',
        'itt-story__media',
        'Hands showing raised puff print texture on an ITT TOLD’EM shirt'
      );
      processVideo.dataset.ittMotion = '';
      if (oldMedia) oldMedia.replaceWith(processVideo);
      processVideo.play().catch(() => {});
    }

    const anchor = house.querySelector('.itt-atelier-proof');
    if (anchor && !house.querySelector('.itt-real-proof')) {
      const proof = document.createElement('section');
      proof.className = 'itt-real-proof';
      proof.setAttribute('data-itt-stop', 'WORN / MADE');
      proof.innerHTML = `
        <div class="itt-real-proof__head">
          <div>
            <div class="itt-kicker">THE CLOTHES, IN REAL LIFE</div>
            <h2 class="itt-display">WORN.<br>HELD.<br>MADE.</h2>
          </div>
          <p>Real garments, real texture and real handwork from the house. The campaign can be cinematic. The product has to prove itself in real life.</p>
        </div>
        <div class="itt-real-proof__grid">
          <figure class="itt-real-proof__video-wrap">
            <video class="itt-real-proof__video" autoplay muted loop playsinline preload="metadata" aria-label="ITT TOLD’EM pants shown on body">
              <source src="https://cdn.shopify.com/videos/c/o/v/87040c4ea6db4c80927dc1f729b4444f.mov" type="video/quicktime">
            </video>
            <figcaption>FIT STUDY · ON BODY</figcaption>
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
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  document.addEventListener('shopify:section:load', init);
})();

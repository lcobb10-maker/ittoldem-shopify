(() => {
  const reveal = document.querySelector('[data-itt-pull-reveal]');
  if (!reveal) return;

  const media = reveal.querySelector('video');
  const maxPull = 150;
  let startY = null;
  let progress = 0;
  let raf = null;

  const setProgress = (value) => {
    progress = Math.max(0, Math.min(1, value));
    if (raf) return;
    raf = requestAnimationFrame(() => {
      reveal.style.setProperty('--itt-pull-progress', progress.toFixed(3));
      if (media) {
        if (progress > .08 && media.paused) media.play().catch(() => {});
        if (progress === 0 && !media.paused) media.pause();
      }
      raf = null;
    });
  };

  const reset = () => {
    startY = null;
    const from = progress;
    const started = performance.now();
    const duration = 420;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - started) / duration);
      setProgress(from * (1 - ease(t)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  addEventListener('touchstart', (event) => {
    if (scrollY > 0 || event.touches.length !== 1) return;
    startY = event.touches[0].clientY;
  }, { passive: true });

  addEventListener('touchmove', (event) => {
    if (startY === null || scrollY > 0 || event.touches.length !== 1) return;
    const pull = Math.max(0, event.touches[0].clientY - startY);
    setProgress(pull / maxPull);
  }, { passive: true });

  addEventListener('touchend', reset, { passive: true });
  addEventListener('touchcancel', reset, { passive: true });

  addEventListener('mousemove', (event) => {
    if (matchMedia('(pointer: coarse)').matches || scrollY > 0 || startY !== null) return;
    if (event.clientY < 42) setProgress((42 - event.clientY) / 84);
    else if (progress > 0) setProgress(0);
  }, { passive: true });
})();
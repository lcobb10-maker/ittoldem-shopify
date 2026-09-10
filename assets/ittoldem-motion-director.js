(() => {
  const init = () => {
    if (!document.body.classList.contains('template-index')) return;
    const root = document.querySelector('.itt-house');
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = root.querySelector('.itt-hero video[data-itt-motion]');
    const categoryVideos = [...root.querySelectorAll('.itt-card video[data-itt-motion]')];
    const story = root.querySelector('.itt-story video[data-itt-motion]');

    categoryVideos.forEach((video) => {
      video.pause();
      video.removeAttribute('autoplay');
      video.preload = 'none';
      video.currentTime = 0;
    });

    if (reduceMotion) {
      hero?.pause();
      story?.pause();
      return;
    }

    if (hero) {
      hero.muted = true;
      hero.loop = true;
      hero.playsInline = true;
      hero.play().catch(() => {});
    }

    if (story) {
      story.pause();
      story.removeAttribute('autoplay');
      story.preload = 'metadata';

      const storyShell = story.closest('.itt-story');
      let userEngaged = false;

      const playStory = () => {
        userEngaged = true;
        if (hero) hero.pause();
        story.play().catch(() => {});
      };
      const pauseStory = () => {
        story.pause();
        if (hero && !document.hidden) hero.play().catch(() => {});
      };

      storyShell?.addEventListener('pointerenter', playStory, { passive: true });
      storyShell?.addEventListener('pointerleave', pauseStory, { passive: true });
      storyShell?.addEventListener('focusin', playStory);
      storyShell?.addEventListener('focusout', pauseStory);
      storyShell?.addEventListener('click', () => {
        if (story.paused) playStory(); else pauseStory();
      });

      const observer = new IntersectionObserver(([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio < 0.35 && !story.paused) pauseStory();
        if (entry.intersectionRatio > 0.7 && window.matchMedia('(hover: none)').matches && userEngaged) {
          story.play().catch(() => {});
        }
      }, { threshold: [0, .35, .7, 1] });
      observer.observe(storyShell || story);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        hero?.pause();
        story?.pause();
      } else if (!story || story.paused) {
        hero?.play().catch(() => {});
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

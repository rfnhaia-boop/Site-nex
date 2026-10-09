(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); });

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const progress = document.querySelector('.scroll-progress');
  const heroArt = document.querySelector('.hero-art');
  let ticking = false;
  const onFrame = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (scrollY < innerHeight * 1.2) heroArt.style.setProperty('--scroll-shift', `${Math.min(scrollY * .12, 95)}px`);
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }, {passive:true});
  onFrame();

  const reveals = document.querySelectorAll('.awareness-inner>div,.insight-grid>div,.section-head,.journey-scene,.journey-details article,.meeting-grid>div,.scan-grid>img,.scan-grid>div,.questions-heading,.question-list article,.blueprint-grid>div,.clarity-grid>div,.faq-grid>div,.closing-copy');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, {rootMargin:'0px 0px -8% 0px',threshold:.12});
    reveals.forEach((node, i) => {
      node.classList.add('reveal');
      if (node.closest('.journey-details')) node.style.setProperty('--reveal-delay', `${i % 3 * 90}ms`);
      observer.observe(node);
    });
  }

  if (matchMedia('(pointer:fine)').matches) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', e => {
      const box = hero.getBoundingClientRect();
      heroArt.style.setProperty('--pointer-x', `${(e.clientX - box.left - box.width / 2) * .025}px`);
      heroArt.style.setProperty('--pointer-y', `${(e.clientY - box.top - box.height / 2) * .025}px`);
    });
    hero.addEventListener('pointerleave', () => {
      heroArt.style.setProperty('--pointer-x','0px');
      heroArt.style.setProperty('--pointer-y','0px');
    });
    const panel = document.querySelector('.glass-panel');
    panel.addEventListener('pointermove', e => {
      const box = panel.getBoundingClientRect();
      panel.style.setProperty('--tilt-x', `${((e.clientY - box.top) / box.height - .5) * -3}deg`);
      panel.style.setProperty('--tilt-y', `${((e.clientX - box.left) / box.width - .5) * 3}deg`);
    });
    panel.addEventListener('pointerleave', () => {
      panel.style.setProperty('--tilt-x','0deg');
      panel.style.setProperty('--tilt-y','0deg');
    });
  }
})();

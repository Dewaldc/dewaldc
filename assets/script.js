/* ===== Ribbon Navigation (no hamburger) ===== */
(() => {
  const track = document.querySelector('.nav-track');
  const ink = document.getElementById('navInk');
  const leftBtn = document.getElementById('navArrowLeft');
  const rightBtn = document.getElementById('navArrowRight');
  if (!track) return;

  // Auto-mark current page
  try {
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const currentLink = track.querySelector(`a[href="${current}"]`);
    if (currentLink) currentLink.setAttribute('aria-current','page');
  } catch(e){ /* noop for local files */ }

  const activePill = () =>
    track.querySelector('.nav-pill[aria-current="page"]') || track.querySelector('.nav-pill');

  const moveInk = () => {
    const active = activePill();
    if (!active || !ink) return;
    const left = active.offsetLeft - track.scrollLeft;
    ink.style.left = `${left}px`;
    ink.style.width = `${active.offsetWidth}px`;
  };

  const updateArrows = () => {
    if (!leftBtn || !rightBtn) return;
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    leftBtn.hidden = atStart; rightBtn.hidden = atEnd;
    leftBtn.disabled = atStart; rightBtn.disabled = atEnd;
  };

  // Click to set active & center the pill
  track.addEventListener('click', (e) => {
    const pill = e.target.closest('.nav-pill');
    if (!pill) return;
    track.querySelectorAll('.nav-pill[aria-current="page"]').forEach(a => a.removeAttribute('aria-current'));
    pill.setAttribute('aria-current','page');
    track.scrollTo({ left: pill.offsetLeft - (track.clientWidth - pill.clientWidth)/2, behavior: 'smooth' });
    moveInk();
  });

  // Scroll buttons
  [leftBtn, rightBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const dir = btn === rightBtn ? 1 : -1;
      track.scrollBy({ left: dir * Math.round(track.clientWidth * 0.75), behavior: 'smooth' });
    });
  });

  // Update on scroll/resize
  track.addEventListener('scroll', () => { moveInk(); updateArrows(); }, { passive: true });
  window.addEventListener('resize', () => { moveInk(); updateArrows(); });

  // Keyboard nav within ribbon
  track.addEventListener('keydown', (e) => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    const pills = [...track.querySelectorAll('.nav-pill')];
    const i = pills.indexOf(document.activeElement);
    let next = i < 0 ? 0 : i;
    if (e.key === 'ArrowRight') next = Math.min(pills.length-1, i+1);
    if (e.key === 'ArrowLeft')  next = Math.max(0, i-1);
    if (e.key === 'Home')       next = 0;
    if (e.key === 'End')        next = pills.length-1;
    if (pills[next]) { pills[next].focus(); pills[next].click(); }
  });

  // Initialize
  moveInk(); updateArrows();
})();

/* ===== Scroll-triggered fade-in (reveal once) ===== */
(() => {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  els.forEach(el => io.observe(el));
})();

/* ===== Quick-links banner rotator (respects reduced motion) ===== */
(() => {
  const rotator = document.getElementById('quick-rotator');
  if (!rotator) return;
  const items = Array.from(rotator.querySelectorAll('.rotator-item'));
  if (items.length <= 1) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let idx = 0;
  items[0].classList.add('is-active');
  if (reduce) return;

  setInterval(() => {
    items[idx].classList.remove('is-active');
    idx = (idx + 1) % items.length;
    items[idx].classList.add('is-active');
  }, 3000);
})();
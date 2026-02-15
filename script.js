// Hamburger-only navigation (desktop + mobile)
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primary-nav');
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  });
  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
  });
  // Close when a nav link is clicked
  primaryNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });
}

// ===== Scroll-triggered fade-in (reveal-once) =====
(() => {
  const revealEls = document.querySelectorAll('.fade-in');
  if (!revealEls.length) return;

  // Fallback for older browsers: show everything immediately
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });

  revealEls.forEach(el => io.observe(el));
})();

// ===== Quick-links banner rotator =====
(() => {
  const rotator = document.getElementById('quick-rotator');
  if (!rotator) return;
  const items = Array.from(rotator.querySelectorAll('.rotator-item'));
  if (items.length <= 1) return;

  let idx = 0;
  setInterval(() => {
    items[idx].classList.remove('is-active');
    idx = (idx + 1) % items.length;
    items[idx].classList.add('is-active');
  }, 3000);
})();
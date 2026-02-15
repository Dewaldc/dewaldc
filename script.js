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
// Reveals any element with .fade-in when ~15% visible, then unobserves it
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
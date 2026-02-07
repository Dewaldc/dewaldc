// Toggle .nav-open on <body> and sync ARIA
(function () {
  const toggle = document.getElementById('navToggle');
  const body = document.body;
  const nav = document.getElementById('primary-nav');

  if (!toggle || !nav) return;

  const closeMenu = () => {
    body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  const openMenu = () => {
    body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  };

  toggle.addEventListener('click', () => {
    body.classList.contains('nav-open') ? closeMenu() : openMenu();
  });

  // Close when a nav link is clicked (mobile)
  nav.addEventListener('click', (e) => {
    const isLink = e.target.closest('a');
    if (isLink && window.matchMedia('(max-width: 900px)').matches) {
      closeMenu();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Ensure correct state on resize
  let lastIsMobile = window.matchMedia('(max-width: 900px)').matches;
  window.addEventListener('resize', () => {
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (!isMobile && lastIsMobile) closeMenu();
    lastIsMobile = isMobile;
  });
})();

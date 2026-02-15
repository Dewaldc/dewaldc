// ===== KUHOLI / OMNIASSIST - Global site script =====

// 1) Client-side include for /components/*.html (nav, footer, etc.)
// Works on root pages and /blog/* by auto-adjusting the prefix.
(async function includePartials() {
  try {
    const path = location.pathname.replace(/\/$/, ''); // drop trailing slash
    const depth = (path.match(/\//g) || []).length;     // "/" -> 1, "/blog/post.html" -> 2
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';

    const slots = document.querySelectorAll('[data-include]');
    for (const el of slots) {
      const rel = el.getAttribute('data-include');
      const url = prefix + rel;
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        el.innerHTML = await res.text();
      } catch (err) {
        console.error('Include failed:', url, err);
      }
    }
  } catch (err) {
    console.error('includePartials error:', err);
  }
})();

// 2) Mobile nav toggle (requires a button with [data-nav-toggle])
(function wireNavToggle() {
  function ready(fn){ /complete|interactive/.test(document.readyState)?fn():document.addEventListener('DOMContentLoaded',fn); }
  ready(() => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu   = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const open = menu.getAttribute('data-open') === 'true';
      menu.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      document.body.classList.toggle('nav-open', !open);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menu.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  });
})();

// 3) Helper: defer image loading if needed (example, safe to keep)
(function lazyImages(){
  if (!('loading' in HTMLImageElement.prototype)) return;
  document.querySelectorAll('img[loading="lazy"][data-src]').forEach(img=>{
    img.src = img.dataset.src;
  });
})();
``
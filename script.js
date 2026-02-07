// Hamburger toggle
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primary-nav");

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && primaryNav.classList.contains("open")) {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }
  });

  // Close after clicking any link
  primaryNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    });
  });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

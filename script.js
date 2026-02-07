// Mobile menu toggle
const navToggle = document.getElementById("navToggle");
const body = document.body;

if (navToggle) {
  navToggle.addEventListener("click", () => {
    body.classList.toggle("nav-open");
  });
}

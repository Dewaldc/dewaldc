document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-include]").forEach(async el => {
        const file = el.getAttribute("data-include");
        if (!file) return;

        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Unable to load ${file}`);
            const html = await response.text();
            el.innerHTML = html;
        } catch (e) {
            console.error("Include error:", e);
            el.innerHTML = `<!-- Error loading ${file} -->`;
        }
    });
});
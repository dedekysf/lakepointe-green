/* Hero carousels: auto-advancing slideshow with dots, arrows, counter and pause. */
(() => {
  const { $$, swap, esc } = LPG;
  $$(document, "[data-carousel]").forEach((box) => {
    const section = box.closest("section");
    // Rebuild slides 2..n from the slide list (only the first is server-rendered).
    const list = JSON.parse(box.dataset.slides || "[]");
    const first = box.querySelector("[data-slide]");
    if (first) list.slice(box.querySelectorAll("[data-slide]").length).forEach((s) => {
      const img = first.cloneNode();
      img.src = s.src;
      img.dataset.alt = s.alt;
      img.dataset.photoId = s.id;
      img.style.objectPosition = s.position || "";
      img.style.opacity = "0";
      box.appendChild(img);
    });
    const slides = $$(box, "[data-slide]");
    if (slides.length < 2) return;
    const dots = $$(section, "[data-carousel-dot]");
    const countEl = section.querySelector("[data-carousel-count]");
    const pauseBtn = section.querySelector("[data-carousel-pause]");
    const controls = section.querySelector("[data-carousel-controls]");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interval = Number(box.dataset.interval) || 6500;
    let i = 0, paused = false, hover = false, timer = null;
    const pad = (n) => String(n).padStart(2, "0");
    function schedule() {
      clearTimeout(timer);
      if (!paused && !hover && !reduced) timer = setTimeout(() => set(i + 1), interval);
    }
    function set(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((img, k) => {
        const on = k === i;
        img.style.opacity = on ? "1" : "0";
        img.style.transform = on ? "scale(1)" : "scale(1.06)";
        img.alt = on ? img.dataset.alt || "" : "";
        if (on) img.removeAttribute("aria-hidden"); else img.setAttribute("aria-hidden", "true");
      });
      dots.forEach((d, k) => {
        const on = k === i;
        if (on) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        const bar = d.querySelector("span");
        bar.style.width = on ? "40px" : "18px";
        bar.style.opacity = on ? "1" : "0.45";
      });
      if (countEl) countEl.textContent = pad(i + 1) + " / " + pad(slides.length);
      schedule();
    }
    dots.forEach((d) => d.addEventListener("click", () => set(Number(d.dataset.carouselDot))));
    section.querySelector("[data-carousel-prev]")?.addEventListener("click", () => set(i - 1));
    section.querySelector("[data-carousel-next]")?.addEventListener("click", () => set(i + 1));
    pauseBtn?.addEventListener("click", () => {
      paused = !paused;
      pauseBtn.setAttribute("aria-pressed", String(paused));
      pauseBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
      pauseBtn.querySelector("[data-carousel-pause-icon]").textContent = paused ? "▶" : "❚❚";
      schedule();
    });
    controls?.addEventListener("mouseenter", () => { hover = true; schedule(); });
    controls?.addEventListener("mouseleave", () => { hover = false; schedule(); });
    set(0);
  });
})();

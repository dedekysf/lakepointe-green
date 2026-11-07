/* Gallery on /find-your-home/: category filters, grid, "view all" opens the lightbox. */
(() => {
  const { $$, swap, esc } = LPG;
  const { GALLERY, GRID_LIMIT } = LPG;
  const gal = document.getElementById("gallery");
  if (gal) {
    const filters = $$(gal, '[role="group"] button');
    const count = gal.querySelector("p[aria-live]");
    const ul = gal.querySelector("ul");
    const viewAll = $$(gal, "button").find((b) => /VIEW ALL/i.test(b.textContent));
    let f = "all", first = true;
    const items = () => (f === "all" ? GALLERY : GALLERY.filter((g) => g.category.toLowerCase() === f)).map((g) => ({ src: g.path, alt: g.alt }));
    const render = () => {
      const list = items();
      // the count is only announced to screen readers (sr-only); sighted visitors see just "View all N photos", and only when there is more than the grid shows
      if (count) count.textContent = list.length + " photos";
      ul.innerHTML = list.slice(0, GRID_LIMIT).map((g, i) =>
        '<li class="' + (i === 0 ? "col-span-2 row-span-2" : "") + '"><button type="button" data-g="' + i + '" aria-label="' + esc(g.alt) +
        '" class="group relative block h-full w-full overflow-hidden rounded-sm" style="position:relative;display:block;width:100%;height:100%;overflow:hidden"><img alt="" src="' + g.src +
        '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></button></li>').join("");
      // "View all" only when the grid is not already showing every photo of the filter
      if (viewAll) {
        viewAll.textContent = "VIEW ALL " + list.length + " PHOTOS →";
        viewAll.style.display = list.length > GRID_LIMIT ? "" : "none";
      }
      if (!first) { ul.classList.remove("lpg-fade"); void ul.offsetWidth; ul.classList.add("lpg-fade"); }
      first = false;
      filters.forEach((b) => {
        const on = b.textContent.trim().toLowerCase() === f;
        b.setAttribute("aria-pressed", String(on));
        swap(b, on, ["border-copper", "text-ink"], ["border-transparent", "text-muted", "hover:text-ink"]);
      });
    };
    filters.forEach((b) => b.addEventListener("click", () => { f = b.textContent.trim().toLowerCase(); render(); }));
    ul.addEventListener("click", (e) => { const b = e.target.closest("[data-g]"); if (b) LPG.openLightbox(items(), Number(b.dataset.g)); });
    if (viewAll) viewAll.addEventListener("click", () => LPG.openLightbox(items(), 0));
    render();
  }
})();

/* Gallery on /find-your-home/: category filters, grid, "view all" opens the lightbox.
   Below 1280px (tablet and phone) only the first KEEP filters stay visible; the rest move into a "More" menu so the row never gets crowded.
   When a filter from the menu is active, the More button shows its name and carries the underline. */
(() => {
  const { $$, swap, esc } = LPG;
  const { GALLERY, GRID_LIMIT } = LPG;
  const KEEP = 2;
  const gal = document.getElementById("gallery");
  if (gal) {
    const group = gal.querySelector('[role="group"]');
    const filters = $$(gal, '[role="group"] button');
    const count = gal.querySelector("p[aria-live]");
    const ul = gal.querySelector("ul");
    const viewAll = $$(gal, "button").find((b) => /VIEW ALL/i.test(b.textContent));
    let f = "all", first = true;
    const name = (b) => b.textContent.trim().toLowerCase();

    // "More" menu for the filters beyond KEEP (visible below 1280px only, see .lpg-more in components.css)
    const extra = filters.slice(KEEP);
    let moreWrap = null, moreBtn = null, moreLabel = null, menu = null, menuBtns = [];
    if (extra.length) {
      extra.forEach((b) => b.classList.add("lpg-gal-extra"));
      moreWrap = document.createElement("div");
      moreWrap.className = "lpg-more";
      moreWrap.innerHTML =
        '<button type="button" class="lpg-more-btn" aria-haspopup="true" aria-expanded="false" aria-controls="gallery-more-menu"><span data-more-label>MORE</span>' +
        '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"></path></svg></button>' +
        '<div id="gallery-more-menu" class="lpg-more-menu" hidden>' +
        extra.map((b) => '<button type="button" data-f="' + esc(name(b)) + '" aria-pressed="false">' + esc(b.textContent.trim()) + "</button>").join("") +
        "</div>";
      group.appendChild(moreWrap);
      moreBtn = moreWrap.querySelector(".lpg-more-btn");
      moreLabel = moreWrap.querySelector("[data-more-label]");
      menu = moreWrap.querySelector(".lpg-more-menu");
      menuBtns = $$(menu, "button");
    }
    const closeMenu = (refocus) => {
      if (!menu || menu.hidden) return;
      menu.hidden = true;
      moreBtn.setAttribute("aria-expanded", "false");
      if (refocus) moreBtn.focus();
    };
    if (moreBtn) {
      moreBtn.addEventListener("click", () => {
        const open = menu.hidden;
        menu.hidden = !open;
        moreBtn.setAttribute("aria-expanded", String(open));
        if (open) (menuBtns.find((b) => b.getAttribute("aria-pressed") === "true") || menuBtns[0]).focus();
      });
      menuBtns.forEach((b) => b.addEventListener("click", () => { f = b.dataset.f; render(); closeMenu(true); }));
      document.addEventListener("click", (e) => { if (!moreWrap.contains(e.target)) closeMenu(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(true); });
      menu.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const i = menuBtns.indexOf(document.activeElement);
        if (i < 0) return;
        e.preventDefault();
        menuBtns[(i + (e.key === "ArrowDown" ? 1 : -1) + menuBtns.length) % menuBtns.length].focus();
      });
      matchMedia("(min-width: 1280px)").addEventListener("change", (e) => { if (e.matches) closeMenu(false); });
    }

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
        const on = name(b) === f;
        b.setAttribute("aria-pressed", String(on));
        swap(b, on, ["border-copper", "text-ink"], ["border-transparent", "text-muted", "hover:text-ink"]);
      });
      if (moreBtn) {
        const active = extra.find((b) => name(b) === f);
        moreBtn.setAttribute("aria-pressed", String(!!active));
        moreLabel.textContent = active ? active.textContent.trim() : "MORE";
        menuBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
      }
    };
    filters.forEach((b) => b.addEventListener("click", () => { f = name(b); render(); }));
    ul.addEventListener("click", (e) => { const b = e.target.closest("[data-g]"); if (b) LPG.openLightbox(items(), Number(b.dataset.g)); });
    if (viewAll) viewAll.addEventListener("click", () => LPG.openLightbox(items(), 0));
    render();
  }
})();

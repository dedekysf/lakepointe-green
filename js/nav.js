/* Header: solid vs. transparent overlay on scroll, active link, mobile menu, in-page anchors. */
(() => {
  const { $$, swap } = LPG;
  const page = document.querySelector(".lpg-page");
  const solid = document.getElementById("lpg-solid-header");
  const path = location.pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");

  // Active nav link (desktop gets the underline, both get aria-current)
  $$(solid, "nav a[href^='/']").forEach((a) => {
    const on = a.getAttribute("href").split("#")[0] === path;
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    if (a.closest("#mobile-nav")) return;
    swap(a, on, ["after:scale-x-100", "text-ink"], ["after:scale-x-0", "hover:after:scale-x-100", "text-ink/70", "hover:text-ink"]);
  });

  LPG.closeMenus = () => {
    $$(document, "#mobile-nav").forEach((n) => { n.classList.add("hidden"); n.classList.remove("block"); });
    $$(document, 'button[aria-controls="mobile-nav"]').forEach((b) => b.setAttribute("aria-expanded", "false"));
  };

  // Home and Find Your Home: the header over the hero is the only header. Scrolling past 24px adds .is-solid and CSS
  // transitions it into the solid sticky bar (same height, see .lpg-hdr in components.css). Other pages use #lpg-solid-header.
  const heroHdr = page.dataset.overlay === "true" ? page.querySelector("header.lpg-hdr") : null;
  if (heroHdr) {
    solid.hidden = true;
    heroHdr.querySelectorAll("nav a[href^='/']").forEach((a) => {
      const on = a.getAttribute("href").split("#")[0] === path;
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    let solidNow = null;
    const onScroll = () => {
      const s = scrollY > 24;
      if (s === solidNow) return;
      solidNow = s;
      heroHdr.classList.toggle("is-solid", s);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    // transitions only after the first paint, so a page reloaded mid-scroll does not animate on load
    requestAnimationFrame(() => requestAnimationFrame(() => heroHdr.classList.add("lpg-hdr-ready")));
  }

  addEventListener("keydown", (e) => { if (e.key === "Escape") LPG.closeMenus(); });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("button[aria-controls='mobile-nav']");
    if (b) {
      // phones get the full-screen menu (js/mobile-menu.js); wider screens keep the dropdown
      if (LPG.isPhone && LPG.isPhone()) { LPG.openMobileMenu(b); return; }
      const nav = b.closest("header").querySelector("#mobile-nav");
      const open = nav.classList.contains("hidden");
      swap(nav, open, ["block"], ["hidden"]);
      b.setAttribute("aria-expanded", String(open));
      return;
    }
    // Same-page "#contact" links jump to the form and focus its first field
    const a = e.target.closest("a[href='#contact']");
    if (a) {
      const el = document.getElementById("contact");
      if (el) { e.preventDefault(); LPG.scrollToEl(el); el.querySelector("input")?.focus({ preventScroll: true }); }
    }
  });
  LPG.closeMenus();
})();

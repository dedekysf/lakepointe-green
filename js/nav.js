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

  // Overlay pages show the transparent header over the hero until the visitor scrolls
  function onScroll() {
    const s = page.dataset.overlay !== "true" || scrollY > 24;
    solid.style.display = s ? "" : "none";
    const oh = page.querySelector("header");
    if (oh) oh.style.display = s ? "none" : "";
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  addEventListener("keydown", (e) => { if (e.key === "Escape") LPG.closeMenus(); });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("button[aria-controls='mobile-nav']");
    if (b) {
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
      if (el) { e.preventDefault(); el.scrollIntoView(); el.querySelector("input")?.focus({ preventScroll: true }); }
    }
  });
  LPG.closeMenus();
})();

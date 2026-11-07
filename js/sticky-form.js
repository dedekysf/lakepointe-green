/* Contact page, desktop: the form card stays in view while the long left column scrolls, and stops at the bottom of the section.
   CSS does the sticking (lg:sticky on [data-sticky-form]). This script only sets how far from the top it sticks:
   normally just below the header; if the card is taller than the window it gets a negative offset, so the page scrolls through the
   card first and the card then holds with its bottom edge in view (nothing is ever cut off). Re-measured when the tab changes,
   the form grows (validation messages) or the window is resized. */
(() => {
  const card = document.querySelector("[data-sticky-form]");
  if (!card) return;
  const HEADER = 72;   // solid header height
  const GAP = 24;      // breathing room under the header and above the window bottom
  const wide = matchMedia("(min-width: 1024px)");

  function place() {
    if (!wide.matches) { card.style.top = ""; return; }
    const room = innerHeight - card.offsetHeight - GAP;
    card.style.top = Math.min(HEADER + GAP, room) + "px";
  }

  if ("ResizeObserver" in window) new ResizeObserver(place).observe(card);
  addEventListener("resize", place);
  wide.addEventListener("change", place);
  place();
})();

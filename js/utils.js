/* Tiny DOM helpers shared by the other scripts. */
window.LPG = window.LPG || {};
LPG.$$ = (root, sel) => [...root.querySelectorAll(sel)];
// Replace one set of classes with another: swap(el, isOn, onClasses, offClasses)
LPG.swap = (el, on, onCls, offCls) => { offCls.concat(onCls).forEach((c) => el.classList.remove(c)); (on ? onCls : offCls).forEach((c) => el.classList.add(c)); };
LPG.esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
// Scroll to an element: through Lenis (smooth) when it is running, otherwise the browser's own jump.
// Anchors must clear the fixed 72px header.
LPG.ANCHOR_OFFSET = 72;
LPG.scrollToEl = (el) => {
  if (window.__lenis) window.__lenis.scrollTo(Math.max(0, el.getBoundingClientRect().top + scrollY - LPG.ANCHOR_OFFSET));
  else el.scrollIntoView();
};

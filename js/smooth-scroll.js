// Smooth scrolling with Lenis (same settings as Intown). Lenis is loaded from the CDN right before this file.
// - Same-page anchor links ("#contact", "/find-your-home/#site-plan" while on that page) glide to the target, clearing the fixed header.
// - Pauses while something locks the page (lightbox sets body overflow hidden) and resumes after.
// - Skipped entirely for visitors who prefer reduced motion (LPG.scrollToEl then falls back to a plain jump).
(function () {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lenis = new Lenis({
    duration: 2,
    easing: function (t) { return 1 - Math.pow(1 - t, 4); },
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
    lerp: 0.06,
    allowNestedScroll: true,
    autoRaf: true,
  });
  window.__lenis = lenis;

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return; // already handled (e.g. the #contact link in nav.js)
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.target === '_blank') return;
    var url = new URL(a.getAttribute('href'), location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    LPG.scrollToEl(target);
  });

  new MutationObserver(function () {
    if (document.body.style.overflow === 'hidden') lenis.stop(); else lenis.start();
  }).observe(document.body, { attributes: true, attributeFilter: ['style'] });
})();

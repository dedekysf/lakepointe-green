// Section-by-section content reveal (same feel as Intown): text fades in and rises, photos only fade in,
// one block after another (stagger), as each section enters the viewport.
//
// Targets, per <section>:
//   1. anything marked [data-reveal] (optional data-reveal-delay="ms");
//   2. otherwise the section's content blocks are picked automatically: the children of the first element
//      that has more than one child, and the cards inside grids (grids with 3+ items stagger card by card).
//   Opt out with [data-reveal-skip] on a section or element. Hero carousels are always skipped (they have their own entrance).
// Content is in the HTML and only hidden once this script runs, so crawlers and no-JS visitors see everything.
// Uses the CSS `translate` property, so it never fights hover transforms.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return; // everything simply stays visible

  function init() {
    var root = getComputedStyle(document.documentElement);
    var STAGGER = parseFloat(root.getPropertyValue('--reveal-stagger')) || 100;
    var MAX_DELAY = 500;
    var MEDIA = 'img, picture, video';

    function skip(el) {
      if (!el || el.nodeType !== 1 || el.hasAttribute('data-reveal-skip')) return true;
      if (/^(SCRIPT|STYLE|TEMPLATE|BR)$/.test(el.tagName)) return true;
      var cs = getComputedStyle(el);
      return cs.position === 'absolute' || cs.position === 'fixed' || cs.display === 'none' || el.getClientRects().length === 0;
    }
    function isGrid(el) { var d = getComputedStyle(el).display; return (d === 'grid' || d === 'inline-grid') && el.children.length >= 3; }

    function targetsFor(section) {
      var explicit = [].slice.call(section.querySelectorAll('[data-reveal]'));
      if (explicit.length) return explicit.map(function (el) { return { el: el, delay: parseInt(el.getAttribute('data-reveal-delay'), 10) || 0 }; });
      var box = section;
      while (box.children.length === 1 && !isGrid(box.children[0])) box = box.children[0];
      var out = [], i = 0;
      [].slice.call(box.children).forEach(function (child) {
        if (skip(child)) return;
        if (isGrid(child)) {
          [].slice.call(child.children).forEach(function (card) { if (!skip(card)) out.push({ el: card, delay: Math.min(i++ * STAGGER, MAX_DELAY) }); });
        } else {
          out.push({ el: child, delay: Math.min(i++ * STAGGER, MAX_DELAY) });
        }
      });
      return out;
    }

    // Text rises, images only fade: a block that holds photos is split into its photo(s) (fade) and its text (fade + rise),
    // all sharing the block's delay so a card still appears as one unit.
    function isMedia(el) { return el.matches(MEDIA) || (el.querySelector(MEDIA) && !el.textContent.trim()); }
    function expand(el, delay, out, depth) {
      if (isMedia(el)) { out.push({ el: el, delay: delay, fade: true }); return; }
      if (!el.querySelector(MEDIA) || depth > 4) { out.push({ el: el, delay: delay }); return; }
      [].slice.call(el.children).forEach(function (child) {
        if (isMedia(child)) { expand(child, delay, out, depth + 1); return; }
        if (skip(child)) return;
        expand(child, delay, out, depth + 1);
      });
    }

    var sections = [].slice.call(document.querySelectorAll('.lpg-page section')).filter(function (s) {
      return !s.hasAttribute('data-reveal-skip') && !s.querySelector('[data-carousel]') && !s.parentElement.closest('section');
    });
    var items = [];
    sections.forEach(function (s) { targetsFor(s).forEach(function (t) { expand(t.el, t.delay, items, 0); }); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var delay = parseInt(el.getAttribute('data-reveal-delay-run'), 10) || 0;
        setTimeout(function () {
          el.classList.add('reveal-anim');
          el.classList.remove('reveal-hidden');
          // hand the element back to its own transitions (hover etc.) once the reveal has played
          setTimeout(function () { el.classList.remove('reveal-anim'); }, 700);
        }, delay);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (t) {
      t.el.setAttribute('data-reveal-delay-run', String(t.delay));
      t.el.classList.add('reveal-hidden');
      if (t.fade) t.el.classList.add('reveal-fade-only');
      io.observe(t.el);
    });
  }
  // wait a frame so the Tailwind CDN has applied its styles (the grid/position checks above read computed styles)
  requestAnimationFrame(function () { requestAnimationFrame(init); });
})();

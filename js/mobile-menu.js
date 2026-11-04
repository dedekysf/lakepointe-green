/* Mobile menu (phones, < 768px): a full-screen overlay like Intown's. It is built from the header's #mobile-nav links,
   so the menu items live in one place. From 768px the same burger opens the dropdown (#mobile-nav) instead (see nav.js).
   Overlay: logo + close button where the header sits, big serif links, Schedule a Tour + Call pinned to the bottom.
   Locks page scroll while open (Lenis pauses through the body overflow check in smooth-scroll.js), Esc / link / close button closes. */
(() => {
  const phone = matchMedia("(max-width: 767px)");
  LPG.isPhone = () => phone.matches;
  let menu = null;

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  function close() {
    if (!menu) return;
    const m = menu; menu = null;
    document.removeEventListener("keydown", m._onKey, true);
    document.body.style.overflow = m._prevOverflow || "";
    m.remove();
    if (m._opener) { m._opener.setAttribute("aria-expanded", "false"); m._opener.focus(); }
  }

  function open(opener) {
    close();
    const src = opener.closest("header").querySelector("#mobile-nav");
    const items = [...src.querySelectorAll("ul > li:not(:last-child) > a")];
    const [tour, call] = [...src.querySelectorAll("ul > li:last-child > a")];
    const logo = opener.closest("header").querySelector("svg[role='img']");
    const logoHtml = logo ? logo.outerHTML.replace(/<g fill="[^"]*"/g, '<g fill="currentColor"') : "";

    // Match the header that is on screen (72px solid, or the 96px transparent one over a hero) so the logo and the
    // close button sit exactly where the logo and the burger were: same row height, logo height and button box.
    const hdr = opener.closest("header");
    const row = hdr.firstElementChild.getBoundingClientRect();
    const ob = opener.getBoundingClientRect();

    const m = document.createElement("div");
    m.className = "lpg-menu";
    m.style.setProperty("--menu-bar-h", row.height + "px");
    m.style.setProperty("--menu-logo-h", (logo ? logo.getBoundingClientRect().height : 34) + "px");
    m.style.setProperty("--menu-btn-w", ob.width + "px");
    m.style.setProperty("--menu-btn-h", ob.height + "px");
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.setAttribute("aria-label", "Menu");
    m.innerHTML =
      '<div class="lpg-menu__bar">' +
        '<a href="/" class="lpg-menu__logo" aria-label="Lake Pointe Green home">' + logoHtml + "</a>" +
        '<button type="button" class="lpg-menu__close" aria-label="Close menu"><svg data-icon="close" width="26" height="26" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M249-201.26 201.26-249l231-231-231-231L249-758.74l231 231 231-231L758.74-711l-231 231 231 231L711-201.26l-231-231-231 231Z"/></svg></button>' +
      "</div>" +
      "<nav aria-label=\"Main\">" +
        items.map((a) => '<a href="' + esc(a.getAttribute("href")) + '" class="lpg-menu__link"' + (a.getAttribute("aria-current") ? ' aria-current="page"' : "") + ">" + esc(a.textContent.trim()) + "</a>").join("") +
      "</nav>" +
      '<div class="lpg-menu__cta">' +
        (tour ? '<a href="' + esc(tour.getAttribute("href")) + '" class="lpg-menu__btn lpg-menu__btn--filled">' + esc(tour.textContent.trim()) + "</a>" : "") +
        (call ? '<a href="' + esc(call.getAttribute("href")) + '" class="lpg-menu__btn lpg-menu__btn--outline">' + call.innerHTML + "</a>" : "") +
      "</div>";

    m.addEventListener("click", (e) => { if (e.target.closest("a") || e.target.closest(".lpg-menu__close")) close(); });
    m._opener = opener;
    m._prevOverflow = document.body.style.overflow;
    m._onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", m._onKey, true);
    document.body.style.overflow = "hidden";
    document.body.appendChild(m);
    opener.setAttribute("aria-expanded", "true");
    menu = m;
    m.querySelector(".lpg-menu__close").focus();
  }

  LPG.openMobileMenu = open;
  LPG.closeMobileMenu = close;
  // rotating a phone / resizing past the breakpoint: the dropdown takes over
  phone.addEventListener("change", (e) => { if (!e.matches) close(); });
})();

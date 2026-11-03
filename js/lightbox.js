/* Photo viewer (lightbox) shared by the gallery and full-size image links. Exposes LPG.openLightbox(list, index). */
(() => {
  const { $$, swap, esc } = LPG;
  const lb = document.createElement("div");
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Photo viewer");
  lb.style.cssText = "position:fixed;inset:0;z-index:100;display:none;flex-direction:column;background:rgba(8,12,18,.95);padding:20px;color:#fff;font-family:var(--font-dm-sans),system-ui,sans-serif";
  lb.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><span data-c style="font-size:13px;opacity:.75"></span><button data-x aria-label="Close" style="font-size:30px;line-height:1;background:none;border:0;color:#fff;cursor:pointer;padding:6px 10px">×</button></div>' +
    '<div style="flex:1;display:flex;align-items:center;justify-content:center;gap:12px;min-height:0"><button data-p aria-label="Previous photo" style="font-size:34px;background:none;border:0;color:#fff;cursor:pointer;padding:12px">‹</button>' +
    '<figure style="margin:0;display:flex;flex-direction:column;align-items:center;max-width:1200px;width:100%;height:100%;justify-content:center"><img data-i alt="" style="max-width:100%;max-height:78vh;object-fit:contain"><figcaption data-cap style="margin-top:12px;font-size:14px;opacity:.85;text-align:center"></figcaption></figure>' +
    '<button data-n aria-label="Next photo" style="font-size:34px;background:none;border:0;color:#fff;cursor:pointer;padding:12px">›</button></div>';
  document.body.appendChild(lb);
  let lbList = [], lbIdx = 0, lbReturn = null;
  const lbRender = () => {
    const it = lbList[lbIdx];
    lb.querySelector("[data-i]").src = it.src;
    lb.querySelector("[data-i]").alt = it.alt || "";
    lb.querySelector("[data-cap]").textContent = it.alt || "";
    lb.querySelector("[data-c]").textContent = lbList.length > 1 ? (lbIdx + 1) + " of " + lbList.length : "";
    lb.querySelector("[data-p]").style.visibility = lbList.length > 1 ? "visible" : "hidden";
    lb.querySelector("[data-n]").style.visibility = lbList.length > 1 ? "visible" : "hidden";
  };
  LPG.openLightbox = openLb;
  function openLb(list, i) { lbList = list; lbIdx = i; lbReturn = document.activeElement; lbRender(); lb.style.display = "flex"; document.body.style.overflow = "hidden"; lb.querySelector("[data-x]").focus(); }
  function closeLb() { lb.style.display = "none"; document.body.style.overflow = ""; lbReturn && lbReturn.focus && lbReturn.focus(); }
  const step = (d) => { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbRender(); };
  lb.addEventListener("click", (e) => { if (e.target.closest("[data-x]") || e.target === lb) closeLb(); else if (e.target.closest("[data-p]")) step(-1); else if (e.target.closest("[data-n]")) step(1); });
  addEventListener("keydown", (e) => {
    if (lb.style.display !== "flex") return;
    if (e.key === "Escape") closeLb(); if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1);
  });


  // Links with data-full open that image in the viewer
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-full]");
    if (!a) return;
    e.preventDefault();
    openLb([{ src: a.dataset.full, alt: a.closest("figure")?.querySelector("img")?.alt || "" }], 0);
  });
})();

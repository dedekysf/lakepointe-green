/* Floor plans: save to localStorage + share (Web Share API, falls back to copying the link). */
(() => {
  const { $$, swap, esc } = LPG;
  const { SAVED_KEY, SITE_URL } = LPG;
  const readSaved = () => { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; } };
  let savedList = readSaved();
  const paintSaved = () => {
    $$(document, "[data-save]").forEach((b) => {
      const on = savedList.includes(b.dataset.save);
      b.setAttribute("aria-pressed", String(on));
      swap(b, on, ["text-copper"], ["text-ink", "hover:text-copper"]);
      const label = b.querySelector("[data-save-label]");
      if (label) label.textContent = on ? "SAVED" : "SAVE";
      const path = b.querySelector("path");
      if (path) path.setAttribute("fill", on ? "currentColor" : "none");
    });
    $$(document, "[data-saved-marker]").forEach((m) => { m.hidden = !savedList.includes(m.dataset.savedMarker); });
  };
  document.addEventListener("click", async (e) => {
    const sv = e.target.closest("[data-save]");
    if (sv) {
      const id = sv.dataset.save;
      savedList = savedList.includes(id) ? savedList.filter((x) => x !== id) : [...savedList, id];
      try { localStorage.setItem(SAVED_KEY, JSON.stringify(savedList)); } catch {}
      paintSaved();
      return;
    }
    const sh = e.target.closest("[data-share]");
    if (!sh) return;
    const base = /^https?:$/.test(location.protocol) ? location.origin : SITE_URL;
    const url = base + sh.dataset.share;
    const status = sh.parentElement.querySelector("[data-share-status]");
    if (navigator.share) {
      try { await navigator.share({ title: sh.dataset.shareTitle, text: sh.dataset.shareTitle + " at Lake Pointe Green", url }); return; }
      catch (err) { if (err.name === "AbortError") return; } // otherwise fall back to copying
    }
    try {
      await navigator.clipboard.writeText(url);
      if (status) { status.textContent = "Link copied"; setTimeout(() => (status.textContent = ""), 2500); }
    } catch {}
  });
  paintSaved();
})();

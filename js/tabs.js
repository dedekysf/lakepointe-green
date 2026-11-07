/* Tabs (contact page: tour / info) with arrow-key support, plus the interest chips in the forms. */
(() => {
  const { $$, swap, esc } = LPG;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.tabTarget) { const t = document.getElementById(b.dataset.tabTarget); if (t) selectTab(t); return; }
    if (b.getAttribute("role") === "tab") { selectTab(b); return; }
    // Interest chips inside the forms toggle on/off
    if (b.hasAttribute("aria-pressed") && b.closest("form")) {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(on));
      swap(b, on, ["border-charcoal", "bg-charcoal", "text-white"], ["border-line", "bg-white", "text-ink", "hover:border-charcoal"]);
    }
  });

  function selectTab(tab) {
    document.documentElement.classList.add("lpg-tab-used"); // enables the panel fade (see components.css)
    const list = tab.closest('[role="tablist"]');
    $$(list, '[role="tab"]').forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      swap(t, on, ["border-copper", "text-ink"], ["border-transparent", "text-muted", "hover:text-ink"]);
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (!panel) return;
      panel.hidden = !on;
      if (panel.classList.contains("hidden") || panel.classList.contains("block")) swap(panel, on, ["block"], ["hidden"]);
    });
    tab.focus();
  }
  $$(document, '[role="tablist"]').forEach((list) => list.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = $$(list, '[role="tab"]');
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    selectTab(tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length]);
  }));
})();

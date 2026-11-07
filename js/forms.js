/* Forms: validate, then open the visitor's email app with the request filled in (no backend yet). */
(() => {
  const { $$, swap, esc } = LPG;
  const { SALES_EMAIL } = LPG;
  $$(document, "form").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    let bad = null;
    $$(form, "input[required]").forEach((i) => {
      const v = i.value.trim();
      const ok = v && (i.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) && (i.type !== "tel" || v.replace(/\D/g, "").length >= 10);
      i.style.borderColor = ok ? "" : "#B42318";
      i.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !bad) bad = i;
    });
    // Tour dates can't be in the past.
    const now = new Date(), today = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $$(form, 'input[type="date"]').forEach((i) => {
      i.min = today;
      const ok = !i.value || i.value >= today;
      i.style.borderColor = ok ? "" : "#B42318";
      i.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !bad) bad = i;
    });
    if (bad) { bad.focus(); return; }
    const lines = [];
    $$(form, "input, select, textarea").forEach((el) => {
      if ((el.type === "radio" && !el.checked) || !el.value.trim()) return;
      const label = el.type === "radio" ? form.querySelector("legend")?.textContent : form.querySelector('label[for="' + el.id + '"]')?.textContent;
      lines.push((label || el.name).replace("*", "").trim() + ": " + el.value.trim());
    });
    const chips = $$(form, 'button[aria-pressed="true"]').map((b) => b.textContent.trim());
    if (chips.length) lines.push("Interested in: " + chips.join(", "));
    const isTour = !!form.closest("#panel-tour");
    const subject = "Lake Pointe Green — " + (isTour ? "Tour request" : "Information request");
    location.href = "mailto:" + SALES_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    form.innerHTML = '<div role="status" style="padding:24px 0;text-align:center"><p class="font-serif" style="font-size:26px;line-height:1.3">Your email is ready to send.</p><p style="margin-top:12px;font-size:15px;color:#5A6470">Your email app should open with your request filled in — just press send. If it doesn\'t, call Greg Burton at 713-503-4582.</p><p style="margin-top:16px;font-size:15px;font-style:italic;color:#5A6470">— The <a href="https://www.lovetthomes.com" target="_blank" rel="noopener noreferrer" class="lpg-lovett-link">Lovett Homes</a> team at Lake Pointe Green</p></div>';
  }));
})();

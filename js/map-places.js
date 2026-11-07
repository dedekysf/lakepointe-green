/* Interactive drive-times map on /find-your-home/ (#location).
   Every row of the "Drive times" list is a button. Choosing one shows the drive from the model home to that place in the map
   beside it (Google Maps embed, no API key); choosing it again, or the "Back to Lake Pointe Green" chip, returns to the community.
   Markup: rows carry data-place="<search text>"; the iframe is #location-map inside #location-map-wrap; the caption is #location-map-caption. */
(() => {
  const sec = document.getElementById("location");
  const frame = document.getElementById("location-map");
  if (!sec || !frame) return;

  const HOME = "1 Fluor Daniel Dr, Sugar Land, TX 77478";
  const HOME_TITLE = frame.getAttribute("title");
  const HOME_SRC = frame.getAttribute("src");
  const wrap = document.getElementById("location-map-wrap");
  const cap = document.getElementById("location-map-caption");
  const capText = cap && cap.querySelector("[data-cap-text]");
  const back = cap && cap.querySelector("[data-cap-reset]");
  const rows = [...sec.querySelectorAll("[data-place]")];
  let active = null;

  const route = (place) =>
    "https://maps.google.com/maps?saddr=" + encodeURIComponent(HOME) + "&daddr=" + encodeURIComponent(place) + "&output=embed";

  function setSrc(src, title) {
    if (frame.getAttribute("src") === src) return;
    wrap.classList.add("is-loading");
    frame.addEventListener("load", () => wrap.classList.remove("is-loading"), { once: true });
    frame.setAttribute("src", src);
    frame.setAttribute("title", title);
  }

  function show(row) {
    active = row;
    rows.forEach((r) => {
      const on = r === row;
      r.setAttribute("aria-pressed", String(on));
      r.closest("[data-row]").classList.toggle("is-active", on);
    });
    if (row) {
      const name = row.textContent.trim();
      const time = row.closest("[data-row]").querySelector("dd").textContent.trim();
      setSrc(route(row.dataset.place), "Map: drive from Lake Pointe Green to " + name);
      if (capText) capText.textContent = name + " · " + time;
      cap && cap.classList.add("is-on");
    } else {
      setSrc(HOME_SRC, HOME_TITLE);
      cap && cap.classList.remove("is-on");
      if (capText) capText.textContent = "";
    }
  }

  rows.forEach((r) => r.addEventListener("click", () => show(active === r ? null : r)));
  if (back) back.addEventListener("click", () => show(null));
  // keyboard: arrow up / down move between places
  sec.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const i = rows.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    rows[(i + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length].focus();
  });
})();

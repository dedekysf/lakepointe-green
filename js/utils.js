/* Tiny DOM helpers shared by the other scripts. */
window.LPG = window.LPG || {};
LPG.$$ = (root, sel) => [...root.querySelectorAll(sel)];
// Replace one set of classes with another: swap(el, isOn, onClasses, offClasses)
LPG.swap = (el, on, onCls, offCls) => { offCls.concat(onCls).forEach((c) => el.classList.remove(c)); (on ? onCls : offCls).forEach((c) => el.classList.add(c)); };
LPG.esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

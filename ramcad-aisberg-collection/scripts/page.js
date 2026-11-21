(() => {
  "use strict";
  const config = window.RAMCAD_CONFIG || {};
  document.querySelectorAll("[data-route]").forEach(link => {
    const href = config.routes?.[link.dataset.route];
    if (href) link.setAttribute("href", href);
  });
  document.querySelectorAll("[data-phone-href]").forEach(link => {
    if (config.phone?.href) link.setAttribute("href", config.phone.href);
  });
  document.querySelectorAll("[data-phone-text]").forEach(el => {
    if (config.phone?.display) el.textContent = config.phone.display;
  });
  document.querySelectorAll("[data-header-phone]").forEach(el => {
    if (config.phone?.header) el.textContent = config.phone.header;
  });
  const menu = document.querySelector(".main-nav");
  const menuButton = document.querySelector(".menu-toggle");
  const setMenu = open => {
    menu?.classList.toggle("is-open",open);
    menuButton?.setAttribute("aria-expanded",String(open));
    menuButton?.setAttribute("aria-label",open ? "Закрыть меню" : "Открыть меню");
  };
  menuButton?.addEventListener("click",() => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  menu?.querySelectorAll("a").forEach(a => a.addEventListener("click",() => setMenu(false)));
  document.addEventListener("keydown",event => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
      setMenu(false); menuButton.focus();
    }
  });
  window.matchMedia("(min-width:981px)").addEventListener("change",() => setMenu(false));
  const descriptions = {scene:"Рыба на колотом льду рядом с упаковкой. Внешний вид рыбы соответствует изображению на этикетке.",pack:"Упаковка с оригинальной этикеткой товара.",fish:"Рыба на колотом льду крупным планом."};
  document.querySelectorAll("[data-gallery-target]").forEach(button => {
    button.addEventListener("click",() => {
      const value = button.dataset.galleryTarget;
      if (!Object.hasOwn(descriptions,value)) return;
      document.body.dataset.gallery = value;
      document.querySelectorAll("[data-gallery-target]").forEach(dot => {
        const active = dot.dataset.galleryTarget === value;
        dot.classList.toggle("is-active",active);dot.setAttribute("aria-pressed",String(active));
      });
      const description = document.getElementById("gallery-description");
      if (description) description.textContent = descriptions[value];
    });
  });
  const dialog = document.getElementById("wholesale-dialog");
  document.querySelectorAll("[data-open-wholesale]").forEach(button => button.addEventListener("click",() => {
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    else window.location.href = config.phone?.href || "tel:+79389042323";
  }));
  document.querySelectorAll("[data-close-wholesale]").forEach(button => button.addEventListener("click",() => dialog?.close()));
  dialog?.addEventListener("click",event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
})();

(() => {
  "use strict";
  const products = window.RAMCAD_PRODUCTS;
  const form = document.getElementById("builder-controls");
  const stage = document.getElementById("layer-stage");
  const picker = document.getElementById("product-picker");
  const code = document.getElementById("composition-code");
  const status = document.getElementById("copy-status");
  let selected = products[0];
  const escape = text => String(text).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]);
  for (const p of products) {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `Сельдь ${p.subtitle} · ${p.weightLabel}`;
    picker.append(option);
  }
  function currentCode() {
    const vars = Array.from(form.querySelectorAll("[data-css]"), input => `  ${input.dataset.css}: ${input.value}%;`).join("\n");
    const parts = [];
    if (document.getElementById("show-pack").checked) parts.push(`  <div class="composition-pack"><img class="pack-base" src="assets/packaging/tub-blank.png" alt=""><img class="pack-label" src="${escape(selected.label)}" alt="Упаковка Айсберг, ${escape(selected.subtitle)}, ${escape(selected.weightLabel)}"></div>`);
    if (document.getElementById("show-fish").checked) parts.push(`  <img class="composition-fish" src="${escape(selected.fish)}" alt="Сельдь ${escape(selected.subtitle)} — изображение соответствует этикетке">`);
    if (document.getElementById("show-waves").checked) parts.push('  <img class="composition-waves" src="assets/patterns/waves.svg" alt="" aria-hidden="true">');
    return `<!-- Пути рассчитаны от корня комплекта. Сохраните папки assets и products. -->\n<div class="ramcad-composition">\n${parts.join("\n")}\n</div>\n<style>\n.ramcad-composition {\n  position: relative; isolation: isolate; width: 100%; aspect-ratio: 2; overflow: hidden;\n  background: #082f46 url("assets/studio/ice-background.png") center/cover;\n${vars}\n}\n.ramcad-composition img { display: block; max-width: none; }\n.composition-pack { position: absolute; z-index: 1; width: var(--pack-width); left: var(--pack-x); top: var(--pack-y); aspect-ratio: 1; filter: drop-shadow(0 8px 8px #082f4628); }\n.composition-pack .pack-base { width: 100%; height: auto; }\n.composition-pack .pack-label { position: absolute; left: 13.3174%; top: 12.4402%; width: 75.1196%; height: 59.6491%; object-fit: fill; border-radius: 50%; }\n.composition-fish { position: absolute; z-index: 2; width: var(--fish-width); left: var(--fish-x); top: var(--fish-y); height: auto; filter: drop-shadow(0 8px 6px #082f4630); }\n.composition-waves { position: absolute; z-index: 3; top: 0; right: 0; width: 58%; height: 100%; opacity: .35; pointer-events: none; }\n</style>`;
  }
  function update() {
    form.querySelectorAll("[data-css]").forEach(input => {
      stage.style.setProperty(input.dataset.css, `${input.value}%`);
      form.querySelector(`output[for="${input.id}"]`).textContent = `${input.value}%`;
    });
    for (const layer of ["pack","fish","waves"]) stage.querySelector(`.layer-${layer}`).hidden = !document.getElementById(`show-${layer}`).checked;
    code.textContent = currentCode();
    status.textContent = "";
  }
  function selectProduct(id) {
    selected = products.find(p => p.id === id) || products[0];
    picker.value = selected.id;
    const [fx,fy,fw] = selected.fishBox;
    const [px,py,pw] = selected.packBox;
    const values = {"fish-x":fx/1774*100,"fish-y":fy/887*100,"fish-width":fw/1774*100,"pack-x":px/1774*100,"pack-y":py/887*100,"pack-width":pw/1774*100};
    for (const [id,value] of Object.entries(values)) document.getElementById(id).value = value.toFixed(2);
    for (const layer of ["pack","fish","waves"]) document.getElementById(`show-${layer}`).checked = true;
    stage.querySelector(".pack-label").src = selected.label;
    stage.querySelector(".layer-fish").src = selected.fish;
    stage.querySelector(".layer-fish").alt = `Сельдь ${selected.subtitle}`;
    document.getElementById("selected-product").textContent = `Сельдь ${selected.subtitle} · ${selected.weightLabel}`;
    document.querySelectorAll("[data-product-link]").forEach(a => a.href = selected[a.dataset.productLink]);
    document.querySelectorAll("[data-product-image]").forEach(img => img.src = selected[img.dataset.productImage]);
    document.querySelectorAll("[data-product-path]").forEach(el => el.textContent = selected[el.dataset.productPath]);
    document.getElementById("source-note").textContent = selected.fishSourceMethod === "original-pdf-image" ? "Рыба извлечена из PDF этой этикетки. Форма, цвет и добавки сохранены в исходном изображении." : selected.fishSourceMethod === "reference-preserving-upscale" ? "Более чёткая версия изображения из этой этикетки. Сохранены стопка кусочков и лук; оригинал 410 × 410 включён в assets/fish/source." : "Рыба подготовлена по изображению на этой этикетке: тарелка удалена, сохранены тип нарезки, количество и внешний вид. Исходник с тарелкой есть в assets/fish/source.";
    document.getElementById("sample-weight").textContent = selected.weightLabel;
    update();
  }
  picker.addEventListener("change", () => {
    selectProduct(picker.value);
    try { const url = new URL(location.href); url.searchParams.set("product",selected.id); history.replaceState(null,"",url); } catch {}
  });
  form.addEventListener("input", event => { if (event.target !== picker) update(); });
  form.addEventListener("reset", event => { event.preventDefault(); selectProduct(selected.id); });
  document.getElementById("copy-composition").addEventListener("click", async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(code.textContent);
      else { const el = document.createElement("textarea"); el.value = code.textContent; document.body.append(el); el.select(); const ok = document.execCommand("copy"); el.remove(); if (!ok) throw new Error("clipboard"); }
      status.textContent = "HTML и CSS скопированы";
    } catch { status.textContent = "Скопируйте код вручную или скачайте HTML"; }
  });
  document.getElementById("download-composition").addEventListener("click", () => {
    const html = `<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(selected.subtitle)} · ${escape(selected.weightLabel)}</title><style>body{margin:0}</style>${currentCode()}</html>`;
    const url = URL.createObjectURL(new Blob([html], {type:"text/html;charset=utf-8"}));
    const a = document.createElement("a"); a.href = url; a.download = `${selected.id}-composition.html`; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    status.textContent = "Сохраните HTML в корень распакованного комплекта";
  });
  selectProduct(new URLSearchParams(location.search).get("product"));
})();

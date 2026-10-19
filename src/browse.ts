import { cars, card, locations } from "./cars.js";
export function setupBrowse(): void {
  const form = document.querySelector<HTMLFormElement>("#filters");
  if (!form) return;
  const min = document.querySelector<HTMLInputElement>("#price-min")!,
    max = document.querySelector<HTMLInputElement>("#price-max")!;
  const sort = document.querySelector<HTMLSelectElement>("#sort")!,
    search = document.querySelector<HTMLInputElement>("#car-search")!;
  for (const [target, key] of [
    ["type-list", "type"],
    ["trans-list", "transmission"],
  ] as const) {
    const values = [...new Set(cars.map((c) => c[key]))];
    document.getElementById(target)!.innerHTML = values
      .map(
        (value) =>
          `<li><label class="flex cursor-pointer items-center gap-3 py-2"><input type="checkbox" name="${key}" value="${value}" class="h-4 w-4 accent-teal-600"/><span class="flex-1">${value}</span><span class="text-sm text-slate-400">${cars.filter((c) => c[key] === value).length}</span></label></li>`,
      )
      .join("");
  }
  const checked = (name: string): string[] =>
    Array.from(
      form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`),
      (i) => i.value,
    );
  function update(): void {
    const lo = Number(min.value),
      hi = Number(max.value),
      types = checked("type"),
      trans = checked("transmission");
    let result = cars.filter(
      (c) =>
        (!types.length || types.includes(c.type)) &&
        (!trans.length || trans.includes(c.transmission)) &&
        c.price >= lo &&
        c.price <= hi &&
        `${c.name} ${c.type} ${c.fuel}`.toLowerCase().includes(search.value.trim().toLowerCase()),
    );
    if (sort.value === "low") result.sort((a, b) => a.price - b.price);
    if (sort.value === "high") result.sort((a, b) => b.price - a.price);
    document.getElementById("car-grid")!.innerHTML = result.map(card).join("");
    document.getElementById("empty-state")!.hidden = result.length > 0;
    document.getElementById("result-count")!.textContent =
      `${result.length} ${result.length === 1 ? "car" : "cars"} found · sample daily rates`;
    document.getElementById("price-label")!.textContent = `$${lo} – $${hi}`;
    const fill = document.getElementById("price-fill")!;
    fill.style.left = `${((lo - 10) / 140) * 100}%`;
    fill.style.width = `${((hi - lo) / 140) * 100}%`;
  }
  form.addEventListener("input", (e) => {
    if (+min.value > +max.value) {
      if (e.target === min) min.value = max.value;
      else max.value = min.value;
    }
    update();
  });
  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("reset", () => {
    search.value = "";
    sort.value = "recommended";
    setTimeout(update, 0);
  });
  sort.addEventListener("change", update);
  search.addEventListener("input", update);
  document.getElementById("empty-reset")!.addEventListener("click", () => form.reset());
  const loc = document.querySelector<HTMLSelectElement>("#location");
  const value = new URLSearchParams(location.search).get("location");
  if (loc && value && locations.includes(value)) loc.value = value;
  update();
}

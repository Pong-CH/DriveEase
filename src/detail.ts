import { cars, card, selectedCar, invalidCar, asset, pageLink, money } from "./cars.js";
import type { Car } from "./cars.js";

/** Fill the supplied detail layout with the vehicle the visitor selected. */
function fillDetail(container: HTMLElement, car: Car): void {
  const text = (role: string, value: string): void => {
    container.querySelector<HTMLElement>(`[data-detail-${role}]`)!.textContent = value;
  };
  text("name", car.name);
  text("description", car.description);
  text("type", car.type);
  text("price", money(car.price));
  text("seats", `${car.seats} seats`);
  text("transmission", car.transmission);
  text("fuel", car.fuel);
  const image = container.querySelector<HTMLImageElement>("[data-detail-image]")!;
  image.src = asset(car.image);
  image.alt = car.name;
  container.querySelector<HTMLAnchorElement>("[data-detail-rent]")!.href = pageLink(
    "booking",
    car.id,
  );
  const thumbs = container.querySelector<HTMLElement>("[data-detail-thumbs]")!;
  thumbs.replaceChildren();
  thumbs.hidden = !car.gallery?.length;
  for (const photo of car.gallery || []) {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "aspect-[1.55] overflow-hidden rounded-lg opacity-80 ring-accent transition hover:opacity-100 aria-pressed:ring-2 aria-pressed:opacity-100";
    button.setAttribute("aria-label", `Preview ${photo.alt}`);
    button.setAttribute("aria-pressed", "false");
    const thumb = document.createElement("img");
    thumb.src = asset(photo.image);
    thumb.alt = photo.alt;
    thumb.className = "h-full w-full object-cover";
    button.append(thumb);
    button.addEventListener("click", () => {
      const active = button.getAttribute("aria-pressed") === "true";
      thumbs.querySelectorAll("button").forEach((el) => el.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", String(!active));
      image.src = asset(active ? car.image : photo.image);
      image.alt = active ? car.name : photo.alt;
    });
    thumbs.append(button);
  }
}

export function setupDetail(): void {
  const page = document.querySelector<HTMLElement>("[data-detail-page]");
  if (!page) return;
  const car = selectedCar();
  if (!car) {
    invalidCar();
    return;
  }
  document.title = `${car.name} rental | DriveEase Cambodia`;
  fillDetail(page, car);
  const title = page.querySelector<HTMLElement>("[data-detail-title]")!;
  // The fallback page has one H1; the popup uses an H2.
  const heading = document.createElement("h1");
  heading.className = title.className;
  heading.textContent = title.textContent;
  title.replaceWith(heading);
  page.querySelectorAll("[data-detail-close]").forEach((button) => {
    button.addEventListener("click", () => location.assign(pageLink("browse-cars")));
  });
  document.getElementById("related-cars")!.innerHTML = cars
    .filter((c) => c.id !== car.id)
    .slice(0, 3)
    .map(card)
    .join("");
}

export function setupDetailPopup(): void {
  const dialog = document.querySelector<HTMLDialogElement>("#car-detail-dialog");
  if (!dialog) return;
  let trigger: HTMLElement | null = null;
  let previousOverflow = "";
  dialog.querySelectorAll("[data-detail-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });
  dialog.addEventListener("close", () => {
    document.documentElement.style.overflow = previousOverflow;
    trigger?.focus({ preventScroll: true });
  });
  document.addEventListener("click", (event) => {
    const mouse = event as MouseEvent;
    if (
      event.defaultPrevented ||
      mouse.button !== 0 ||
      mouse.ctrlKey ||
      mouse.metaKey ||
      mouse.shiftKey ||
      mouse.altKey
    )
      return;
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !url.pathname.endsWith("/pages/car-detail.html")) return;
    const car = cars.find((item) => item.id === Number(url.searchParams.get("id")));
    if (!car) return;
    event.preventDefault();
    trigger = link;
    fillDetail(dialog, car);
    // Carry any trip selections from the clicked link into booking.
    const rent = dialog.querySelector<HTMLAnchorElement>("[data-detail-rent]")!;
    const booking = new URL(rent.href);
    for (const key of ["location", "pickup", "return"]) {
      const value = url.searchParams.get(key);
      if (value) booking.searchParams.set(key, value);
    }
    rent.href = booking.href;
    previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    dialog.scrollTop = 0;
    dialog.querySelector<HTMLButtonElement>("[data-detail-close]")!.focus({ preventScroll: true });
  });
}

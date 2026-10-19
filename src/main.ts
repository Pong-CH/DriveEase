import { cars, card, dateAfter, locations } from "./cars.js";
import { setupBrowse } from "./browse.js";
import { setupDetail, setupDetailPopup } from "./detail.js";
import { setupBooking } from "./booking.js";
import { validDate, nextDate } from "./calendars.js";

function setupNavbar(): void {
  const theme = document.querySelector<HTMLButtonElement>("#theme-toggle");
  const updateLabel = (): void => {
    const dark = document.documentElement.classList.contains("dark");
    theme?.setAttribute("aria-pressed", String(dark));
    theme?.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };
  updateLabel();
  theme?.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* The theme still works when storage is unavailable. */
    }
    updateLabel();
  });
  const button = document.querySelector<HTMLButtonElement>("#menu-toggle"),
    menu = document.getElementById("mobile-menu");
  const close = (): void => {
    menu?.classList.add("hidden");
    button?.setAttribute("aria-expanded", "false");
    button?.setAttribute("aria-label", "Open menu");
  };
  button?.addEventListener("click", () => {
    const open = menu?.classList.toggle("hidden") === false;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });
  menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.querySelectorAll<HTMLAnchorElement>("[data-nav]").forEach((a) => {
    if (
      new URL(a.href).pathname === location.pathname
    )
      a.setAttribute("aria-current", "page");
  });
}
function setupSearch(): void {
  document.querySelectorAll<HTMLFormElement>("[data-trip-search]").forEach((form) => {
    const pickup = form.querySelector<HTMLInputElement>('[name="pickup"]')!,
      end = form.querySelector<HTMLInputElement>('[name="return"]')!;
    const q = new URLSearchParams(location.search),
      loc = form.querySelector<HTMLSelectElement>('[name="location"]')!;
    pickup.min = end.min = dateAfter(0);
    pickup.required = end.required = true;
    pickup.value = q.get("pickup") || dateAfter(1);
    end.value = q.get("return") || dateAfter(4);
    const selected = q.get("location");
    if (selected && locations.includes(selected)) loc.value = selected;
    const validate = (): void => {
      pickup.setCustomValidity(
        !validDate(pickup.value)
          ? "Enter a valid date as YYYY-MM-DD."
          : pickup.value < dateAfter(0)
            ? "Choose today or a future date."
            : "",
      );
      end.min = validDate(pickup.value) ? nextDate(pickup.value) : dateAfter(1);
      end.setCustomValidity(
        !validDate(end.value)
          ? "Enter a valid date as YYYY-MM-DD."
          : end.value <= pickup.value
            ? "Return date must be after pickup."
            : "",
      );
    };
    pickup.addEventListener("input", () => {
      if (validDate(pickup.value) && end.value <= pickup.value) end.value = nextDate(pickup.value);
    });
    form.addEventListener("input", validate);
    form.addEventListener("submit", (e) => {
      validate();
      if (!form.reportValidity()) e.preventDefault();
    });
    validate();
  });
}
function setupContact(): void {
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  if (!form) return;
  const name = form.querySelector<HTMLInputElement>('[name="name"]')!,
    message = form.querySelector<HTMLTextAreaElement>("textarea")!;
  const validate = (): void => {
    name.setCustomValidity(name.value.trim().length < 2 ? "Please enter your name." : "");
    message.setCustomValidity(
      message.value.trim().length < 10 ? "Please write at least 10 characters." : "",
    );
  };
  form.addEventListener("input", () => {
    validate();
    document.getElementById("form-status")!.textContent = "";
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    validate();
    if (!form.reportValidity()) return;
    document.getElementById("form-status")!.textContent =
      "Your message passes validation. This is a frontend demo; no message was sent.";
  });
}
function setupRentalInfo(): void {
  const dialog = document.querySelector<HTMLDialogElement>("#rental-info-dialog");
  if (!dialog) return;
  const titles: Record<string, string> = {
    guide: "Rental Guide",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
  };
  let trigger: HTMLButtonElement | null = null;
  let previousOverflow = "";
  document.querySelectorAll<HTMLButtonElement>("[data-open-info]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.dataset.openInfo!;
      if (!titles[panel]) return;
      trigger = button;
      document.getElementById("rental-info-title")!.textContent = titles[panel];
      dialog.querySelectorAll<HTMLElement>("[data-info-panel]").forEach((section) => {
        section.hidden = section.dataset.infoPanel !== panel;
      });
      previousOverflow = document.documentElement.style.overflow;
      dialog.showModal();
      dialog.scrollTop = 0;
      document.documentElement.style.overflow = "hidden";
      dialog
        .querySelector<HTMLButtonElement>("[data-close-dialog]")!
        .focus({ preventScroll: true });
    });
  });
  dialog.addEventListener("close", () => {
    document.documentElement.style.overflow = previousOverflow;
    trigger?.focus({ preventScroll: true });
  });
}

function setupInspirationCarousel(): void {
  if (!document.getElementById("inspiration-carousel")) return;
  const preline = window as typeof window & {
    HSCarousel?: {
      getInstance(selector: string): {
        currentIndex: number;
        recalculateWidth(): void;
        goTo(index: number): void;
      } | null;
    };
  };
  const visibleCards = (): number =>
    window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  let previousCount = visibleCards();
  window.addEventListener("resize", () => {
    const count = visibleCards();
    if (count === previousCount) return;
    previousCount = count;
    const carousel = preline.HSCarousel?.getInstance("#inspiration-carousel");
    if (!carousel) return;
    // Keep the last mobile slide from leaving empty space after switching to desktop.
    carousel.recalculateWidth();
    carousel.goTo(Math.min(carousel.currentIndex, 6 - count));
  });
}

function setupCarScrolling(): void {
  const row = document.getElementById("popular-cars");
  if (!row) return;
  const previous = document.querySelector<HTMLButtonElement>('[data-car-scroll="prev"]');
  const next = document.querySelector<HTMLButtonElement>('[data-car-scroll="next"]');
  const update = (): void => {
    if (previous) previous.disabled = row.scrollLeft <= 1;
    if (next) next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
  };
  const move = (direction: number): void => {
    const card = row.querySelector<HTMLElement>(".car-card");
    const distance = (card?.getBoundingClientRect().width || row.clientWidth) + 24;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * distance, behavior: reducedMotion ? "auto" : "smooth" });
  };
  previous?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));
  row.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  row.addEventListener("keydown", (event) => {
    if (event.target !== row || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  });
  update();
}

function start(): void {
  setupNavbar();
  setupSearch();
  setupBrowse();
  setupDetail();
  setupDetailPopup();
  setupBooking();
  setupContact();
  setupRentalInfo();
  setupInspirationCarousel();
  const popular = document.getElementById("popular-cars");
  if (popular) popular.innerHTML = cars.map(card).join("");
  setupCarScrolling();
  document.querySelectorAll<HTMLDialogElement>("dialog").forEach((dialog) => {
    dialog
      .querySelectorAll("[data-close-dialog]")
      .forEach((button) => button.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        const r = dialog.getBoundingClientRect();
        if (
          event.clientX < r.left ||
          event.clientX > r.right ||
          event.clientY < r.top ||
          event.clientY > r.bottom
        )
          dialog.close();
      }
    });
  });
  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = String(new Date().getFullYear())));
}
start();

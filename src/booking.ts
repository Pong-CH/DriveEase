import { selectedCar, invalidCar, asset, money, dateAfter, rentalDays, locations } from "./cars.js";
export function setupBooking(): void {
  const form = document.querySelector<HTMLFormElement>("#booking-form");
  if (!form) return;
  const car = selectedCar();
  if (!car) {
    invalidCar();
    return;
  }
  const field = (id: string): HTMLInputElement | HTMLSelectElement =>
    document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
  const set = (id: string, value: string): void => {
    document.getElementById(id)!.textContent = value;
  };
  for (const img of form.querySelectorAll<HTMLImageElement>("[data-car-image]")) {
    img.src = asset(car.image);
    img.alt = car.name;
  }
  form.querySelectorAll("[data-car-name]").forEach((el) => (el.textContent = car.name));
  form.querySelectorAll("[data-car-type]").forEach((el) => (el.textContent = car.type));
  set("booking-description", car.description);
  set("booking-specs", `${car.seats} seats · ${car.transmission} · Air conditioning`);
  set("booking-price", money(car.price));
  field("passengers").innerHTML =
    '<option value="">Select passengers</option>' +
    Array.from(
      { length: car.seats },
      (_, i) =>
        `<option value="${i + 1}">${i + 1} ${i === 0 ? "passenger" : "passengers"}</option>`,
    ).join("");
  for (const name of ["pickup-time", "return-time"]) {
    field(name).innerHTML = Array.from(
      { length: 13 },
      (_, i) =>
        `<option value="${String(i + 7).padStart(2, "0")}:00">${String(i + 7).padStart(2, "0")}:00</option>`,
    ).join("");
    field(name).value = "09:00";
  }
  const q = new URLSearchParams(location.search),
    start = field("pickup-date") as HTMLInputElement,
    end = field("return-date") as HTMLInputElement;
  start.min = end.min = dateAfter(0);
  start.value = q.get("pickup") || dateAfter(1);
  end.value = q.get("return") || dateAfter(4);
  const loc = q.get("location");
  if (loc && locations.includes(loc)) {
    field("pickup-location").value = loc;
    field("return-location").value = loc;
  }
  let days = 0,
    total = 0;
  function update(): void {
    const a = `${start.value}T${field("pickup-time").value}`,
      b = `${end.value}T${field("return-time").value}`;
    days = rentalDays(a, b);
    total = days * car!.price;
    start.setCustomValidity(
      start.value < dateAfter(0) ? "Choose today or a future pickup date." : "",
    );
    end.min = start.value || dateAfter(0);
    end.setCustomValidity(days ? "" : "Return must be after pickup.");
    set(
      "sum-pickup",
      `${field("pickup-location").value} · ${start.value} ${field("pickup-time").value}`,
    );
    set(
      "sum-return",
      `${field("return-location").value} · ${end.value} ${field("return-time").value}`,
    );
    set("sum-duration", days ? `${days} ${days === 1 ? "day" : "days"}` : "Check dates");
    set("sum-rate", `${money(car!.price)} / day`);
    set("sum-rental-label", `Rental (${days} ${days === 1 ? "day" : "days"})`);
    set("sum-rental-amount", days ? money(total) : "—");
    set("sum-total", days ? money(total) : "—");
    document.getElementById("booking-status")!.textContent = "";
  }
  const name = field("full-name") as HTMLInputElement,
    phone = field("phone") as HTMLInputElement;
  function validate(): void {
    name.setCustomValidity(name.value.trim().length < 2 ? "Enter your full name." : "");
    phone.setCustomValidity(
      /^[+\d][\d\s()-]{6,19}$/.test(phone.value.trim())
        ? ""
        : "Enter a valid phone number (7–20 characters).",
    );
  }
  form.addEventListener("input", () => {
    update();
    validate();
  });
  form.addEventListener("change", update);
  let confirmation = "";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    update();
    validate();
    if (!form.reportValidity() || !days) return;
    const ref = `DE-${Date.now().toString(36).toUpperCase()}`;
    confirmation = `DriveEase — DEMO BOOKING\nReference: ${ref}\nCar: ${car!.name}\nPickup: ${field("pickup-location").value}, ${start.value} ${field("pickup-time").value}\nReturn: ${field("return-location").value}, ${end.value} ${field("return-time").value}\nDuration: ${days} days\nDaily rate: ${money(car!.price)}\nTotal: ${money(total)}`;
    set("confirmation-reference", ref);
    set("confirmation-car", car!.name);
    set("confirmation-total", money(total));
    set("confirmation-trip", `${start.value} → ${end.value} · ${days} days`);
    document.querySelector<HTMLDialogElement>("#booking-dialog")!.showModal();
  });
  document.getElementById("download-booking")!.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([confirmation], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "driveease-demo-booking.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  update();
}

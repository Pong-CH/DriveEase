/** Shared static catalogue. Rates and specifications describe this classroom demo fleet. */
export interface Car {
  id: number;
  name: string;
  type: string;
  transmission: string;
  seats: number;
  price: number;
  image: string;
  fuel: string;
  description: string;
  gallery?: { image: string; alt: string }[];
}
export const cars: Car[] = [
  {
    id: 1,
    name: "Ford Ranger",
    type: "Pickup",
    transmission: "Automatic",
    seats: 5,
    price: 65,
    image: "images/cars/ranger.jpg",
    fuel: "Diesel",
    description:
      "A versatile pickup with a comfortable cabin and useful cargo space for city trips and countryside adventures.",
  },
  {
    id: 2,
    name: "Toyota Camry",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    price: 45,
    image: "images/cars/camry.jpg",
    fuel: "Petrol",
    description: "An easygoing sedan with a comfortable cabin for city breaks and business trips.",
  },
  {
    id: 3,
    name: "Honda CR-V",
    type: "SUV",
    transmission: "Automatic",
    seats: 5,
    price: 70,
    image: "images/cars/suv.jpg",
    fuel: "Petrol",
    description:
      "Room for your favorite people and their bags. A practical choice for a family getaway.",
  },
  {
    id: 4,
    name: "BMW 3 Series",
    type: "Premium",
    transmission: "Automatic",
    seats: 5,
    price: 110,
    image: "images/cars/bmw.jpg",
    fuel: "Petrol",
    description:
      "A refined cabin and a memorable drive for the days that deserve something special.",
  },
  {
    id: 5,
    name: "Tesla Model 3",
    type: "Electric",
    transmission: "Automatic",
    seats: 5,
    price: 120,
    image: "images/cars/tesla.jpg",
    fuel: "Electric",
    description:
      "A quiet electric journey. Plan charging stops with your route before setting off.",
  },
  {
    id: 6,
    name: "Toyota Hilux Manual",
    type: "Pickup",
    transmission: "Manual",
    seats: 5,
    price: 55,
    image: "images/pickup_type/Hilux-Travo-Rally-ATTITUDE-BLACK-MC.webp",
    fuel: "Diesel",
    description: "A manual pickup with useful cargo space for an adventure at your own pace.",
  },
  {
    id: 7,
    name: "Mercedes-AMG GT",
    type: "Sports",
    transmission: "Automatic",
    seats: 2,
    price: 125,
    image: "images/cars/mercedes.jpg",
    fuel: "Petrol",
    description: "A two-seat sports coupe for a memorable weekend drive.",
  },
  {
    id: 8,
    name: "Ford Explorer",
    type: "SUV",
    transmission: "Automatic",
    seats: 7,
    price: 85,
    image: "images/cars/explorer.jpg",
    fuel: "Petrol",
    description: "A roomy SUV for family trips, luggage, and a longer journey together.",
  },
  {
    id: 9,
    name: "Audi A7",
    type: "Premium",
    transmission: "Automatic",
    seats: 5,
    price: 95,
    image: "images/cars/audi.jpg",
    fuel: "Petrol",
    description: "A comfortable premium car for business travel and relaxed road trips.",
  },
  {
    id: 10,
    name: "Porsche Panamera",
    type: "Premium",
    transmission: "Automatic",
    seats: 4,
    price: 145,
    image: "images/cars/porsche.jpg",
    fuel: "Petrol",
    description: "Four-seat comfort with a sporty character for a special occasion.",
  },
  {
    id: 11,
    name: "Ford Mustang",
    type: "Sports",
    transmission: "Automatic",
    seats: 4,
    price: 115,
    image: "images/cars/mustang.jpg",
    fuel: "Petrol",
    description: "An eye-catching coupe for a scenic route and an enjoyable weekend.",
  },
  {
    id: 12,
    name: "Chevrolet Camaro",
    type: "Sports",
    transmission: "Automatic",
    seats: 4,
    price: 140,
    image: "images/cars/camaro.jpg",
    fuel: "Petrol",
    description: "A four-seat sports coupe for a drive that feels a little more special.",
  },
];
export const locations = ["Phnom Penh", "Siem Reap", "Sihanoukville", "Kampot"];
// Each module lives in dist/, so this resolves correctly at / and /repository/ alike.
export const base = new URL("../", import.meta.url);
export const asset = (path: string): string => new URL(path, base).href;
export const money = (amount: number): string => `$${amount.toFixed(2)}`;
export function pageLink(page: string, id?: number): string {
  const url = new URL(`pages/${page}.html`, base);
  if (id !== undefined) url.searchParams.set("id", String(id));
  const trip = new URLSearchParams(location.search);
  for (const key of ["location", "pickup", "return"]) {
    const value = trip.get(key);
    if (value) url.searchParams.set(key, value);
  }
  return url.href;
}
export function selectedCar(): Car | undefined {
  const id = new URLSearchParams(location.search).get("id");
  return id === null ? cars[0] : cars.find((car) => car.id === Number(id));
}
export function card(car: Car): string {
  return `<article class="car-card group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
    <a href="${pageLink("car-detail", car.id)}" class="car-photo relative block overflow-hidden bg-slate-100 dark:bg-slate-800" aria-label="View ${car.name}"><img src="${asset(car.image)}" alt="${car.name}" loading="lazy" width="600" height="400" class="h-48 w-full object-cover transition duration-500 group-hover:scale-105"/><span class="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-800">${car.type}</span></a>
    <div class="flex flex-1 flex-col p-5"><h3 class="text-xl font-bold text-navy dark:text-white">${car.name}</h3><p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${car.description}</p><p class="mt-4 text-sm text-slate-500 dark:text-slate-400">${car.seats} seats · ${car.transmission} · ${car.fuel}</p><p class="mt-auto pt-5"><strong class="text-3xl text-primary dark:text-teal-300">$${car.price}</strong><span class="text-sm text-slate-500 dark:text-slate-400"> / day</span></p><div class="mt-4 flex items-center justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-700"><a class="text-sm font-semibold text-deep-green underline underline-offset-4 dark:text-teal-300" href="${pageLink("car-detail", car.id)}">View details</a><a class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-deep-green" href="${pageLink("booking", car.id)}">Rent now</a></div></div></article>`;
}
export function iso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dateAfter(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return iso(date);
}
export function rentalDays(start: string, end: string): number {
  const a = new Date(start).getTime(),
    b = new Date(end).getTime();
  return Number.isFinite(a) && Number.isFinite(b) && b > a ? Math.ceil((b - a) / 86400000) : 0;
}
export function invalidCar(): void {
  const main = document.querySelector("main");
  if (main)
    main.innerHTML = `<section class="mx-auto max-w-[1440px] px-5 py-20"><h1 class="text-4xl font-bold">Car not found</h1><p class="mt-4">This car link is invalid. Please choose a vehicle from our collection.</p><a class="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-white" href="${pageLink("browse-cars")}">Browse cars</a></section>`;
}

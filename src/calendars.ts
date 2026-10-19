import { iso } from "./cars.js";

export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return Number.isFinite(date.getTime()) && iso(date) === value;
}

export function nextDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return iso(date);
}

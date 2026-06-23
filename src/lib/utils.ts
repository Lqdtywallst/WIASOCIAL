import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function formatDate(date: string, locale: string = "es"): string {
  return new Date(date).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isToday(date: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return date === today;
}

/** Normalize AI output that may be a string, array, or timestamp-keyed object. */
export function formatAiText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(formatAiText).filter(Boolean).join("\n");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => {
        const segment = formatAiText(val);
        return segment ? `[${key}] ${segment}` : `[${key}]`;
      })
      .join("\n\n");
  }
  return String(value);
}

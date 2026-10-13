import en, { type Dictionary } from "./en";
import de from "./de";
import { LOCALES, type Locale } from "../schemas";

const dictionaries: Record<Locale, Dictionary> = { en, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function pick(l: { en: string; de: string } | undefined, locale: Locale): string {
  if (!l) return "";
  return l[locale] || l.en || "";
}

export function pickList(l: { en: string[]; de: string[] } | undefined, locale: Locale): string[] {
  if (!l) return [];
  return l[locale]?.length ? l[locale] : l.en ?? [];
}

export function formatDate(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(d);
}

export function formatMoney(amount: number, currency: "GBP" | "EUR" | "USD", locale: Locale): string {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export type { Dictionary };

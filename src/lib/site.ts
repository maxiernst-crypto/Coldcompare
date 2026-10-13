import type { Metadata } from "next";
import { LOCALES, type Locale } from "./schemas";

export const SITE_NAME = "ColdCompare";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function absolute(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Locale-prefixed path, e.g. lp("de", "/compare") → "/de/compare". */
export function lp(locale: Locale, path = ""): string {
  const p = path === "/" ? "" : path;
  return `/${locale}${p}`;
}

export interface PageMetaInput {
  locale: Locale;
  /** Path for this locale (with locale prefix). */
  path: string;
  title: string;
  description: string;
  /** Paths of existing translations keyed by locale (including this one). Omitted locales get no hreflang. */
  alternates?: Partial<Record<Locale, string>>;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  absoluteTitle?: boolean;
}

export function pageMetadata(i: PageMetaInput): Metadata {
  const alternates = i.alternates ?? { [i.locale]: i.path };
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const p = alternates[l];
    if (p) languages[l === "en" ? "en" : "de"] = absolute(p);
  }
  // x-default points to English when available.
  if (alternates.en) languages["x-default"] = absolute(alternates.en);
  const hasAlternates = Object.keys(languages).length > 1;

  return {
    title: i.absoluteTitle ? { absolute: i.title } : i.title,
    description: i.description,
    alternates: {
      canonical: absolute(i.path),
      ...(hasAlternates ? { languages } : {}),
    },
    openGraph: {
      type: i.type ?? "website",
      title: i.title,
      description: i.description,
      url: absolute(i.path),
      siteName: SITE_NAME,
      locale: i.locale === "de" ? "de_DE" : "en_GB",
      ...(i.type === "article" && i.publishedTime ? { publishedTime: i.publishedTime } : {}),
      ...(i.type === "article" && i.modifiedTime ? { modifiedTime: i.modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: i.title, description: i.description },
    robots: i.noindex ? { index: false, follow: true } : undefined,
  };
}

export const both = (path: string): Record<Locale, string> => ({ en: lp("en", path), de: lp("de", path) });

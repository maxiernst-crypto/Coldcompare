import { pick } from "./i18n";
import type { Country, Currency, FactField, FactStatus, Locale, Product, ProductData } from "./schemas";
import { overallScore, type Weights } from "./scoring";

/** Compact, locale-resolved product shape that is safe and cheap to send to client components. */
export interface ClientProduct {
  slug: string;
  model: string;
  manufacturer: string;
  hqCountry: string;
  formFactor: ProductData["formFactor"];
  tagline: string;
  releaseYear: number | null;
  prices: ProductData["prices"];
  priceCheckedAt: string | null;
  bitcoinOnly: boolean;
  btcOnlyFirmware: boolean;
  assetsSummary: string;
  assetBreadth: number;
  secureElement: ProductData["secureElement"];
  openFirmware: ProductData["openSource"]["firmware"];
  openHardware: ProductData["openSource"]["hardware"];
  connectivity: ProductData["connectivity"];
  airGapped: ProductData["airGapped"];
  backup: ProductData["backup"];
  passphrase: boolean;
  multisig: ProductData["multisig"];
  platforms: ProductData["platforms"];
  display: string;
  input: string;
  battery: boolean;
  scores: ProductData["scores"];
  overall: number;
  advisories: { date: string; severity: "info" | "warning" | "critical"; title: string }[];
  factStatus: Partial<Record<FactField, FactStatus>>;
  lastVerifiedAt: string | null;
  imageUrl: string | null;
  imageAlt: string;
}

export function toClientProduct(p: Product, locale: Locale, weights: Weights): ClientProduct {
  const d = p.data;
  return {
    slug: p.slug,
    model: p.model,
    manufacturer: p.manufacturer.name,
    hqCountry: p.manufacturer.hqCountry,
    formFactor: d.formFactor,
    tagline: pick(d.tagline, locale),
    releaseYear: d.releaseYear,
    prices: d.prices,
    priceCheckedAt: d.priceCheckedAt,
    bitcoinOnly: d.bitcoinOnly,
    btcOnlyFirmware: d.btcOnlyFirmware,
    assetsSummary: pick(d.assetsSummary, locale),
    assetBreadth: d.assetBreadth,
    secureElement: d.secureElement,
    openFirmware: d.openSource.firmware,
    openHardware: d.openSource.hardware,
    connectivity: d.connectivity,
    airGapped: d.airGapped,
    backup: d.backup,
    passphrase: d.passphrase,
    multisig: d.multisig,
    platforms: d.platforms,
    display: d.display,
    input: d.input,
    battery: d.battery,
    scores: d.scores,
    overall: overallScore(d.scores, weights),
    advisories: d.advisories.map((a) => ({ date: a.date, severity: a.severity, title: pick(a.title, locale) })),
    factStatus: d.factStatus,
    lastVerifiedAt: p.lastVerifiedAt,
    imageUrl: d.image?.url ?? null,
    imageAlt: d.image?.alt ?? p.model,
  };
}

const PREFERRED: Record<Country, Currency[]> = {
  GB: ["GBP", "EUR", "USD"],
  DE: ["EUR", "USD", "GBP"],
  INTL: ["USD", "EUR", "GBP"],
};

/** Choose which stored price to show for a country. `exact` is false when falling back to another currency. */
export function pickPrice(prices: ProductData["prices"], country: Country): { amount: number; currency: Currency; exact: boolean } | null {
  const order = PREFERRED[country];
  for (const c of order) {
    const v = prices[c];
    if (v != null) return { amount: v, currency: c, exact: c === order[0] };
  }
  return null;
}

export function defaultCountry(locale: Locale): Country {
  return locale === "de" ? "DE" : "GB";
}

export function sortValue(p: ClientProduct, key: "overall" | "security" | "usability" | "priceAsc" | "priceDesc" | "assets"): number {
  const price = p.prices.EUR ?? p.prices.USD ?? (p.prices.GBP != null ? p.prices.GBP * 1.17 : null);
  switch (key) {
    case "overall":
      return -p.overall;
    case "security":
      return -p.scores.security;
    case "usability":
      return -p.scores.usability;
    case "assets":
      return -p.assetBreadth;
    case "priceAsc":
      return price ?? Number.POSITIVE_INFINITY;
    case "priceDesc":
      return price == null ? Number.POSITIVE_INFINITY : -price;
  }
}

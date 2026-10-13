import { sortValue, type ClientProduct } from "./product-view";

export const FILTER_KEYS = ["btc", "airgap", "open", "nobt", "se", "multisig"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export const SORT_KEYS = ["overall", "security", "usability", "priceAsc", "priceDesc", "assets"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export interface FilterState {
  q: string;
  filters: FilterKey[];
  maxPrice: number | null;
  sort: SortKey;
}

const TESTS: Record<FilterKey, (p: ClientProduct) => boolean> = {
  btc: (p) => p.bitcoinOnly || p.btcOnlyFirmware,
  airgap: (p) => p.airGapped !== "no",
  open: (p) => p.openFirmware === "yes",
  nobt: (p) => !p.connectivity.includes("bluetooth"),
  se: (p) => p.secureElement.present,
  multisig: (p) => p.multisig === "strong",
};

export function applyFilters(products: ClientProduct[], s: FilterState): ClientProduct[] {
  const q = s.q.trim().toLowerCase();
  return products
    .filter((p) => !q || `${p.model} ${p.manufacturer}`.toLowerCase().includes(q))
    .filter((p) => s.filters.every((f) => TESTS[f](p)))
    .filter((p) => {
      if (s.maxPrice == null) return true;
      const price = p.prices.EUR ?? p.prices.USD ?? (p.prices.GBP != null ? p.prices.GBP * 1.17 : null);
      return price != null && price <= s.maxPrice;
    })
    .sort((a, b) => sortValue(a, s.sort) - sortValue(b, s.sort) || a.model.localeCompare(b.model));
}

export function parseFilterParams(sp: URLSearchParams): FilterState {
  const f = (sp.get("f") ?? "").split(",").filter((x): x is FilterKey => (FILTER_KEYS as readonly string[]).includes(x));
  const sort = sp.get("sort");
  const max = Number(sp.get("max"));
  return {
    q: sp.get("q") ?? "",
    filters: f,
    maxPrice: Number.isFinite(max) && max > 0 ? max : null,
    sort: sort && (SORT_KEYS as readonly string[]).includes(sort) ? (sort as SortKey) : "overall",
  };
}

/** Selected wallets from ?w=a,b,c — unknown slugs dropped, max four, de-duplicated. */
export function parseSelection(value: string | null, known: Set<string>): string[] {
  const out: string[] = [];
  for (const s of (value ?? "").split(",")) if (known.has(s) && !out.includes(s)) out.push(s);
  return out.slice(0, 4);
}

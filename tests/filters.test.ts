import { describe, expect, it } from "vitest";
import { applyFilters, parseFilterParams, parseSelection } from "@/lib/filters";
import { buildRows } from "@/lib/compare-rows";
import en from "@/lib/i18n/en";
import { pickPrice } from "@/lib/product-view";
import { fakeProduct } from "./helpers";

const a = fakeProduct({ slug: "a", model: "Alpha", bitcoinOnly: true, overall: 7, prices: { GBP: null, EUR: 150, USD: null } });
const b = fakeProduct({ slug: "b", model: "Beta", connectivity: ["usb", "bluetooth"], overall: 9, prices: { GBP: null, EUR: 60, USD: null } });

describe("comparison engine", () => {
  it("filters and sorts", () => {
    expect(applyFilters([a, b], { q: "", filters: [], maxPrice: null, sort: "overall" }).map((p) => p.slug)).toEqual(["b", "a"]);
    expect(applyFilters([a, b], { q: "", filters: ["nobt"], maxPrice: null, sort: "overall" }).map((p) => p.slug)).toEqual(["a"]);
    expect(applyFilters([a, b], { q: "alp", filters: [], maxPrice: null, sort: "overall" }).map((p) => p.slug)).toEqual(["a"]);
    expect(applyFilters([a, b], { q: "", filters: [], maxPrice: 100, sort: "overall" }).map((p) => p.slug)).toEqual(["b"]);
    expect(applyFilters([a, b], { q: "", filters: [], maxPrice: null, sort: "priceDesc" }).map((p) => p.slug)).toEqual(["a", "b"]);
  });

  it("parses shareable URLs safely", () => {
    const s = parseFilterParams(new URLSearchParams("f=btc,bogus&sort=priceAsc&max=200"));
    expect(s).toEqual({ q: "", filters: ["btc"], maxPrice: 200, sort: "priceAsc" });
    expect(parseSelection("a,a,x,b,c,d,e", new Set(["a", "b", "c", "d", "e"]))).toEqual(["a", "b", "c", "d"]);
  });

  it("marks rows that differ", () => {
    const rows = buildRows([a, b], en);
    expect(rows.find((r) => r.key === "bitcoinOnly")!.differs).toBe(true);
    expect(rows.find((r) => r.key === "passphrase")!.differs).toBe(false);
  });

  it("chooses the local currency and flags fallbacks", () => {
    expect(pickPrice({ GBP: 70, EUR: 80, USD: 90 }, "GB")).toEqual({ amount: 70, currency: "GBP", exact: true });
    expect(pickPrice({ GBP: null, EUR: 80, USD: 90 }, "GB")).toEqual({ amount: 80, currency: "EUR", exact: false });
    expect(pickPrice({ GBP: null, EUR: null, USD: null }, "DE")).toBeNull();
  });
});

import { cache } from "react";
import { listPublicProducts } from "./repo/products";
import { getWeights } from "./repo/settings";
import { toClientProduct, type ClientProduct } from "./product-view";
import type { Locale } from "./schemas";

/** All public products for a locale, as compact client-safe objects, sorted by overall score. */
export const getCatalog = cache(async (locale: Locale) => {
  const [products, weights] = await Promise.all([listPublicProducts(), getWeights()]);
  const list = products.map((p) => toClientProduct(p, locale, weights)).sort((a, b) => b.overall - a.overall || a.model.localeCompare(b.model));
  const map = new Map<string, ClientProduct>(list.map((p) => [p.slug, p]));
  return { list, map, weights, raw: products };
});

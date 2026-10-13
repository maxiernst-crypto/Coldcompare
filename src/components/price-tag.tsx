"use client";

import { formatMoney } from "@/lib/i18n";
import { pickPrice } from "@/lib/product-view";
import type { FactStatus, ProductData } from "@/lib/schemas";
import { usePrefs } from "./prefs";

export function PriceTag({ prices, status, compact = false }: { prices: ProductData["prices"]; status?: FactStatus; compact?: boolean }) {
  const { country, d, locale } = usePrefs();
  const p = pickPrice(prices, country);
  if (!p) return <span className="text-fg-subtle">{d.common.noPrice}</span>;
  const unverified = status !== "verified";
  const approx = unverified || !p.exact;
  return (
    <span className="inline-flex flex-col leading-tight">
      <span className="tabular font-semibold text-fg">
        {approx && <span className="font-normal text-fg-subtle">{d.common.approxPrice} </span>}
        {formatMoney(p.amount, p.currency, locale)}
      </span>
      {!compact && unverified && <span className="text-xs text-warn">{d.common.priceUnverified}</span>}
    </span>
  );
}

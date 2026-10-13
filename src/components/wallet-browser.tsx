"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { applyFilters, parseFilterParams } from "@/lib/filters";
import type { ClientProduct } from "@/lib/product-view";
import { FilterBar } from "./filter-bar";
import { ProductCard } from "./product-card";
import { usePrefs } from "./prefs";

export function WalletBrowser({ products }: { products: ClientProduct[] }) {
  const { d, locale } = usePrefs();
  const sp = useSearchParams();
  const [state, setState] = useState(() => parseFilterParams(new URLSearchParams(sp?.toString() ?? "")));
  const shown = useMemo(() => applyFilters(products, state), [products, state]);
  return (
    <div className="space-y-6">
      <FilterBar state={state} onChange={setState} count={shown.length} />
      {shown.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProductCard key={p.slug} p={p} locale={locale} d={d} placement="wallets-directory" />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-fg-muted">{d.compare.empty}</p>
      )}
    </div>
  );
}

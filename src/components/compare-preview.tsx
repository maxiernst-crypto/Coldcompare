"use client";

import Link from "next/link";
import { useState } from "react";
import type { ClientProduct } from "@/lib/product-view";
import { CompareTable } from "./compare-table";
import { usePrefs } from "./prefs";

const PREVIEW_ROWS = ["price", "overall", "bitcoinOnly", "secureElement", "openFirmware", "airGapped", "connectivity", "multisig"];

export function ComparePreview({ products }: { products: ClientProduct[] }) {
  const { d, locale } = usePrefs();
  const [selected, setSelected] = useState(products.slice(0, 3).map((p) => p.slug));
  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? (s.length > 1 ? s.filter((x) => x !== slug) : s) : s.length >= 3 ? [...s.slice(1), slug] : [...s, slug]));
  const chosen = selected.map((s) => products.find((p) => p.slug === s)).filter((p): p is ClientProduct => !!p);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={d.compare.pickPrompt}>
        {products.map((p) => {
          const on = selected.includes(p.slug);
          return (
            <button
              key={p.slug}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(p.slug)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${on ? "border-fg bg-fg text-bg" : "border-line bg-card text-fg-muted hover:border-line-strong"}`}
            >
              {p.model}
            </button>
          );
        })}
      </div>
      <CompareTable products={chosen} rowKeys={PREVIEW_ROWS} placement="home-compare-preview" />
      <div className="mt-4 flex justify-end">
        <Link href={`/${locale}/compare?w=${selected.join(",")}`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent-strong hover:underline">
          {d.home.openComparison} →
        </Link>
      </div>
    </div>
  );
}

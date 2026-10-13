import { buildRows } from "@/lib/compare-rows";
import type { Dictionary } from "@/lib/i18n/en";
import type { ClientProduct } from "@/lib/product-view";
import { PriceTag } from "./price-tag";
import { FactBadge } from "./ui";

export function SpecList({ p, d, extra = [] }: { p: ClientProduct; d: Dictionary; extra?: { label: string; value: string }[] }) {
  const rows = buildRows([p], d).filter((r) => r.kind !== "score");
  return (
    <dl className="divide-y divide-line rounded-2xl border border-line bg-card">
      {rows.map((r) => (
        <div key={r.key} className="grid gap-1 p-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
          <dt className="text-sm font-medium text-fg-muted">{r.label}</dt>
          <dd className="text-sm">
            {r.kind === "price" ? <PriceTag prices={p.prices} status={p.factStatus.price} /> : r.cells[0].text}
            {r.kind !== "price" && <FactBadge status={r.cells[0].status} d={d} />}
          </dd>
        </div>
      ))}
      {extra.map((e) => (
        <div key={e.label} className="grid gap-1 p-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
          <dt className="text-sm font-medium text-fg-muted">{e.label}</dt>
          <dd className="text-sm">{e.value}</dd>
        </div>
      ))}
    </dl>
  );
}

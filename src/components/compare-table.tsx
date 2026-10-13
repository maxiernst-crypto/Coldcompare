"use client";

import Link from "next/link";
import { bestIndex, buildRows, type Row, type Tone } from "@/lib/compare-rows";
import type { ClientProduct } from "@/lib/product-view";
import { BuyButton } from "./buy-button";
import { DeviceIllustration } from "./device";
import { PriceTag } from "./price-tag";
import { usePrefs } from "./prefs";
import { FactBadge, ScoreBadge } from "./ui";

const TONE: Record<Tone, string> = {
  good: "text-ok",
  bad: "text-danger",
  warn: "text-warn",
  neutral: "",
};

/**
 * Side-by-side attribute table. Mobile: horizontal scroll with a sticky attribute column.
 * Used by the interactive comparison engine and by [[table:...]] shortcodes in articles.
 */
export function CompareTable({
  products,
  onlyDiff = false,
  highlight = true,
  onRemove,
  placement,
  rowKeys,
}: {
  products: ClientProduct[];
  /** Restrict to these rows (e.g. for compact previews). */
  rowKeys?: string[];
  onlyDiff?: boolean;
  highlight?: boolean;
  onRemove?: (slug: string) => void;
  placement: string;
}) {
  const { d, locale } = usePrefs();
  const all = buildRows(products, d);
  const rows = rowKeys ? all.filter((r) => rowKeys.includes(r.key)) : all;
  const visible = onlyDiff && products.length > 1 ? rows.filter((r) => r.differs || r.key === "price") : rows;
  const groups: { name: string; rows: Row[] }[] = [];
  for (const r of visible) {
    const g = groups.at(-1);
    if (g && g.name === r.group) g.rows.push(r);
    else groups.push({ name: r.group, rows: [r] });
  }
  const colW = "min-w-[11rem] w-[11rem] sm:min-w-[13rem] sm:w-auto";

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-card">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{d.compare.title}</caption>
        <thead>
          <tr className="border-b border-line align-top">
            <th scope="col" className="sticky left-0 z-10 w-36 min-w-[8.5rem] bg-card p-3 text-left text-xs font-medium uppercase tracking-wide text-fg-subtle sm:w-48">
              {d.compare.attribute}
            </th>
            {products.map((p) => (
              <th key={p.slug} scope="col" className={`${colW} p-3 text-left font-normal`}>
                <div className="flex items-start justify-between gap-2">
                  <DeviceIllustration formFactor={p.formFactor} label={p.imageAlt} imageUrl={p.imageUrl} className="h-12 w-12" />
                  {onRemove && (
                    <button type="button" onClick={() => onRemove(p.slug)} className="rounded p-1 text-fg-subtle hover:bg-bg-subtle hover:text-fg" aria-label={`${d.compare.remove} ${p.model}`}>
                      ×
                    </button>
                  )}
                </div>
                <Link href={`/${locale}/wallets/${p.slug}`} className="mt-2 block font-semibold text-fg hover:text-accent-strong">
                  {p.model}
                </Link>
                <div className="mt-3">
                  <BuyButton slug={p.slug} locale={locale} placement={placement} label={d.common.checkPrice} variant="secondary" className="w-full !px-3 !py-2" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.name}>
            <tr>
              <th colSpan={products.length + 1} scope="colgroup" className="sticky left-0 bg-bg-subtle px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">
                {g.name}
              </th>
            </tr>
            {g.rows.map((r) => {
              const best = bestIndex(r);
              const diff = highlight && r.differs && products.length > 1;
              return (
                <tr key={r.key} className={`border-t border-line align-top ${diff ? "bg-accent-soft/40" : ""}`}>
                  <th scope="row" className="sticky left-0 z-10 bg-card p-3 text-left text-sm font-medium text-fg-muted">
                    {r.label}
                    {diff && <span className="sr-only"> (differs)</span>}
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={products[i].slug} className={`${colW} p-3 ${c.tone ? TONE[c.tone] : ""}`}>
                      {r.kind === "price" ? (
                        <PriceTag prices={products[i].prices} status={products[i].factStatus.price} />
                      ) : r.key === "overall" ? (
                        <ScoreBadge score={Number(c.text)} size="sm" />
                      ) : (
                        <span className={i === best && highlight ? "font-bold text-ok" : ""}>{c.text}</span>
                      )}
                      {r.kind !== "price" && c.status && c.status !== "manufacturer_claim" && <FactBadge status={c.status} d={d} />}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}

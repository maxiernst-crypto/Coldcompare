"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { applyFilters, parseFilterParams, parseSelection, type FilterState } from "@/lib/filters";
import type { ClientProduct } from "@/lib/product-view";
import { CompareTable } from "./compare-table";
import { DeviceIllustration } from "./device";
import { FilterBar } from "./filter-bar";
import { usePrefs } from "./prefs";

function toQuery(selected: string[], s: FilterState): string {
  const p = new URLSearchParams();
  if (selected.length) p.set("w", selected.join(","));
  if (s.q) p.set("q", s.q);
  if (s.filters.length) p.set("f", s.filters.join(","));
  if (s.maxPrice) p.set("max", String(s.maxPrice));
  if (s.sort !== "overall") p.set("sort", s.sort);
  const q = p.toString();
  return q ? `?${q.replace(/%2C/g, ",")}` : "";
}

export function CompareEngine({ products }: { products: ClientProduct[] }) {
  const { d } = usePrefs();
  const sp = useSearchParams();
  const known = useMemo(() => new Set(products.map((p) => p.slug)), [products]);
  const [selected, setSelected] = useState<string[]>(() => {
    const s = parseSelection(sp?.get("w") ?? null, known);
    return s.length ? s : products.slice(0, 2).map((p) => p.slug);
  });
  const [state, setState] = useState<FilterState>(() => parseFilterParams(new URLSearchParams(sp?.toString() ?? "")));
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [highlight, setHighlight] = useState(true);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  // Keep the URL shareable without adding history entries.
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}${toQuery(selected, state)}`);
  }, [selected, state]);

  const shown = useMemo(() => applyFilters(products, state), [products, state]);
  const chosen = selected.map((s) => products.find((p) => p.slug === s)).filter((p): p is ClientProduct => !!p);

  const toggle = (slug: string) => {
    setNotice("");
    setSelected((cur) => {
      if (cur.includes(slug)) return cur.filter((x) => x !== slug);
      if (cur.length >= 4) {
        setNotice(d.compare.maxReached);
        return cur;
      }
      return [...cur, slug];
    });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the URL bar already contains the shareable link */
    }
  };

  return (
    <div className="space-y-6">
      <FilterBar state={state} onChange={setState} count={shown.length} />

      <section aria-label={d.compare.pickPrompt}>
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {shown.map((p) => {
            const on = selected.includes(p.slug);
            return (
              <button
                key={p.slug}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(p.slug)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${on ? "border-fg bg-fg text-bg" : "border-line bg-card hover:border-line-strong"}`}
              >
                <DeviceIllustration formFactor={p.formFactor} label="" className="h-7 w-7" />
                <span>
                  <span className="block font-semibold">{p.model}</span>
                  <span className={`text-xs ${on ? "opacity-80" : "text-fg-subtle"}`}>{p.overall.toFixed(1)} / 10</span>
                </span>
              </button>
            );
          })}
          {!shown.length && <p className="text-sm text-fg-muted">{d.compare.empty}</p>}
        </div>
        <p role="status" aria-live="polite" className="min-h-5 text-sm text-warn">
          {notice}
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-medium">
          {d.compare.selected}: {chosen.length}/4
        </span>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} /> {d.compare.onlyDiff}
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} /> {d.compare.highlight}
        </label>
        <div className="ml-auto flex gap-2">
          {chosen.length > 0 && (
            <button type="button" onClick={() => setSelected([])} className="rounded-lg border border-line px-3 py-1.5 hover:border-line-strong">
              {d.compare.clear}
            </button>
          )}
          <button type="button" onClick={share} className="rounded-lg border border-line-strong px-3 py-1.5 font-medium hover:border-accent" title={d.compare.shareTitle}>
            {copied ? d.common.copied : d.common.copyLink}
          </button>
        </div>
      </div>

      {chosen.length ? (
        <CompareTable products={chosen} onlyDiff={onlyDiff} highlight={highlight} onRemove={toggle} placement="compare-engine" />
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-fg-muted">{d.compare.pickPrompt}</p>
      )}
      <p className="text-xs text-fg-subtle">{d.common.claimsNote}</p>
    </div>
  );
}

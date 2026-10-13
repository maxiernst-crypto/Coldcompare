"use client";

import { FILTER_KEYS, SORT_KEYS, type FilterKey, type FilterState, type SortKey } from "@/lib/filters";
import { usePrefs } from "./prefs";

export function FilterBar({ state, onChange, count }: { state: FilterState; onChange: (s: FilterState) => void; count: number }) {
  const { d } = usePrefs();
  const labels: Record<FilterKey, string> = {
    btc: d.compare.filterBtcOnly,
    airgap: d.compare.filterAirgap,
    open: d.compare.filterOpen,
    nobt: d.compare.filterBluetooth,
    se: d.compare.filterSE,
    multisig: d.attrs.multisig,
  };
  const toggle = (f: FilterKey) => onChange({ ...state, filters: state.filters.includes(f) ? state.filters.filter((x) => x !== f) : [...state.filters, f] });
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="block">
          <span className="sr-only">{d.compare.search}</span>
          <input
            type="search"
            value={state.q}
            onChange={(e) => onChange({ ...state, q: e.target.value })}
            placeholder={d.compare.search}
            className="w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          {d.compare.maxPrice}
          <select
            value={state.maxPrice ?? ""}
            onChange={(e) => onChange({ ...state, maxPrice: e.target.value ? Number(e.target.value) : null })}
            className="rounded-lg border border-line-strong bg-bg px-2 py-2 text-sm"
          >
            <option value="">—</option>
            {[100, 150, 200, 300, 400].map((v) => (
              <option key={v} value={v}>
                ≤ {v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          {d.compare.sortBy}
          <select value={state.sort} onChange={(e) => onChange({ ...state, sort: e.target.value as SortKey })} className="rounded-lg border border-line-strong bg-bg px-2 py-2 text-sm">
            {SORT_KEYS.map((k) => (
              <option key={k} value={k}>
                {d.compare.sort[k]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={d.compare.filters}>
        {FILTER_KEYS.map((f) => {
          const on = state.filters.includes(f);
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(f)}
              className={`rounded-full border px-3 py-1 text-sm transition ${on ? "border-accent bg-accent-soft font-medium text-accent-strong" : "border-line text-fg-muted hover:border-line-strong"}`}
            >
              {labels[f]}
            </button>
          );
        })}
        <span className="ml-auto text-sm text-fg-subtle" aria-live="polite">
          {d.compare.results.replace("{n}", String(count))}
        </span>
      </div>
    </div>
  );
}

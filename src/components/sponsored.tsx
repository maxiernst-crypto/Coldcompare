import type { Dictionary } from "@/lib/i18n/en";
import type { SiteSettings } from "@/lib/repo/settings";

/** Paid placement: visually distinct from editorial content, explicitly labelled, rel="sponsored". */
export function SponsoredSlot({ settings, d }: { settings: SiteSettings; d: Dictionary }) {
  const s = settings.sponsored;
  if (!settings.sponsoredSlotsEnabled || !s.url || !s.title || !s.sponsor) return null;
  return (
    <aside aria-label={d.common.sponsored} className="rounded-2xl border-2 border-dashed border-line-strong bg-bg-subtle p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">
        {d.common.sponsored} · {s.sponsor}
      </p>
      <a href={s.url} rel="sponsored nofollow noopener" target="_blank" className="mt-2 block font-semibold hover:underline">
        {s.title} ↗
      </a>
      {s.text && <p className="mt-1 text-sm text-fg-muted">{s.text}</p>}
    </aside>
  );
}

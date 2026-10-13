import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/en";
import type { ClientProduct } from "@/lib/product-view";
import type { Locale } from "@/lib/schemas";
import { BuyButton } from "./buy-button";
import { DeviceIllustration } from "./device";
import { PriceTag } from "./price-tag";
import { Pill, ScoreBadge } from "./ui";

export function ProductCard({ p, locale, d, rank, label, placement }: { p: ClientProduct; locale: Locale; d: Dictionary; rank?: number; label?: string; placement: string }) {
  const critical = p.advisories.some((a) => a.severity === "critical");
  return (
    <article className="group relative flex flex-col rounded-2xl border border-line bg-card p-5 transition hover:border-line-strong hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-bg-subtle">
          <DeviceIllustration formFactor={p.formFactor} label={p.imageAlt} imageUrl={p.imageUrl} className="h-16 w-16" />
          {rank != null && <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-fg text-xs font-bold text-bg">{rank}</span>}
        </div>
        <div className="min-w-0 flex-1">
          {label && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-strong">{label}</p>}
          <h3 className="text-lg font-semibold leading-snug">
            <Link href={`/${locale}/wallets/${p.slug}`} className="after:absolute after:inset-0">
              {p.model}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{p.tagline}</p>
        </div>
        <ScoreBadge score={p.overall} label={d.common.editorialScore} />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.bitcoinOnly ? <Pill tone="accent">{d.compare.filterBtcOnly}</Pill> : p.btcOnlyFirmware ? <Pill>{d.attrs.btcOnlyFirmware}</Pill> : null}
        {p.secureElement.present && <Pill>{d.attrs.secureElement}</Pill>}
        {p.openFirmware === "yes" && <Pill tone="ok">{d.compare.filterOpen}</Pill>}
        {p.airGapped !== "no" && <Pill>{d.compare.filterAirgap}</Pill>}
        {critical && <Pill tone="danger">{d.attrs.advisories}</Pill>}
      </div>
      <div className="relative z-10 mt-auto flex items-end justify-between gap-3 pt-5">
        <PriceTag prices={p.prices} status={p.factStatus.price} />
        <BuyButton slug={p.slug} locale={locale} placement={placement} label={d.common.checkPrice} variant="secondary" />
      </div>
    </article>
  );
}

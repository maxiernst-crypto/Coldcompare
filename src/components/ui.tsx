import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/en";
import { formatDate, pick } from "@/lib/i18n";
import type { Advisory, FactStatus, Locale } from "@/lib/schemas";
import { absolute } from "@/lib/site";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function ScoreBadge({ score, size = "md", label }: { score: number; size?: "sm" | "md" | "lg"; label?: string }) {
  const tone = score >= 8 ? "border-ok text-ok" : score >= 7 ? "border-fg-muted text-fg" : score >= 6 ? "border-warn text-warn" : "border-danger text-danger";
  const dims = size === "lg" ? "h-16 w-16 text-2xl" : size === "sm" ? "h-9 w-9 text-sm" : "h-12 w-12 text-lg";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 bg-card font-bold tabular ${tone} ${dims}`} title={label} aria-label={label ? `${label}: ${score.toFixed(1)} / 10` : undefined}>
      {score.toFixed(1)}
    </span>
  );
}

const FACT_STYLE: Record<FactStatus, string> = {
  verified: "bg-ok-soft text-ok",
  manufacturer_claim: "bg-info-soft text-info",
  unverified: "bg-warn-soft text-warn",
};

export function FactBadge({ status, d }: { status: FactStatus | undefined; d: Dictionary }) {
  if (!status) return null;
  return <span className={`ml-1.5 inline-block rounded px-1.5 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wide ${FACT_STYLE[status]}`}>{d.fact[status]}</span>;
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" | "ok" | "warn" | "danger" }) {
  const t = {
    neutral: "bg-bg-subtle text-fg-muted border-line",
    accent: "bg-accent-soft text-accent-strong border-transparent",
    ok: "bg-ok-soft text-ok border-transparent",
    warn: "bg-warn-soft text-warn border-transparent",
    danger: "bg-danger-soft text-danger border-transparent",
  }[tone];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${t}`}>{children}</span>;
}

export function SectionHeading({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {sub && <p className="mt-2 text-fg-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  // JSON.stringify output is safe inside <script> once "<" is escaped.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Breadcrumbs({ items, d }: { items: { name: string; href: string }[]; d: Dictionary }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absolute(it.href) })),
  };
  return (
    <nav aria-label={d.common.breadcrumbs} className="text-sm text-fg-subtle">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-fg-muted">
                {it.name}
              </span>
            ) : (
              <Link href={it.href} className="hover:text-fg">
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={ld} />
    </nav>
  );
}

export function PreviewBanner({ d }: { d: Dictionary }) {
  return (
    <div role="status" className="border-b border-warn/30 bg-warn-soft px-4 py-2 text-center text-sm font-medium text-warn">
      {d.common.previewBanner}
    </div>
  );
}

export function SeedWarning({ d, compact = false }: { d: Dictionary; compact?: boolean }) {
  return (
    <div role="note" className={`flex gap-3 rounded-xl border border-danger/25 bg-danger-soft text-danger ${compact ? "p-3 text-xs" : "p-4 text-sm"}`}>
      <svg aria-hidden className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
      <p>{d.common.seedWarning}</p>
    </div>
  );
}

export function AffiliateNote({ d, locale }: { d: Dictionary; locale: Locale }) {
  return (
    <p className="text-xs text-fg-subtle">
      {d.common.affiliateShort}{" "}
      <Link href={`/${locale}/affiliate-disclosure`} className="underline underline-offset-2 hover:text-fg">
        {d.common.learnMore}
      </Link>
    </p>
  );
}

export function AdvisoryList({ advisories, locale, d }: { advisories: Advisory[]; locale: Locale; d: Dictionary }) {
  if (!advisories.length) return null;
  const sorted = [...advisories].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <ul className="space-y-3">
      {sorted.map((a) => {
        const tone = a.severity === "critical" ? "border-danger/40 bg-danger-soft" : a.severity === "warning" ? "border-warn/40 bg-warn-soft" : "border-line bg-bg-subtle";
        return (
          <li key={a.date + pick(a.title, "en")} className={`rounded-xl border p-4 ${tone}`}>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Pill tone={a.severity === "critical" ? "danger" : a.severity === "warning" ? "warn" : "neutral"}>{a.severity}</Pill>
              <time dateTime={a.date} className="text-fg-subtle">
                {formatDate(a.date, locale)}
              </time>
            </div>
            <p className="mt-2 font-semibold">{pick(a.title, locale)}</p>
            <p className="mt-1 text-sm text-fg-muted">{pick(a.summary, locale)}</p>
            {a.url && (
              <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium text-accent-strong underline underline-offset-2">
                {d.common.sources} ↗
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Faq({ faqs, d }: { faqs: { q: string; a: string }[]; d: Dictionary }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq" className="mt-12">
      <h2 id="faq" className="text-2xl font-bold tracking-tight">
        {d.common.faq}
      </h2>
      <div className="mt-4 divide-y divide-line rounded-xl border border-line bg-card">
        {faqs.map((f) => (
          <details key={f.q} className="group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {f.q}
              <span aria-hidden className="text-fg-subtle transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 text-fg-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </section>
  );
}

export function Sources({ sources, d }: { sources: { label: string; url: string }[]; d: Dictionary }) {
  if (!sources.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">{d.common.sources}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-muted">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fg">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

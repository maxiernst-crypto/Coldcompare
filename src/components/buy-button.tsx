import type { Locale } from "@/lib/schemas";

/**
 * Outbound purchase link. Always routes through /go/<slug> so the destination (country-specific
 * retailer, affiliate or not) is managed centrally and clicks are counted without personal data.
 * rel="sponsored nofollow" is applied because the destination may be an affiliate link.
 */
export function BuyButton({
  slug,
  locale,
  placement,
  label,
  variant = "primary",
  className = "",
}: {
  slug: string;
  locale: Locale;
  placement: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const href = `/go/${encodeURIComponent(slug)}?l=${locale}&p=${encodeURIComponent(placement)}`;
  const styles =
    variant === "primary"
      ? "bg-fg text-bg hover:opacity-90"
      : "border border-line-strong bg-card text-fg hover:border-accent hover:text-accent-strong";
  return (
    <a
      href={href}
      rel="sponsored nofollow noopener"
      target="_blank"
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${styles} ${className}`}
      data-placement={placement}
    >
      {label}
      <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}

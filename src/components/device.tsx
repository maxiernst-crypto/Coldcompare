import type { FormFactor } from "@/lib/schemas";

/**
 * Neutral product illustration by form factor. Used until properly licensed product photos are added
 * in the admin (with credit and licence). Not a depiction of any specific manufacturer's design.
 */
export function DeviceIllustration({ formFactor, label, className = "", imageUrl }: { formFactor: FormFactor; label: string; className?: string; imageUrl?: string | null }) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={label} loading="lazy" decoding="async" className={`object-contain ${className}`} />;
  }
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={label} className={className}>
      <defs>
        <linearGradient id={`g-${formFactor}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--border-strong)" />
          <stop offset="1" stopColor="var(--border)" />
        </linearGradient>
      </defs>
      {formFactor === "stick" && (
        <g>
          <rect x="22" y="44" width="72" height="32" rx="10" fill={`url(#g-${formFactor})`} />
          <rect x="94" y="52" width="10" height="16" rx="2" fill="var(--fg-subtle)" />
          <rect x="34" y="52" width="40" height="16" rx="3" fill="var(--fg)" />
          <rect x="38" y="58" width="14" height="3" rx="1.5" fill="var(--accent)" />
        </g>
      )}
      {formFactor === "candybar" && (
        <g>
          <rect x="32" y="20" width="56" height="80" rx="12" fill={`url(#g-${formFactor})`} />
          <rect x="40" y="30" width="40" height="34" rx="4" fill="var(--fg)" />
          <rect x="45" y="44" width="18" height="3" rx="1.5" fill="var(--accent)" />
          <circle cx="50" cy="80" r="6" fill="var(--fg-subtle)" />
          <circle cx="70" cy="80" r="6" fill="var(--fg-subtle)" />
        </g>
      )}
      {formFactor === "touch" && (
        <g>
          <rect x="28" y="16" width="64" height="88" rx="14" fill={`url(#g-${formFactor})`} />
          <rect x="35" y="24" width="50" height="72" rx="8" fill="var(--fg)" />
          <circle cx="60" cy="52" r="10" fill="none" stroke="var(--accent)" strokeWidth="3" />
          <rect x="45" y="78" width="30" height="5" rx="2.5" fill="var(--fg-subtle)" />
        </g>
      )}
      {formFactor === "phone" && (
        <g>
          <rect x="30" y="10" width="60" height="100" rx="12" fill={`url(#g-${formFactor})`} />
          <rect x="36" y="18" width="48" height="84" rx="6" fill="var(--fg)" />
          <rect x="44" y="40" width="32" height="32" rx="3" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
          <rect x="50" y="46" width="8" height="8" fill="var(--accent)" />
          <rect x="62" y="58" width="8" height="8" fill="var(--accent)" />
        </g>
      )}
      {formFactor === "keyboard" && (
        <g>
          <rect x="26" y="14" width="68" height="92" rx="10" fill={`url(#g-${formFactor})`} />
          <rect x="33" y="22" width="54" height="36" rx="4" fill="var(--fg)" />
          <rect x="38" y="34" width="22" height="3" rx="1.5" fill="var(--accent)" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={35 + (i % 4) * 13} y={66 + Math.floor(i / 4) * 12} width="10" height="8" rx="2" fill="var(--fg-subtle)" />
          ))}
        </g>
      )}
      {formFactor === "card" && (
        <g>
          <rect x="16" y="34" width="88" height="56" rx="8" fill={`url(#g-${formFactor})`} />
          <rect x="28" y="50" width="18" height="14" rx="3" fill="var(--accent)" />
          <path d="M78 52a10 10 0 0 1 0 14M84 47a17 17 0 0 1 0 24" stroke="var(--fg-subtle)" strokeWidth="2.5" fill="none" />
        </g>
      )}
    </svg>
  );
}

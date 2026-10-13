import type { AffiliateLink, Country } from "./schemas";

/**
 * Pick the outbound link for a visitor's country.
 * Order: exact country match → global fallback ('*'); within those, active before placeholder,
 * then by editorial priority. Paused links are never used. Commission is deliberately NOT a factor.
 */
export function selectLink(links: AffiliateLink[], country: string): AffiliateLink | null {
  const usable = links.filter((l) => l.status !== "paused");
  const rank = (l: AffiliateLink) => [l.country === country ? 0 : l.country === "*" ? 1 : 2, l.status === "active" ? 0 : 1, -l.priority] as const;
  const candidates = usable.filter((l) => l.country === country || l.country === "*");
  candidates.sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i];
    return 0;
  });
  return candidates[0] ?? null;
}

export function buildOutboundUrl(link: Pick<AffiliateLink, "url" | "addUtm">, opts: { utmSource: string; campaign?: string; content?: string }): string {
  if (!link.addUtm) return link.url;
  let url: URL;
  try {
    url = new URL(link.url);
  } catch {
    return link.url;
  }
  if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", opts.utmSource);
  if (!url.searchParams.has("utm_medium")) url.searchParams.set("utm_medium", "referral");
  if (opts.campaign && !url.searchParams.has("utm_campaign")) url.searchParams.set("utm_campaign", opts.campaign);
  if (opts.content && !url.searchParams.has("utm_content")) url.searchParams.set("utm_content", opts.content);
  return url.toString();
}

/** Resolve the visitor's country from an explicit preference cookie, then the CDN geo header. */
export function resolveCountry(pref: string | undefined, geoHeader: string | null): Country {
  const p = pref?.toUpperCase();
  if (p === "GB" || p === "DE" || p === "INTL") return p;
  const g = geoHeader?.toUpperCase();
  if (g === "GB" || g === "UK") return "GB";
  if (g === "DE" || g === "AT" || g === "CH") return "DE";
  return "INTL";
}

/** The `rel` value for an outbound commercial link. */
export function relFor(isAffiliate: boolean): string {
  return isAffiliate ? "sponsored nofollow noopener" : "nofollow noopener";
}

export function isSafeHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

import { describe, expect, it } from "vitest";
import { buildOutboundUrl, isSafeHttpUrl, relFor, resolveCountry, selectLink } from "@/lib/affiliate";
import type { AffiliateLink } from "@/lib/schemas";

const link = (over: Partial<AffiliateLink>): AffiliateLink => ({
  id: Math.random().toString(36),
  productSlug: "w",
  country: "*",
  retailer: "Official",
  isOfficial: true,
  network: "none",
  url: "https://example.com/p",
  isAffiliate: false,
  status: "placeholder",
  addUtm: false,
  priority: 0,
  commissionNote: null,
  lastCheckedAt: null,
  lastStatusCode: null,
  lastCheckError: null,
  ...over,
});

describe("affiliate link selection", () => {
  it("prefers the visitor's country over the fallback", () => {
    const gb = link({ country: "GB", url: "https://gb.example" });
    const any = link({ country: "*", status: "active" });
    expect(selectLink([any, gb], "GB")).toBe(gb);
    expect(selectLink([any, gb], "DE")).toBe(any);
  });

  it("prefers active over placeholder, then priority", () => {
    const a = link({ status: "placeholder", priority: 10 });
    const b = link({ status: "active", priority: 0 });
    const c = link({ status: "active", priority: 5 });
    expect(selectLink([a, b, c], "DE")).toBe(c);
  });

  it("never uses paused links and returns null when nothing applies", () => {
    expect(selectLink([link({ status: "paused" })], "GB")).toBeNull();
    expect(selectLink([link({ country: "DE" })], "GB")).toBeNull();
  });

  it("ignores commission notes entirely", () => {
    const a = link({ status: "active", priority: 1, commissionNote: "50%" });
    const b = link({ status: "active", priority: 2, commissionNote: "1%" });
    expect(selectLink([a, b], "GB")).toBe(b);
  });

  it("adds UTM parameters only when enabled and never overwrites existing ones", () => {
    expect(buildOutboundUrl({ url: "https://x.com/a", addUtm: false }, { utmSource: "cc" })).toBe("https://x.com/a");
    const u = new URL(buildOutboundUrl({ url: "https://x.com/a?utm_source=partner", addUtm: true }, { utmSource: "cc", campaign: "review" }));
    expect(u.searchParams.get("utm_source")).toBe("partner");
    expect(u.searchParams.get("utm_campaign")).toBe("review");
  });

  it("resolves country from preference first, then geo header", () => {
    expect(resolveCountry("DE", "GB")).toBe("DE");
    expect(resolveCountry(undefined, "AT")).toBe("DE");
    expect(resolveCountry(undefined, "GB")).toBe("GB");
    expect(resolveCountry(undefined, "US")).toBe("INTL");
    expect(resolveCountry("xx", null)).toBe("INTL");
  });

  it("marks affiliate links as sponsored", () => {
    expect(relFor(true)).toContain("sponsored");
    expect(relFor(false)).not.toContain("sponsored");
  });

  it("only accepts http(s) URLs", () => {
    expect(isSafeHttpUrl("https://a.com")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("not a url")).toBe(false);
  });
});

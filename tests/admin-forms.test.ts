import { describe, expect, it } from "vitest";
import { EDITORIAL_CHECKLIST, FormError, parseArticleForm, parseCsv, parseProductForm, toCsv } from "@/lib/admin-forms";

function fd(entries: Record<string, string | string[]>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) for (const x of Array.isArray(v) ? v : [v]) f.append(k, x);
  return f;
}

const article = { type: "learn", locale: "en", slug: "test-article", title: "Test", body: "Hello", status: "draft" };

describe("article form", () => {
  it("parses a draft", () => {
    const a = parseArticleForm(fd({ ...article, "faq.0.q": "Q?", "faq.0.a": "A.", "faq.1.q": "", productSlugs: "a, b" }), { canPublish: false });
    expect(a.data.faqs).toEqual([{ q: "Q?", a: "A." }]);
    expect(a.productSlugs).toEqual(["a", "b"]);
    expect(a.translationKey).toBe("learn-test-article");
  });

  it("prevents writers from publishing", () => {
    expect(() => parseArticleForm(fd({ ...article, status: "published" }), { canPublish: false })).toThrow(FormError);
  });

  it("requires the full editorial checklist and a fact-check date to publish", () => {
    const checks = Object.fromEntries(EDITORIAL_CHECKLIST.map((_, i) => [`check.${i}`, "on"]));
    expect(() => parseArticleForm(fd({ ...article, status: "published", reviewedAt: "2026-10-13" }), { canPublish: true })).toThrow(/checklist/);
    expect(() => parseArticleForm(fd({ ...article, status: "published", ...checks }), { canPublish: true })).toThrow(/fact-check/);
    expect(parseArticleForm(fd({ ...article, status: "published", reviewedAt: "2026-10-13", ...checks }), { canPublish: true }).status).toBe("published");
  });

  it("rejects bad slugs", () => {
    expect(() => parseArticleForm(fd({ ...article, slug: "Bad Slug" }), { canPublish: true })).toThrow(/Slug/);
  });
});

describe("product form", () => {
  const minimal = {
    slug: "new-wallet",
    model: "New Wallet",
    manufacturerSlug: "trezor",
    status: "draft",
    formFactor: "stick",
    "open.firmware": "yes",
    "open.hardware": "no",
    airGapped: "no",
    multisig: "basic",
    officialUrl: "https://example.com",
    connectivity: ["usb", "evil"],
    "price.EUR": "99,5",
    "score.security": "8",
    "adv.0.date": "2026-01-01",
    "adv.0.severity": "warning",
    "adv.0.title.en": "Thing",
    "adv.1.date": "",
  };
  it("parses, whitelists enum values and handles decimal commas", () => {
    const p = parseProductForm(fd(minimal));
    expect(p.data.connectivity).toEqual(["usb"]);
    expect(p.data.prices.EUR).toBe(99.5);
    expect(p.data.advisories).toHaveLength(1);
    expect(p.data.factStatus.price).toBe("unverified");
  });
  it("rejects out-of-range scores", () => {
    expect(() => parseProductForm(fd({ ...minimal, "score.security": "11" }))).toThrow(FormError);
  });
});

describe("csv", () => {
  it("round-trips quoted values", () => {
    const rows = [["a", 'b "q"', "c,d"], ["1", "2", "line\nbreak"]];
    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });
});

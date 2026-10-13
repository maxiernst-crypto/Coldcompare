import { describe, expect, it } from "vitest";
import { parseAnswers, recommend, scoreProduct, type QuizAnswers } from "@/lib/quiz";
import { fakeProduct } from "./helpers";

const base: QuizAnswers = { assets: "btc", experience: "beginner", budget: "any", platform: "desktop", openSource: "indifferent", airgap: "indifferent", multisig: "no", style: "simple" };

describe("wallet quiz", () => {
  it("excludes Bitcoin-only devices for multi-asset users", () => {
    expect(scoreProduct(fakeProduct({ bitcoinOnly: true }), { ...base, assets: "multi" })).toBeNull();
  });

  it("excludes non-air-gapped devices when air-gap is required", () => {
    expect(scoreProduct(fakeProduct({ airGapped: "no" }), { ...base, airgap: "required" })).toBeNull();
    expect(scoreProduct(fakeProduct({ airGapped: "optional" }), { ...base, airgap: "required" })).not.toBeNull();
  });

  it("excludes closed firmware when open source is essential", () => {
    expect(scoreProduct(fakeProduct({ openFirmware: "no" }), { ...base, openSource: "essential" })).toBeNull();
  });

  it("excludes devices without the required platform", () => {
    expect(scoreProduct(fakeProduct({ platforms: ["windows"] }), { ...base, platform: "mobile" })).toBeNull();
  });

  it("penalises and flags products over budget", () => {
    const cheap = scoreProduct(fakeProduct({ prices: { GBP: null, EUR: 80, USD: null } }), { ...base, budget: "lt100" })!;
    const dear = scoreProduct(fakeProduct({ prices: { GBP: null, EUR: 300, USD: null } }), { ...base, budget: "lt100" })!;
    expect(cheap.reasons).toContain("inBudget");
    expect(dear.limitations).toContain("overBudget");
    expect(dear.score).toBeLessThan(cheap.score);
  });

  it("returns at most three recommendations, ranked deterministically", () => {
    const products = Array.from({ length: 6 }, (_, i) => fakeProduct({ slug: `w${i}`, overall: 5 + i * 0.5, scores: { security: 5 + i * 0.5, backup: 8, usability: 8, privacy: 8, features: 8, value: 8 } }));
    const r = recommend(products, base);
    expect(r.top).toHaveLength(3);
    expect(r.top[0].slug).toBe("w5");
    expect(r.alternatives.map((x) => x.slug)).toEqual(["w2", "w1", "w0"]);
  });

  it("flags recent critical advisories and lowers the score", () => {
    const now = new Date("2026-10-13");
    const clean = scoreProduct(fakeProduct(), base, now)!;
    const flagged = scoreProduct(fakeProduct({ advisories: [{ date: "2026-07-31", severity: "critical", title: "x" }] }), base, now)!;
    expect(flagged.security).toContain("advisory");
    expect(flagged.score).toBeLessThan(clean.score);
  });

  it("does not take commercial data as input", () => {
    // The quiz input type has no affiliate/commission fields; an object with them scores identically.
    const p = fakeProduct();
    const withCommercial = { ...p, commission: 50, isAffiliate: true } as typeof p;
    expect(scoreProduct(withCommercial, base)).toEqual(scoreProduct(p, base));
  });

  it("parses answers from URL params and rejects incomplete/invalid ones", () => {
    expect(parseAnswers({ ...base })).toEqual(base);
    expect(parseAnswers({ ...base, budget: "free" })).toBeNull();
    expect(parseAnswers({ assets: "btc" })).toBeNull();
  });
});

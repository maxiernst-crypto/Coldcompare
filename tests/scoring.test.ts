import { describe, expect, it } from "vitest";
import { DEFAULT_WEIGHTS, normalizeWeights, overallScore, scoreBreakdown, validateWeights } from "@/lib/scoring";

describe("scoring model", () => {
  it("default weights match the published methodology and total 100", () => {
    expect(DEFAULT_WEIGHTS).toEqual({ security: 35, backup: 20, usability: 15, privacy: 15, features: 10, value: 5 });
    expect(validateWeights(DEFAULT_WEIGHTS)).toBeNull();
  });

  it("computes a reproducible weighted average", () => {
    const s = { security: 10, backup: 5, usability: 5, privacy: 5, features: 5, value: 5 };
    // (10*35 + 5*65) / 100 = 6.75 → 6.8
    expect(overallScore(s)).toBe(6.8);
  });

  it("uniform scores give the same overall regardless of weights", () => {
    const s = { security: 7, backup: 7, usability: 7, privacy: 7, features: 7, value: 7 };
    expect(overallScore(s, { security: 1, backup: 0, usability: 0, privacy: 0, features: 0, value: 99 })).toBe(7);
  });

  it("rejects weights that don't add to 100", () => {
    expect(validateWeights({ ...DEFAULT_WEIGHTS, value: 10 })).toMatch(/100/);
  });

  it("normalizes invalid inputs back to defaults", () => {
    expect(normalizeWeights({ security: Number.NaN, backup: -1 })).toEqual(DEFAULT_WEIGHTS);
  });

  it("breakdown contributions sum to the overall score", () => {
    const s = { security: 8.5, backup: 8.5, usability: 8.5, privacy: 8.5, features: 7, value: 8 };
    const sum = scoreBreakdown(s).reduce((a, b) => a + b.contribution, 0);
    expect(Math.round(sum * 10) / 10).toBe(overallScore(s));
  });
});

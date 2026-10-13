import { SCORE_KEYS, type ScoreKey, type ProductData } from "./schemas";

export type Weights = Record<ScoreKey, number>;

/** Default editorial weights (percent). Editable in Admin → Settings. */
export const DEFAULT_WEIGHTS: Weights = {
  security: 35,
  backup: 20,
  usability: 15,
  privacy: 15,
  features: 10,
  value: 5,
};

export function normalizeWeights(w: Partial<Weights>): Weights {
  const out = { ...DEFAULT_WEIGHTS };
  for (const k of SCORE_KEYS) {
    const v = Number(w[k]);
    if (Number.isFinite(v) && v >= 0) out[k] = v;
  }
  return out;
}

export function validateWeights(w: Weights): string | null {
  const total = SCORE_KEYS.reduce((s, k) => s + w[k], 0);
  if (Math.abs(total - 100) > 0.001) return `Weights must add up to 100 (currently ${total}).`;
  return null;
}

/** Weighted overall score on a 0–10 scale, rounded to one decimal. Reproducible: sum(score_i * weight_i) / sum(weight_i). */
export function overallScore(scores: ProductData["scores"], weights: Weights = DEFAULT_WEIGHTS): number {
  let total = 0;
  let wsum = 0;
  for (const k of SCORE_KEYS) {
    total += scores[k] * weights[k];
    wsum += weights[k];
  }
  if (wsum === 0) return 0;
  return Math.round((total / wsum) * 10) / 10;
}

export function scoreBreakdown(scores: ProductData["scores"], weights: Weights = DEFAULT_WEIGHTS) {
  const wsum = SCORE_KEYS.reduce((s, k) => s + weights[k], 0) || 1;
  return SCORE_KEYS.map((k) => ({
    key: k,
    score: scores[k],
    weight: weights[k],
    contribution: Math.round(((scores[k] * weights[k]) / wsum) * 100) / 100,
  }));
}

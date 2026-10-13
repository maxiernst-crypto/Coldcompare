import type { ClientProduct } from "./product-view";

/** The product attributes the quiz uses — deliberately nothing commercial (no affiliate or commission data). */
export type QuizProduct = Pick<
  ClientProduct,
  | "slug"
  | "overall"
  | "prices"
  | "bitcoinOnly"
  | "btcOnlyFirmware"
  | "assetBreadth"
  | "airGapped"
  | "openFirmware"
  | "platforms"
  | "connectivity"
  | "multisig"
  | "passphrase"
  | "scores"
  | "secureElement"
  | "advisories"
> & { discontinued?: boolean };

export interface QuizAnswers {
  assets: "btc" | "multi";
  experience: "beginner" | "experienced";
  budget: "lt100" | "lt200" | "lt400" | "any";
  platform: "mobile" | "desktop" | "both";
  openSource: "essential" | "preferred" | "indifferent";
  airgap: "required" | "preferred" | "indifferent";
  multisig: "yes" | "maybe" | "no";
  style: "simple" | "advanced";
}

export const QUIZ_QUESTIONS: { key: keyof QuizAnswers; options: string[] }[] = [
  { key: "assets", options: ["btc", "multi"] },
  { key: "experience", options: ["beginner", "experienced"] },
  { key: "budget", options: ["lt100", "lt200", "lt400", "any"] },
  { key: "platform", options: ["mobile", "desktop", "both"] },
  { key: "openSource", options: ["essential", "preferred", "indifferent"] },
  { key: "airgap", options: ["required", "preferred", "indifferent"] },
  { key: "multisig", options: ["yes", "maybe", "no"] },
  { key: "style", options: ["simple", "advanced"] },
];

export type ReasonCode =
  | "btcOnly"
  | "btcOnlyFirmware"
  | "manyAssets"
  | "beginnerFriendly"
  | "strongSecurity"
  | "mobileReady"
  | "desktopReady"
  | "openSource"
  | "airGapped"
  | "airGapOptional"
  | "multisig"
  | "inBudget"
  | "advancedControls"
  | "simpleSetup";

export type LimitationCode =
  | "overBudget"
  | "multiAttackSurface"
  | "learningCurve"
  | "sourceAvailable"
  | "closedSource"
  | "multisigBasic"
  | "noMultisig"
  | "noMobile"
  | "noDesktop"
  | "fewAssets"
  | "priceUnverified";

export type SecurityCode = "secureElement" | "noSecureElement" | "bluetoothSurface" | "advisory" | "buyOfficial" | "backupTest";

export interface QuizResult {
  slug: string;
  score: number;
  reasons: ReasonCode[];
  limitations: LimitationCode[];
  security: SecurityCode[];
}

const BUDGET_MAX: Record<QuizAnswers["budget"], number> = { lt100: 100, lt200: 200, lt400: 400, any: Infinity };

/** Reference price for budget comparisons: EUR, else USD, else GBP converted roughly. */
export function referencePrice(p: Pick<QuizProduct, "prices">): number | null {
  const { EUR, USD, GBP } = p.prices;
  if (EUR != null) return EUR;
  if (USD != null) return USD;
  if (GBP != null) return Math.round(GBP * 1.17);
  return null;
}

/**
 * Transparent, rule-based matching. Inputs are product characteristics and the published editorial scores only.
 * Affiliate status and commission are not inputs to this function.
 */
export function scoreProduct(p: QuizProduct, a: QuizAnswers, now = new Date()): QuizResult | null {
  const d = p;
  if (p.discontinued) return null;
  if (a.assets === "multi" && d.bitcoinOnly) return null;
  if (a.airgap === "required" && d.airGapped === "no") return null;
  if (a.openSource === "essential" && (d.openFirmware === "no" || d.openFirmware === "unknown")) return null;

  const mobile = d.platforms.includes("ios") || d.platforms.includes("android");
  const desktop = d.platforms.some((x) => x === "windows" || x === "macos" || x === "linux");
  if (a.platform === "mobile" && !mobile) return null;
  if (a.platform === "desktop" && !desktop) return null;

  const reasons: ReasonCode[] = [];
  const limitations: LimitationCode[] = [];
  const security: SecurityCode[] = [];

  // Baseline: published editorial score (0–30 points).
  let s = p.overall * 3;

  const price = referencePrice(p);
  const max = BUDGET_MAX[a.budget];
  if (price == null) limitations.push("priceUnverified");
  else if (price <= max) {
    if (a.budget !== "any") {
      reasons.push("inBudget");
      s += 10;
    }
  } else if (price <= max * 1.2) {
    limitations.push("overBudget");
    s -= 12;
  } else {
    limitations.push("overBudget");
    s -= 40;
  }

  if (a.assets === "btc") {
    if (d.bitcoinOnly) {
      reasons.push("btcOnly");
      s += 12;
    } else if (d.btcOnlyFirmware) {
      reasons.push("btcOnlyFirmware");
      s += 8;
    } else {
      limitations.push("multiAttackSurface");
      s -= 5;
    }
  } else {
    s += d.assetBreadth * 3;
    if (d.assetBreadth >= 3) reasons.push("manyAssets");
    else limitations.push("fewAssets");
  }

  if (a.experience === "beginner") {
    s += d.scores.usability * 2;
    if (d.scores.usability >= 8) reasons.push("beginnerFriendly");
    if (d.scores.usability < 7) limitations.push("learningCurve");
  } else {
    s += d.scores.security * 1.5;
    if (d.scores.security >= 8) reasons.push("strongSecurity");
  }

  if (a.platform === "mobile" || a.platform === "both") {
    const wireless = d.connectivity.includes("bluetooth") || d.connectivity.includes("nfc") || d.connectivity.includes("qr");
    if (mobile && wireless) {
      reasons.push("mobileReady");
      s += 10;
    } else if (mobile) s += 4;
    else limitations.push("noMobile");
  }
  if (a.platform === "desktop" || a.platform === "both") {
    if (desktop) {
      if (a.platform === "desktop") reasons.push("desktopReady");
      s += 5;
    } else limitations.push("noDesktop");
  }

  const fw = d.openFirmware;
  if (a.openSource !== "indifferent") {
    const k = a.openSource === "essential" ? 1 : 0.55;
    if (fw === "yes") {
      reasons.push("openSource");
      s += 15 * k;
    } else if (fw === "partial") {
      limitations.push("sourceAvailable");
      s += 5 * k;
    } else limitations.push("closedSource");
  }

  if (a.airgap !== "indifferent") {
    const k = a.airgap === "required" ? 1 : 0.55;
    if (d.airGapped === "full") {
      reasons.push("airGapped");
      s += 15 * k;
    } else if (d.airGapped === "optional") {
      reasons.push("airGapOptional");
      s += 11 * k;
    }
  }

  if (a.multisig === "yes") {
    if (d.multisig === "strong") {
      reasons.push("multisig");
      s += 12;
    } else if (d.multisig === "basic") {
      limitations.push("multisigBasic");
      s += 3;
    } else {
      limitations.push("noMultisig");
      s -= 20;
    }
  } else if (a.multisig === "maybe" && d.multisig === "strong") {
    reasons.push("multisig");
    s += 6;
  }

  if (a.style === "simple") {
    s += d.scores.usability * 1.5;
    if (d.scores.usability >= 8 && !reasons.includes("beginnerFriendly")) reasons.push("simpleSetup");
  } else {
    s += d.scores.features;
    if (d.passphrase) s += 2;
    if (d.scores.features >= 8) reasons.push("advancedControls");
  }

  // Security considerations shown with every recommendation.
  security.push(d.secureElement.present ? "secureElement" : "noSecureElement");
  if (d.connectivity.includes("bluetooth")) security.push("bluetoothSurface");
  const recentCritical = d.advisories.some(
    (x) => x.severity === "critical" && now.getTime() - new Date(x.date).getTime() < 1000 * 60 * 60 * 24 * 730,
  );
  if (d.advisories.length) security.push("advisory");
  if (recentCritical) s -= 8;
  security.push("buyOfficial", "backupTest");

  return { slug: p.slug, score: Math.round(s * 10) / 10, reasons, limitations, security };
}

export function recommend(products: QuizProduct[], a: QuizAnswers, now = new Date()) {
  const scored = products
    .map((p) => scoreProduct(p, a, now))
    .filter((x): x is QuizResult => x !== null)
    .sort((x, y) => y.score - x.score || x.slug.localeCompare(y.slug));
  return { top: scored.slice(0, 3), alternatives: scored.slice(3, 6), considered: scored.length };
}

export function parseAnswers(params: Record<string, string | undefined>): QuizAnswers | null {
  const out: Partial<QuizAnswers> = {};
  for (const q of QUIZ_QUESTIONS) {
    const v = params[q.key];
    if (!v || !q.options.includes(v)) return null;
    (out as Record<string, string>)[q.key] = v;
  }
  return out as QuizAnswers;
}

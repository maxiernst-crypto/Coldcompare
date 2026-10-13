import type { Dictionary } from "./i18n/en";
import type { ClientProduct } from "./product-view";
import { SCORE_KEYS, type FactField, type FactStatus } from "./schemas";

export type Tone = "good" | "bad" | "warn" | "neutral";

export interface Cell {
  text: string;
  tone?: Tone;
  status?: FactStatus;
}

export interface Row {
  key: string;
  group: string;
  label: string;
  /** Rows rendered specially by the view (price uses the visitor's country). */
  kind?: "price" | "score";
  cells: Cell[];
  differs: boolean;
}

const yesNo = (v: boolean, d: Dictionary, goodWhen = true): Cell => ({ text: v ? d.common.yes : d.common.no, tone: v === goodWhen ? "good" : "neutral" });

export function buildRows(products: ClientProduct[], d: Dictionary): Row[] {
  const status = (p: ClientProduct, f: FactField) => p.factStatus[f];
  const groups = {
    overview: d.review.overview,
    security: d.review.security,
    backup: d.scores.backup,
    connectivity: d.attrs.connectivity,
    usability: d.review.usability,
    scores: d.review.scoreTitle,
  };

  const defs: Omit<Row, "differs">[] = [
    { key: "price", group: groups.overview, label: d.attrs.price, kind: "price", cells: products.map((p) => ({ text: JSON.stringify(p.prices), status: status(p, "price") })) },
    { key: "overall", group: groups.overview, label: d.scores.overall, kind: "score", cells: products.map((p) => ({ text: p.overall.toFixed(1) })) },
    { key: "manufacturer", group: groups.overview, label: d.attrs.manufacturer, cells: products.map((p) => ({ text: p.manufacturer })) },
    { key: "assets", group: groups.overview, label: d.attrs.assets, cells: products.map((p) => ({ text: p.assetsSummary, status: status(p, "assets") })) },
    { key: "bitcoinOnly", group: groups.overview, label: d.attrs.bitcoinOnly, cells: products.map((p) => yesNo(p.bitcoinOnly, d)) },
    { key: "btcOnlyFirmware", group: groups.overview, label: d.attrs.btcOnlyFirmware, cells: products.map((p) => yesNo(p.btcOnlyFirmware, d)) },

    {
      key: "secureElement",
      group: groups.security,
      label: d.attrs.secureElement,
      cells: products.map((p) => ({
        text: p.secureElement.present ? `${d.common.yes}${p.secureElement.chip ? ` — ${p.secureElement.chip}` : ""}` : `${d.common.no}${p.secureElement.chip ? ` — ${p.secureElement.chip}` : ""}`,
        tone: p.secureElement.present ? "good" : "warn",
        status: status(p, "secureElement"),
      })),
    },
    {
      key: "certification",
      group: groups.security,
      label: d.attrs.certification,
      cells: products.map((p) => ({ text: p.secureElement.certification || "—", status: status(p, "secureElement") })),
    },
    {
      key: "openFirmware",
      group: groups.security,
      label: d.attrs.openFirmware,
      cells: products.map((p) => ({ text: d.values.open[p.openFirmware], tone: p.openFirmware === "yes" ? "good" : p.openFirmware === "no" ? "bad" : "neutral", status: status(p, "openSource") })),
    },
    {
      key: "openHardware",
      group: groups.security,
      label: d.attrs.openHardware,
      cells: products.map((p) => ({ text: d.values.open[p.openHardware], tone: p.openHardware === "yes" ? "good" : "neutral", status: status(p, "openSource") })),
    },
    {
      key: "airGapped",
      group: groups.security,
      label: d.attrs.airGapped,
      cells: products.map((p) => ({ text: d.values.airGapped[p.airGapped], tone: p.airGapped === "no" ? "neutral" : "good", status: status(p, "airGapped") })),
    },
    {
      key: "advisories",
      group: groups.security,
      label: d.attrs.advisories,
      cells: products.map((p) => {
        const crit = p.advisories.filter((a) => a.severity === "critical").length;
        return { text: p.advisories.length ? `${p.advisories.length}${crit ? ` (${crit} ${d.common.critical})` : ""}` : d.common.none, tone: crit ? "bad" : p.advisories.length ? "warn" : "neutral" };
      }),
    },

    {
      key: "backup",
      group: groups.backup,
      label: d.attrs.backup,
      cells: products.map((p) => ({ text: p.backup.map((b) => d.values.backup[b]).join(", "), status: status(p, "backup") })),
    },
    { key: "passphrase", group: groups.backup, label: d.attrs.passphrase, cells: products.map((p) => ({ ...yesNo(p.passphrase, d), status: status(p, "passphrase") })) },
    {
      key: "multisig",
      group: groups.backup,
      label: d.attrs.multisig,
      cells: products.map((p) => ({ text: d.values.multisig[p.multisig], tone: p.multisig === "strong" ? "good" : p.multisig === "none" ? "bad" : "neutral", status: status(p, "multisig") })),
    },

    {
      key: "connectivity",
      group: groups.connectivity,
      label: d.attrs.connectivity,
      cells: products.map((p) => ({ text: p.connectivity.map((c) => d.values.connectivity[c]).join(", "), status: status(p, "connectivity") })),
    },
    {
      key: "platforms",
      group: groups.connectivity,
      label: d.attrs.platforms,
      cells: products.map((p) => ({ text: p.platforms.map((c) => d.values.platforms[c]).join(", "), status: status(p, "platforms") })),
    },

    { key: "display", group: groups.usability, label: d.attrs.display, cells: products.map((p) => ({ text: p.display || "—" })) },
    { key: "input", group: groups.usability, label: d.attrs.input, cells: products.map((p) => ({ text: p.input || "—" })) },
    { key: "battery", group: groups.usability, label: d.attrs.battery, cells: products.map((p) => ({ text: p.battery ? d.common.yes : d.common.no })) },
    { key: "formFactor", group: groups.usability, label: d.attrs.formFactor, cells: products.map((p) => ({ text: d.values.formFactor[p.formFactor] })) },

    ...SCORE_KEYS.map((k) => ({
      key: `score-${k}`,
      group: groups.scores,
      label: d.scores[k],
      kind: "score" as const,
      cells: products.map((p) => ({ text: p.scores[k].toFixed(1) })),
    })),
  ];

  return defs.map((r) => ({ ...r, differs: new Set(r.cells.map((c) => c.text)).size > 1 }));
}

/** Index of the best value in a numeric score row (for highlighting), or -1 when tied/not applicable. */
export function bestIndex(row: Row): number {
  if (row.kind !== "score") return -1;
  const nums = row.cells.map((c) => Number(c.text));
  const max = Math.max(...nums);
  const idx = nums.indexOf(max);
  return nums.filter((n) => n === max).length === 1 ? idx : -1;
}

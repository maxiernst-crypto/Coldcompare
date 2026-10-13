import { describe, expect, it } from "vitest";
import de from "@/lib/i18n/de";
import en from "@/lib/i18n/en";
import { fmt, formatMoney, pick } from "@/lib/i18n";

function keys(o: unknown, prefix = ""): string[] {
  if (Array.isArray(o)) return [`${prefix}[${o.length}]`];
  if (o && typeof o === "object") return Object.entries(o).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
  return [prefix];
}

describe("i18n", () => {
  it("German dictionary has exactly the same keys as English", () => {
    expect(keys(de).sort()).toEqual(keys(en).sort());
  });

  it("no German string is left empty", () => {
    const empty = keys(de).filter((k) => {
      const v = k.split(".").reduce<unknown>((o, p) => (o as Record<string, unknown>)?.[p.replace(/\[\d+\]$/, "")], de);
      return typeof v === "string" && !v.trim();
    });
    expect(empty).toEqual([]);
  });

  it("uses the exact required affiliate disclosure wording in English", () => {
    expect(en.common.affiliateDisclosure).toBe(
      "Some links on this website are affiliate links. We may earn a commission when you purchase through them, at no additional cost to you. Our reviews and recommendations remain editorially independent.",
    );
  });

  it("formats placeholders, fallbacks and currency", () => {
    expect(fmt("{n} wallets", { n: 3 })).toBe("3 wallets");
    expect(pick({ en: "Hello", de: "" }, "de")).toBe("Hello");
    expect(formatMoney(149, "EUR", "de")).toMatch(/149\s?€/);
    expect(formatMoney(79, "GBP", "en")).toBe("£79");
  });
});

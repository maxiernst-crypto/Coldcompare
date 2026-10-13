import { describe, expect, it } from "vitest";
import { hashPassword, passwordProblem, signSession, verifyPassword, verifySession } from "@/lib/auth/crypto";
import { can } from "@/lib/auth/permissions";

const KEY = "k".repeat(40);

describe("auth", () => {
  it("hashes and verifies passwords with scrypt", async () => {
    const h = await hashPassword("correct horse battery");
    expect(h.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("correct horse battery", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
    expect(await verifyPassword("x", "garbage")).toBe(false);
  });

  it("enforces a minimum password length", () => {
    expect(passwordProblem("short")).not.toBeNull();
    expect(passwordProblem("long-enough-pass")).toBeNull();
  });

  it("signs sessions and rejects tampering, wrong keys and expiry", () => {
    const exp = Math.floor(Date.now() / 1000) + 60;
    const t = signSession({ uid: "u1", v: 1, exp }, KEY);
    expect(verifySession(t, KEY)).toEqual({ uid: "u1", v: 1, exp });
    const [body, sig] = t.split(".");
    const forged = Buffer.from(JSON.stringify({ uid: "admin", v: 1, exp })).toString("base64url");
    expect(verifySession(`${forged}.${sig}`, KEY)).toBeNull();
    expect(verifySession(`${body}.${sig}x`, KEY)).toBeNull();
    expect(verifySession(t, "z".repeat(40))).toBeNull();
    expect(verifySession(t, KEY, (exp + 1) * 1000)).toBeNull();
    expect(verifySession(undefined, KEY)).toBeNull();
  });

  it("applies role-based permissions", () => {
    expect(can("admin", "users.manage")).toBe(true);
    expect(can("editor", "content.publish")).toBe(true);
    expect(can("editor", "users.manage")).toBe(false);
    expect(can("writer", "content.publish")).toBe(false);
    expect(can("writer", "content.edit")).toBe(true);
    expect(can("analyst", "content.edit")).toBe(false);
    expect(can("analyst", "analytics.view")).toBe(true);
  });
});

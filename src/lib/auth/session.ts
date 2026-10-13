import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { query, queryOne } from "../db";
import type { Role } from "../schemas";
import { hashPassword, signSession, verifyPassword, verifySession } from "./crypto";
import { can, type Permission } from "./permissions";

export const SESSION_COOKIE = "cc_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const jar = await cookies();
  const payload = verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  const u = await queryOne<{ id: string; email: string; name: string; role: Role; session_version: number; disabled: boolean }>(
    `SELECT id, email, name, role, session_version, disabled FROM users WHERE id = $1`,
    [payload.uid],
  );
  if (!u || u.disabled || u.session_version !== payload.v) return null;
  return { id: u.id, email: u.email, name: u.name, role: u.role };
});

/** Use at the top of every admin page and server action. */
export async function requirePermission(permission: Permission): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!can(user.role, permission)) redirect("/admin?denied=1");
  return user;
}

export async function requireUser(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

// Simple in-memory throttle against password guessing. Per-instance only; put a WAF/rate limiter
// in front for multi-instance deployments.
const attempts = new Map<string, { count: number; until: number }>();

export function loginThrottled(key: string, now = Date.now()): boolean {
  const a = attempts.get(key);
  return !!a && a.count >= 5 && a.until > now;
}

function noteFailure(key: string, now = Date.now()) {
  const a = attempts.get(key);
  if (!a || a.until < now) attempts.set(key, { count: 1, until: now + 15 * 60 * 1000 });
  else a.count++;
}

let dummyHash: Promise<string> | null = null;

export async function login(email: string, password: string): Promise<"ok" | "invalid" | "throttled"> {
  const key = email.toLowerCase().trim();
  if (loginThrottled(key)) return "throttled";
  const u = await queryOne<{ id: string; password_hash: string; session_version: number; disabled: boolean }>(
    `SELECT id, password_hash, session_version, disabled FROM users WHERE lower(email) = $1`,
    [key],
  );
  // Always run a hash comparison to keep timing similar for unknown users.
  const ok = await verifyPassword(password, u?.password_hash ?? (await (dummyHash ??= hashPassword("timing-equaliser"))));
  if (!u || !ok || u.disabled) {
    noteFailure(key);
    return "invalid";
  }
  attempts.delete(key);
  await query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [u.id]);
  const token = signSession({ uid: u.id, v: u.session_version, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return "ok";
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

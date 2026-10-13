import { NextResponse } from "next/server";
import { toCsv } from "@/lib/admin-forms";
import { can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { query } from "@/lib/db";
import { audit } from "@/lib/repo/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "settings.manage")) return new NextResponse("Forbidden", { status: 403 });
  const rows = await query<{ email: string; locale: string; confirmed_at: Date; consent_text: string }>(
    `SELECT email, locale, confirmed_at, consent_text FROM newsletter_subscribers WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL ORDER BY confirmed_at`,
  );
  await audit(user, "subscribers.export", "newsletter", "*", { rows: rows.length });
  const csv = toCsv([["email", "locale", "confirmed_at", "consent_text"], ...rows.map((r) => [r.email, r.locale, r.confirmed_at.toISOString(), r.consent_text])]);
  return new NextResponse(csv, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="subscribers.csv"', "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}

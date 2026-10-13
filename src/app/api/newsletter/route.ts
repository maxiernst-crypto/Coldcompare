import { NextResponse, type NextRequest } from "next/server";
import { getDictionary } from "@/lib/i18n";
import { isValidEmail, subscribe } from "@/lib/newsletter";
import { getSiteSettings } from "@/lib/repo/settings";

const recent = new Map<string, number>();

export async function POST(req: NextRequest) {
  const settings = await getSiteSettings();
  if (!settings.newsletterEnabled) return NextResponse.json({ ok: false }, { status: 404 });
  // Same-origin only (basic CSRF protection for this public endpoint).
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.nextUrl.host) return NextResponse.json({ ok: false }, { status: 403 });

  let body: { email?: unknown; consent?: unknown; locale?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot: pretend success
  if (body.consent !== true || !isValidEmail(body.email)) return NextResponse.json({ ok: false }, { status: 400 });
  const locale = body.locale === "de" ? "de" : "en";

  const key = body.email.toLowerCase();
  const last = recent.get(key) ?? 0;
  if (Date.now() - last < 60_000) return NextResponse.json({ ok: true });
  recent.set(key, Date.now());

  await subscribe(body.email, locale, getDictionary(locale).newsletter.consent);
  return NextResponse.json({ ok: true });
}

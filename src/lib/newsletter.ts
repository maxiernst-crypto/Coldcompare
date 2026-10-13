import { query, queryOne } from "./db";
import { randomToken } from "./auth/crypto";
import { siteUrl } from "./site";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

export function isValidEmail(v: unknown): v is string {
  return typeof v === "string" && v.length <= 254 && EMAIL.test(v);
}

/** Double opt-in: store a pending subscription and send (or log) a confirmation link. */
export async function subscribe(email: string, locale: "en" | "de", consentText: string): Promise<void> {
  const token = randomToken();
  const row = await queryOne<{ confirm_token: string; confirmed_at: Date | null }>(
    `INSERT INTO newsletter_subscribers (email, locale, confirm_token, consent_text) VALUES (lower($1), $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET locale = EXCLUDED.locale, unsubscribed_at = NULL,
       confirm_token = CASE WHEN newsletter_subscribers.confirmed_at IS NULL THEN EXCLUDED.confirm_token ELSE newsletter_subscribers.confirm_token END
     RETURNING confirm_token, confirmed_at`,
    [email, locale, token, consentText],
  );
  if (!row || row.confirmed_at) return; // already confirmed: say nothing (avoids address enumeration)
  const link = `${siteUrl()}/api/newsletter/confirm?token=${encodeURIComponent(row.confirm_token)}&l=${locale}`;
  await sendConfirmation(email, locale, link);
}

async function sendConfirmation(email: string, locale: "en" | "de", link: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  const subject = locale === "de" ? "Bitte bestätigen Sie Ihre Anmeldung" : "Please confirm your subscription";
  const text =
    locale === "de"
      ? `Bitte bestätigen Sie Ihre Newsletter-Anmeldung bei ColdCompare:\n\n${link}\n\nWenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail.`
      : `Please confirm your ColdCompare newsletter subscription:\n\n${link}\n\nIf you didn't sign up, ignore this email.`;
  if (!key || !from) {
    if (process.env.NODE_ENV !== "production") console.info(`[newsletter] confirmation link for ${email}: ${link}`);
    else console.warn("[newsletter] RESEND_API_KEY/NEWSLETTER_FROM not set; confirmation email not sent");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: email, subject, text }),
  });
  if (!res.ok) console.error("[newsletter] email provider error", res.status);
}

export async function confirm(token: string): Promise<boolean> {
  const rows = await query(`UPDATE newsletter_subscribers SET confirmed_at = COALESCE(confirmed_at, now()) WHERE confirm_token = $1 RETURNING id`, [token]);
  return rows.length > 0;
}

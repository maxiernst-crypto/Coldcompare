import { NextResponse, type NextRequest } from "next/server";
import { getDictionary } from "@/lib/i18n";
import { confirm } from "@/lib/newsletter";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const locale = req.nextUrl.searchParams.get("l") === "de" ? "de" : "en";
  const d = getDictionary(locale);
  const ok = token.length > 10 && (await confirm(token));
  const msg = ok ? d.newsletter.confirmed : d.newsletter.invalid;
  const html = `<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>ColdCompare</title><body style="font-family:system-ui;max-width:32rem;margin:15vh auto;padding:0 16px;text-align:center"><h1 style="font-size:1.4rem">${msg}</h1><p><a href="/${locale}">ColdCompare</a></p></body></html>`;
  return new NextResponse(html, { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } });
}

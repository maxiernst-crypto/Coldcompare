import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "de"];

function preferredLocale(req: NextRequest): string {
  const cookie = req.cookies.get("cc_locale")?.value;
  if (cookie && LOCALES.includes(cookie)) return cookie;
  const accept = req.headers.get("accept-language") ?? "";
  const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("de") ? "de" : "en";
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const seg = pathname.split("/")[1];
  if (LOCALES.includes(seg)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  // 307: the target depends on the visitor's language, so it must not be cached as permanent.
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  // Everything except API, affiliate redirects, admin, Next internals and files with an extension.
  matcher: ["/((?!api|go|admin|admin-export|_next|.*\\..*).*)"],
};

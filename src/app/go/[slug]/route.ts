import { NextResponse, type NextRequest } from "next/server";
import { buildOutboundUrl, isSafeHttpUrl, resolveCountry, selectLink } from "@/lib/affiliate";
import { listLinksForProduct, recordClick } from "@/lib/repo/links";
import { getPublicProduct } from "@/lib/repo/products";
import { getSiteSettings } from "@/lib/repo/settings";

export const dynamic = "force-dynamic";

const BOT = /bot|crawler|spider|crawling|preview|facebookexternalhit|slurp|headless/i;

/**
 * Central outbound redirect: /go/<product>?l=<locale>&p=<placement>
 * Picks the country-specific retailer link, appends UTM parameters where configured, logs an
 * anonymous click (no IP, no cookies, no user agent stored) and redirects.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) return new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });

  const country = resolveCountry(req.cookies.get("cc_country")?.value, req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry"));
  const [links, settings] = await Promise.all([listLinksForProduct(slug), getSiteSettings()]);
  const link = selectLink(links, country);
  const placement = req.nextUrl.searchParams.get("p")?.slice(0, 64) ?? null;
  const locale = req.nextUrl.searchParams.get("l");

  let target = link ? buildOutboundUrl(link, { utmSource: settings.utmSource, campaign: placement ?? undefined, content: slug }) : product.data.officialUrl;
  if (!isSafeHttpUrl(target)) target = product.data.officialUrl;

  const ua = req.headers.get("user-agent") ?? "";
  if (!BOT.test(ua)) {
    let pagePath: string | null = null;
    try {
      const ref = new URL(req.headers.get("referer") ?? "");
      if (ref.host === req.nextUrl.host) pagePath = ref.pathname.slice(0, 200);
    } catch {
      /* no or foreign referer */
    }
    try {
      await recordClick({
        productSlug: slug,
        linkId: link?.id ?? null,
        country,
        locale: locale === "en" || locale === "de" ? locale : null,
        pagePath,
        placement,
        device: /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop",
        isAffiliate: !!link?.isAffiliate,
      });
    } catch (e) {
      // Never block the visitor because analytics failed.
      console.error("click logging failed", e);
    }
  }

  return NextResponse.redirect(target, {
    status: 302,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer-when-downgrade" },
  });
}

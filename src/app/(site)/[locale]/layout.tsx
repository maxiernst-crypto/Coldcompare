import "../../globals.css";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { ConsentAndAnalytics } from "@/components/consent";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { PrefsProvider } from "@/components/prefs";
import { PreviewBanner } from "@/components/ui";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/repo/settings";
import { LOCALES } from "@/lib/schemas";
import { siteUrl } from "@/lib/site";
import { isPreviewMode } from "@/lib/visibility";

export const revalidate = 3600;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${d.meta.siteName} — ${d.meta.tagline}`, template: `%s | ${d.meta.siteName}` },
    description: d.meta.defaultDescription,
    applicationName: d.meta.siteName,
    // Preview deployments must never be indexed.
    robots: isPreviewMode() ? { index: false, follow: false } : undefined,
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f14" },
  ],
};

// Applies the saved/system theme before first paint to avoid a flash.
const THEME_SCRIPT = `try{var t=localStorage.getItem('cc_theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const settings = await getSiteSettings();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen">
        <PrefsProvider locale={locale} dict={d}>
          {isPreviewMode() && <PreviewBanner d={d} />}
          <SiteHeader locale={locale} d={d} />
          <main id="main">{children}</main>
          <SiteFooter locale={locale} d={d} newsletterEnabled={settings.newsletterEnabled} />
          <ConsentAndAnalytics
            gaId={process.env.NEXT_PUBLIC_GA_ID || undefined}
            plausibleDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || undefined}
            plausibleSrc={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || undefined}
          />
        </PrefsProvider>
      </body>
    </html>
  );
}

"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import { readCookie, usePrefs, writeCookie } from "./prefs";

type Consent = { analytics: boolean; ts: number };

function readConsent(): Consent | null {
  try {
    const raw = readCookie("cc_consent");
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

/**
 * Cookie consent (UK/EU GDPR, PECR, TDDDG). GA4 loads only after an explicit opt-in.
 * The optional Plausible-compatible script is cookieless and loads without consent.
 */
export function ConsentAndAnalytics({ gaId, plausibleDomain, plausibleSrc }: { gaId?: string; plausibleDomain?: string; plausibleSrc?: string }) {
  const { d } = usePrefs();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setOpen(!c && !!gaId);
    const onOpen = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setOpen(true);
    };
    window.addEventListener("cc:open-consent", onOpen);
    return () => window.removeEventListener("cc:open-consent", onOpen);
  }, [gaId]);

  const save = useCallback((value: boolean) => {
    const c = { analytics: value, ts: Date.now() };
    writeCookie("cc_consent", JSON.stringify(c), 365);
    setConsent(c);
    setOpen(false);
    if (!value) {
      // Remove GA cookies if consent is withdrawn.
      for (const name of document.cookie.split(";").map((s) => s.split("=")[0].trim())) {
        if (name.startsWith("_ga")) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${location.hostname}`;
        if (name.startsWith("_ga")) document.cookie = `${name}=; Max-Age=0; Path=/`;
      }
    }
  }, []);

  return (
    <>
      {plausibleDomain && <Script src={plausibleSrc || "https://plausible.io/js/script.js"} data-domain={plausibleDomain} strategy="afterInteractive" />}
      {gaId && consent?.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(gaId)},{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {open && (
        <div role="dialog" aria-modal="false" aria-labelledby="cc-consent-title" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-card p-5 shadow-2xl sm:inset-x-6">
          <h2 id="cc-consent-title" className="font-semibold">
            {d.cookie.title}
          </h2>
          <p className="mt-2 text-sm text-fg-muted">{d.cookie.body}</p>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2 text-fg-subtle">
              <input type="checkbox" checked disabled /> {d.cookie.necessary}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> {d.cookie.analytics}
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Equal prominence for accept and reject. */}
            <button type="button" onClick={() => save(false)} className="flex-1 rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold">
              {d.cookie.reject}
            </button>
            <button type="button" onClick={() => save(analytics)} className="flex-1 rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold">
              {d.cookie.save}
            </button>
            <button type="button" onClick={() => save(true)} className="flex-1 rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold">
              {d.cookie.accept}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("cc:open-consent"))} className="hover:text-fg">
      {label}
    </button>
  );
}

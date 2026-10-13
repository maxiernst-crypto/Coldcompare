"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n/en";
import type { Country, Locale } from "@/lib/schemas";
import { defaultCountry } from "@/lib/product-view";

interface Prefs {
  locale: Locale;
  d: Dictionary;
  country: Country;
  setCountry: (c: Country) => void;
}

const Ctx = createContext<Prefs | null>(null);

export function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function writeCookie(name: string, value: string, maxAgeDays = 365) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeDays * 86400}; SameSite=Lax${secure}`;
}

export function PrefsProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country>(defaultCountry(locale));

  useEffect(() => {
    const c = readCookie("cc_country");
    if (c === "GB" || c === "DE" || c === "INTL") setCountryState(c);
  }, []);

  const setCountry = useCallback((c: Country) => {
    setCountryState(c);
    writeCookie("cc_country", c);
  }, []);

  return <Ctx.Provider value={{ locale, d: dict, country, setCountry }}>{children}</Ctx.Provider>;
}

export function usePrefs(): Prefs {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePrefs must be used inside PrefsProvider");
  return v;
}

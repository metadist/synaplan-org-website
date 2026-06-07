import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

/** Absolute URL for a path in a given locale (default locale has no prefix). */
export function localeUrl(locale: Locale, path: string): string {
  const isDefault = locale === routing.defaultLocale;
  if (path === "" || path === "/") {
    return isDefault ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;
  }
  return isDefault ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`;
}

/** Canonical + hreflang alternates for a page at `path` in `locale`. */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) languages[loc] = localeUrl(loc, path);
  languages["x-default"] = localeUrl(routing.defaultLocale, path);
  return { canonical: localeUrl(locale, path), languages };
}

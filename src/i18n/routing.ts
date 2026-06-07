import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // German-first: source content is authored in German. EN and FR are full
  // translations. The default locale (de) is served without a URL prefix.
  locales: ["de", "en", "fr"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  // The URL is the ONLY source of truth for the visitor's chosen language.
  //
  // - `localeDetection: false` → never redirect based on Accept-Language.
  // - `localeCookie: false`    → never write a NEXT_LOCALE cookie.
  //
  // Together these guarantee that clicking a language actually lands the
  // visitor on that language's page, instead of being silently re-routed back
  // by a leftover cookie or a browser-language sniffer.
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

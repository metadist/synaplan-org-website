/**
 * Proxy (Next.js 16 middleware): next-intl i18n routing only.
 * This is a static content site — no admin guard, no auth.
 */
import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  const res = intlMiddleware(req);

  // Defensive cleanup: evict any leftover NEXT_LOCALE cookie. We never read it
  // (localeDetection: false, localeCookie: false) — the URL is the only source
  // of truth for language.
  if (req.cookies.has("NEXT_LOCALE")) {
    res.cookies.set("NEXT_LOCALE", "", { path: "/", maxAge: 0 });
  }

  return res;
}

export const config = {
  // Exclude static files (.*\..*), API, and Next internals.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

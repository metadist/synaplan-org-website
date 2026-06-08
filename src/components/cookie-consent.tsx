"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { privacyPolicyUrl } from "@/lib/constants";

/**
 * Where the visitor's choice is remembered. We intentionally use
 * `localStorage` (not a cookie): the "decline" path wipes every cookie on the
 * domain, so a cookie-based flag would erase itself. The consent decision is
 * functionally necessary storage and may be kept without prior consent.
 */
const STORAGE_KEY = "syn-cookie-consent";

/** Fired in the current tab after we mutate the stored choice. */
const CHANGE_EVENT = "syn-consent-change";

/** Sentinel returned during SSR/hydration so the banner never flashes. */
const SERVER_SNAPSHOT = "__server__";

type Choice = "accepted" | "declined";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getStoredChoice(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredChoice(choice: Choice): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* storage blocked — banner will reappear next visit */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Expire every script-readable cookie across the host + its parent domains. */
function deleteAllCookies(): void {
  const rawCookies = document.cookie ? document.cookie.split(";") : [];
  const hostname = window.location.hostname;

  // Target the bare host, the dotted host, and every parent domain (e.g. for
  // www.synaplan.eu also .synaplan.eu) so domain-scoped cookies are caught too.
  const domains = new Set<string>(["", hostname, `.${hostname}`]);
  const parts = hostname.split(".");
  for (let i = 1; i < parts.length - 1; i += 1) {
    const parent = parts.slice(i).join(".");
    domains.add(parent);
    domains.add(`.${parent}`);
  }

  const paths = new Set<string>(["/", window.location.pathname]);
  const past = "Thu, 01 Jan 1970 00:00:00 GMT";

  for (const cookie of rawCookies) {
    const name = cookie.split("=")[0]?.trim();
    if (!name) continue;
    for (const path of paths) {
      for (const domain of domains) {
        const base = `${name}=; expires=${past}; max-age=0; path=${path}`;
        document.cookie = domain ? `${base}; domain=${domain}` : base;
        // Re-attempt with Secure/SameSite for cookies set with those flags.
        document.cookie = domain
          ? `${base}; domain=${domain}; SameSite=Lax; Secure`
          : `${base}; SameSite=Lax; Secure`;
      }
    }
  }
}

type IndexedDbWithDatabases = IDBFactory & {
  databases?: () => Promise<Array<{ name?: string }>>;
};

/** Clear client-side storage and caches the page can reach from JavaScript. */
async function clearSiteData(): Promise<void> {
  try {
    window.localStorage.clear();
  } catch {
    /* storage may be unavailable (private mode / blocked) */
  }
  try {
    window.sessionStorage.clear();
  } catch {
    /* ignore */
  }

  // Cache Storage API — service-worker / PWA response caches.
  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch {
      /* ignore */
    }
  }

  // Unregister any service workers serving cached responses.
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    } catch {
      /* ignore */
    }
  }

  // IndexedDB (best-effort; `databases()` is not in every browser).
  const idb = window.indexedDB as IndexedDbWithDatabases | undefined;
  if (idb?.databases) {
    try {
      const databases = await idb.databases();
      await Promise.all(
        databases.map((database) =>
          database.name ? window.indexedDB.deleteDatabase(database.name) : undefined,
        ),
      );
    } catch {
      /* ignore */
    }
  }
}

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const locale = useLocale();
  // `null` (no stored choice) → show banner. The server snapshot is a sentinel
  // so the first paint matches the server HTML and the banner appears only
  // after hydration once we can safely read localStorage.
  const choice = useSyncExternalStore(subscribe, getStoredChoice, () => SERVER_SNAPSHOT);
  const visible = choice === null;

  const onAccept = useCallback(() => {
    setStoredChoice("accepted");
  }, []);

  const onDecline = useCallback(async () => {
    if (!window.confirm(t("wipeConfirm"))) {
      return;
    }
    deleteAllCookies();
    await clearSiteData();
    // Re-record the choice AFTER wiping so the banner stays dismissed.
    setStoredChoice("declined");
    // Cache-busting reload to drop in-memory/HTTP-cached state for this page.
    window.location.reload();
  }, [t]);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background/95 backdrop-blur-md"
    >
      <div className="container-wide section-padding py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-foreground">{t("title")}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t("description")}{" "}
              <a
                href={privacyPolicyUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#002c92] underline underline-offset-2 hover:opacity-80"
              >
                {t("privacyLink")}
              </a>
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onDecline}
              className="order-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:order-1"
            >
              {t("decline")}
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="btn-figma-primary order-1 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 sm:order-2"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

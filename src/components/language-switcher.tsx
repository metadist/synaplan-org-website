"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  fr: "FR",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5">
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={active ? "true" : undefined}
            className={
              active
                ? "rounded-md bg-[#002c92] px-2.5 py-1 text-xs font-bold text-white"
                : "rounded-md px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {LABELS[loc]}
          </button>
        );
      })}
    </div>
  );
}

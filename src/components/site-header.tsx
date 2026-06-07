"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LINKS, NAV_ITEMS } from "@/lib/constants";
import { SynaplanLogo } from "@/components/synaplan-logo";
import { LanguageSwitcher } from "@/components/language-switcher";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navItems = [
    ...NAV_ITEMS.map((i) => ({ href: i.href, label: t(`nav.${i.key}`) })),
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgb(196_197_215/0.25)] bg-page-tint/80 backdrop-blur-md">
      <div className="container-wide section-padding">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label={t("nav.logoAlt")}
          >
            <SynaplanLogo variant="light" size="compact" alt={t("nav.logoAlt")} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "rounded-lg px-3 py-2 text-sm font-semibold text-[#002c92]"
                      : "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="Synaplan on GitHub"
              className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              <GithubIcon className="size-6" />
            </a>

            <LanguageSwitcher />

            <a
              href={LINKS.web}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-figma-primary hidden items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 sm:inline-flex"
            >
              {t("common.discoverSynaplan")}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={open}
              className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6" aria-hidden>
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-20 z-40 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav className="fixed inset-x-0 top-20 z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-border bg-background section-padding pb-8 pt-2">
            <div className="container-wide flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={LINKS.web}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn-figma-primary mt-3 inline-flex items-center justify-center rounded-lg px-5 py-3 text-base font-semibold text-white"
              >
                {t("common.discoverSynaplan")}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

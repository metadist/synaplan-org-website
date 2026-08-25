import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/constants";
import { OsbaMemberBadge } from "@/components/osba-member-badge";
import { SynaplanLogo } from "@/components/synaplan-logo";

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("footer.topics"),
      links: [
        { label: t("nav.sovereignty"), href: "/sovereignty" },
        { label: t("nav.openSource"), href: "/open-source" },
        { label: t("nav.integrations"), href: "/integrations" },
        { label: t("nav.contact"), href: "/contact" },
      ],
    },
    {
      title: t("footer.product"),
      links: [
        { label: t("footer.website"), href: LINKS.web, external: true },
        { label: t("footer.docs"), href: LINKS.docs, external: true },
        { label: t("footer.github"), href: LINKS.github, external: true },
      ],
    },
    {
      title: t("footer.ecosystem"),
      links: [
        { label: "openDesk", href: LINKS.openDesk, external: true },
        { label: "Nextcloud", href: LINKS.nextcloud, external: true },
        { label: "OpenCloud", href: LINKS.openCloud, external: true },
        { label: "ZenDiS", href: LINKS.zendis, external: true },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#0f1320] text-neutral-300">
      <div className="container-wide section-padding py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <SynaplanLogo variant="dark" className="max-h-8" alt="Synaplan" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
              {t("footer.tagline")}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center border-t border-white/10 pt-8 sm:justify-start">
          <OsbaMemberBadge hint={t("footer.osbaHint")} />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-neutral-500">{t("footer.copyright", { year })}</p>
          <div className="flex items-center gap-4">
            <Link
              href="/imprint"
              className="text-xs text-neutral-400 transition-colors hover:text-white"
            >
              {t("footer.imprint")}
            </Link>
            <p className="text-xs text-neutral-500">{t("footer.builtWith")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

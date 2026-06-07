import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { LINKS } from "@/lib/constants";
import { alternatesFor } from "@/lib/seo";
import { PageHero, Section, SectionHeading, Card } from "@/components/page-shell";
import { CountryFlag } from "@/components/country-flag";
import { ObfuscatedEmail } from "@/components/obfuscated-email";

const PATH = "/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale as Locale, PATH),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const about = t.raw("about") as string[];

  const links = [
    { label: t("channels.website"), value: "www.synaplan.com", href: LINKS.web },
    { label: t("channels.docs"), value: "docs.synaplan.com", href: LINKS.docs },
    { label: t("channels.github"), value: "github.com/metadist/synaplan", href: LINKS.github },
  ];

  return (
    <>
      <PageHero kicker={t("hero.kicker")} title={t("hero.title")} lead={t("hero.lead")} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <SectionHeading title={t("aboutTitle")} />
            {about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              {t.rich("founder", {
                ralf: (chunks) => (
                  <a
                    href="https://www.linkedin.com/in/orgaralf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#002c92] hover:underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
            <p>
              {t.rich("advisor", {
                nemat: (chunks) => (
                  <a
                    href="https://de.wikipedia.org/wiki/Claudia_Nemat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#002c92] hover:underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <SectionHeading title={t("channelsTitle")} />
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("channels.email")}
              </p>
              <ObfuscatedEmail
                user="info"
                domain="metadist.de"
                className="mt-1 inline-block text-base font-semibold text-[#002c92] hover:underline"
              />
            </Card>
            {links.map((c) => (
              <Card key={c.href}>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-base font-semibold text-[#002c92] hover:underline"
                >
                  {c.value}
                </a>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Offices: Germany + Switzerland */}
      <Section tinted>
        <SectionHeading title={t("officesTitle")} />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <CountryFlag country="de" />
              <h3 className="text-base font-bold text-foreground">
                {t("officeGermanyLabel")}
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              metadist data management GmbH
              <br />
              Königsallee 82
              <br />
              40212 Düsseldorf, Deutschland
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <CountryFlag country="ch" />
              <h3 className="text-base font-bold text-foreground">
                {t("officeSwitzerlandLabel")}
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Synaplan Schweiz GmbH
              <br />
              Ebenmattstrasse 26
              <br />
              4447 Känerkinden (BL), Schweiz
            </p>
            <p className="mt-4 text-sm text-foreground">
              <span className="font-semibold">{t("swissContactLabel")}:</span>{" "}
              Dr. Daniel Burgwinkel
              <br />
              <ObfuscatedEmail
                user="db"
                domain="synaplan.com"
                className="font-medium text-[#002c92] hover:underline"
              />
            </p>
          </Card>
        </div>
        <Link
          href="/imprint"
          className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-[#002c92] hover:underline"
        >
          {t("viewImprint")} <span aria-hidden>→</span>
        </Link>
      </Section>
    </>
  );
}

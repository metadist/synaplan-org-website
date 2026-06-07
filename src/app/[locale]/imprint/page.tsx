import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { LINKS } from "@/lib/constants";
import { PageHero, Section, Card } from "@/components/page-shell";
import { CountryFlag } from "@/components/country-flag";
import { ObfuscatedEmail } from "@/components/obfuscated-email";

const PATH = "/imprint";

// Verbatim purpose ("Zweck") from the German commercial register (Handelsregister
// Düsseldorf). Kept in the original German legal wording across all locales.
const PURPOSE_DE =
  "Die Entwicklung, die Weiterentwicklung und die Vermittlung sowie Vermarktung und Lizensierung von Software und Anwendungen im Bereich der Entwicklung, des Designs und des Betriebs von Webseiten, -applikationen und Internetauftritten sowie die Erbringung von damit im Zusammenhang stehenden Dienst- und Beratungsleistungen.";

// Verbatim purpose ("Zweck") from the Swiss commercial register extract (SHAB).
// Kept in the original German legal wording across all locales.
const PURPOSE_CH =
  "Die Gesellschaft bezweckt den Vertrieb, die Vermarktung, den Handel sowie die Implementierung von Software und KI-Applikationen, einschliesslich damit zusammenhängender Beratungs- und Unterstützungsdienstleistungen. Die Gesellschaft kann Zweigniederlassungen und Tochtergesellschaften im In- und Ausland errichten und sich an anderen Unternehmen im In- und Ausland beteiligen sowie alle Geschäfte tätigen, die direkt oder indirekt mit ihrem Zweck in Zusammenhang stehen. Die Gesellschaft kann im In- und Ausland Grundeigentum erwerben, belasten, veräussern und verwalten. Sie kann auch Finanzierungen für eigene oder fremde Rechnung vornehmen sowie Garantien und Bürgschaften für Tochtergesellschaften und Dritte eingehen.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imprint.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale as Locale, PATH),
  };
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-border py-3 first:border-t-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("imprint");
  const l = await getTranslations("imprint.labels");

  return (
    <>
      <PageHero kicker={t("hero.kicker")} title={t("hero.title")} lead={t("hero.lead")} />

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Germany */}
          <Card>
            <div className="flex items-center gap-3">
              <CountryFlag country="de" />
              <h2 className="text-xl font-bold text-foreground">{t("germanyTitle")}</h2>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("germanyNote")}
            </p>
            <dl className="mt-5">
              <Row label={l("company")}>metadist data management GmbH</Row>
              <Row label={l("address")}>
                Königsallee 82
                <br />
                40212 Düsseldorf
                <br />
                {t("germanyTitle")}
              </Row>
              <Row label={l("email")}>
                <ObfuscatedEmail
                  user="info"
                  domain="metadist.de"
                  className="font-medium text-[#002c92] hover:underline"
                />
              </Row>
              <Row label={l("phone")}>+49 (0)211 90760084</Row>
              <Row label={l("ceo")}>Ralf Schwoebel</Row>
              <Row label={l("register")}>Amtsgericht Düsseldorf</Row>
              <Row label={l("hrb")}>HRB 101206</Row>
              <Row label={l("vat")}>DE301805620</Row>
              <Row label={l("purpose")}>
                <span className="text-muted-foreground">{PURPOSE_DE}</span>
              </Row>
            </dl>
            <a
              href={LINKS.imprintDe}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#002c92] hover:underline"
            >
              {t("germanyReference")} <span aria-hidden>↗</span>
            </a>
          </Card>

          {/* Switzerland */}
          <Card>
            <div className="flex items-center gap-3">
              <CountryFlag country="ch" />
              <h2 className="text-xl font-bold text-foreground">{t("switzerlandTitle")}</h2>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("switzerlandNote")}
            </p>
            <dl className="mt-5">
              <Row label={l("company")}>
                Synaplan Schweiz GmbH
                <br />
                <span className="text-muted-foreground">
                  (Synaplan Schweiz Sàrl · Sagl · LLC)
                </span>
              </Row>
              <Row label={l("address")}>
                Ebenmattstrasse 26
                <br />
                4447 Känerkinden (BL)
                <br />
                {t("switzerlandTitle")}
              </Row>
              <Row label={l("email")}>
                <ObfuscatedEmail
                  user="db"
                  domain="synaplan.com"
                  className="font-medium text-[#002c92] hover:underline"
                />
              </Row>
              <Row label={l("ceo")}>Dr. Daniel Burgwinkel</Row>
              <Row label={l("legalForm")}>
                Gesellschaft mit beschränkter Haftung (GmbH)
              </Row>
              <Row label={l("uid")}>CHE-282.850.997</Row>
              <Row label={l("registryOffice")}>
                Handelsregister-Amt Basel-Landschaft
              </Row>
              <Row label={l("statutes")}>01.12.2025</Row>
              <Row label={l("capital")}>
                CHF 20&apos;000.00
                <br />
                <span className="text-muted-foreground">
                  Nebenleistungspflichten gemäss näherer Umschreibung in den Statuten.
                </span>
              </Row>
              <Row label={l("publication")}>
                SHAB 251223/2025 · 23.12.2025
                <br />
                <span className="text-muted-foreground">
                  Publikationsnr. HR01-1006522624 · Neugründung
                </span>
              </Row>
              <Row label={l("purpose")}>
                <span className="text-muted-foreground">{PURPOSE_CH}</span>
              </Row>
            </dl>
          </Card>
        </div>
      </Section>

      <Section tinted>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">{t("disclaimerTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("disclaimerText")}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{t("copyrightTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("copyrightText")}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

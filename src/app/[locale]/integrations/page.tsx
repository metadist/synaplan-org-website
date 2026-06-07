import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { LINKS } from "@/lib/constants";
import { alternatesFor } from "@/lib/seo";
import { PageHero, Section, SectionHeading, Card } from "@/components/page-shell";

const PATH = "/integrations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "integrations.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale as Locale, PATH),
  };
}

type Layer = { title: string; text: string };
const PARTNER_LINKS: Record<string, string> = {
  openDesk: LINKS.openDesk,
  Nextcloud: LINKS.nextcloud,
  OpenCloud: LINKS.openCloud,
  Outlook: "https://www.microsoft.com/microsoft-365/outlook",
};

export default async function IntegrationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("integrations");

  const intro = t.raw("intro") as string[];
  const layers = t.raw("layers") as Layer[];
  const partners = t.raw("partners") as { name: string; text: string }[];

  return (
    <>
      <PageHero kicker={t("hero.kicker")} title={t("hero.title")} lead={t("hero.lead")} />

      <Section>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
          {intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      {/* The stack: from Outlook to your own cluster */}
      <Section tinted>
        <SectionHeading
          kicker={t("stackSection.kicker")}
          title={t("stackSection.title")}
          lead={t("stackSection.lead")}
        />
        <ol className="mt-10 space-y-4">
          {layers.map((l, i) => (
            <li key={i} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#002c92] text-sm font-bold text-white">
                  {i + 1}
                </span>
                {i < layers.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-border" aria-hidden />
                ) : null}
              </div>
              <Card className="mb-2 flex-1">
                <h3 className="text-lg font-bold text-foreground">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {l.text}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* Ecosystem partners */}
      <Section>
        <SectionHeading title={t("partnersSection.title")} lead={t("partnersSection.lead")} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((p) => (
            <Card key={p.name} className="flex flex-col">
              <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.text}
              </p>
              {PARTNER_LINKS[p.name] ? (
                <a
                  href={PARTNER_LINKS[p.name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#002c92] hover:underline"
                >
                  {p.name} <span aria-hidden>↗</span>
                </a>
              ) : null}
            </Card>
          ))}
        </div>
      </Section>

      <Section tinted>
        <div className="flex flex-col items-start gap-5">
          <SectionHeading title={t("next.title")} lead={t("next.text")} />
          <Link
            href="/contact"
            className="btn-figma-primary inline-flex items-center justify-center rounded-xl px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-95"
          >
            {t("next.cta")}
          </Link>
        </div>
      </Section>
    </>
  );
}

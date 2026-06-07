import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { PageHero, Section, SectionHeading, Card } from "@/components/page-shell";

const PATH = "/sovereignty";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sovereignty.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale as Locale, PATH),
  };
}

type Risk = { title: string; text: string };

export default async function SovereigntyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sovereignty");

  const intro = t.raw("intro") as string[];
  const risks = t.raw("risks") as Risk[];

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

      <Section tinted>
        <SectionHeading
          kicker={t("risksSection.kicker")}
          title={t("risksSection.title")}
          lead={t("risksSection.lead")}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {risks.map((r, i) => (
            <Card key={i}>
              <h3 className="text-lg font-bold text-foreground">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {r.text}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start gap-5">
          <SectionHeading title={t("next.title")} lead={t("next.text")} />
          <Link
            href="/open-source"
            className="btn-figma-primary inline-flex items-center justify-center rounded-xl px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-95"
          >
            {t("next.cta")}
          </Link>
        </div>
      </Section>
    </>
  );
}

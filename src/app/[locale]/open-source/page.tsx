import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { LINKS } from "@/lib/constants";
import { alternatesFor } from "@/lib/seo";
import { PageHero, Section, SectionHeading, Card } from "@/components/page-shell";

const PATH = "/open-source";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "openSource.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale as Locale, PATH),
  };
}

type Criterion = { title: string; requirement: string; promise: string };

export default async function OpenSourcePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("openSource");

  const intro = t.raw("intro") as string[];
  const criteria = t.raw("criteria") as Criterion[];

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
          kicker={t("criteriaSection.kicker")}
          title={t("criteriaSection.title")}
          lead={t("criteriaSection.lead")}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {criteria.map((c, i) => (
            <Card key={i} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#002c92] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {t("labels.requirement")}:{" "}
                </span>
                {c.requirement}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-[#002c92]">
                  {t("labels.promise")}:{" "}
                </span>
                {c.promise}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground">
            {t("conclusion")}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-figma-primary inline-flex items-center justify-center rounded-xl px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-95"
            >
              {t("ctaCode")}
            </a>
            <Link
              href="/integrations"
              className="inline-flex items-center justify-center rounded-xl border border-border px-7 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {t("ctaNext")}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

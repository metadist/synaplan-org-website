import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StatusProbe } from "@/components/status-probe";
import { PageHero, Section, SectionHeading } from "@/components/page-shell";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";

const PATH = "/status";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "status.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale as Locale, PATH),
  };
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("status");
  const means = t.raw("means") as string[];
  const limits = t.raw("limits") as string[];

  return (
    <>
      <PageHero kicker={t("hero.kicker")} title={t("hero.title")} lead={t("hero.lead")} />
      <Section>
        <StatusProbe />
        <div className="mt-10 max-w-3xl">
          <SectionHeading title={t("meansTitle")} />
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground">
            {means.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10 max-w-3xl">
          <SectionHeading title={t("limitsTitle")} />
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground">
            {limits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-foreground">
            <Link href="/trust#availability" className="font-semibold text-[#002c92] underline underline-offset-4">
              {t("trustLink")}
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}

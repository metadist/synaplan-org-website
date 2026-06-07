import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { LINKS, SITE_URL } from "@/lib/constants";
import { Flags } from "@/components/flags";
import { Section, SectionHeading, Card } from "@/components/page-shell";

function homeUrl(locale: Locale): string {
  return locale === routing.defaultLocale ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) languages[loc] = homeUrl(loc);
  languages["x-default"] = homeUrl(routing.defaultLocale);
  return { alternates: { canonical: homeUrl(locale as Locale), languages } };
}

type Pillar = { title: string; text: string; href: string; cta: string };

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const pillars = t.raw("pillars") as Pillar[];
  const badges = t.raw("hero.badges") as string[];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-page-tint">
        <div className="container-wide section-padding flex flex-col items-center py-20 text-center sm:py-28">
          <Flags />
          <h1 className="mt-10 max-w-4xl text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg font-medium text-[#002c92] sm:text-2xl">
            {t("hero.subtitle")}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("hero.description")}
          </p>
          <div className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/sovereignty"
              className="btn-figma-primary inline-flex items-center justify-center rounded-xl px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-95"
            >
              {t("hero.ctaPrimary")}
            </Link>
            <a
              href={LINKS.web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[color:var(--color-brand-50)] px-7 py-3 text-base font-semibold text-[#002c92] transition-colors hover:bg-[color:var(--color-brand-50)]/70"
            >
              {t("hero.ctaSecondary")}
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm font-medium text-muted-foreground">
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="text-[#002c92]">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Argumentation chain — three pillars */}
      <Section>
        <SectionHeading
          kicker={t("chain.kicker")}
          title={t("chain.title")}
          lead={t("chain.lead")}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Card key={p.href} className="flex flex-col">
              <span className="text-sm font-bold text-[#002c92]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-bold text-foreground">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.text}
              </p>
              <Link
                href={p.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#002c92] hover:underline"
              >
                {p.cta} <span aria-hidden>→</span>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* "From Outlook to your own basement cluster" */}
      <Section tinted>
        <div className="rounded-3xl bg-[#0f1320] px-8 py-14 text-center sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
            {t("stack.kicker")}
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-balance text-2xl font-extrabold leading-snug text-white sm:text-3xl">
            {t("stack.headline")}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-300">
            {t("stack.text")}
          </p>
          <Link
            href="/integrations"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-base font-semibold text-[#002c92] transition-colors hover:bg-neutral-100"
          >
            {t("stack.cta")}
          </Link>
        </div>
      </Section>

      {/* Closing CTA */}
      <Section>
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeading title={t("cta.title")} />
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("cta.text")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="btn-figma-primary inline-flex items-center justify-center rounded-xl px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-95"
            >
              {tc("contactUs")}
            </Link>
            <a
              href={LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-border px-7 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {tc("readDocs")}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

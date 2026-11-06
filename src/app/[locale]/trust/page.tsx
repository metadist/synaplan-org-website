import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { LINKS, privacyPolicyUrl } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { PageHero, Section, SectionHeading } from "@/components/page-shell";

const PATH = "/trust";

type TocItem = { id: string; label: string };
type Named = { title: string; text: string };
type Processor = { name: string; role: string; region: string; trains: string };
type Clause = { title: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trust.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale as Locale, PATH),
  };
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Block({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <article id={id} className="scroll-mt-28 border-t border-border pt-10">
      <SectionHeading title={title} lead={lead} />
      <div className="mt-6 max-w-3xl">{children}</div>
    </article>
  );
}

export default async function TrustPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trust");
  const contract = await getTranslations({ locale: "de", namespace: "trust.avv" });

  const toc = t.raw("toc") as TocItem[];
  const minutes = t.raw("minutes") as string[];
  const toms = t.raw("toms.items") as Named[];
  const limits = t.raw("toms.limits") as string[];
  const processors = t.raw("processors.rows") as Processor[];
  const flows = t.raw("flow.paths") as Named[];
  const does = t.raw("aiAct.does") as string[];
  const deployer = t.raw("aiAct.deployer") as string[];
  const availability = t.raw("availability.items") as string[];
  const access = t.raw("access.items") as string[];
  const open = t.raw("open.items") as string[];
  const clauses = contract.raw("clauses") as Clause[];

  return (
    <>
      <PageHero kicker={t("hero.kicker")} title={t("hero.title")} lead={t("hero.lead")} />

      <Section>
        <p className="text-sm font-medium text-foreground">{t("hero.checked")}</p>

        <nav className="mt-8" aria-label={t("tocLabel")}>
          <ol className="flex flex-wrap gap-2">
            {toc.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                >
                  {String(index + 1).padStart(2, "0")} {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-4 space-y-14">
          <Block id="minute" title={t("minutesTitle")} lead={t("minutesLead")}>
            <BulletList items={minutes} />
          </Block>

          <Block id="avv" title={t("avv.title")} lead={t("avv.lead")}>
            <p className="text-base leading-relaxed text-foreground">{t("avv.draft")}</p>
            <BulletList items={t.raw("avv.points") as string[]} />
            <p className="mt-4 text-base leading-relaxed text-foreground">{t("avv.language")}</p>
            <details className="mt-6 rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer text-base font-semibold text-foreground">
                {t("avv.openContract")}
              </summary>
              <div className="mt-6 space-y-6">
                {clauses.map((clause) => (
                  <div key={clause.title}>
                    <h3 className="text-base font-semibold text-foreground">{clause.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-foreground">{clause.body}</p>
                  </div>
                ))}
              </div>
            </details>
            <a
              href="mailto:privacy@synaplan.com?subject=AVV%20Synaplan"
              className="btn-figma-primary mt-6 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            >
              {t("avv.ask")}
            </a>
          </Block>

          <Block id="toms" title={t("toms.title")} lead={t("toms.lead")}>
            <div className="space-y-4">
              {toms.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-8 text-base font-semibold text-foreground">{t("toms.limitsTitle")}</h3>
            <BulletList items={limits} />
          </Block>

          <Block id="processors" title={t("processors.title")} lead={t("processors.lead")}>
            <ul className="space-y-4">
              {processors.map((row) => (
                <li key={row.name} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-base font-semibold text-foreground">{row.name}</h3>
                  <p className="mt-2 text-base leading-relaxed text-foreground">{row.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    <span className="font-semibold">{t("processors.region")}</span> {row.region}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    <span className="font-semibold">{t("processors.trains")}</span> {row.trains}
                  </p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="flow" title={t("flow.title")} lead={t("flow.lead")}>
            <div className="space-y-4">
              {flows.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-base leading-relaxed text-foreground">
              <a
                href="https://github.com/metadist/synaplan/blob/main/docs/DATA_FLOW.md"
                className="font-semibold text-[#002c92] underline underline-offset-4"
              >
                {t("flow.doc")}
              </a>
            </p>
          </Block>

          <Block id="aiact" title={t("aiAct.title")} lead={t("aiAct.lead")}>
            <h3 className="text-base font-semibold text-foreground">{t("aiAct.doesTitle")}</h3>
            <BulletList items={does} />
            <h3 className="mt-6 text-base font-semibold text-foreground">{t("aiAct.deployerTitle")}</h3>
            <BulletList items={deployer} />
            <p className="mt-4 text-base leading-relaxed text-foreground">
              <a
                href="https://github.com/metadist/synaplan/blob/main/docs/AI_ACT.md"
                className="font-semibold text-[#002c92] underline underline-offset-4"
              >
                {t("aiAct.doc")}
              </a>
            </p>
          </Block>

          <Block id="security" title={t("security.title")} lead={t("security.lead")}>
            <h3 className="text-base font-semibold text-foreground">{t("security.vulnTitle")}</h3>
            <p className="mt-2 text-base leading-relaxed text-foreground">{t("security.vuln")}</p>
            <h3 className="mt-6 text-base font-semibold text-foreground">{t("security.incidentTitle")}</h3>
            <p className="mt-2 text-base leading-relaxed text-foreground">{t("security.incident")}</p>
            <p className="mt-4 text-base leading-relaxed text-foreground">
              <a
                href="https://github.com/metadist/synaplan/blob/main/SECURITY.md"
                className="font-semibold text-[#002c92] underline underline-offset-4"
              >
                {t("security.doc")}
              </a>
            </p>
          </Block>

          <Block id="availability" title={t("availability.title")} lead={t("availability.lead")}>
            <BulletList items={availability} />
            <p className="mt-4 text-base leading-relaxed text-foreground">
              <Link href="/status" className="font-semibold text-[#002c92] underline underline-offset-4">
                {t("availability.statusLink")}
              </Link>
            </p>
          </Block>

          <Block id="access" title={t("access.title")} lead={t("access.lead")}>
            <BulletList items={access} />
            <p className="mt-4 text-base leading-relaxed text-foreground">
              <a
                href="mailto:privacy@synaplan.com?subject=Barrierefreiheit"
                className="font-semibold text-[#002c92] underline underline-offset-4"
              >
                privacy@synaplan.com
              </a>
            </p>
          </Block>

          <Block id="open" title={t("open.title")} lead={t("open.lead")}>
            <BulletList items={open} />
            <p className="mt-6 text-base leading-relaxed text-foreground">
              {t("open.privacyBefore")}{" "}
              <a
                href={privacyPolicyUrl(locale)}
                className="font-semibold text-[#002c92] underline underline-offset-4"
              >
                {t("open.privacy")}
              </a>
              . {t("open.contactBefore")}{" "}
              <a href={LINKS.contact} className="font-semibold text-[#002c92] underline underline-offset-4">
                info@metadist.de
              </a>
              .
            </p>
          </Block>
        </div>
      </Section>
    </>
  );
}

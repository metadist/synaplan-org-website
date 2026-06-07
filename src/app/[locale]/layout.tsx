import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const OG_LOCALE: Record<Locale, string> = {
  de: "de_DE",
  en: "en_US",
  fr: "fr_FR",
};

// Pre-render every locale at build time → fully static, server-rendered pages
// (perfect SEO, no client-side locale resolution).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  // "Souverän by design" share card — EU + Swiss flags, brand parrot.
  const ogAlt = "Souverän by design — synaplan.eu";

  return {
    title: {
      default: t("title"),
      template: `%s | Synaplan`,
    },
    description: t("description"),
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
      shortcut: ["/favicon.ico"],
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Synaplan",
      url: localeUrl(locale as Locale, "/"),
      locale: OG_LOCALE[locale as Locale] ?? "de_DE",
      type: "website",
      // Facebook / LinkedIn read og:image (1200×630; LinkedIn also accepts this).
      images: [
        {
          url: "/og/og-default.png",
          width: 1200,
          height: 630,
          alt: ogAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      // Twitter / X summary_large_image (1200×675).
      images: [{ url: "/og/og-twitter.png", alt: ogAlt }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

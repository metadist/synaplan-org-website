import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

type PathConfig = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

// Add new pages here as the static content is built out.
const PATHS: PathConfig[] = [
  { path: "", priority: 1.0, changeFrequency: "monthly" },
  { path: "/sovereignty", priority: 0.9, changeFrequency: "monthly" },
  { path: "/open-source", priority: 0.9, changeFrequency: "monthly" },
  { path: "/integrations", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/imprint", priority: 0.3, changeFrequency: "yearly" },
];

function buildUrl(locale: Locale, path: string): string {
  const isDefault = locale === routing.defaultLocale;
  if (path === "") {
    return isDefault ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;
  }
  return isDefault ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const { path, priority, changeFrequency } of PATHS) {
      const languages: Record<string, string> = {};
      for (const loc of routing.locales) {
        languages[loc] = buildUrl(loc, path);
      }
      languages["x-default"] = buildUrl(routing.defaultLocale, path);

      entries.push({
        url: buildUrl(locale, path),
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}

/** Canonical production origin. synaplan.org redirects here. */
export const SITE_URL = "https://www.synaplan.eu";

/** External Synaplan properties & ecosystem partners referenced across the site. */
export const LINKS = {
  web: "https://www.synaplan.com",
  docs: "https://docs.synaplan.com",
  imprintDe: "https://www.synaplan.com/de/imprint",
  github: "https://github.com/metadist/synaplan",
  openCode: "https://gitlab.opencode.de/",
  contact: "mailto:info@metadist.de",
  // Ecosystem
  openDesk: "https://opendesk.eu/",
  nextcloud: "https://nextcloud.com/",
  openCloud: "https://opencloud.eu/",
  zendis: "https://www.zendis.de/",
} as const;

/** Main navigation — the argumentation chain + About/Contact. */
export const NAV_ITEMS = [
  { href: "/sovereignty", key: "sovereignty" },
  { href: "/open-source", key: "openSource" },
  { href: "/integrations", key: "integrations" },
] as const;

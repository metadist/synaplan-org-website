import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Content-Security-Policy — all known production origins hardcoded so the CSP
// is correct in every Docker image regardless of build-time env vars. This is a
// static content site, so the surface is intentionally small.
// In development, React/Turbopack need 'unsafe-eval' for HMR + debugging.
// Production stays strict (no eval).
const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  [
    "connect-src 'self'",
    "https://www.synaplan.com",
    "https://docs.synaplan.com",
  ].join(" "),
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  /** Minimal Node server bundle – works with `node server.js` and Docker. */
  output: "standalone",

  logging: {
    browserToTerminal: "warn",
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Legacy domain → canonical .eu. Any host under synaplan.org (apex or any
      // subdomain) is 301-redirected to https://www.synaplan.eu, preserving path.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(.*\\.)?synaplan\\.org" }],
        destination: "https://www.synaplan.eu/:path*",
        permanent: true,
      },
      // Canonicalise .eu: apex (synaplan.eu) and any non-www subdomain
      // (e.g. ch1.synaplan.eu) → https://www.synaplan.eu, preserving path.
      // The negative lookahead excludes www.synaplan.eu so we never loop.
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "(?!www\\.)([a-z0-9-]+\\.)*synaplan\\.eu",
          },
        ],
        destination: "https://www.synaplan.eu/:path*",
        permanent: true,
      },
      // Trailing-slash normalisation for prefixed locales — avoids duplicate content.
      {
        source: "/en/",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/fr/",
        destination: "/fr",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

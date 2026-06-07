<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2) has breaking changes — APIs, conventions, and file structure may differ from your training data. Middleware lives in `src/proxy.ts` (NOT `middleware.ts`). Read the relevant guide in `node_modules/next/dist/docs/` before writing code.
<!-- END:nextjs-agent-rules -->

# synaplan-org-website — Project Conventions

Public, **German-first** website at **www.synaplan.eu** (the `synaplan.org` domain redirects here) for public administration / government audiences (digital sovereignty, open source). Mirrors the layout, build, and publication model of `synaplan-website`, but is a **content-only static site** (no database, no admin, no blog).

## Tech Stack
- **Framework**: Next.js 16.2 (App Router, standalone output)
- **React**: 19.2 with Server Components
- **Styling**: Tailwind CSS v4
- **i18n**: `next-intl` with `[locale]` routing, middleware in `src/proxy.ts`
- **Package Manager**: npm

## i18n — trilingual, German-first
- Locales: **`de` (default, no URL prefix)**, `en` (`/en`), `fr` (`/fr`).
- Source content is authored in **German**; EN + FR are full translations.
- Translation files: `src/messages/{de,en,fr}.json` — **always update all three**.
- Never hardcode user-facing strings. `getTranslations()` in server components, `useTranslations()` in client.
- `localeDetection` and `localeCookie` are **off** — the URL is the only source of truth for language.

## Server-side rendering / SEO (do not break)
- Every locale is pre-rendered at build time via `generateStaticParams()` → fully static, server-rendered HTML for perfect SEO.
- Always call `setRequestLocale(locale)` at the top of server components/pages.
- Each page sets its own `canonical` + `hreflang` alternates in `generateMetadata` (see `app/[locale]/page.tsx`). The layout sets defaults only — do not add `alternates` in the layout (causes conflicting `<link>` tags).
- `robots.ts` + `sitemap.ts` use `SITE_URL` from `src/lib/constants.ts`.

## File Structure
```
src/
├── app/
│   ├── layout.tsx          # pass-through root
│   ├── [locale]/           # locale layout + pages (SSG)
│   ├── api/health/         # healthcheck endpoint
│   ├── globals.css
│   ├── robots.ts
│   └── sitemap.ts
├── i18n/                    # routing, request, navigation
├── lib/                     # constants (SITE_URL, external links)
└── messages/               # de.json, en.json, fr.json
```

## Build & Publish
- Shipped as a finished Docker image to `ghcr.io/metadist/synaplan-org-website:latest` (GitHub Actions on push to `main` / `v*` tags).
- Production: server pulls the image via `docker-compose.prod.yml` (no build on the server). Runs alongside `ch1.synaplan.com` on the same Docker host.

## Boundaries
### Ask first before
- Adding dependencies (npm).
- Changing the i18n routing, the Docker/CI build, or the locale set.

### Never do
- Commit secrets or `.env` files.
- Edit `node_modules/` or commit `.next/`.
- Push directly to `main` or force-push `main`.
- Hardcode `http://localhost` hosts in shipped code.
- Use `git checkout --ours/--theirs` to resolve code merge conflicts.

## Commits
- [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `refactor:`).
- **NEVER** add "Generated with…", "Co-Authored-By: …", or any AI/tool attribution.
